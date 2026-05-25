import Link from "next/link";
import type { Metadata } from "next";

type Lang = "fr" | "en";

type Copy = {
  topLeftHome: string;
  metaPill: string;
  kickerTest: string;
  h1Lead: string;
  h1Accent: string;
  h1Trail: string;
  kickerManifesto: string;
  manifesto1: string;
  manifesto2: string;
  ctaButton: string;
  ctaMeta: string;
  skipLink: string;
  langSwitch: string;
  langSwitchHref: string;
  ogLocale: string;
  metaTitle: string;
  metaDescription: string;
};

const COPY: Record<Lang, Copy> = {
  fr: {
    topLeftHome: "← TAIYKA · Accueil",
    metaPill: "9 questions · 2 min · 5 profils",
    kickerTest: "LE TEST",
    h1Lead: "Quel type d’entrepreneur",
    h1Accent: "tu es vraiment",
    h1Trail: "— et pourquoi ça avance pas.",
    kickerManifesto: "MANIFESTE",
    manifesto1:
      "Tout le monde te vend des outils, des formations, des frameworks. Personne te dit où tu en es vraiment — ni ce qui te bloque, toi.",
    manifesto2:
      "9 questions, 2 minutes. À la fin tu sais quel type d’entrepreneur tu es, et la seule chose à faire ensuite pour que ça bouge.",
    ctaButton: "Découvrir mon profil en 2 min",
    ctaMeta: "Gratuit · Sans email avant la fin · 2 min",
    skipLink: "Pas envie du QCM ? Voir les produits →",
    langSwitch: "EN",
    langSwitchHref: "/qcm?lang=en",
    ogLocale: "fr_FR",
    metaTitle: "QCM — Quel type d’entrepreneur tu es vraiment ? · Taiyka",
    metaDescription:
      "9 questions, 2 minutes. Découvre ton profil d’entrepreneur et la prochaine étape concrète pour faire bouger ton business avec l’IA.",
  },
  en: {
    topLeftHome: "← TAIYKA · Home",
    metaPill: "9 questions · 2 min · 5 profiles",
    kickerTest: "THE TEST",
    h1Lead: "What kind of entrepreneur",
    h1Accent: "are you really",
    h1Trail: "— and why aren’t you moving.",
    kickerManifesto: "MANIFESTO",
    manifesto1:
      "Everyone sells you tools, courses, frameworks. Nobody tells you where you actually stand — or what’s blocking you, specifically.",
    manifesto2:
      "9 questions, 2 minutes. By the end you know what kind of entrepreneur you are, and the one thing to do next so things finally move.",
    ctaButton: "Discover my profile in 2 min",
    ctaMeta: "Free · No email until the end · 2 min",
    skipLink: "Don’t want the quiz? See the products →",
    langSwitch: "FR",
    langSwitchHref: "/qcm",
    ogLocale: "en_US",
    metaTitle: "Quiz — What kind of entrepreneur are you really? · Taiyka",
    metaDescription:
      "9 questions, 2 minutes. Discover your entrepreneur profile and the concrete next step to move your business forward with AI.",
  },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const lang: Lang = sp?.lang === "en" ? "en" : "fr";
  const c = COPY[lang];

  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: {
      canonical: "/qcm",
      languages: {
        "fr-FR": "/qcm",
        "en-US": "/qcm?lang=en",
      },
    },
    openGraph: {
      type: "website",
      locale: c.ogLocale,
      title: c.metaTitle,
      description: c.metaDescription,
      images: [
        {
          url: "/og/qcm.png",
          width: 1200,
          height: 630,
          alt: c.metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: c.metaTitle,
      description: c.metaDescription,
      images: ["/og/qcm.png"],
      creator: "@manu_ai.to",
    },
  };
}

const qcmSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "QCM Entrepreneur IA",
  description:
    "9 questions, 2 minutes. Découvre ton profil d'entrepreneur et la prochaine étape concrète pour faire bouger ton business avec l'IA.",
  provider: {
    "@type": "Organization",
    name: "Taiyka",
    url: "https://taiyka.com",
  },
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT2M",
  },
};

export default async function QcmLandingPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const sp = await searchParams;
  const lang: Lang = sp?.lang === "en" ? "en" : "fr";
  const c = COPY[lang];

  return (
    <main className="relative flex-1 w-full z-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(qcmSchema) }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[60vh] bg-gradient-glow opacity-60 blur-2xl"
      />

      <div
        className="relative mx-auto w-full max-w-3xl px-6 md:px-10 py-8 md:py-12 text-center"
        style={{ opacity: 0, animation: "qcm-fade-in 400ms ease-out forwards" }}
      >
        {/* Top bar — keep justify-between for nav scannability */}
        <div className="w-full flex items-center justify-between mb-10 md:mb-14 font-mono text-[10px] md:text-[11px] tracking-[0.22em] uppercase">
          <Link
            href={lang === "en" ? "/?lang=en" : "/"}
            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
          >
            {c.topLeftHome}
          </Link>
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {c.metaPill}
          </span>
          <Link
            href={c.langSwitchHref}
            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
          >
            {c.langSwitch} <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Kicker */}
        <span className="kicker">{c.kickerTest}</span>

        {/* H1 — hook */}
        <h1 className="mt-5 mb-10 md:mb-12 text-balance font-bold tracking-[-0.04em] leading-[0.96] text-[clamp(2.5rem,8.5vw,5rem)]">
          {c.h1Lead}{" "}
          <span className="text-gradient-hero">{c.h1Accent}</span>{" "}
          <span className="text-foreground/70">{c.h1Trail}</span>
        </h1>

        <div className="hairline mb-12 md:mb-16" />

        {/* Manifesto — centered single column under center mode */}
        <div className="flex flex-col items-center gap-5">
          <span className="kicker">{c.kickerManifesto}</span>
          <blockquote className="relative pt-5 max-w-[58ch] mx-auto">
            <span
              aria-hidden
              className="absolute left-1/2 -translate-x-1/2 top-0 h-px w-16 bg-cyan-400"
            />
            <p className="text-[1.0625rem] md:text-[1.25rem] leading-[1.65] text-[#e8f0fe] text-balance">
              {c.manifesto1}
            </p>
            <p className="mt-5 text-[1.0625rem] md:text-[1.125rem] leading-[1.65] text-muted-foreground text-balance">
              {c.manifesto2}
            </p>
          </blockquote>
        </div>

        <div className="hairline mt-10 md:mt-14 mb-12 md:mb-16" />

        {/* CTA — centered */}
        <div className="flex flex-col items-center gap-6">
          <Link
            href={lang === "en" ? "/qcm/quiz?lang=en" : "/qcm/quiz"}
            className="hover-grow group inline-flex items-center gap-3 h-14 md:h-16 px-7 md:px-9 rounded-md bg-gradient-hero text-[#0a1628] font-bold text-base md:text-lg tracking-tight shadow-glow hover:shadow-[0_0_60px_rgba(0,166,255,0.55)] transition-all"
          >
            {c.ctaButton}
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
            {c.ctaMeta}
          </p>
          <Link
            href={lang === "en" ? "/products?lang=en" : "/products"}
            className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
          >
            {c.skipLink}
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-24 md:mt-32 pt-8 border-t border-border text-xs text-muted-foreground flex flex-wrap justify-center gap-y-2 gap-x-4">
          <span>© {new Date().getFullYear()} Taiyka</span>
          <span aria-hidden>·</span>
          <span>@manu_ai.to</span>
        </footer>
      </div>
    </main>
  );
}
