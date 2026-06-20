import Link from "next/link";
import { Fragment } from "react";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { withLang } from "@/lib/lang-utils";

type Lang = "fr" | "en";

type ButtonSpec = {
  label: string;
  href: string;
  index: string;
  primary?: boolean;
};

type Copy = {
  h1: string;
  semanticH1: string;
  visualLead: string;
  visualAccent: string;
  topStatus: string;
  sectionKicker: string;
  langSwitch: string;
  langSwitchHref: string;
  buttons: ButtonSpec[];
};

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taiyka.com";

const COPY: Record<Lang, Copy> = {
  fr: {
    h1: "L'Atelier",
    semanticH1: "L'Atelier — liens et ressources de Manu (@manu_ai.to)",
    visualLead: "L'",
    visualAccent: "ATELIER",
    topStatus: "L'ATELIER · TAIYKA",
    sectionKicker: "Liens",
    langSwitch: "EN",
    langSwitchHref: "/?lang=en",
    buttons: [
      { label: "Réserver un appel", href: withLang("/book", "fr"), index: "APPEL", primary: true },
      { label: "Ressources gratuites", href: withLang("/resources", "fr"), index: "01" },
      { label: "Mon Skool", href: withLang("/skool", "fr"), index: "02" },
      { label: "Ma boutique", href: withLang("/shop", "fr"), index: "03" },
    ],
  },
  en: {
    h1: "The Workshop",
    semanticH1: "The Workshop — Manu's links and resources (@manu_ai.to)",
    visualLead: "THE ",
    visualAccent: "WORKSHOP",
    topStatus: "THE WORKSHOP · TAIYKA",
    sectionKicker: "Links",
    langSwitch: "FR",
    langSwitchHref: "/?lang=fr",
    buttons: [
      { label: "Book a call", href: withLang("/book", "en"), index: "CALL", primary: true },
      { label: "Free resources", href: withLang("/resources", "en"), index: "01" },
      { label: "My Skool", href: withLang("/skool", "en"), index: "02" },
      { label: "My Shop", href: withLang("/shop", "en"), index: "03" },
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
      siteName: lang === "fr" ? "L'Atelier" : "The Workshop",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      title,
      description,
    },
    twitter: {
      card: "summary",
      title,
      description,
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

  return (
    <main className="relative flex-1 w-full flex flex-col z-10">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[60vh] bg-gradient-glow opacity-60 blur-2xl"
      />

      <div
        className="relative mx-auto w-full max-w-xl px-6 md:px-10 py-10 md:py-16 flex flex-col flex-1"
        style={{ opacity: 0, animation: "qcm-fade-in 400ms ease-out forwards" }}
      >
        {/* Top bar — status pulse + lang toggle */}
        <div className="w-full flex items-center justify-between mb-12 md:mb-16 font-mono text-[11px] tracking-[0.22em] uppercase">
          <span
            className="inline-flex items-center gap-2 text-foreground/80"
            style={{ textShadow: "0 0 8px rgba(10,22,40,0.9)" }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {c.topStatus}
          </span>
          <Link
            href={c.langSwitchHref}
            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
            aria-label={lang === "fr" ? "Switch to English" : "Passer en français"}
          >
            {c.langSwitch} <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Semantic H1 — keyword-bearing, screen-reader only */}
        <h1 className="sr-only">{c.semanticH1}</h1>

        {/* Wordmark — uppercase, gradient on accent */}
        <p
          role="presentation"
          className="self-center mb-12 md:mb-14 text-balance font-bold tracking-[-0.04em] leading-[0.96] whitespace-nowrap uppercase text-[clamp(2.25rem,9vw,4.5rem)]"
        >
          {c.visualLead}
          <span className="text-gradient-hero">{c.visualAccent}</span>
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
              <Fragment key={btn.label}>
                <Link href={btn.href} className={cardClass}>
                  {/* Four corner brackets */}
                  <span aria-hidden className={bracketCls("lt")} />
                  <span aria-hidden className={bracketCls("rt")} />
                  <span aria-hidden className={bracketCls("lb")} />
                  <span aria-hidden className={bracketCls("rb")} />

                  <span className="flex items-center gap-4">
                    {/* Index code */}
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 font-mono-hud text-[10px] tabular-nums tracking-[0.22em] uppercase shrink-0 transition-colors",
                        btn.primary
                          ? "text-primary"
                          : "text-muted-foreground/80 group-hover:text-primary",
                      )}
                    >
                      <span
                        aria-hidden
                        className="inline-block h-1 w-1 rounded-full bg-[var(--hud-tick)] opacity-70 group-hover:opacity-100 transition-opacity"
                      />
                      {btn.index}
                    </span>

                    {/* Divider hairline */}
                    <span
                      aria-hidden
                      className="hidden sm:block h-px flex-1 bg-border/60 group-hover:bg-primary/40 transition-colors"
                    />

                    {/* Label */}
                    <span
                      className={cn(
                        "flex-1 sm:flex-none text-left text-[0.95rem] md:text-base font-medium leading-snug transition-colors",
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
              </Fragment>
            );
          })}
        </nav>

        <div className="hairline mt-12 md:mt-14 opacity-50" />
      </div>
    </main>
  );
}
