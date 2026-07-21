import "server-only";
import { query } from "./db";

// Durable, cross-instance rate limit backed by brief.rate_limit (P1-6). The
// in-memory limiter in lib/book resets per Vercel serverless instance, so it
// barely limits anything in production. This one shares state through Postgres.
//
// Fixed window: MAX requests per WINDOW_SECONDS per key (key = "brief:<ip>").

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 5;

type Row = { count: number; retry_after: number };

/**
 * Atomically bump the counter for `key` and report whether the caller is over
 * the limit. Fails OPEN on any DB error (returns ok) — the honeypot + double
 * opt-in still gate abuse, and a hard DB outage already breaks signup anyway.
 */
export async function checkRateLimitDb(
  key: string,
): Promise<{ ok: boolean; retryAfter?: number }> {
  try {
    const rows = await query<Row>(
      `insert into brief.rate_limit (key, window_start, count)
         values ($1, now(), 1)
       on conflict (key) do update set
         count = case
                   when brief.rate_limit.window_start < now() - make_interval(secs => $2)
                   then 1
                   else brief.rate_limit.count + 1
                 end,
         window_start = case
                          when brief.rate_limit.window_start < now() - make_interval(secs => $2)
                          then now()
                          else brief.rate_limit.window_start
                        end
       returning
         count,
         greatest(1, ceil(extract(epoch from
           (brief.rate_limit.window_start + make_interval(secs => $2) - now())
         )))::int as retry_after`,
      [key, WINDOW_SECONDS],
    );
    const row = rows[0];
    if (!row) return { ok: true };
    if (row.count > MAX_REQUESTS) {
      return { ok: false, retryAfter: row.retry_after };
    }
    return { ok: true };
  } catch (err) {
    console.error("[brief/rate-limit] check failed, failing open", {
      message: err instanceof Error ? err.message : String(err),
    });
    return { ok: true };
  }
}
