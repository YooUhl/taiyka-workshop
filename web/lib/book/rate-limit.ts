import "server-only";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

const store = new Map<string, number[]>();

export function checkRateLimit(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const recent = (store.get(ip) ?? []).filter((t) => t > windowStart);

  if (recent.length >= MAX_REQUESTS) {
    const oldest = recent[0];
    const retryAfter = Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000));
    store.set(ip, recent);
    return { ok: false, retryAfter };
  }

  recent.push(now);
  store.set(ip, recent);
  return { ok: true };
}
