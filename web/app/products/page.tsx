import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/ProductCard";
import { getProducts, tierLabel, type Lang, type Tier } from "@/lib/products";

const COPY = {
  fr: {
    title: "Produits",
    tagline:
      "Du lead magnet gratuit aux systèmes premium — chaque produit résout un problème concret d'automation.",
    sections: {
      0: { label: "Gratuit", sub: "Lead magnets" },
      1: { label: "Entrée — 10-25€", sub: "Démarrer rapidement" },
      2: { label: "Premium — 25-50€", sub: "Systèmes complets" },
    },
    skoolTitle: "Skool — Communauté Taiyka",
    skoolBody:
      "Une communauté francophone d'entrepreneurs IA. Sessions live, workflows partagés, support direct. Pricing à venir.",
    skoolCta: "Pricing à venir",
    langSwitch: "EN",
  },
  en: {
    title: "Products",
    tagline:
      "From free lead magnets to premium systems — each product solves a real automation problem.",
    sections: {
      0: { label: "Free", sub: "Lead magnets" },
      1: { label: "Entry — €10-25", sub: "Get started fast" },
      2: { label: "Premium — €25-50", sub: "Complete systems" },
    },
    skoolTitle: "Skool — Taiyka Community",
    skoolBody:
      "A French-speaking community of AI entrepreneurs. Live sessions, shared workflows, direct support. Pricing coming soon.",
    skoolCta: "Pricing coming soon",
    langSwitch: "FR",
  },
};

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

  return (
    <main className="flex-1 w-full px-6 py-16 max-w-6xl mx-auto">
      <header className="mb-12 text-center relative">
        <div className="absolute right-0 top-0">
          <Link
            href={`/products?lang=${otherLang}`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-xs"
            )}
          >
            {t.langSwitch}
          </Link>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          <span className="text-gradient-hero">{t.title}</span>
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
          {t.tagline}
        </p>
      </header>

      <div className="flex flex-col gap-16">
        {([0, 1, 2] as Tier[]).map((tier) => {
          const items = byTier(tier);
          if (items.length === 0) return null;
          const meta = t.sections[tier as 0 | 1 | 2];
          return (
            <section key={tier} className="flex flex-col gap-6">
              <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-bold">{meta.label}</h2>
                  <p className="text-xs text-muted-foreground">{meta.sub}</p>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {tierLabel(tier)}
                </Badge>
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
        <section className="flex flex-col gap-6">
          <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold">Skool</h2>
              <p className="text-xs text-muted-foreground">Community</p>
            </div>
            <Badge variant="outline" className="text-[10px]">
              {tierLabel(3)}
            </Badge>
          </div>
          <div className="rounded-2xl border border-border bg-gradient-glow p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-xl">
              <h3 className="text-2xl font-bold text-gradient-hero">
                {t.skoolTitle}
              </h3>
              <p className="text-sm text-muted-foreground">{t.skoolBody}</p>
            </div>
            <div
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "shrink-0 cursor-default opacity-80"
              )}
            >
              {t.skoolCta}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
