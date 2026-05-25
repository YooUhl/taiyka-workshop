import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { RESULTS } from "@/lib/quiz-results";
import { isValidProfile } from "@/lib/quiz-scoring";
import type { ProfileSlug } from "@/lib/quiz-questions";
import ProfileEmailForm from "@/components/ProfileEmailForm";

type RouteParams = { profil: string };
type SearchParams = { [key: string]: string | string[] | undefined };

type Lang = "fr" | "en";

function pickLang(sp: SearchParams | undefined): Lang {
  const raw = sp?.lang;
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v === "en" ? "en" : "fr";
}

function pickFrom(sp: SearchParams | undefined): string | undefined {
  const raw = sp?.from;
  const v = Array.isArray(raw) ? raw[0] : raw;
  return typeof v === "string" ? v : undefined;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<RouteParams>;
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { profil } = await params;
  const sp = await searchParams;
  const lang = pickLang(sp);
  if (!isValidProfile(profil)) return { title: "Résultat — Taiyka" };
  const r = RESULTS[profil][lang];
  return {
    title: `${r.name} — ${lang === "fr" ? "Ton profil" : "Your profile"} · Taiyka QCM`,
    description: r.tagline,
    openGraph: {
      title: `${r.name} — Taiyka QCM`,
      description: r.tagline,
      images: [
        {
          url: `/og/profil-${profil}.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export function generateStaticParams() {
  return (Object.keys(RESULTS) as ProfileSlug[]).map((profil) => ({ profil }));
}

// Build the "Other profiles" rail data once per render.
function otherProfilesRail(
  current: ProfileSlug,
  lang: Lang
): { slug: ProfileSlug; label: string }[] {
  const order: ProfileSlug[] = ["salarie", "aspirant", "surcharge", "scale", "pas-pret"];
  return order
    .filter((slug) => slug !== current)
    .map((slug) => ({ slug, label: RESULTS[slug][lang].label }));
}

export default async function ResultPage({
  params,
  searchParams,
}: {
  params: Promise<RouteParams>;
  searchParams: Promise<SearchParams>;
}) {
  const { profil } = await params;
  const sp = await searchParams;
  if (!isValidProfile(profil)) notFound();
  const lang = pickLang(sp);
  const from = pickFrom(sp);
  const r = RESULTS[profil][lang];

  // Hide inline email form when user already gave email at the gate, or explicitly opted out.
  const hideEmailForm = from === "quiz-skip" || from === "quiz-gate";

  // Localized UI strings.
  const t = {
    fr: {
      home: "← TAIYKA · Accueil",
      resultBadge: "Résultat",
      kickerProfil: "PROFIL",
      kickerMeaning: "CE QUE ÇA VEUT DIRE",
      kickerNext: "PROCHAINE ÉTAPE",
      kickerPs: "PS",
      kickerTips: "Emails taillés pour ton profil",
      tipsBlurb: "Reçois 2-3 emails taillés pour ton profil. Optionnel.",
      alreadyReceived: "Email déjà reçu ? Check ta boîte.",
      fallback: "Email pas arrivé ? ",
      fallbackCta: "Écris-moi",
      fallbackTail: ", je te renvoie ton profil.",
      otherProfiles: "Autres profils",
      contactDirect: "Contact direct",
      rights: "Tous droits réservés.",
    },
    en: {
      home: "← TAIYKA · Home",
      resultBadge: "Result",
      kickerProfil: "PROFILE",
      kickerMeaning: "WHAT THIS MEANS",
      kickerNext: "NEXT STEP",
      kickerPs: "PS",
      kickerTips: "What I'd do in your spot",
      tipsBlurb: "Get 2-3 emails tailored to your profile. Optional.",
      alreadyReceived: "Email already received? Check your inbox.",
      fallback: "Email didn't arrive? ",
      fallbackCta: "Write me",
      fallbackTail: ", I'll resend your profile.",
      otherProfiles: "Other profiles",
      contactDirect: "Direct contact",
      rights: "All rights reserved.",
    },
  }[lang];

  const rail = otherProfilesRail(profil, lang);

  // Article JSON-LD — finding 4.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: r.name,
    description: r.tagline,
    image: `https://taiyka.com/og/profil-${profil}.png`,
    author: {
      "@type": "Person",
      name: "Manu (Yoan-Manuulutea Uhila)",
      url: "https://instagram.com/manu_ai.to",
    },
    publisher: {
      "@type": "Organization",
      name: "Taiyka",
      logo: {
        "@type": "ImageObject",
        url: "https://taiyka.com/favicon.svg",
      },
    },
    datePublished: "2026-05-25",
  };

  return (
    <main className="relative flex-1 w-full z-10">
      {/* Article JSON-LD for SEO */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[60vh] bg-gradient-glow opacity-60 blur-2xl"
      />

      <div className="relative mx-auto w-full max-w-3xl px-6 md:px-10 py-12 md:py-20 text-center">
        {/* Top bar */}
        <div className="w-full flex items-center justify-between mb-16 md:mb-20 font-mono text-[11px] tracking-[0.22em] uppercase">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
          >
            {t.home}
          </Link>
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {t.resultBadge}
          </span>
        </div>

        {/* Kicker */}
        <span className="kicker">
          {t.kickerProfil} · {r.label.toUpperCase()}
        </span>

        {/* Hero — finding 10: removed "Ton profil" mono micro-label */}
        <div className="mt-5 mb-12">
          <h1 className="text-balance font-bold tracking-[-0.04em] leading-[0.96] text-[clamp(2.25rem,7.5vw,4.75rem)]">
            {r.useGradient ? (
              <span
                className="text-gradient-hero"
                style={{
                  backgroundSize: "200% 100%",
                  animation: "qcm-gradient-sweep 900ms ease-out forwards",
                }}
              >
                {r.name}
              </span>
            ) : (
              <span className="text-foreground">{r.name}</span>
            )}
          </h1>
          <p className="mt-6 text-[1.0625rem] md:text-[1.25rem] leading-[1.4] text-[#e8f0fe] text-balance max-w-[40ch] mx-auto">
            {r.tagline}
          </p>
        </div>

        <div className="hairline mb-12" />

        {/* Body — centered. Finding 1: h2.kicker for SR heading nav. */}
        <div className="flex flex-col items-center gap-6">
          <h2 className="kicker">{t.kickerMeaning}</h2>
          <div className="w-full max-w-[58ch] mx-auto space-y-5">
            {r.body.map((p, i) => (
              <p
                key={i}
                className={
                  p.tone === "ink"
                    ? "text-[1.0625rem] md:text-[1.1875rem] leading-[1.65] text-[#e8f0fe] text-balance"
                    : "text-[1rem] md:text-[1.0625rem] leading-[1.65] text-muted-foreground"
                }
              >
                {p.text}
              </p>
            ))}
          </div>
        </div>

        {r.cta && <div className="hairline mt-16 mb-12" />}

        {/* CTA — finding 1: h2.kicker */}
        {r.cta && (
          <div className="flex flex-col items-center gap-6">
            <h2 className="kicker kicker-accent">{t.kickerNext}</h2>
            <a
              href={r.cta.href}
              target={r.cta.external ? "_blank" : undefined}
              rel={r.cta.external ? "noopener noreferrer" : undefined}
              className="hover-grow group inline-flex items-center gap-3 h-14 md:h-16 px-7 md:px-9 rounded-md bg-gradient-hero text-[#0a1628] font-bold text-base md:text-lg tracking-tight shadow-glow hover:shadow-[0_0_60px_rgba(0,166,255,0.55)] transition-all"
            >
              {r.cta.label}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
            {r.cta.meta && (
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
                {r.cta.meta}
              </p>
            )}
          </div>
        )}

        {/* PS section — finding 1: h2.kicker for the PS label */}
        <div className="mt-12 max-w-[60ch] mx-auto">
          <h2 className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground/70 mb-2">
            {t.kickerPs}
          </h2>
          <p className="text-sm md:text-base leading-[1.65] text-muted-foreground italic">
            {r.ps}
          </p>
        </div>

        {/* Finding 2: hairline above the tips block — matches rhythm of other sections. */}
        <div className="hairline mt-16 mb-12" />

        {/* Optional profile email capture — highest-intent moment.
            Finding 6: hide form when user came from quiz-skip / quiz-gate. */}
        <div className="max-w-[60ch] mx-auto">
          <h2 className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground mb-3 text-center">
            {t.kickerTips}
          </h2>
          {hideEmailForm ? (
            <p className="text-sm md:text-base leading-[1.65] text-muted-foreground mb-5 text-center">
              {t.alreadyReceived}
            </p>
          ) : (
            <>
              <p className="text-sm md:text-base leading-[1.65] text-muted-foreground mb-5 text-center">
                {t.tipsBlurb}
              </p>
              <ProfileEmailForm profile={profil} lang={lang} />
            </>
          )}

          {/* Finding 7: fallback adjacent to email form (or to the "already received" note). */}
          <p className="mt-5 text-xs text-muted-foreground italic text-center">
            {t.fallback}
            <a
              href="mailto:manu.uhila@taiyka.com"
              className="not-italic underline-offset-4 hover:underline hover:text-primary transition-colors"
            >
              {t.fallbackCta}
            </a>
            {t.fallbackTail}
          </p>
        </div>

        {/* Finding 9: "Autres profils" rail. */}
        <nav
          aria-label={t.otherProfiles}
          className="mt-16 text-xs font-mono uppercase tracking-wider text-muted-foreground"
        >
          <span>{t.otherProfiles} : </span>
          {rail.map((p, i) => (
            <span key={p.slug}>
              <Link
                href={`/qcm/resultat/${p.slug}${lang === "en" ? "?lang=en" : ""}`}
                className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
              >
                {p.label}
              </Link>
              {i < rail.length - 1 && <span aria-hidden> · </span>}
            </span>
          ))}
        </nav>

        {/* Social row */}
        <div className="mt-12 mb-8">
          <div className="hairline mb-6" />
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-mono text-[11px] tracking-[0.22em] uppercase">
            <a
              href="https://www.skool.com/taiyka"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
            >
              Skool
            </a>
            <a
              href="https://instagram.com/manu_ai.to"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
            >
              Instagram
            </a>
            <a
              href="mailto:manu.uhila@taiyka.com"
              className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
            >
              {t.contactDirect}
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-8 border-t border-border text-xs text-muted-foreground flex flex-wrap justify-center gap-y-2 gap-x-4">
          <span>© {new Date().getFullYear()} Taiyka · @manu_ai.to</span>
          <span aria-hidden>·</span>
          <span>{t.rights}</span>
        </footer>
      </div>
    </main>
  );
}
