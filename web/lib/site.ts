// Single source of truth for the canonical site origin.
// Used by metadata, sitemap, robots, and JSON-LD so canonical/OG/sitemap URLs never diverge.
export const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taiyka.com";
