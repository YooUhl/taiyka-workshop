import "server-only";
import { NextResponse } from "next/server";
import { ShopDbNotConfigured, query } from "@/lib/shop/db";
import { EMAIL_MAX, isValidEmail } from "@/lib/shop/content";
import { checkRateLimit } from "@/lib/book/rate-limit";

export const runtime = "nodejs";

type Body = {
  email?: string;
  lang?: string;
};

type ValidatedBody = {
  email: string;
  lang: "fr" | "en";
};

function validate(body: Body): { ok: true; data: ValidatedBody } | { ok: false; error: string } {
  const lang = body.lang === "en" ? "en" : "fr";

  const email = (body.email ?? "").trim();
  if (email.length === 0 || email.length > EMAIL_MAX) {
    return { ok: false, error: "invalid_email" };
  }
  if (!isValidEmail(email)) {
    return { ok: false, error: "invalid_email" };
  }

  return { ok: true, data: { email, lang } };
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = checkRateLimit(ip, "shop");
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, status: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 60) } },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, status: "invalid_body" },
      { status: 400 },
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
