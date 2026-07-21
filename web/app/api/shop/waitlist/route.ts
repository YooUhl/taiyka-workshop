import "server-only";
import { NextResponse } from "next/server";
import { ShopDbNotConfigured, query } from "@/lib/shop/db";
import { EMAIL_MAX, isValidEmail } from "@/lib/shop/content";
import { checkRateLimitDb } from "@/lib/brief/rate-limit";
import { getClientIp } from "@/lib/http";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 16_384; // 16KB — well over the schema, kills 50MB DOS

type Body = {
  email?: string;
  lang?: string;
  // Honeypot field — real users never see it; bots fill everything.
  // The current shop client does NOT send it — absent means human.
  company_website?: string;
};

type ValidatedBody = {
  email: string;
  lang: "fr" | "en";
};

function validate(body: Body): { ok: true; data: ValidatedBody } | { ok: false; error: string } {
  const lang = body.lang === "en" ? "en" : "fr";

  // Lowercase + trim so Foo@Bar.com and foo@bar.com dedupe to one row.
  const email = (body.email ?? "").trim().toLowerCase();
  if (email.length === 0 || email.length > EMAIL_MAX) {
    return { ok: false, error: "invalid_email" };
  }
  if (!isValidEmail(email)) {
    return { ok: false, error: "invalid_email" };
  }

  return { ok: true, data: { email, lang } };
}

export async function POST(request: Request) {
  // Body size cap — read raw text first, reject early if too large.
  const contentLength = parseInt(request.headers.get("content-length") ?? "0", 10);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, status: "payload_too_large" }, { status: 413 });
  }
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ ok: false, status: "invalid_body" }, { status: 400 });
  }
  if (rawBody.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, status: "payload_too_large" }, { status: 413 });
  }

  let body: Body;
  try {
    body = JSON.parse(rawBody) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, status: "invalid_body" },
      { status: 400 },
    );
  }

  // Honeypot: real users never fill company_website. Bots that do get a fake
  // success — no row written (mirrors the /book and /brief pattern).
  if (typeof body.company_website === "string" && body.company_website.length > 0) {
    return NextResponse.json({ ok: true, status: "ok" });
  }

  // Durable, cross-instance rate limit backed by Postgres (brief.rate_limit —
  // same database, namespaced key). Replaces the per-instance in-memory
  // limiter that barely applied on Vercel serverless. Fails open on DB error.
  const ip = getClientIp(request);
  const limit = await checkRateLimitDb(`shop-waitlist:${ip}`);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, status: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 60) } },
    );
  }

  const result = validate(body);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, status: result.error },
      { status: 400 },
    );
  }

  const userAgent = request.headers.get("user-agent")?.slice(0, 255) ?? null;
  const ipForRow = ip === "unknown" ? null : ip;

  try {
    const rows = await query<{ id: string }>(
      `insert into shop.waitlist (email, lang, source, ip, user_agent)
       values ($1, $2, 'shop', $3, $4)
       on conflict (email, source) do nothing
       returning id`,
      [result.data.email, result.data.lang, ipForRow, userAgent],
    );

    if (rows.length === 0) {
      return NextResponse.json({ ok: true, status: "already_subscribed" });
    }
    return NextResponse.json({ ok: true, status: "ok" });
  } catch (err) {
    if (err instanceof ShopDbNotConfigured) {
      return NextResponse.json(
        { ok: false, status: "backend_offline" },
        { status: 503 },
      );
    }
    console.error("[/api/shop/waitlist] insert failed", {
      code: (err as { code?: string })?.code,
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { ok: false, status: "server_error" },
      { status: 500 },
    );
  }
}
