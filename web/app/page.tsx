import Link from "next/link";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { withLang } from "@/lib/lang-utils";

type Lang = "fr" | "en";

type ButtonSpec = {
  label: string;
  href: string;
  primary?: boolean;
};

type Copy = {
  h1: string;
  semanticH1: string;
  visualLead: string;
  visualAccent: string;
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
    visualAccent: "Atelier",
    langSwitch: "EN",
    langSwitchHref: "/?lang=en",
    buttons: [
      { label: "Réserver un appel", href: withLang("/book", "fr"), primary: true },
      { label: "Ressources gratuites", href: withLang("/resources", "fr") },
      { label: "Mon Skool", href: withLang("/skool", "fr") },
      { label: "Ma boutique", href: withLang("/shop", "fr") },
    ],
  },
  en: {
    h1: "The Workshop",
    semanticH1: "The Workshop — Manu's links and resources (@manu_ai.to)",
    visualLead: "The ",
    visualAccent: "Workshop",
    langSwitch: "FR",
    langSwitchHref: "/?lang=fr",
    buttons: [
      { label: "Book a call", href: withLang("/book", "en"), primary: true },
      { label: "Free resources", href: withLang("/resources", "en") },
      { label: "My Skool", href: withLang("/skool", "en") },
      { label: "My Shop", href: withLang("/shop", "en") },
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
    <main className="relative flex-1 w-full flex flex-col z-10 min-h-screen">
      <div className="relative mx-auto w-full max-w-md px-6 pt-6 pb-12 flex flex-col flex-1">
        {/* Lang toggle — top-right */}
        <div className="w-full flex justify-end mb-16 md:mb-20">
          <Link
            href={c.langSwitchHref}
            className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm px-1"
            aria-label={lang === "fr" ? "Switch to English" : "Passer en français"}
          >
            {c.langSwitch}
          </Link>
        </div>

        {/* Semantic H1 for SEO — visually replaced by display H1 below */}
        <h1 className="sr-only">{c.semanticH1}</h1>

        {/* Display H1 — "L'Atelier" / "The Workshop" */}
        <p
          role="presentation"
          className="self-center mb-14 md:mb-16 text-center font-bold tracking-[-0.03em] leading-[1] whitespace-nowrap text-[clamp(1.75rem,8vw,3.25rem)]"
        >
          {c.visualLead}
          <span className="text-gradient-hero">{c.visualAccent}</span>
        </p>

        {/* Button stack */}
        <nav aria-label={lang === "fr" ? "Liens principaux" : "Main links"} className="flex flex-col gap-4">
          {c.buttons.map((btn) => {
            const base =
              "group block w-full text-center rounded-full py-4 px-6 text-[0.95rem] md:text-base font-semibold tracking-tight transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]";
            const styles = btn.primary
              ? "bg-gradient-hero text-[#0a1628] shadow-glow hover:shadow-[0_0_60px_rgba(0,166,255,0.55)] hover:scale-[1.02]"
              : "border border-white/15 bg-white/[0.02] text-foreground hover:border-primary/60 hover:bg-white/[0.05] hover:scale-[1.02]";
            return (
              <Link key={btn.label} href={btn.href} className={cn(base, styles)}>
                {btn.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </main>
  );
}
