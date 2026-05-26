import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taiyka.com";

// Build-time constant — avoids per-request churn that signals constant change to Googlebot.
const LAST_MOD = new Date("2026-05-25T00:00:00Z");

const routes = [
  "",
  "/products",
  "/portfolio",
  "/free-n8n-pack",
  "/qcm",
  "/qcm/quiz",
  "/qcm/resultat/salarie",
  "/qcm/resultat/aspirant",
  "/qcm/resultat/surcharge",
  "/qcm/resultat/scale",
  "/qcm/resultat/pas-pret",
  "/brief",
  "/skool",
  "/products/prospect-audit-funnel",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => {
    const path = route || "/";
    const url = `${SITE}${path}`;
    return {
      url,
      lastModified: LAST_MOD,
      changeFrequency: route === "" ? "weekly" : "monthly",
      priority: route === "" ? 1.0 : 0.8,
      alternates: {
        languages: {
          "en-US": `${url}?lang=en`,
        },
      },
    };
  });
}
