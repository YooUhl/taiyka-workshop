import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service-role key.
 * NEVER import this from a Client Component.
 *
 * Pass the schema name (e.g. "calisthenics") to scope queries to it.
 * Schemas must be added to "Exposed schemas" in Supabase Dashboard →
 * Settings → API for PostgREST to route to them.
 */
export function supabaseServer(schema: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env var.",
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema },
  });
}
