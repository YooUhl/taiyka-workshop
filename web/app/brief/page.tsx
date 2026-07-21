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

  // Numbered format list — presentation only, copy strings unchanged.
  const features = [
    { n: "01", text: c.feature1, quiet: false },
    { n: "02", text: c.feature2, quiet: false },
    { n: "03", text: c.feature3, quiet: false },
    { n: "—", text: c.featureMeta, quiet: true },
  ];

  return (
    <main className="relative flex-1 w-full flex flex-col z-10 paper-grid">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(briefSchema) }}
      />

      <div
        className="relative mx-auto w-full max-w-3xl px-6 md:px-10 py-12 md:py-20 flex flex-col flex-1"
        style={{ opacity: 0, animation: "qcm-fade-in 400ms ease-out forwards" }}
      >
        {/* Top bar */}
        <div className="w-full flex items-center justify-between mb-16 md:mb-24 font-mono-hud text-[10px] sm:text-[11px] tracking-[0.18em] uppercase gap-3">
          <Link
            href={withLang("/", lang)}
            className="inline-flex items-center min-h-[44px] text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
          >
            {c.topHome}
          </Link>
          <Link
            href={c.langSwitchHref}
            className="inline-flex items-center justify-center min-h-[44px] px-2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm shrink-0"
          >
            {c.langSwitchLabel} <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Hero — editorial, left-aligned */}
        <header className="mb-16 md:mb-24">
          <span className="kicker kicker-accent">{c.kickerHero}</span>
          <h1 className="mt-6 display-xl text-foreground text-balance">
            {c.h1Lead} <span className="text-primary">{c.h1Accent}</span>
          </h1>
          <p className="mt-6 max-w-[46ch] text-balance text-[1.0625rem] md:text-[1.25rem] leading-[1.6] text-glacier-blue">
            {c.h1Tail}
          </p>
          {/* Meta line — cadence + read time, moved out of the cramped top bar */}
          <p className="mt-8 inline-flex items-center gap-2.5 font-mono-hud text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
            <span aria-hidden className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
            {c.statusPill}
          </p>
        </header>

        <div className="hairline mb-16 md:mb-24" />

        {/* Manifesto — blue-ruled pull quote */}
        <section className="mb-16 md:mb-24">
          <span className="kicker">{c.kickerManifesto}</span>
          <blockquote className="mt-6 border-l-2 border-primary pl-6 md:pl-8 max-w-[62ch]">
            <p className="display-md text-foreground">{c.manifestoLead}</p>
            <p className="mt-6 text-[1.0625rem] md:text-[1.125rem] leading-[1.65] text-muted-foreground">
              {c.manifestoTail}
            </p>
          </blockquote>
        </section>

        {/* What's inside — numbered editorial list */}
        <section className="mb-16 md:mb-24">
          <span className="kicker">{c.kickerInside}</span>
          <ul className="mt-6 max-w-[62ch] border-t border-border">
            {features.map((f) => (
              <li
                key={f.n}
                className="flex gap-5 md:gap-6 py-5 border-b border-border"
              >
                <span
                  aria-hidden
                  className={`font-mono-hud text-xs tabular-nums tracking-[0.18em] pt-1 shrink-0 ${
                    f.quiet ? "text-steel-blue" : "text-primary"
                  }`}
                >
                  {f.n}
                </span>
                <p
                  className={`text-[1rem] md:text-[1.0625rem] leading-[1.6] ${
                    f.quiet ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {f.text}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Sample issue preview — the light email panel embedded in the dark page */}
        <section className="mb-16 md:mb-24">
          <span className="kicker">{c.kickerSample}</span>
          <p className="mt-6 mb-8 max-w-[52ch] text-[1rem] md:text-[1.0625rem] leading-[1.6] text-muted-foreground">
            {c.sampleLead}
          </p>
          <SampleIssuePreview lang={lang} />
        </section>

        {/* Signup — the conversion point, given the most visual weight */}
        <section className="mb-16 md:mb-20 scroll-mt-8">
          <span className="kicker kicker-accent">{c.kickerSignup}</span>
          <p className="mt-6 mb-8 max-w-[46ch] display-md text-foreground">
            {c.signupLead}
          </p>
          <div className="w-full max-w-lg">
            <BriefSignupForm lang={lang} />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto pt-10 border-t border-border font-mono-hud text-[10px] tracking-[0.18em] uppercase text-muted-foreground flex flex-wrap gap-y-2 gap-x-4">
          <span>© {new Date().getFullYear()} · @manu_ai.to</span>
          <span aria-hidden>·</span>
          <span>{c.footerRights}</span>
        </footer>
      </div>
    </main>
  );
}
