import workflowsRaw from "./workflows-data.generated.json";
import type { Lang } from "./content";

export type WorkflowTier = "entry" | "premium";
export type WorkflowStatus = "coming-soon" | "live";

export type WorkflowVariable = {
  name: string;
  description: string;
};

export type WorkflowLocalized = {
  title: string;
  tagline: string;
  hoverDescription: string;
};

export type Workflow = {
  slug: string;
  icon: string;
  tier: WorkflowTier;
  price: string;
  priceNumeric: number | null;
  status: WorkflowStatus;
  fr: WorkflowLocalized;
  en: WorkflowLocalized;
  nodes: string[];
  variables: WorkflowVariable[];
  costEstimate: { fr: string; en: string };
  valueProps: { fr: string[]; en: string[] };
  frBody: string;
  enBody: string;
};

let cached: Workflow[] | null = null;

export function getShopWorkflows(): Workflow[] {
  if (cached) return cached;
  cached = workflowsRaw as Workflow[];
  return cached;
}

export function getShopWorkflow(slug: string): Workflow | null {
  return getShopWorkflows().find((w) => w.slug === slug) ?? null;
}

export function tierBadge(tier: WorkflowTier, lang: Lang): string {
  if (lang === "fr") return tier === "entry" ? "ENTRÉE" : "PREMIUM";
  return tier === "entry" ? "ENTRY" : "PREMIUM";
}
