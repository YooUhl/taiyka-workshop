import fs from "node:fs";
import path from "node:path";

export type Tier = 0 | 1 | 2 | 3;
export type Status = "ready" | "draft";
export type Lang = "fr" | "en";

export type Product = {
  slug: string;
  tier: Tier;
  price: string;
  status: Status;
  name: { fr: string; en: string };
  hero: { fr: string; en: string };
  subhero: { fr: string; en: string };
  bullets: { fr: string[]; en: string[] };
  ctaHref: string;
  coverSvg: string | null;
};

// Catalog order + display names + Tier-3 entry that has no folder.
// `price` is the canonical display string ("GRATUIT", "19€", etc.) used for UI.
// If a product README provides **Target price:**, that value overrides this fallback.
const CATALOG: {
  slug: string;
  tier: Tier;
  price: string;
  fallbackName: { fr: string; en: string };
  ctaHref: string;
}[] = [
  {
    slug: "free-n8n-pack",
    tier: 0,
    price: "GRATUIT",
    fallbackName: {
      fr: "5 Workflows n8n pour Entrepreneurs IA",
      en: "5 n8n Workflows for AI Entrepreneurs",
    },
    ctaHref: "/free-n8n-pack",
  },
  {
    slug: "free-claude-starter",
    tier: 0,
    price: "GRATUIT",
    fallbackName: {
      fr: "Claude Code Starter Pack",
      en: "Claude Code Starter Pack",
    },
    ctaHref: "mailto:manu.uhila@taiyka.com?subject=Notify%20me%20%E2%80%94%20Claude%20Code%20Starter%20Pack",
  },
  {
    slug: "cold-outreach-pack",
    tier: 1,
    price: "19€",
    fallbackName: {
      fr: "Cold Outreach Pack",
      en: "Cold Outreach Pack",
    },
    ctaHref: "mailto:manu.uhila@taiyka.com?subject=Notify%20me%20%E2%80%94%20Cold%20Outreach%20Pack",
  },
  {
    slug: "notion-ai-stack",
    tier: 1,
    price: "15€",
    fallbackName: {
      fr: "Notion : Solopreneur AI Stack",
      en: "Notion: Solopreneur AI Stack",
    },
    ctaHref: "mailto:manu.uhila@taiyka.com?subject=Notify%20me%20%E2%80%94%20Notion%20AI%20Stack",
  },
  {
    slug: "prompt-pack-50",
    tier: 1,
    price: "12€",
    fallbackName: {
      fr: "50 Prompts pour Automatiser ton Business",
      en: "50 Prompts to Automate Your Business",
    },
    ctaHref: "mailto:manu.uhila@taiyka.com?subject=Notify%20me%20%E2%80%94%2050%20Prompts%20Pack",
  },
  {
    slug: "competitor-intel",
    tier: 2,
    price: "49€",
    fallbackName: {
      fr: "Competitor Intelligence System",
      en: "Competitor Intelligence System",
    },
    ctaHref: "mailto:manu.uhila@taiyka.com?subject=Notify%20me%20%E2%80%94%20Competitor%20Intelligence%20System",
  },
  {
    slug: "client-acquisition-bundle",
    tier: 2,
    price: "39€",
    fallbackName: {
      fr: "Client Acquisition Bundle",
      en: "Client Acquisition Bundle",
    },
    ctaHref: "mailto:manu.uhila@taiyka.com?subject=Notify%20me%20%E2%80%94%20Client%20Acquisition%20Bundle",
  },
  {
    slug: "ai-agent-playbook",
    tier: 2,
    price: "29€",
    fallbackName: {
      fr: "Build Your First AI Agent",
      en: "Build Your First AI Agent",
    },
    ctaHref: "mailto:manu.uhila@taiyka.com?subject=Notify%20me%20%E2%80%94%20Build%20Your%20First%20AI%20Agent",
  },
  {
    slug: "prospect-audit-funnel",
    tier: 2,
    price: "49€",
    fallbackName: {
      fr: "Smart Prospect Audit Funnel",
      en: "Smart Prospect Audit Funnel",
    },
    ctaHref: "/products/prospect-audit-funnel",
  },
  {
    slug: "email-triage-agent",
    tier: 2,
    price: "29€",
    fallbackName: {
      fr: "Email Triage Agent",
      en: "Email Triage Agent",
    },
    ctaHref: "mailto:manu.uhila@taiyka.com?subject=Notify%20me%20%E2%80%94%20Email%20Triage%20Agent",
  },
];

// Vercel deployment: data is copied into web/.data/products at prebuild.
// Local dev: same path, populated by predev script.
const PRODUCTS_ROOT = path.resolve(process.cwd(), ".data", "products");

function readFileSafe(p: string): string | null {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return null;
  }
}

function parseReadme(md: string): {
  status: Status;
  price: string;
  tierFromMd?: Tier;
  title?: string;
} {
  const lines = md.split(/\r?\n/);
  const titleLine = lines.find((l) => l.startsWith("# "));
  const title = titleLine ? titleLine.replace(/^#\s+/, "").trim() : undefined;

  const statusLine = lines.find((l) => /\*\*Status:\*\*/i.test(l)) ?? "";
  const status: Status = /ready/i.test(statusLine) ? "ready" : "draft";

  const priceLine = lines.find((l) => /\*\*Target price:\*\*/i.test(l)) ?? "";
  const price = priceLine
    .replace(/\*\*Target price:\*\*/i, "")
    .trim()
    .replace(/\s+/g, " ");

  const tierLine = lines.find((l) => /\*\*Tier:\*\*/i.test(l)) ?? "";
  const tierMatch = tierLine.match(/(\d)/);
  const tierFromMd = tierMatch ? (Number(tierMatch[1]) as Tier) : undefined;

  return { status, price, tierFromMd, title };
}

function parseSalesCopy(md: string): {
  hero: string;
  subhero: string;
  bullets: string[];
} {
  // Hero: text under "## H1 (hero)" — first non-empty bold/plain line
  const lines = md.split(/\r?\n/);
  const findSection = (regex: RegExp): string[] => {
    const i = lines.findIndex((l) => regex.test(l));
    if (i === -1) return [];
    const out: string[] = [];
    for (let j = i + 1; j < lines.length; j++) {
      if (/^##\s+/.test(lines[j])) break;
      out.push(lines[j]);
    }
    return out;
  };

  const heroLines = findSection(/^##\s+H1\s*\(hero\)/i);
  const heroText = heroLines
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^\*\*(.+?)\*\*$/, "$1"))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const subLines = findSection(/^##\s+Sub-hero/i);
  const subhero = subLines
    .map((l) => l.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const bulletSection =
    findSection(/^##\s+(Bullets de valeur|Value bullets)/i) || [];
  const bullets = bulletSection
    .filter((l) => /^\s*-\s+/.test(l))
    .map((l) =>
      l
        .replace(/^\s*-\s+/, "")
        .replace(/\*\*/g, "")
        .trim()
    )
    .filter(Boolean);

  return { hero: heroText, subhero, bullets };
}

export function getProducts(): Product[] {
  return CATALOG.map((entry) => {
    const dir = path.join(PRODUCTS_ROOT, entry.slug);
    const readme = readFileSafe(path.join(dir, "README.md"));
    const meta = readme
      ? parseReadme(readme)
      : { status: "draft" as Status, price: "" };

    const tier = meta.tierFromMd ?? entry.tier;

    let heroFr = "";
    let heroEn = "";
    let subFr = "";
    let subEn = "";
    let bulletsFr: string[] = [];
    let bulletsEn: string[] = [];

    if (meta.status === "ready") {
      const fr = readFileSafe(path.join(dir, "copy", "sales-fr.md"));
      const en = readFileSafe(path.join(dir, "copy", "sales-en.md"));
      if (fr) {
        const p = parseSalesCopy(fr);
        heroFr = p.hero;
        subFr = p.subhero;
        bulletsFr = p.bullets;
      }
      if (en) {
        const p = parseSalesCopy(en);
        heroEn = p.hero;
        subEn = p.subhero;
        bulletsEn = p.bullets;
      }
    }

    // Free pack ships sales copy too — surface it even if marked draft
    if (entry.slug === "free-n8n-pack" && meta.status !== "ready") {
      const fr = readFileSafe(path.join(dir, "copy", "sales-fr.md"));
      const en = readFileSafe(path.join(dir, "copy", "sales-en.md"));
      if (fr) {
        const p = parseSalesCopy(fr);
        heroFr = p.hero;
        subFr = p.subhero;
        bulletsFr = p.bullets;
      }
      if (en) {
        const p = parseSalesCopy(en);
        heroEn = p.hero;
        subEn = p.subhero;
        bulletsEn = p.bullets;
      }
    }

    // Status override: free-n8n-pack is shippable per task spec
    const finalStatus: Status =
      entry.slug === "free-n8n-pack" || meta.status === "ready"
        ? "ready"
        : "draft";

    const coverSvg = readFileSafe(path.join(dir, "delivery", "cover.svg"));

    return {
      slug: entry.slug,
      tier,
      price: meta.price || entry.price || (tier === 0 ? "GRATUIT" : "Coming soon"),
      status: finalStatus,
      name: entry.fallbackName,
      hero: { fr: heroFr, en: heroEn },
      subhero: { fr: subFr, en: subEn },
      bullets: { fr: bulletsFr, en: bulletsEn },
      ctaHref: entry.ctaHref,
      coverSvg,
    };
  });
}

export function tierLabel(tier: Tier): string {
  switch (tier) {
    case 0:
      return "Free";
    case 1:
      return "10-25€";
    case 2:
      return "25-50€";
    case 3:
      return "Skool";
  }
}
