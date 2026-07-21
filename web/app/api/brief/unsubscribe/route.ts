import "server-only";
import { NextResponse } from "next/server";
import { BriefDbNotConfigured, query } from "@/lib/brief/db";

export const runtime = "nodejs";

// Unsubscribe. Two entry points, both land here with ?token=<uuid>:
//   1. The footer link (GET) — does NOT mutate, because mail scanners prefetch
//      GET links and would unsubscribe real readers (P1-1). It forwards to the
//      /brief/unsubscribe page which shows a confirm button.
//   2. The RFC 8058 one-click header (POST) AND the page's confirm button
//      (POST) — perform the actual flip (P0-3). One-click clients ignore the
//      redirect body; browsers follow it to the outcome page.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Row = { status: string };

function toPage(request: Request, params: Record<string, string>) {
  const url = new URL("/brief/unsubscribe", request.url);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return NextResponse.redirect(url);
}

// GET = confirmation page with a button (no mutation).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") ?? "";
  const lang = searchParams.get("lang") === "en" ? "en" : "fr";

  if (!UUID_RE.test(token)) {
    return toPage(request, { status: "invalid", lang });
  }
  return toPage(request, { token, lang });
}

// POST = actually unsubscribe (one-click header + page button).
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") ?? "";
  const lang = searchParams.get("lang") === "en" ? "en" : "fr";

  if (!UUID_RE.test(token)) {
    return toPage(request, { status: "invalid", lang });
  }

  try {
    const updated = await query<Row>(
      `update brief.subscribers
         set status = 'unsubscribed', unsubscribed_at = now()
       where token = $1 and status <> 'unsubscribed'
       returning status`,
      [token],
    );
    if (updated.length > 0) {
      return toPage(request, { status: "done", lang });
    }
    // Either already unsubscribed or unknown token.
    const existing = await query<Row>(
      `select status from brief.subscribers where token = $1`,
      [token],
    );
    if (existing[0]?.status === "unsubscribed") {
      return toPage(request, { status: "done", lang });
    }
    return toPage(request, { status: "invalid", lang });
  } catch (err) {
    if (err instanceof BriefDbNotConfigured) {
      return toPage(request, { status: "error", lang });
    }
    console.error("[/api/brief/unsubscribe] update failed", {
      message: err instanceof Error ? err.message : String(err),
    });
    return toPage(request, { status: "error", lang });
  }
}
