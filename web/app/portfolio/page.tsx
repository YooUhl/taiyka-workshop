import Link from "next/link";
import type { Metadata } from "next";
import { Ticker } from "@/components/site/Ticker";
import { TopBar } from "@/components/site/TopBar";
import { getProjectMeta } from "@/components/PortfolioDetail";
import { getPortfolioProjects, type Lang } from "@/lib/portfolio";
import { withLang } from "@/lib/lang-utils";
import PortfolioClient from "./portfolio-client";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taiyka.com";

type SearchParams = Promise<{ lang?: string }>;

const COPY = {
  fr: {
    home: "TAIYKA · Accueil",
    status: "PORTFOLIO · L'ATELIER",
    kicker: "SYSTÈMES LIVRÉS",
    title: "LIVRÉ",
    tagline: "Construits pour de vrais clients. Testés. En route tous les jours.",
    toggleLabel: "EN",
    ticker: ["Systèmes en production", "Clients réels", "n8n · Claude · Supabase"],
    ctaTitle: "On construit le tien ?",
    ctaBody: "Je prends 2-3 projets ce mois-ci.",
    ctaPrimary: "Réserver un call de 30 min",
    ctaSecondary: "Voir mes systèmes prêts à brancher →",
    ctaTertiary: "Ou rejoins la communauté Skool →",
    ctaOpening: "Ouverture…",
  },
  en: {
    home: "TAIYKA · Home",
    status: "PORTFOLIO · THE WORKSHOP",
    kicker: "SYSTEMS DELIVERED",
    title: "DELIVERED",
    tagline: "Built for real clients. Tested. Running every day.",
    toggleLabel: "FR",
    ticker: ["Systems in production", "Real clients", "n8n · Claude · Supabase"],
    ctaTitle: "Want yours built?",
    ctaBody: "I'm taking 2-3 projects this month.",
    ctaPrimary: "Book a 30-min call",
    ctaSecondary: "See packaged systems →",
    ctaTertiary: "Or join Skool →",
    ctaOpening: "Opening…",
  },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  const lang: Lang = sp?.lang === "en" ? "en" : "fr";

  // No brand suffix here — the root layout's title template appends it.
  const title =
    lang === "fr"
      ? "Portfolio — Systèmes d'automatisation IA en production"
      : "Portfolio — AI Automation Systems Running in Production";

  const description =
    lang === "fr"
      ? "Workflows n8n, agents IA et pipelines de données livrés chez des clients réels : Polymaker, UFC Wallis, content system @manu_ai.to, lead-gen multi-plateformes. Par Manu."
      : "n8n workflows, AI agents and data pipelines shipped for real clients: Polymaker, UFC Wallis, @manu_ai.to content system, multi-platform lead-gen. By Manu.";

  return {
    title,
    description,
    alternates: {
      canonical: "/portfolio",
      languages: {
        "fr-FR": "/portfolio",
        "en-US": "/portfolio?lang=en",
      },
    },
    openGraph: {
      type: "website",
      url: `${SITE}/portfolio`,
      siteName: lang === "fr" ? "L'Atelier" : "The Workshop",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      title,
      description,
      images: [
        {
          url: "/og/portfolio.png",
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
      images: ["/og/portfolio.png"],
      creator: "@manu_ai.to",
    },
  };
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const lang: Lang = params.lang === "en" ? "en" : "fr";
  const otherLang: Lang = lang === "fr" ? "en" : "fr";
  const copy = COPY[lang];
  const projects = getPortfolioProjects();

  // Build a flat metric strip from PROJECT_META. Take the FIRST metric of each project
  // (the headline number). If a project has no metrics defined, skip it. If no project
  // has metrics, the whole strip is dropped (no fabricated data).
  const stripEntries: Array<{ codename: string; metric: string }> = [];
  for (const p of projects) {
    const meta = getProjectMeta(p.slug);
    if (meta.metrics.length > 0) {
      const m = meta.metrics[0];
      stripEntries.push({
        codename: meta.codename,
        metric: `${m.value} ${m.label}`,
      });
    }
  }

  // ItemList JSON-LD — each project as a CreativeWork.
  // Bound to current lang so SEO + previews match the page locale.
  // `dateCreated` is omitted on purpose: PortfolioProject carries no real dates,
  // and a hardcoded year would be misleading.
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: lang === "fr" ? "L'Atelier" : "The Workshop",
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: p[lang].title,
        description: p[lang].tagline,
        image: `${SITE}/og/portfolio.png`,
      },
    })),
  };

  return (
    <main className="relative flex-1 w-full flex flex-col z-10">
      <Ticker items={copy.ticker} />
      <TopBar
        backHref={withLang("/", lang)}
        backLabel={copy.home}
        status={copy.status}
        langSwitchHref={`/portfolio?lang=${otherLang}`}
        langSwitchLabel={copy.toggleLabel}
        langSwitchAria={`Switch language to ${copy.toggleLabel}`}
      />

      <div className="w-full px-6 py-16 max-w-6xl mx-auto text-center">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
        <header className="mb-16 text-center flex flex-col items-center gap-5">
          <span className="kicker kicker-accent">{copy.kicker}</span>
          <h1 className="display-xl display-caps text-foreground">{copy.title}</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {copy.tagline}
          </p>
          {stripEntries.length > 0 && (
            <div className="w-full max-w-3xl mx-auto mt-4">
              <div className="hairline-strong" />
              <p
                className="py-4 font-mono-hud text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-muted-foreground leading-relaxed"
                aria-label={lang === "fr" ? "Indicateurs clés du portfolio" : "Portfolio key metrics"}
              >
                {stripEntries.map((entry, i) => (
                  <span key={entry.codename}>
                    <span className="text-foreground">{entry.codename}</span> · {entry.metric}
                    {i < stripEntries.length - 1 && (
                      <span aria-hidden className="mx-2 text-primary/50">·</span>
                    )}
                  </span>
                ))}
              </p>
              <div className="hairline" />
            </div>
          )}
        </header>

        <PortfolioClient projects={projects} lang={lang} />

        <hr className="hairline mb-16 mt-24 border-0" />
        <footer className="card-line card-line-accent rounded-none text-center p-10 md:p-14">
          <h2 className="display-md display-caps text-foreground mb-3">{copy.ctaTitle}</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
            {copy.ctaBody}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
            {/* Goes to the booking funnel, not a mailto — a mailto silently
                does nothing on a machine with no mail client configured. */}
            <Link
              href={withLang("/book", lang)}
              className="group cta inline-flex items-center justify-center gap-3 h-14 px-7 text-[0.95rem] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]"
            >
              {copy.ctaPrimary}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href={withLang("/shop", lang)}
              className="inline-flex items-center justify-center gap-2 min-h-14 py-3 px-6 rounded-none border border-border text-foreground hover:border-primary hover:text-primary transition-colors font-medium text-[0.9375rem] md:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]"
            >
              {copy.ctaSecondary}
            </Link>
          </div>
          <Link
            href={withLang("/skool", lang)}
            className="inline-block text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
          >
            {copy.ctaTertiary}
          </Link>
          <p className="mt-6 font-mono-hud text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
            manu.uhila@taiyka.com
          </p>
        </footer>
      </div>
    </main>
  );
}
