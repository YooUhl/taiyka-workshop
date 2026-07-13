import "server-only";
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { BookDbNotConfigured, query } from "@/lib/book/db";

export const runtime = "nodejs";

// Calendly webhook signatures use HMAC-SHA256.
// Signing key set in CALENDLY_WEBHOOK_SIGNING_KEY (Vercel env + .env.local).
// Manu must (a) create a Personal Access Token at calendly.com/integrations/api_webhooks
// and (b) register a webhook subscription targeting
//   https://workshop.taiyka.com/api/book/calendly-webhook
// for events: invitee.created, invitee.canceled
// See DEFERRED-MANUAL-STEPS.md in project root.

type CalendlyEvent = "invitee.created" | "invitee.canceled";

type WebhookPayload = {
  event: CalendlyEvent | string;
  created_at?: string;
  payload?: {
    uri?: string;
    name?: string;
    email?: string;
    cancel_url?: string;
    reschedule_url?: string;
    scheduled_event?: {
      uri?: string;
      start_time?: string;
    };
    invitee?: {
      uri?: string;
      email?: string;
      name?: string;
    };
    [key: string]: unknown;
  };
};

function verifySignature(signingKey: string, header: string, body: string): boolean {
  // Header format: "t=<timestamp>,v1=<signature>"
  const parts = header.split(",").reduce<Record<string, string>>((acc, kv) => {
    const [k, v] = kv.split("=");
    if (k && v) acc[k.trim()] = v.trim();
    return acc;
  }, {});
  const t = parts.t;
  const v1 = parts.v1;
  if (!t || !v1) return false;

  // Reject signatures older than 5 minutes (replay defense).
  const tsMs = Number(t) * 1000;
  if (!Number.isFinite(tsMs) || Math.abs(Date.now() - tsMs) > 5 * 60_000) return false;

  const signed = `${t}.${body}`;
  const computed = createHmac("sha256", signingKey).update(signed).digest("hex");

  const a = Buffer.from(v1, "hex");
  const b = Buffer.from(computed, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
  if (!signingKey) {
    console.warn("[/api/book/calendly-webhook] CALENDLY_WEBHOOK_SIGNING_KEY missing");
    return NextResponse.json({ ok: false, error: "Webhook not configured." }, { status: 503 });
  }

  const sigHeader = request.headers.get("calendly-webhook-signature");
  if (!sigHeader) {
    return NextResponse.json({ ok: false, error: "Missing signature." }, { status: 401 });
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return NextResponse.json({ ok: false, error: "Could not read body." }, { status: 400 });
  }
  if (raw.length > 64_000) {
    return NextResponse.json({ ok: false, error: "Payload too large." }, { status: 413 });
  }

  if (!verifySignature(signingKey, sigHeader, raw)) {
    return NextResponse.json({ ok: false, error: "Invalid signature." }, { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(raw) as WebhookPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const eventName = payload.event;
  if (eventName !== "invitee.created" && eventName !== "invitee.canceled") {
    // Acknowledge unrecognized events so Calendly doesn't retry forever.
    return NextResponse.json({ ok: true, ignored: true });
  }

  const invitee = payload.payload?.invitee;
  const scheduled = payload.payload?.scheduled_event;
  const eventUri = scheduled?.uri ?? payload.payload?.uri;
  const inviteeUri = invitee?.uri ?? payload.payload?.uri;
  const inviteeEmail = invitee?.email ?? payload.payload?.email;
  const inviteeName = invitee?.name ?? payload.payload?.name;
  const rescheduleUri = payload.payload?.reschedule_url ?? null;

  if (!eventUri || !inviteeEmail) {
    return NextResponse.json({ ok: false, error: "Missing event_uri or invitee email." }, { status: 400 });
  }

  const status = eventName === "invitee.created" ? "scheduled" : "canceled";
  const scheduledAt = scheduled?.start_time ?? null;
  const canceledAt = eventName === "invitee.canceled" ? new Date().toISOString() : null;

  try {
    await query(
      `insert into book.bookings
         (event_uri, invitee_uri, invitee_email, invitee_name, status,
          scheduled_at, canceled_at, reschedule_uri, raw_payload)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb)
       on conflict (event_uri) do update set
         status = excluded.status,
         scheduled_at = coalesce(excluded.scheduled_at, book.bookings.scheduled_at),
         canceled_at = coalesce(excluded.canceled_at, book.bookings.canceled_at),
         reschedule_uri = coalesce(excluded.reschedule_uri, book.bookings.reschedule_uri),
         raw_payload = excluded.raw_payload`,
      [
        eventUri,
        inviteeUri,
        inviteeEmail.toLowerCase(),
        inviteeName ?? null,
        status,
        scheduledAt,
        canceledAt,
        rescheduleUri,
        raw,
      ],
    );
  } catch (err) {
    if (err instanceof BookDbNotConfigured) {
      return NextResponse.json({ ok: false, error: "DB not configured." }, { status: 503 });
    }
    const code = (err as { code?: string })?.code;
    console.error("[/api/book/calendly-webhook] insert failed", { code });
    return NextResponse.json({ ok: false, error: "Persist failed." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
