import Link from "next/link";
import type { Metadata } from "next";
import BriefSignupForm from "@/components/BriefSignupForm";
import SampleIssuePreview from "@/components/SampleIssuePreview";
import { withLang } from "@/lib/lang-utils";
import { SITE } from "@/lib/site";

type Lang = "fr" | "en";

type Copy = {
  htmlLang: string;
  topHome: string;
  langSwitchLabel: string;
  langSwitchHref: string;
  statusPill: string;
  kickerHero: string;
  h1Lead: string;
  h1Accent: string;
  h1Tail: string;
  kickerManifesto: string;
  manifestoLead: string;
  manifestoTail: string;
  kickerInside: string;
  feature1: string;
  feature2: string;
  feature3: string;
  featureMeta: string;
  kickerSample: string;
  sampleLead: string;
  kickerSignup: string;
  signupLead: string;
  footerRights: string;
};

const COPY: Record<Lang, Copy> = {
  fr: {
    htmlLang: "fr",
    topHome: "← L'Atelier · Accueil",
    langSwitchLabel: "EN",
    langSwitchHref: "/brief?lang=en",
    statusPill: "Newsletter · tous les 2 jours · 2 min",
    kickerHero: "LE BRIEF · 1 JOUR SUR 2",
    h1Lead: "L'IA qui bouge,",
    h1Accent: "un jour sur deux.",
    h1Tail: "En français. En 2 minutes.",
    kickerManifesto: "MANIFESTE",
    manifestoLead:
      "Tu veux suivre l'IA mais t'as pas 2h par jour à lire TechCrunch, The Verge, MIT, X, Reddit, et 12 newsletters.",
    manifestoTail:
      "Je le fais à ta place. Tous les 2 jours : les news IA qui comptent, triées. Les 3-4 grosses décryptées en quelques lignes, le reste en bref, avec les liens. 2 minutes de lecture. C'est tout.",
    kickerInside: "DEDANS · FORMAT",
    feature1:
      "3-4 news décryptées + le reste en bref — agents, modèles, outils, business.",
    feature2:
      "Les grosses en 2-3 lignes : ce que c'est, pourquoi ça compte. Le reste en une ligne, avec le lien.",
    feature3:
      "Que ce que je trouve pertinent. Le reste, je le coupe.",
    featureMeta: "Pas de pitch. Pas de pub. Pas de spam.",
    kickerSample: "EXEMPLE · UN NUMÉRO",
    sampleLead: "Voilà à quoi ressemble un numéro dans ta boîte.",
    kickerSignup: "S'INSCRIRE",
    signupLead:
      "Entre ton email. Confirme en un clic. Ton premier numéro au prochain envoi.",
    footerRights: "Tous droits réservés.",
  },
  en: {
    htmlLang: "en",
    topHome: "← The Workshop · Home",
    langSwitchLabel: "FR",
    langSwitchHref: "/brief",
    statusPill: "Newsletter · every 2 days · 2 min",
    kickerHero: "LE BRIEF · EVERY 2 DAYS",
    h1Lead: "The AI that's actually moving,",
    h1Accent: "every 2 days.",
    h1Tail: "In French. In 2 minutes.",
    kickerManifesto: "MANIFESTO",
    manifestoLead:
      "You want to follow AI but you don't have 2 hours a day to read TechCrunch, The Verge, MIT, X, Reddit, and 12 newsletters.",
    manifestoTail:
      "I do it for you. Every 2 days: the AI news that matters, filtered. The 3-4 big ones broken down in a few lines, the rest in brief, with the links. 2-minute read. That's it.",
    kickerInside: "INSIDE · FORMAT",
    feature1:
      "3-4 stories broken down + the rest in brief — agents, models, tools, business.",
    feature2:
      "The big ones in 2-3 lines: what it is, why it matters. The rest in one line, with the link.",
    feature3:
      "Only what I find relevant. The rest, I cut.",
    featureMeta: "No pitch. No ads. No spam.",
    kickerSample: "SAMPLE · ONE ISSUE",
    sampleLead: "Here's what one issue looks like in your inbox.",
    kickerSignup: "SIGN UP",
    signupLead:
      "Drop your email. Confirm in one click. Your first issue on the next send.",
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
      ? "Le Brief — L'IA qui bouge, un jour sur deux · L'Atelier"
      : "Le Brief — AI that moves, every 2 days · The Workshop";

  const description =
    lang === "fr"
      ? "Newsletter IA gratuite, tous les 2 jours. 2 minutes de lecture, en français : les news IA qui comptent, décryptées et avec le lien. Dans ta boîte."
      : "Free AI newsletter, every 2 days. 2-minute read, in French: the AI news that matters, broken down, with the link. In your inbox.";

  return {
    title,
    description,
    alternates: {
      canonical: "/brief",
      languages: {
        "fr-FR": "/brief",
        "en-US": "/brief?lang=en",
      },
    },
    openGraph: {
      type: "website",
      url: `${SITE}/brief${lang === "en" ? "?lang=en" : ""}`,
      siteName: lang === "fr" ? "L'Atelier" : "The Workshop",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      title,
      description,
      images: [
        {
          url: "/og/brief.png",
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
      images: ["/og/brief.png"],
      creator: "@manu_ai.to",
    },
  };
}

export default async function BriefLandingPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const sp = await searchParams;
  const lang: Lang = sp?.lang === "en" ? "en" : "fr";
  const c = COPY[lang];

  const briefSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Le Brief",
    description:
      lang === "fr"
        ? "Le brief IA, un jour sur deux, sans bullshit."
        : "The AI brief, every 2 days, no bullshit.",
    publisher: {
      "@type": "Organization",
      name: lang === "fr" ? "L'Atelier" : "The Workshop",
      url: SITE,
    },
    inLanguage: lang === "fr" ? "fr-FR" : "en-US",
  };

  return (
    <main className="relative flex-1 w-full flex flex-col z-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(briefSchema) }}
      />
      <div
        aria-hidden
        className="hidden md:block pointer-events-none fixed inset-x-0 top-0 h-[60vh] bg-gradient-glow opacity-60 blur-2xl"
      />

      <div
        className="relative mx-auto w-full max-w-3xl px-6 md:px-10 py-12 md:py-20 flex flex-col flex-1 text-center"
        style={{ opacity: 0, animation: "qcm-fade-in 400ms ease-out forwards" }}
      >
        {/* Top bar */}
        <div className="w-full flex items-center justify-between mb-14 md:mb-20 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase gap-3">
          <Link
            href={withLang("/", lang)}
            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
          >
            {c.topHome}
          </Link>
          <span
            className="inline-flex items-center gap-2 text-foreground/80 shrink-0"
            style={{ textShadow: "0 0 8px rgba(10,22,40,0.9)" }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {c.statusPill}
          </span>
          <Link
            href={c.langSwitchHref}
            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm shrink-0"
          >
            {c.langSwitchLabel} <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Kicker */}
        <span className="kicker">{c.kickerHero}</span>

        {/* H1 */}
        <h1 className="mt-5 mb-4 md:mb-5 text-balance font-bold tracking-[-0.04em] leading-[0.96] text-[clamp(2.5rem,8.5vw,5rem)]">
          {c.h1Lead}{" "}
          <span className="text-gradient-hero">{c.h1Accent}</span>
        </h1>
        <p className="mb-12 md:mb-16 text-balance text-[0.95rem] md:text-base leading-relaxed text-muted-foreground">
          {c.h1Tail}
        </p>

        <div className="hairline mb-14 md:mb-20" />

        {/* Manifesto — centered */}
        <div className="flex flex-col items-center gap-5 mb-14 md:mb-20">
          <span className="kicker">{c.kickerManifesto}</span>
          <blockquote className="relative pt-5 max-w-[58ch] mx-auto">
            <span
              aria-hidden
              className="absolute left-1/2 -translate-x-1/2 top-0 h-px w-12 bg-primary"
            />
            <p className="text-[1.0625rem] md:text-[1.25rem] leading-[1.65] text-[#e8f0fe] text-balance">
              {c.manifestoLead}
            </p>
            <p className="mt-5 text-[1.0625rem] md:text-[1.125rem] leading-[1.65] text-muted-foreground text-balance">
              {c.manifestoTail}
            </p>
          </blockquote>
        </div>

        {/* What's inside — centered stack (no hairline above; merged with manifesto block) */}
        <div className="flex flex-col items-center gap-6 mb-14 md:mb-20">
          <span className="kicker">{c.kickerInside}</span>
          <div className="flex flex-col items-center gap-4 max-w-[58ch]">
            <div className="flex flex-col items-center gap-1">
              <span className="font-mono-hud text-[10px] tabular-nums tracking-[0.22em] uppercase text-primary/80">01</span>
              <p className="text-[1rem] md:text-[1.0625rem] leading-[1.6] text-[#e8f0fe]">
                {c.feature1}
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="font-mono-hud text-[10px] tabular-nums tracking-[0.22em] uppercase text-primary/80">02</span>
              <p className="text-[1rem] md:text-[1.0625rem] leading-[1.6] text-[#e8f0fe]">
                {c.feature2}
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="font-mono-hud text-[10px] tabular-nums tracking-[0.22em] uppercase text-primary/80">03</span>
              <p className="text-[1rem] md:text-[1.0625rem] leading-[1.6] text-[#e8f0fe]">
                {c.feature3}
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="font-mono-hud text-[10px] tabular-nums tracking-[0.22em] uppercase text-muted-foreground/70">—</span>
              <p className="text-[1rem] md:text-[1.0625rem] leading-[1.6] text-muted-foreground">
                {c.featureMeta}
              </p>
            </div>
          </div>
        </div>

        {/* Sample issue preview — visual proof of format before sign up */}
        <div className="flex flex-col items-center gap-6 mb-14 md:mb-20">
          <span className="kicker">{c.kickerSample}</span>
          <p className="text-[1rem] md:text-[1.0625rem] leading-[1.6] text-muted-foreground max-w-[50ch]">
            {c.sampleLead}
          </p>
          <SampleIssuePreview lang={lang} />
        </div>

        <div className="hairline mb-14 md:mb-20" />

        {/* CTA — centered. Form fields keep their own left text alignment via component. */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <span className="kicker">{c.kickerSignup}</span>
          <p className="text-[1rem] md:text-[1.0625rem] leading-[1.6] text-muted-foreground max-w-[50ch]">
            {c.signupLead}
          </p>
          <div className="w-full max-w-md text-left">
            <BriefSignupForm lang={lang} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-12 border-t border-border text-xs text-muted-foreground flex flex-wrap justify-center gap-y-2 gap-x-4">
          <span>© {new Date().getFullYear()} · @manu_ai.to</span>
          <span aria-hidden>·</span>
          <span>{c.footerRights}</span>
        </footer>
      </div>
    </main>
  );
}
