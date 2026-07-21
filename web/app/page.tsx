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
    visualAccent: "Atelier",
    topStatus: "L'Atelier",
    sectionKicker: "Liens",
    langSwitch: "EN",
    langSwitchHref: "/?lang=en",
    langSwitchAria: "Voir en anglais",
    buttons: [
      { label: "Réserver un appel", href: withLang("/book", "fr"), icon: Phone, primary: true },
      { label: "Ma boutique", href: withLang("/shop", "fr"), icon: ShoppingBag },
      { label: "Mon Skool", href: withLang("/skool", "fr"), icon: Users },
      { label: "Le Brief", href: withLang("/brief", "fr"), icon: Mail },
      { label: "Ressources gratuites", href: withLang("/resources", "fr"), icon: Download },
    ],
  },
  en: {
    h1: "The Workshop",
    semanticH1: "The Workshop — Manu's links and resources (@manu_ai.to)",
    visualLead: "The ",
    visualAccent: "Workshop",
    topStatus: "The Workshop",
    sectionKicker: "Links",
    langSwitch: "FR",
    langSwitchHref: "/?lang=fr",
    langSwitchAria: "View in French",
    buttons: [
      { label: "Book a call", href: withLang("/book", "en"), icon: Phone, primary: true },
      { label: "My Shop", href: withLang("/shop", "en"), icon: ShoppingBag },
      { label: "My Skool", href: withLang("/skool", "en"), icon: Users },
      { label: "Le Brief", href: withLang("/brief", "en"), icon: Mail },
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
    <main className="relative flex-1 w-full flex flex-col min-h-screen paper-grid">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div
        className="relative mx-auto w-full max-w-xl px-6 md:px-10 py-6 md:py-8 flex flex-col flex-1 min-h-screen"
        style={{ opacity: 0, animation: "qcm-fade-in 400ms ease-out forwards" }}
      >
        {/* Top bar — mono label + lang toggle */}
        <div className="w-full flex items-center justify-between font-mono-hud text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
          <span className="inline-flex items-center gap-2 text-foreground">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,166,255,0.8)]" />
            {c.topStatus}
          </span>
          <Link
            href={c.langSwitchHref}
            className="inline-flex items-center justify-center min-h-[44px] px-3 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glacier-blue focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
            aria-label={c.langSwitchAria}
          >
            {c.langSwitch} <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Semantic H1 — keyword-bearing, screen-reader only */}
        <h1 className="sr-only">{c.semanticH1}</h1>

        {/* Centered content block */}
        <div className="flex-1 flex flex-col justify-center py-10">
          {/* Wordmark — heavy editorial, all obsidian; accent word carries a
              steel underline rather than a color change (quieter, more premium). */}
          <p
            role="presentation"
            className="self-center mb-12 md:mb-14 display-xl whitespace-nowrap text-foreground"
          >
            {c.visualLead}
            <span className="text-primary">{c.visualAccent}</span>
          </p>

          {/* Section kicker */}
          <span className="kicker kicker-accent mb-5 self-start">
            {c.sectionKicker}
          </span>

          {/* Link cards */}
          <nav
            aria-label={lang === "fr" ? "Liens principaux" : "Main links"}
            className="flex flex-col gap-3"
          >
            {c.buttons.map((btn) => (
              <Link
                key={btn.label}
                href={btn.href}
                className={cn(
                  "group card-line block w-full px-5 py-4",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glacier-blue focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]",
                  "active:scale-[0.995]",
                  btn.primary && "card-line-accent",
                )}
              >
                <span className="flex items-center gap-4">
                  {/* Icon — quiet square. Primary gets the solid navy chip. */}
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border transition-colors",
                      btn.primary
                        ? "border-primary bg-primary text-[#06131f]"
                        : "border-border bg-secondary/60 text-glacier-blue group-hover:border-primary/50 group-hover:text-primary",
                    )}
                  >
                    <btn.icon aria-hidden className="h-4 w-4" strokeWidth={2} />
                  </span>

                  {/* Label */}
                  <span className="min-w-0 text-[0.95rem] md:text-base font-semibold leading-snug text-foreground truncate">
                    {btn.label}
                  </span>

                  {/* Arrow */}
                  <span
                    aria-hidden
                    className={cn(
                      "ml-auto shrink-0 text-sm transition-all group-hover:translate-x-0.5",
                      btn.primary
                        ? "text-primary"
                        : "text-glacier-blue/70 group-hover:text-primary",
                    )}
                  >
                    →
                  </span>
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <footer className="pt-8 text-xs text-muted-foreground flex flex-wrap justify-center gap-y-2 gap-x-4">
          <span>© {new Date().getFullYear()} · @manu_ai.to</span>
        </footer>
      </div>
    </main>
  );
}
