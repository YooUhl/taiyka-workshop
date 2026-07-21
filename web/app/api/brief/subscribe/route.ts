import "server-only";
import { NextResponse } from "next/server";
import { BriefDbNotConfigured, query } from "@/lib/brief/db";
import {
  EMAIL_MAX,
  buildConfirmEmail,
  isValidEmail,
  normalizeEmail,
  type Lang,
} from "@/lib/brief/content";
import { BriefEmailNotConfigured, sendEmail } from "@/lib/brief/email";
import { checkRateLimitDb } from "@/lib/brief/rate-limit";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";

// Which consent wording the subscriber agreed to (stamped for CNIL proof, P3-8).
// Bump when the privacy notice / consent copy materially changes.
const CONSENT_VERSION = "2026-07-15-brief-v1";

type Body = { email?: string; lang?: string; source?: string; company_website?: string };
type ValidatedBody = { email: string; lang: Lang; source: string };

function validate(body: Body): { ok: true; data: ValidatedBody } | { ok: false; error: string } {
  const lang: Lang = body.lang === "en" ? "en" : "fr";
  const email = normalizeEmail(body.email ?? "");
  if (email.length === 0 || email.length > EMAIL_MAX || !isValidEmail(email)) {
    return { ok: false, error: "invalid_email" };
  }
  const source = (body.source ?? "brief-landing").slice(0, 64);
  return { ok: true, data: { email, lang, source } };
}

type SubRow = { token: string; status: string };

/** Ensure a pending subscriber row exists and return its confirm token.
 * Returns null when the address is already active (nothing to confirm). */
async function upsertPending(
  data: ValidatedBody,
  ip: string | null,
  ua: string | null,
): Promise<{ token: string } | null> {
  // New signup wins the insert.
  const inserted = await query<SubRow>(
    `insert into brief.subscribers (email, lang, source, ip, user_agent, consent_version)
     values ($1, $2, $3, $4, $5, $6)
     on conflict (email) do nothing
     returning token, status`,
    [data.email, data.lang, data.source, ip, ua, CONSENT_VERSION],
  );
  if (inserted.length > 0) return { token: inserted[0].token };

  // Address already exists — decide by current status.
  const existing = await query<SubRow>(
    `select token, status from brief.subscribers where email = $1`,
    [data.email],
  );
  const row = existing[0];
  if (!row) return null; // race: vanished between insert and select — treat as done
  if (row.status === "active") return null; // already subscribed, no email

  if (row.status === "unsubscribed") {
    // Re-subscribe: fresh confirm cycle with a new token.
    const reactivated = await query<SubRow>(
      `update brief.subscribers
         set status = 'pending', token = gen_random_uuid(),
             unsubscribed_at = null, lang = $2, source = $3,
             consent_version = $4
       where email = $1
       returning token, status`,
      [data.email, data.lang, data.source, CONSENT_VERSION],
    );
    return reactivated[0] ? { token: reactivated[0].token } : null;
  }

  // status === 'pending' — resend confirmation with the existing token.
  return { token: row.token };
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, status: "invalid_body" }, { status: 400 });
  }

  // Honeypot: real users never fill company_website. Bots that do get a fake
  // success — no row written, no email sent (mirrors the /book pattern). (P1-6)
  if (typeof body.company_website === "string" && body.company_website.length > 0) {
    return NextResponse.json({ ok: true, status: "pending_confirmation" });
  }

  // Durable, cross-instance rate limit — replaces the per-instance in-memory
  // limiter that barely applied on Vercel serverless (P1-6).
  const limit = await checkRateLimitDb(`brief:${ip}`);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, status: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 60) } },
    );
  }

  const result = validate(body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, status: result.error }, { status: 400 });
  }

  const ua = request.headers.get("user-agent")?.slice(0, 255) ?? null;
  const ipForRow = ip === "unknown" ? null : ip;

  let pending: { token: string } | null;
  try {
    pending = await upsertPending(result.data, ipForRow, ua);
  } catch (err) {
    if (err instanceof BriefDbNotConfigured) {
      return NextResponse.json({ ok: false, status: "backend_offline" }, { status: 503 });
    }
    console.error("[/api/brief/subscribe] upsert failed", {
      code: (err as { code?: string })?.code,
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ ok: false, status: "server_error" }, { status: 500 });
  }

  // Already active — return the SAME response as a fresh pending signup so the
  // endpoint can't be probed to tell which addresses are on the list (P2-9).
  // No email is sent in this case.
  if (pending === null) {
    return NextResponse.json({ ok: true, status: "pending_confirmation" });
  }

  // Send the double-opt-in confirmation email.
  const confirmUrl = `${SITE}/api/brief/confirm?token=${pending.token}`;
  const email = buildConfirmEmail(confirmUrl, result.data.lang);
  try {
    await sendEmail({
      to: result.data.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
  } catch (err) {
    if (err instanceof BriefEmailNotConfigured) {
      // Pre-Phase-0: Resend not wired yet. Row exists; log the link so the
      // flow is still testable, and report success to the user.
      console.warn(
        "[/api/brief/subscribe] RESEND_API_KEY missing — confirm link:",
        confirmUrl,
      );
      return NextResponse.json({ ok: true, status: "pending_confirmation" });
    }
    // Transient send failure — the row is saved; don't fail the signup.
    console.error("[/api/brief/subscribe] confirm email send failed", {
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ ok: true, status: "pending_confirmation" });
  }

  return NextResponse.json({ ok: true, status: "pending_confirmation" });
}
