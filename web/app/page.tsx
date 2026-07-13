import Link from "next/link";
import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import { Phone, Download, Users, ShoppingBag, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { withLang } from "@/lib/lang-utils";
import { SITE } from "@/lib/site";
import type { Lang } from "@/lib/portfolio";

type ButtonSpec = {
  label: string;
  href: string;
  icon: LucideIcon;
  primary?: boolean;
};

type Copy = {
  h1: string;
  semanticH1: string;
  visualLead: string;
  visualAccent: string;
  tagline: string;
  topStatus: string;
  sectionKicker: string;
  langSwitch: string;
  langSwitchHref: string;
  langSwitchAria: string;
  buttons: ButtonSpec[];
};

const COPY: Record<Lang, Copy> = {
  fr: {
    h1: "L'Atelier",
    semanticH1: "L'Atelier — liens et ressources de Manu (@manu_ai.to)",
    visualLead: "L'",
    visualAccent: "ATELIER",
    tagline: "Systèmes d'automatisation IA & n8n — par Manu",
    topStatus: "L'ATELIER",
    sectionKicker: "Liens",
    langSwitch: "EN",
    langSwitchHref: "/?lang=en",
    langSwitchAria: "Voir en anglais",
    buttons: [
      { label: "Réserver un appel", href: withLang("/book", "fr"), icon: Phone, primary: true },
      { label: "Ma boutique", href: withLang("/shop", "fr"), icon: ShoppingBag },
      { label: "Mon Skool", href: withLang("/skool", "fr"), icon: Users },
      { label: "Le Brief — newsletter IA", href: withLang("/brief", "fr"), icon: Mail },
      { label: "Ressources gratuites", href: withLang("/resources", "fr"), icon: Download },
    ],
  },
  en: {
    h1: "The Workshop",
    semanticH1: "The Workshop — Manu's links and resources (@manu_ai.to)",
    visualLead: "THE ",
    visualAccent: "WORKSHOP",
    tagline: "AI automation & n8n systems — by Manu",
    topStatus: "THE WORKSHOP",
    sectionKicker: "Links",
    langSwitch: "FR",
    langSwitchHref: "/?lang=fr",
    langSwitchAria: "View in French",
    buttons: [
      { label: "Book a call", href: withLang("/book", "en"), icon: Phone, primary: true },
      { label: "My Shop", href: withLang("/shop", "en"), icon: ShoppingBag },
      { label: "My Skool", href: withLang("/skool", "en"), icon: Users },
      { label: "Le Brief — AI newsletter", href: withLang("/brief", "en"), icon: Mail },
      { label: "Free resources", href: withLang("/resources", "en"), icon: Download },
    ],
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
      ? "L'Atelier — Manu (@manu_ai.to)"
      : "The Workshop — Manu (@manu_ai.to)";
  const description =
    lang === "fr"
      ? "Tous mes liens : appel, ressources gratuites, communauté Skool, boutique."
      : "All my links: call, free resources, Skool community, shop.";

  const ogImages = [
    {
      url: "/og/home.png",
      width: 1200,
      height: 630,
      alt: title,
    },
  ];

  return {
    title,
    description,
    alternates: {
      // Lang-aware canonical so `?lang=en` isn't deduped into the FR root.
      canonical: lang === "en" ? `${SITE}/?lang=en` : SITE,
      languages: {
        "fr-FR": "/",
        "en-US": "/?lang=en",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      url: SITE,
      siteName: lang === "fr" ? "L'Atelier" : "The Workshop",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      alternateLocale: lang === "fr" ? ["en_US"] : ["fr_FR"],
      title,
      description,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages,
      creator: "@manu_ai.to",
    },
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const sp = await searchParams;
  const lang: Lang = sp?.lang === "en" ? "en" : "fr";
  const c = COPY[lang];

  // schema.org entity graph — helps Google build the brand entity for @manu_ai.to.
  const brandName = lang === "fr" ? "L'Atelier" : "The Workshop";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: SITE,
        name: brandName,
        inLanguage: lang === "fr" ? "fr-FR" : "en-US",
        publisher: { "@id": `${SITE}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE}/#organization`,
        name: brandName,
        url: SITE,
      },
      {
        "@type": "Person",
        "@id": `${SITE}/#manu`,
        name: "Manu",
        url: SITE,
        sameAs: [
          "https://instagram.com/manu_ai.to",
          "https://tiktok.com/@manu_ai.to",
        ],
      },
    ],
  };

  return (
    <main className="relative flex-1 w-full flex flex-col z-10 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[60vh] bg-gradient-glow opacity-60 blur-2xl hidden md:block"
      />

      <div
        className="relative mx-auto w-full max-w-xl px-6 md:px-10 py-6 md:py-8 flex flex-col flex-1 min-h-screen"
        style={{ opacity: 0, animation: "qcm-fade-in 400ms ease-out forwards" }}
      >
        {/* Top bar — status pulse + lang toggle (pinned to top) */}
        <div className="w-full flex items-center justify-between font-mono text-[11px] tracking-[0.22em] uppercase">
          <span
            className="inline-flex items-center gap-2 text-foreground/80"
            style={{ textShadow: "0 0 8px rgba(10,22,40,0.9)" }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {c.topStatus}
          </span>
          <Link
            href={c.langSwitchHref}
            className="inline-flex items-center justify-center min-h-[44px] px-3 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
            aria-label={c.langSwitchAria}
          >
            {c.langSwitch} <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Semantic H1 — keyword-bearing, screen-reader only */}
        <h1 className="sr-only">{c.semanticH1}</h1>

        {/* Centered content block — wordmark + tiles fill remaining vertical space */}
        <div className="flex-1 flex flex-col justify-center py-10">
          {/* Wordmark — uppercase, gradient on accent. Clamp floor lowered so it
              scales down (not clips) on ≤340px screens; stays single line. */}
          <p
            role="presentation"
            className="self-center mb-4 md:mb-5 font-bold tracking-[-0.04em] leading-[0.96] whitespace-nowrap uppercase text-[clamp(1.75rem,9vw,4.5rem)]"
          >
            {c.visualLead}
            <span className="text-gradient-hero">{c.visualAccent}</span>
          </p>

          {/* Visible tagline — value prop for sighted users (H1 is sr-only) */}
          <p className="self-center mb-12 md:mb-14 text-sm text-muted-foreground text-center text-balance max-w-[36ch]">
            {c.tagline}
          </p>

          <div className="hairline mb-10 md:mb-12" />

          {/* Section kicker */}
          <span className="kicker mb-6 self-center">{c.sectionKicker}</span>

        {/* HUD tile stack */}
        <nav
          aria-label={lang === "fr" ? "Liens principaux" : "Main links"}
          className="flex flex-col gap-3"
        >
          {c.buttons.map((btn) => {
            const cardClass = cn(
              "group relative block w-full rounded-md px-5 py-4 transition-all duration-300 ease-out",
              "active:scale-[0.99] active:bg-primary/10",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]",
              btn.primary
                ? "border border-primary/40 bg-primary/[0.06] hover:border-primary/80 hover:bg-primary/[0.10] hover:shadow-[0_0_32px_rgba(0,166,255,0.28)]"
                : "border border-border/70 bg-card/40 hover:border-primary/60 hover:bg-card/70 hover:shadow-[0_0_24px_rgba(0,166,255,0.18)]",
            );
            const bracketCls = (corner: "lt" | "rt" | "lb" | "rb") => {
              const pos =
                corner === "lt"
                  ? "left-1.5 top-1.5 border-l border-t"
                  : corner === "rt"
                    ? "right-1.5 top-1.5 border-r border-t"
                    : corner === "lb"
                      ? "left-1.5 bottom-1.5 border-l border-b"
                      : "right-1.5 bottom-1.5 border-r border-b";
              const color = btn.primary
                ? "border-primary/70 group-hover:border-primary"
                : "border-[var(--hud-bracket-dim)] group-hover:border-[var(--hud-bracket)]";
              return cn(
                "pointer-events-none absolute h-2.5 w-2.5 transition-colors",
                pos,
                color,
              );
            };
            return (
              <Link key={btn.label} href={btn.href} className={cardClass}>
                {/* Four corner brackets */}
                <span aria-hidden className={bracketCls("lt")} />
                <span aria-hidden className={bracketCls("rt")} />
                <span aria-hidden className={bracketCls("lb")} />
                <span aria-hidden className={bracketCls("rb")} />

                <span className="flex items-center gap-3">
                  {/* Icon */}
                  <btn.icon
                    aria-hidden
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      btn.primary
                        ? "text-primary"
                        : "text-muted-foreground/80 group-hover:text-primary",
                    )}
                    strokeWidth={2}
                  />

                  {/* Divider hairline */}
                  <span
                    aria-hidden
                    className="hidden sm:block h-px flex-1 bg-border/60 group-hover:bg-primary/40 transition-colors"
                  />

                  {/* Label — centered between hairlines */}
                  <span
                    className={cn(
                      "flex-1 sm:flex-none text-center text-[0.95rem] md:text-base font-medium leading-snug transition-colors",
                      btn.primary
                        ? "text-foreground"
                        : "text-foreground group-hover:text-primary",
                    )}
                  >
                    {btn.label}
                  </span>

                  {/* Divider hairline */}
                  <span
                    aria-hidden
                    className="hidden sm:block h-px flex-1 bg-border/60 group-hover:bg-primary/40 transition-colors"
                  />

                  {/* Arrow */}
                  <span
                    aria-hidden
                    className={cn(
                      "font-mono-hud text-[10px] tracking-[0.22em] uppercase shrink-0 transition-all group-hover:translate-x-0.5",
                      btn.primary
                        ? "text-primary"
                        : "text-muted-foreground/50 group-hover:text-primary/80",
                    )}
                  >
                    →
                  </span>
                </span>
              </Link>
            );
          })}
          </nav>

          <div className="hairline mt-12 md:mt-14 opacity-50" />
        </div>

        {/* Footer — matches sibling pages (free-n8n-pack, qcm) */}
        <footer className="pt-8 text-xs text-muted-foreground flex flex-wrap justify-center gap-y-2 gap-x-4">
          <span>© {new Date().getFullYear()} · @manu_ai.to</span>
        </footer>
      </div>
    </main>
  );
}
