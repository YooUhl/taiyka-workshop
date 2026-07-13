import "server-only";
import { NextResponse } from "next/server";
import { BriefDbNotConfigured, query } from "@/lib/brief/db";

export const runtime = "nodejs";

// One-click unsubscribe. Every issue's footer link hits this route with
// ?token=<uuid>. We flip the subscriber to 'unsubscribed' and redirect to the
// /brief/unsubscribe page which shows a confirmation.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Row = { status: string };

function redirect(request: Request, status: string, lang: string) {
  const url = new URL("/brief/unsubscribe", request.url);
  url.searchParams.set("status", status);
  if (lang === "en") url.searchParams.set("lang", "en");
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") ?? "";
  const lang = searchParams.get("lang") === "en" ? "en" : "fr";

  if (!UUID_RE.test(token)) {
    return redirect(request, "invalid", lang);
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
      return redirect(request, "done", lang);
    }
    // Either already unsubscribed or unknown token.
    const existing = await query<Row>(
      `select status from brief.subscribers where token = $1`,
      [token],
    );
    if (existing[0]?.status === "unsubscribed") {
      return redirect(request, "done", lang);
    }
    return redirect(request, "invalid", lang);
  } catch (err) {
    if (err instanceof BriefDbNotConfigured) {
      return redirect(request, "error", lang);
    }
    console.error("[/api/brief/unsubscribe] update failed", {
      message: err instanceof Error ? err.message : String(err),
    });
    return redirect(request, "error", lang);
  }
}
