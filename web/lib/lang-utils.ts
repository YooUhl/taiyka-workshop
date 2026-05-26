import type { Lang } from "@/lib/portfolio";

/**
 * Append ?lang=en to internal hrefs when lang is "en", otherwise return href unchanged.
 * Preserves existing query strings and fragments.
 * Skips external URLs (anything starting with http/https/mailto/tel).
 */
export function withLang(href: string, lang: Lang): string {
  if (lang !== "en") return href;
  if (/^(https?:|mailto:|tel:|#|\/\/)/.test(href)) return href;
  if (href.includes("lang=")) return href;
  const [path, hash] = href.split("#");
  const sep = path.includes("?") ? "&" : "?";
  const withParam = `${path}${sep}lang=en`;
  return hash ? `${withParam}#${hash}` : withParam;
}
