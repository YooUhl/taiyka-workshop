import Link from "next/link";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import MailtoButton from "@/components/MailtoButton";
import { getProjectMeta } from "@/components/PortfolioDetail";
import { getPortfolioProjects, type Lang } from "@/lib/portfolio";

// Lazy-load the heavy interactive carousel (rAF + ResizeObserver + modal + 3x looped tiles).
// SSR-prerendered placeholder shows 3 static project links so the page is meaningful
// without JS and so bots / crawlers see the catalog.
// NOTE: `ssr: false` is not permitted in Server Components in this Next.js version
// (see node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md). Code-splitting
// still applies — the heavy client bundle is deferred until hydration.
const PortfolioCarousel = dynamic(() => import("@/components/PortfolioCarousel"), {
  loading: () => <PortfolioPlaceholder />,
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taiyka.com";

type SearchParams = Promise<{ lang?: string }>;

const COPY = {
  fr: {
    kicker: "OPS LOG",
    title: "DEPLOYED",
    tagline: "Workflows buildés, testés, en prod chez des clients.",
    toggleLabel: "EN",
    ctaTitle: "Prêt à shipper ?",
    ctaBody: "Places limitées. Je prends 2-3 projets ce mois-ci.",
    ctaPrimary: "Réserver un call de 30 min",
    ctaSecondary: "Voir mes systèmes packagés →",
    ctaTertiary: "Ou rejoins la communauté Skool →",
    ctaOpening: "Ouverture…",
  },
  en: {
    kicker: "OPS LOG",
    title: "DEPLOYED",
    tagline: "Workflows built, tested, running in production.",
    toggleLabel: "FR",
    ctaTitle: "Ready to ship?",
    ctaBody: "Limited slots. I'm taking 2-3 projects this month.",
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

  const title =
    lang === "fr"
      ? "Portfolio — Systèmes d'automatisation IA en production · Taiyka"
      : "Portfolio — AI Automation Systems Running in Production · Taiyka";

  const description =
    lang === "fr"
      ? "Workflows n8n, agents IA et pipelines de données livrés chez des clients réels : Polymaker, UFC Wallis, content system @manu_ai.to, lead-gen multi-plateformes. Par Manu (Taiyka)."
      : "n8n workflows, AI agents and data pipelines shipped for real clients: Polymaker, UFC Wallis, @manu_ai.to content system, multi-platform lead-gen. By Manu (Taiyka).";

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
      siteName: "Taiyka",
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

// Static SSR fallback used while the client carousel chunk loads
// AND as the no-JS degraded experience. Plain anchors, no client code.
function PortfolioPlaceholder() {
  const projects = getPortfolioProjects().slice(0, 3);
  return (
    <div className="w-full py-12 md:py-20">
      <ul className="flex flex-wrap items-stretch justify-center gap-4 md:gap-6">
        {projects.map((p) => (
          <li key={p.slug} className="w-full sm:w-[280px]">
            <a
              href={`#${p.slug}`}
              className="block rounded-md border border-border bg-card/60 p-6 text-left hover:border-primary/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]"
            >
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground mb-2">
                {p.slug}
              </p>
              <h3 className="font-bold text-base mb-2">{p.fr.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {p.fr.tagline}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
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

  // ItemList JSON-LD — each project as a CreativeWork
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Taiyka Portfolio",
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: p.fr.title,
        description: p.fr.tagline,
        image: `${SITE}/og/portfolio.png`,
        dateCreated: "2026",
      },
    })),
  };

  return (
    <main className="flex-1 w-full px-6 py-16 max-w-6xl mx-auto text-center relative z-10">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className="w-full flex items-center justify-between mb-12 font-mono text-[11px] tracking-[0.22em] uppercase">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
        >
          ← TAIYKA · Accueil
        </Link>
        <Link
          href={`/portfolio?lang=${otherLang}`}
          className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
        >
          {copy.toggleLabel} →
        </Link>
      </div>
      <header className="mb-12 text-center flex flex-col items-center gap-4">
        <span className="kicker">{copy.kicker}</span>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight uppercase">
          <span className="text-gradient-hero">{copy.title}</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {copy.tagline}
        </p>
        {stripEntries.length > 0 && (
          <p
            className="mt-2 font-mono text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-muted-foreground/90 max-w-3xl mx-auto leading-relaxed"
            aria-label={lang === "fr" ? "Indicateurs clés du portfolio" : "Portfolio key metrics"}
          >
            {stripEntries.map((entry, i) => (
              <span key={entry.codename}>
                {entry.codename} · {entry.metric}
                {i < stripEntries.length - 1 && (
                  <span aria-hidden className="mx-2 text-muted-foreground/40">·</span>
                )}
              </span>
            ))}
          </p>
        )}
      </header>

      <PortfolioCarousel projects={projects} lang={lang} />

      <footer className="mt-20 text-center rounded-2xl border border-border bg-card/40 p-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          <span className="text-gradient-hero">{copy.ctaTitle}</span>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          {copy.ctaBody}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <MailtoButton
            href="mailto:manu.uhila@taiyka.com?subject=Call%20portfolio"
            className="hover-grow group inline-flex items-center justify-center gap-3 min-h-14 py-3 px-7 rounded-md bg-gradient-hero text-[#0a1628] font-bold text-[0.9375rem] md:text-base tracking-tight shadow-glow hover:shadow-[0_0_60px_rgba(0,166,255,0.55)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]"
            feedbackLabel={copy.ctaOpening}
          >
            {copy.ctaPrimary}
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </MailtoButton>
          <Link
            href={`/products${lang === "en" ? "?lang=en" : ""}`}
            className="inline-flex items-center justify-center gap-2 min-h-14 py-3 px-6 rounded-md border border-primary/40 text-foreground hover:border-primary hover:bg-card/60 transition-all font-medium text-[0.9375rem] md:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]"
          >
            {copy.ctaSecondary}
          </Link>
        </div>
        <Link
          href="/skool"
          className="inline-block text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
        >
          {copy.ctaTertiary}
        </Link>
        <p className="mt-4 font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
          manu.uhila@taiyka.com
        </p>
      </footer>
    </main>
  );
}
