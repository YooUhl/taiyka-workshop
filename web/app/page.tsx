import Link from "next/link";
import { Fragment } from "react";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { withLang } from "@/lib/lang-utils";

type Lang = "fr" | "en";

type RowLink = {
  label: string;
  href: string;
  index: string;
  external?: boolean;
  featured?: boolean;
};

type Section = {
  kicker: string;
  links: RowLink[];
};

type Copy = {
  semanticH1: string;
  visualWordmarkLead: string;
  visualWordmarkAccent: string;
  subhead: string;
  primaryButton: string;
  primaryMeta: string;
  langSwitch: string;
  langSwitchHref: string;
  recentClientsKicker: string;
  sections: Section[];
  footerRights: string;
};

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taiyka.com";

// Curated freeze — do NOT auto-derive from portfolio data.
// Portfolio includes internal projects (content-system, lead-pipeline) that are not
// external clients and therefore cannot be cited as social proof. This list is
// hand-maintained to only surface verified external client engagements.
const RECENT_CLIENTS = ["Polymaker", "UFC Wallis"];

const COPY: Record<Lang, Copy> = {
  fr: {
    semanticH1: "Taiyka — Workshop d'automatisation IA pour entrepreneurs",
    visualWordmarkLead: "THE ",
    visualWordmarkAccent: "WORKSHOP",
    subhead:
      "Pour les entrepreneurs francophones qui veulent shipper des agents IA et des automations qui rapportent — pas regarder une 13e formation.",
    primaryButton: "Quel entrepreneur t'es — et pourquoi ça bouge pas ?",
    primaryMeta: "Gratuit · 9 questions · 2 min",
    langSwitch: "EN",
    langSwitchHref: "/?lang=en",
    recentClientsKicker: "Récents builds",
    sections: [
      {
        kicker: "Ressources",
        links: [
          { label: "Skool — 100 places fondateurs", href: "/skool", index: "SKOOL", featured: true },
          { label: "Portfolio", href: "/portfolio", index: "01" },
          { label: "AI NEWS — la newsletter quotidienne", href: "/brief", index: "02" },
          { label: "Pack n8n gratuit", href: "/free-n8n-pack", index: "03" },
          { label: "Tous les produits", href: "/products", index: "04" },
        ],
      },
      {
        kicker: "Contact direct",
        links: [
          { label: "manu.uhila@taiyka.com", href: "mailto:manu.uhila@taiyka.com", index: "MAIL", external: true },
        ],
      },
    ],
    footerRights: "Tous droits réservés.",
  },
  en: {
    semanticH1: "Taiyka — AI Automation Workshop for Entrepreneurs",
    visualWordmarkLead: "THE ",
    visualWordmarkAccent: "WORKSHOP",
    subhead:
      "For French-speaking entrepreneurs who want to ship AI agents and automations that actually pay — not sit through another course.",
    primaryButton: "What kind of entrepreneur are you — and why aren't you moving?",
    primaryMeta: "Free · 9 questions · 2 min",
    langSwitch: "FR",
    langSwitchHref: "/?lang=fr",
    recentClientsKicker: "Recent builds",
    sections: [
      {
        kicker: "Resources",
        links: [
          { label: "Skool — 100 founder spots", href: "/skool", index: "SKOOL", featured: true },
          { label: "Portfolio", href: "/portfolio", index: "01" },
          { label: "AI NEWS — the daily newsletter", href: "/brief", index: "02" },
          { label: "Free n8n pack", href: "/free-n8n-pack", index: "03" },
          { label: "All products", href: "/products", index: "04" },
        ],
      },
      {
        kicker: "Direct contact",
        links: [
          { label: "manu.uhila@taiyka.com", href: "mailto:manu.uhila@taiyka.com", index: "MAIL", external: true },
        ],
      },
    ],
    footerRights: "All rights reserved.",
  },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const lang: Lang = sp?.lang === "en" ? "en" : "fr";

  const title =
    lang === "fr"
      ? "Taiyka — Workshop d'automatisation IA pour entrepreneurs"
      : "Taiyka — AI Automation Workshop for Entrepreneurs";

  const description =
    lang === "fr"
      ? "Workflows n8n, agents IA et systèmes d'automatisation pour entrepreneurs francophones. Lead magnets gratuits, kits prêts à l'emploi, communauté Skool. Par Manu (@manu_ai.to)."
      : "n8n workflows, AI agents and automation systems for French-speaking entrepreneurs. Free lead magnets, ready-to-ship kits, Skool community. By Manu (@manu_ai.to).";

  return {
    title,
    description,
    alternates: {
      canonical: SITE,
      languages: {
        "fr-FR": "/",
        "en-US": "/?lang=en",
      },
    },
    openGraph: {
      type: "website",
      url: SITE,
      siteName: "Taiyka",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      title,
      description,
      images: [
        {
          url: "/og/home.png",
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
      images: ["/og/home.png"],
      creator: "@manu_ai.to",
    },
  };
}

// Google's Organization schema requires a raster logo (PNG/JPG); /logo-512.png is
// generated in Wave 3-A3. sameAs intentionally lists only IG + TikTok — those are
// Taiyka's only active public profiles; do not add LinkedIn/X/YouTube placeholders.
const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Taiyka",
  url: "https://taiyka.com",
  logo: "https://taiyka.com/logo-512.png",
  sameAs: [
    "https://instagram.com/manu_ai.to",
    "https://tiktok.com/@manu_ai.to",
  ],
};

const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Taiyka",
  url: "https://taiyka.com",
  inLanguage: ["fr-FR", "en-US"],
  publisher: {
    "@type": "Organization",
    name: "Taiyka",
  },
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const sp = await searchParams;
  const lang: Lang = sp?.lang === "en" ? "en" : "fr";
  const c = COPY[lang];

  // Defensive: render the proof row only when we actually have verifiable names.
  const showRecentClients = RECENT_CLIENTS.length > 0;

  return (
    <main className="relative flex-1 w-full flex flex-col z-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSONLD) }}
      />

      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[60vh] bg-gradient-glow opacity-60 blur-2xl"
      />

      <div
        className="relative mx-auto w-full max-w-2xl px-6 md:px-10 py-10 md:py-16 flex flex-col flex-1 text-center"
        style={{ opacity: 0, animation: "qcm-fade-in 400ms ease-out forwards" }}
      >
        {/* Top bar — keep justify-between for nav scannability */}
        <div className="w-full flex items-center justify-between mb-12 md:mb-16 font-mono text-[11px] tracking-[0.22em] uppercase">
          <span
            className="inline-flex items-center gap-2 text-foreground/80"
            style={{ textShadow: "0 0 8px rgba(10,22,40,0.9)" }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            TAIYKA · WORKSHOP
          </span>
          <Link
            href={c.langSwitchHref}
            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
          >
            {c.langSwitch} <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Semantic H1 — keyword-bearing, visually hidden so screen readers + crawlers get the value prop */}
        <h1 className="sr-only">{c.semanticH1}</h1>

        {/* Decorative wordmark — visual hero, no longer the H1. Bumped per audit. */}
        <p
          role="presentation"
          className="self-center mb-4 md:mb-6 text-balance font-bold tracking-[-0.04em] leading-[0.96] text-[clamp(2.25rem,9vw,5rem)] uppercase"
        >
          {c.visualWordmarkLead}
          <span className="text-gradient-hero">{c.visualWordmarkAccent}</span>
        </p>

        {/* Subhead — names audience + outcome */}
        <p className="self-center max-w-xl mb-8 md:mb-10 text-balance text-[0.95rem] md:text-base leading-relaxed text-foreground/80">
          {c.subhead}
        </p>

        <div className="hairline mb-10 md:mb-12" />

        {/* Section A — primary funnel entry */}
        <div className="flex flex-col items-center gap-5 mb-8 md:mb-10">
          <span className="kicker">QCM Découverte</span>
          <Link
            href={withLang("/qcm", lang)}
            className="hover-grow group inline-flex items-center justify-center gap-3 min-h-14 md:min-h-16 py-3 px-5 md:px-8 rounded-md bg-gradient-hero text-[#0a1628] font-bold text-[0.9375rem] md:text-base tracking-tight shadow-glow hover:shadow-[0_0_60px_rgba(0,166,255,0.55)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]"
          >
            <span className="text-balance leading-tight">{c.primaryButton}</span>
            <span aria-hidden className="transition-transform group-hover:translate-x-1 shrink-0">
              →
            </span>
          </Link>
          <p
            className="font-mono text-[11px] tracking-[0.22em] uppercase text-foreground/80"
            style={{ textShadow: "0 0 8px rgba(10,22,40,0.9)" }}
          >
            {c.primaryMeta}
          </p>
        </div>

        {/* Recent clients proof row — verified portfolio names only */}
        {showRecentClients && (
          <div className="mt-2 md:mt-4 mb-12 md:mb-16 flex flex-col items-center gap-2">
            <span className="kicker">{c.recentClientsKicker}</span>
            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-foreground/90 text-xs md:text-sm font-mono uppercase tracking-wider">
              {RECENT_CLIENTS.map((name, i) => (
                <Fragment key={name}>
                  {i > 0 && <span aria-hidden>·</span>}
                  <span>{name}</span>
                </Fragment>
              ))}
            </p>
          </div>
        )}

        {/* Sections B + C — HUD tile grid */}
        {c.sections.map((section, sIdx) => {
          const fullWidth = true;
          return (
            <div key={section.kicker} className="mb-12 md:mb-16 flex flex-col items-center">
              <span className="kicker mb-6">{section.kicker}</span>
              <ul
                className={cn(
                  "w-full gap-3",
                  fullWidth ? "flex flex-col" : "grid grid-cols-1 sm:grid-cols-2"
                )}
              >
                {section.links.map((link) => {
                  // Demoted featured (Skool) row: keep brackets visible but static,
                  // drop the heavy glow shadow + bracket pulse to reserve them for the QCM CTA.
                  const cardClass = cn(
                    "group relative block w-full rounded-md transition-all duration-300 ease-out",
                    fullWidth ? "px-5 py-4" : "px-5 py-5",
                    link.featured
                      ? "border border-primary/30 bg-primary/[0.05] hover:border-primary/60 hover:bg-primary/[0.08]"
                      : "border border-border/70 bg-card/40 hover:border-primary/60 hover:bg-card/70 hover:shadow-[0_0_24px_rgba(0,166,255,0.18)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]"
                  );
                  const brackets = (
                    <>
                      <span aria-hidden className={cn("pointer-events-none absolute left-1.5 top-1.5 h-2.5 w-2.5 border-l border-t transition-colors", link.featured ? "border-primary/70 group-hover:border-primary" : "border-[var(--hud-bracket-dim)] group-hover:border-[var(--hud-bracket)]")} />
                      <span aria-hidden className={cn("pointer-events-none absolute right-1.5 top-1.5 h-2.5 w-2.5 border-r border-t transition-colors", link.featured ? "border-primary/70 group-hover:border-primary" : "border-[var(--hud-bracket-dim)] group-hover:border-[var(--hud-bracket)]")} />
                      <span aria-hidden className={cn("pointer-events-none absolute left-1.5 bottom-1.5 h-2.5 w-2.5 border-l border-b transition-colors", link.featured ? "border-primary/70 group-hover:border-primary" : "border-[var(--hud-bracket-dim)] group-hover:border-[var(--hud-bracket)]")} />
                      <span aria-hidden className={cn("pointer-events-none absolute right-1.5 bottom-1.5 h-2.5 w-2.5 border-r border-b transition-colors", link.featured ? "border-primary/70 group-hover:border-primary" : "border-[var(--hud-bracket-dim)] group-hover:border-[var(--hud-bracket)]")} />
                    </>
                  );
                  const inner = fullWidth ? (
                    <>
                      {brackets}
                      <span className="flex items-center gap-4">
                        <span className="inline-flex items-center gap-1.5 font-mono-hud text-[10px] tabular-nums tracking-[0.22em] uppercase text-muted-foreground/80 group-hover:text-primary transition-colors shrink-0">
                          <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-[var(--hud-tick)] opacity-70 group-hover:opacity-100 transition-opacity" />
                          {link.index}
                        </span>
                        <span aria-hidden className="hidden sm:block h-px flex-1 bg-border/60 group-hover:bg-primary/40 transition-colors" />
                        <span className="flex-1 sm:flex-none text-left text-[0.9375rem] md:text-base leading-snug text-foreground group-hover:text-primary transition-colors">
                          {link.label}
                        </span>
                        <span aria-hidden className="hidden sm:block h-px flex-1 bg-border/60 group-hover:bg-primary/40 transition-colors" />
                        <span
                          aria-hidden
                          className="font-mono-hud text-[10px] tracking-[0.22em] uppercase text-muted-foreground/50 group-hover:text-primary/80 group-hover:translate-x-0.5 transition-all shrink-0"
                        >
                          →
                        </span>
                      </span>
                    </>
                  ) : (
                    <>
                      {brackets}
                      <span className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 font-mono-hud text-[10px] tabular-nums tracking-[0.22em] uppercase text-muted-foreground/80 group-hover:text-primary transition-colors">
                          <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-[var(--hud-tick)] opacity-70 group-hover:opacity-100 transition-opacity" />
                          {link.index}
                        </span>
                        <span
                          aria-hidden
                          className="font-mono-hud text-[10px] tracking-[0.22em] uppercase text-muted-foreground/40 group-hover:text-primary/70 group-hover:translate-x-0.5 transition-all"
                        >
                          →
                        </span>
                      </span>
                      <span className="mt-3 block text-left text-[0.9375rem] md:text-base leading-snug text-foreground group-hover:text-primary transition-colors">
                        {link.label}
                      </span>
                    </>
                  );
                  if (link.external) {
                    return (
                      <li key={link.label} className="w-full">
                        <a href={withLang(link.href, lang)} target="_blank" rel="noopener noreferrer" className={cardClass}>
                          {inner}
                        </a>
                      </li>
                    );
                  }
                  return (
                    <li key={link.label} className="w-full">
                      <Link href={withLang(link.href, lang)} className={cardClass}>
                        {inner}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {sIdx < c.sections.length - 1 && <div className="hairline mt-10 md:mt-12" />}
            </div>
          );
        })}

        {/* Footer — mt-auto anchors to bottom when content is short */}
        <footer className="mt-auto pt-12 border-t border-border text-xs text-muted-foreground flex flex-wrap justify-center gap-y-2 gap-x-4">
          <span>© {new Date().getFullYear()} Taiyka · @manu_ai.to</span>
          <span aria-hidden>·</span>
          <span>{c.footerRights}</span>
        </footer>
      </div>
    </main>
  );
}
