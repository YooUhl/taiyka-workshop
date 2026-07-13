import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getShopWorkflows } from "@/lib/shop/workflows";

// Evaluated once at module load, so lastmod advances per deploy without
// per-request churn that would signal constant change to Googlebot.
const LAST_MOD = new Date();

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
  "/book",
  "/shop",
  "/products/prospect-audit-funnel",
];

// Builds one sitemap entry with a full hreflang cluster (x-default + fr/en).
function entry(path: string): MetadataRoute.Sitemap[number] {
  const url = `${SITE}${path || "/"}`;
  return {
    url,
    lastModified: LAST_MOD,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1.0 : 0.8,
    alternates: {
      languages: {
        "x-default": url,
        "fr-FR": url,
        "en-US": `${url}?lang=en`,
      },
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = routes.map(entry);
  const workflowRoutes = getShopWorkflows().map((w) =>
    entry(`/shop/workflows/${w.slug}`),
  );
  return [...staticRoutes, ...workflowRoutes];
}
