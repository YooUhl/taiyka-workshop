import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taiyka.com";

const routes = ["", "/products", "/portfolio", "/free-n8n-pack"];
const langs = ["fr", "en"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const lang of langs) {
      const path = lang === "fr" ? route : `${route}?lang=en`;
      entries.push({
        url: `${SITE}${path || "/"}`,
        lastModified: now,
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
  }

  return entries;
}
