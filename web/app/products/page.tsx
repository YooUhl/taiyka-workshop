import Link from "next/link";
import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/ProductCard";
import { getProducts, type Lang, type Product, type Tier } from "@/lib/products";
import { withLang } from "@/lib/lang-utils";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taiyka.com";

const COPY = {
  fr: {
    kicker: "CATALOGUE",
    title: "Kits · Systèmes · Workflows",
    tagline: "Chaque kit résout un truc précis. Pas de remplissage.",
    qcmLink: "Pas sûr du bon pack ? Fais le QCM en 2 min →",
    sections: {
      0: { kicker: "TIER 0 · GRATUIT", label: "Gratuit", sub: "Lead magnets" },
      1: { kicker: "TIER 1 · ENTRÉE", label: "Entrée — 10-25€", sub: "Entrée de gamme · Essayer" },
      2: { kicker: "TIER 2 · PRO", label: "Premium — 25-50€", sub: "Premium · Production" },
    },
    skoolKicker: "TIER 3 · COMMUNAUTÉ",
    skoolHeading: "Communauté Skool",
    skoolSub: "Communauté",
    skoolTitle: "THE WORKSHOP — Build together",
    skoolBody:
      "12 semaines. Builds en prod. 100 places fondateurs. Pas d'excuses pour traîner.",
    skoolCta: "Entrer dans la communauté",
    langSwitch: "EN",
  },
  en: {
    kicker: "CATALOG",
    title: "Packs · Systems · Workflows",
    tagline: "Every pack solves a real problem. No filler.",
    qcmLink: "Not sure which one? Take the 2-min QCM →",
    sections: {
      0: { kicker: "TIER 0 · FREE", label: "Free", sub: "Lead magnets" },
      1: { kicker: "TIER 1 · ENTRY", label: "Entry — €10-25", sub: "Entry — Try it" },
      2: { kicker: "TIER 2 · PREMIUM", label: "Premium — €25-50", sub: "Premium — Production" },
    },
    skoolKicker: "TIER 3 · COMMUNITY",
    skoolHeading: "Skool community",
    skoolSub: "Community",
    skoolTitle: "THE WORKSHOP — Build together",
    skoolBody:
      "12 weeks. Production builds. 100 founder spots. No excuses to drag your feet.",
    skoolCta: "Enter the community",
    langSwitch: "FR",
  },
};

// --- Metadata ---------------------------------------------------------------
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const lang: Lang = sp?.lang === "en" ? "en" : "fr";

  const title =
    lang === "fr"
      ? "Catalogue — Kits, systèmes & workflows IA"
      : "Catalog — AI kits, systems & workflows";

  const description =
    lang === "fr"
      ? "Le catalogue : lead magnets gratuits, kits 10-25€, systèmes premium 25-50€ et la communauté Skool. Chaque pack résout un truc précis. Pas de remplissage."
      : "The catalog: free lead magnets, €10-25 kits, premium €25-50 systems and the Skool community. Every pack solves a real problem. No filler.";

  return {
    title,
    description,
    alternates: {
      canonical: "/products",
      languages: {
        "fr-FR": "/products",
        "en-US": "/products?lang=en",
      },
    },
    openGraph: {
      type: "website",
      url: `${SITE}/products`,
      siteName: lang === "fr" ? "L'Atelier" : "The Workshop",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      title,
      description,
      images: [
        {
          url: "/og/products.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og/products.png"],
      creator: "@manu_ai.to",
    },
  };
}

// --- JSON-LD helpers --------------------------------------------------------
// Convert display price strings ("GRATUIT", "FREE", "0€", "29€") to a numeric
// string suitable for Product offers ("0", "29"). Falls back to "0" for empty
// / non-numeric inputs so the schema stays valid.
function priceToNumber(price: string): string {
  const raw = (price ?? "").trim().toLowerCase();
  if (!raw) return "0";
  if (raw === "gratuit" || raw === "free" || raw === "0" || raw === "0€" || raw === "0 €") {
    return "0";
  }
  const m = raw.match(/(\d+(?:[.,]\d+)?)/);
  if (!m) return "0";
  return m[1].replace(",", ".");
}

// Set of product slugs that have a dedicated /og/<slug>.png. Anything not in
// this list falls back to /og/products.png so the schema never points at a
// missing image.
const OG_PRODUCT_SLUGS = new Set<string>([
  "free-n8n-pack",
  "free-claude-starter",
  "cold-outreach-pack",
  "notion-ai-stack",
  "prompt-pack-50",
  "competitor-intel",
  "client-acquisition-bundle",
  "ai-agent-playbook",
  "email-triage-agent",
  "prospect-audit-funnel",
]);

function buildItemListJsonLd(products: Product[], lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: lang === "fr" ? "L'Atelier" : "The Workshop",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.name?.[lang] || p.name?.fr || p.slug,
        // Never bleed FR text into the EN ItemList — stay within the requested
        // language. Fall back to hero in the same language, then empty string.
        description: p.subhero?.[lang] || p.hero?.[lang] || "",
        image: OG_PRODUCT_SLUGS.has(p.slug)
          ? `${SITE}/og/${p.slug}.png`
          : `${SITE}/og/products.png`,
        brand: { "@type": "Brand", name: lang === "fr" ? "L'Atelier" : "The Workshop" },
        offers: {
          "@type": "Offer",
          price: priceToNumber(p.price),
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: `${SITE}/products/${p.slug}`,
        },
      },
    })),
  };
}

// --- Page -------------------------------------------------------------------
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const lang: Lang = sp.lang === "en" ? "en" : "fr";
  const t = COPY[lang];

  const products = getProducts();
  const byTier = (tier: Tier) => products.filter((p) => p.tier === tier);

  const otherLang: Lang = lang === "fr" ? "en" : "fr";

  const itemListJsonLd = buildItemListJsonLd(products, lang);

  return (
    <main className="flex-1 w-full px-6 py-16 max-w-6xl mx-auto text-center relative z-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <div className="w-full flex items-center justify-between mb-12 font-mono text-[11px] tracking-[0.22em] uppercase">
        <Link
          href={withLang("/", lang)}
          className="inline-flex items-center min-h-[44px] text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
        >
          ← TAIYKA · Accueil
        </Link>
        <Link
          href={`/products?lang=${otherLang}`}
          className="inline-flex items-center min-h-[44px] text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
        >
          {t.langSwitch} →
        </Link>
      </div>

      <header className="mb-16 md:mb-20 text-center flex flex-col items-center gap-5">
        <span className="kicker kicker-accent">{t.kicker}</span>
        <h1 className="display-lg max-w-[16ch]">{t.title}</h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-[1.6]">
          {t.tagline}
        </p>
        <Link
          href={withLang("/qcm", lang)}
          className="inline-flex items-center min-h-[44px] text-sm font-medium text-primary hover:underline underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
        >
          {t.qcmLink}
        </Link>
      </header>

      <div className="flex flex-col gap-16">
        {([0, 1, 2] as Tier[]).map((tier) => {
          const items = byTier(tier);
          if (items.length === 0) return null;
          const meta = t.sections[tier as 0 | 1 | 2];
          return (
            <section
              key={tier}
              id={`tier-${tier}`}
              className="flex flex-col gap-6 scroll-mt-24"
            >
              <div className="flex flex-col items-center gap-3">
                <span className="kicker">{meta.kicker}</span>
                <h2 className="display-md">{meta.label}</h2>
                <p className="text-sm text-muted-foreground">{meta.sub}</p>
                <hr className="hairline mt-2" />
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <ProductCard key={p.slug} product={p} lang={lang} />
                ))}
              </div>
            </section>
          );
        })}

        {/* Tier 3 — Skool community */}
        <section id="skool" className="flex flex-col gap-6 scroll-mt-24">
          <div className="flex flex-col items-center gap-3">
            <span className="kicker kicker-accent">{t.skoolKicker}</span>
            <h2 className="display-md">{t.skoolHeading}</h2>
            <p className="text-sm text-muted-foreground">{t.skoolSub}</p>
            <hr className="hairline mt-2" />
          </div>
          <div className="card-line card-line-accent p-8 md:p-12 flex flex-col items-center gap-6 text-center">
            <div className="flex flex-col items-center gap-3 max-w-xl">
              <h3 className="display-md text-foreground">{t.skoolTitle}</h3>
              <p className="text-base text-muted-foreground leading-[1.6]">
                {t.skoolBody}
              </p>
            </div>
            <Link
              href={withLang("/skool", lang)}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "shrink-0"
              )}
            >
              {t.skoolCta} <span aria-hidden>→</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
