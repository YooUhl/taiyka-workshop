"use client";
import { createClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client using the anon key. Safe to import in
 * Client Components. Pass the schema name to scope queries.
 */
export function supabaseBrowser(schema: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env var.",
    );
  }
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema },
  });
}
