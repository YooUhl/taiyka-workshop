import "server-only";
import { NextResponse } from "next/server";
import { BriefDbNotConfigured, query } from "@/lib/brief/db";

export const runtime = "nodejs";

// Double-opt-in confirmation. The email's button is a GET link to this route.
// GET no longer mutates — mail-security scanners prefetch GET links and would
// silently confirm subscribers who never clicked, breaking the consent proof
// (P1-1). Instead GET forwards to /brief/confirmed which renders a button that
// POSTs back here; POST performs the pending -> active flip.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Row = { status: string };

function toConfirmed(request: Request, params: Record<string, string>) {
  const url = new URL("/brief/confirmed", request.url);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return NextResponse.redirect(url);
}

// GET = land the user on the confirm page with a button (no mutation).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") ?? "";
  const lang = searchParams.get("lang") === "en" ? "en" : "fr";

  if (!UUID_RE.test(token)) {
    return toConfirmed(request, { status: "invalid", lang });
  }
  // Carry the token to the page; the page's button POSTs it back.
  return toConfirmed(request, { token, lang });
}

// POST = perform the actual confirmation (from the page button).
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") ?? "";
  const lang = searchParams.get("lang") === "en" ? "en" : "fr";

  if (!UUID_RE.test(token)) {
    return toConfirmed(request, { status: "invalid", lang });
  }

  try {
    const updated = await query<Row>(
      `update brief.subscribers
         set status = 'active', confirmed_at = now()
       where token = $1 and status = 'pending'
       returning status`,
      [token],
    );
    if (updated.length > 0) {
      return toConfirmed(request, { status: "confirmed", lang });
    }
    // Nothing flipped — either already active or unknown token.
    const existing = await query<Row>(
      `select status from brief.subscribers where token = $1`,
      [token],
    );
    if (existing[0]?.status === "active") {
      return toConfirmed(request, { status: "already", lang });
    }
    return toConfirmed(request, { status: "invalid", lang });
  } catch (err) {
    if (err instanceof BriefDbNotConfigured) {
      return toConfirmed(request, { status: "error", lang });
    }
    console.error("[/api/brief/confirm] update failed", {
      message: err instanceof Error ? err.message : String(err),
    });
    return toConfirmed(request, { status: "error", lang });
  }
}
