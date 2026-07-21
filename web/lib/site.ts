// Single source of truth for the canonical site origin.
// Used by metadata, sitemap, robots, JSON-LD, and — critically — the confirm /
// unsubscribe links in Le Brief emails, which resolve to the WRONG domain if
// this is misconfigured. So we never *silently* fall back to a hardcoded host:
// prefer NEXT_PUBLIC_SITE_URL, then the actual Vercel deployment host, and log
// loudly in production if neither is set (P3-4).

function resolveSite(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (process.env.NODE_ENV === "production") {
    if (vercel) {
      console.error(
        "[site] NEXT_PUBLIC_SITE_URL is not set — falling back to VERCEL_URL " +
          `(https://${vercel}). Set NEXT_PUBLIC_SITE_URL so email links are stable.`,
      );
      return `https://${vercel}`;
    }
    console.error(
      "[site] NEXT_PUBLIC_SITE_URL and VERCEL_URL are both unset in production. " +
        "Email confirm/unsubscribe links will point at the default domain and may not resolve.",
    );
  }

  return "https://taiyka.com";
}

export const SITE = resolveSite();
