import "server-only";

// Vercel injects the real client IP as the LAST entry of x-forwarded-for
// AND mirrors it in x-vercel-forwarded-for. Prefer the Vercel-specific
// header — it can't be spoofed because Vercel rewrites it at the edge.
// (Copied from app/api/book/route.ts — the reference implementation.)
export function getClientIp(request: Request): string {
  const vercel = request.headers.get("x-vercel-forwarded-for");
  if (vercel) return vercel.split(",").map((s) => s.trim()).filter(Boolean).pop() ?? "unknown";
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim() || "unknown";
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    // Read LAST entry — first entries can be client-injected spoofs.
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    return parts.pop() ?? "unknown";
  }
  return "unknown";
}
