import "server-only";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const SWEEP_EVERY = 256; // sweep ~once per N calls to bound memory

const store = new Map<string, number[]>();
let callCount = 0;

function sweep(now: number) {
  const cutoff = now - WINDOW_MS;
  for (const [key, ts] of store) {
    const kept = ts.filter((t) => t > cutoff);
    if (kept.length === 0) store.delete(key);
    else store.set(key, kept);
  }
}

export function checkRateLimit(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  callCount = (callCount + 1) % SWEEP_EVERY;
  if (callCount === 0) sweep(now);

  const windowStart = now - WINDOW_MS;
  const recent = (store.get(ip) ?? []).filter((t) => t > windowStart);

  if (recent.length >= MAX_REQUESTS) {
    // Math.min guards against clock skew/NTP correction that could leave
    // recent[] out of monotonic order.
    const oldest = Math.min(...recent);
    const retryAfter = Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000));
    store.set(ip, recent);
    return { ok: false, retryAfter };
  }

  recent.push(now);
  store.set(ip, recent);
  return { ok: true };
}
