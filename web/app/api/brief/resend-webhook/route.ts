import "server-only";
import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { BriefDbNotConfigured, query } from "@/lib/brief/db";

export const runtime = "nodejs";

// Resend delivery-event webhook (P1-5). Hard bounces and spam complaints must
// stop future sends or they burn the sending domain's reputation. Resend signs
// webhooks with Svix; we verify the signature with RESEND_WEBHOOK_SECRET, then
// flip the matching subscriber to 'bounced' / 'complained'. The pipeline only
// sends to status='active', so suppression is automatic.
//
// Configure in the Resend dashboard: endpoint = <SITE>/api/brief/resend-webhook,
// events = email.bounced + email.complained, secret -> RESEND_WEBHOOK_SECRET.

const TOLERANCE_SECONDS = 5 * 60; // reject timestamps older than this (replay guard)

type ResendEvent = {
  type?: string;
  data?: { to?: string[] | string; email?: string };
};

/** Verify a Svix-signed request. Returns true only on a valid v1 signature. */
function verifySignature(
  secret: string,
  svixId: string,
  svixTimestamp: string,
  svixSignature: string,
  body: string,
): boolean {
  // Replay guard.
  const ts = Number(svixTimestamp);
  if (!Number.isFinite(ts)) return false;
  const nowSec = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSec - ts) > TOLERANCE_SECONDS) return false;

  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const signedContent = `${svixId}.${svixTimestamp}.${body}`;
  const expected = crypto
    .createHmac("sha256", secretBytes)
    .update(signedContent)
    .digest("base64");
  const expectedBuf = Buffer.from(expected);

  // The header is a space-separated list of "v1,<sig>" entries.
  return svixSignature.split(" ").some((part) => {
    const comma = part.indexOf(",");
    const sig = comma === -1 ? part : part.slice(comma + 1);
    if (!sig) return false;
    const sigBuf = Buffer.from(sig);
    return (
      sigBuf.length === expectedBuf.length &&
      crypto.timingSafeEqual(sigBuf, expectedBuf)
    );
  });
}

function recipients(evt: ResendEvent): string[] {
  const to = evt.data?.to;
  const list = Array.isArray(to) ? to : to ? [to] : [];
  if (evt.data?.email) list.push(evt.data.email);
  return list.map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[/api/brief/resend-webhook] RESEND_WEBHOOK_SECRET not set");
    return NextResponse.json({ ok: false, status: "not_configured" }, { status: 503 });
  }

  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");
  const body = await request.text();

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ ok: false, status: "missing_headers" }, { status: 400 });
  }
  if (!verifySignature(secret, svixId, svixTimestamp, svixSignature, body)) {
    return NextResponse.json({ ok: false, status: "bad_signature" }, { status: 401 });
  }

  let evt: ResendEvent;
  try {
    evt = JSON.parse(body) as ResendEvent;
  } catch {
    return NextResponse.json({ ok: false, status: "invalid_body" }, { status: 400 });
  }

  const newStatus =
    evt.type === "email.bounced"
      ? "bounced"
      : evt.type === "email.complained"
        ? "complained"
        : null;

  // Acknowledge unrelated events (delivered, opened, etc.) so Resend stops.
  if (!newStatus) {
    return NextResponse.json({ ok: true, status: "ignored" });
  }

  const emails = recipients(evt);
  if (emails.length === 0) {
    return NextResponse.json({ ok: true, status: "no_recipient" });
  }

  try {
    await query(
      `update brief.subscribers
         set status = $2
       where lower(email) = any($1) and status not in ('unsubscribed', $2)`,
      [emails, newStatus],
    );
  } catch (err) {
    if (err instanceof BriefDbNotConfigured) {
      return NextResponse.json({ ok: false, status: "backend_offline" }, { status: 503 });
    }
    console.error("[/api/brief/resend-webhook] suppression update failed", {
      message: err instanceof Error ? err.message : String(err),
    });
    // 500 so Resend retries — a transient DB blip shouldn't lose a suppression.
    return NextResponse.json({ ok: false, status: "server_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, status: newStatus });
}
