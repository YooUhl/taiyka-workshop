import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { RESULTS, RESULTS_DATE_PUBLISHED } from "@/lib/quiz-results";
import { isValidProfile } from "@/lib/quiz-scoring";
import type { ProfileSlug } from "@/lib/quiz-questions";
import ProfileEmailForm from "@/components/ProfileEmailForm";
import { withLang } from "@/lib/lang-utils";
import { SITE } from "@/lib/site";

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
  if (!isValidProfile(profil)) return { title: "Résultat — L'Atelier" };
  const r = RESULTS[profil][lang];
  const path = `/qcm/resultat/${profil}`;
  const ogTitle =
    lang === "fr"
      ? `Je suis ${r.name} sur le QCM de L'Atelier. Et toi ?`
      : `I'm ${r.name} on The Workshop quiz. What about you?`;
  return {
    title: `${r.name} — ${lang === "fr" ? "Ton profil" : "Your profile"} · ${lang === "fr" ? "L'Atelier QCM" : "The Workshop quiz"}`,
    description: r.tagline,
    alternates: {
      canonical: path,
      languages: {
        "fr-FR": path,
        "en-US": `${path}?lang=en`,
      },
    },
    openGraph: {
      title: ogTitle,
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

  // Finding 5: skip-path opts out entirely — hide whole tips block.
  // Finding 6: gate-path already submitted email — hide form, show 1-line muted note.
  const skipPath = from === "quiz-skip";
  const gatePath = from === "quiz-gate";

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
      gateNote: "Email déjà envoyé — check ta boîte. Pas arrivé ? ",
      gateNoteCta: "Écris-moi",
      gateNoteTail: ".",
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
      gateNote: "Email already sent — check your inbox. Didn't arrive? ",
      gateNoteCta: "Write me",
      gateNoteTail: ".",
      fallback: "Email didn't arrive? ",
      fallbackCta: "Write me",
      fallbackTail: ", I'll resend your profile.",
      otherProfiles: "Other profiles",
      contactDirect: "Direct contact",
      rights: "All rights reserved.",
    },
  }[lang];

  const rail = otherProfilesRail(profil, lang);

  // Article JSON-LD — localized + dynamic (round-2 audit finding 2).
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    inLanguage: lang === "fr" ? "fr-FR" : "en-US",
    headline: r.name,
    description: r.tagline,
    image: `${SITE}/og/profil-${profil}.png`,
    author: {
      "@type": "Person",
      name: "Manu (Yoan-Manuulutea Uhila)",
      url: "https://instagram.com/manu_ai.to",
    },
    publisher: {
      "@type": "Organization",
      name: lang === "fr" ? "L'Atelier" : "The Workshop",
    },
    datePublished: RESULTS_DATE_PUBLISHED,
    dateModified: RESULTS_DATE_PUBLISHED,
  };

  return (
    <main className="relative flex-1 w-full z-10">
      {/* Article JSON-LD for SEO */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="relative mx-auto w-full max-w-3xl px-6 md:px-10 py-12 md:py-20 text-center">
        {/* Top bar */}
        <div className="w-full flex items-center justify-between mb-16 md:mb-20 font-mono text-[11px] tracking-[0.22em] uppercase">
          <Link
            href={withLang("/", lang)}
            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
          >
            {t.home}
          </Link>
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <span aria-hidden className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
            {t.resultBadge}
          </span>
        </div>

        {/* Kicker */}
        <span className="kicker kicker-accent">
          {t.kickerProfil} · {r.label.toUpperCase()}
        </span>

        {/* Hero — finding 10: removed "Ton profil" mono micro-label.
            `useGradient` now selects the blue accent treatment rather than a
            gradient fill — the gradient look is gone from the design system. */}
        <div className="mt-5 mb-12">
          <h1 className="display-xl text-balance">
            <span className={r.useGradient ? "text-primary" : "text-foreground"}>
              {r.name}
            </span>
          </h1>
          <p className="mt-6 text-[1.0625rem] md:text-[1.25rem] leading-[1.4] text-foreground text-balance max-w-[40ch] mx-auto">
            {r.tagline}
          </p>
        </div>

        <div className="hairline mb-12" />

        {/* Body — left-aligned prose. Centring multi-paragraph copy wrecks
            readability (ragged left edge forces the eye to hunt each line start),
            so only the page chrome stays centred. */}
        <div className="flex flex-col items-center gap-6">
          <h2 className="kicker">{t.kickerMeaning}</h2>
          <div className="w-full max-w-[58ch] mx-auto space-y-5 text-left">
            {r.body.map((p, i) => (
              <p
                key={i}
                className={
                  p.tone === "ink"
                    ? "text-[1.0625rem] md:text-[1.1875rem] leading-[1.65] text-foreground"
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
              href={r.cta.external ? r.cta.href : withLang(r.cta.href, lang)}
              target={r.cta.external ? "_blank" : undefined}
              rel={r.cta.external ? "noopener noreferrer" : undefined}
              className="group inline-flex items-center gap-3 h-14 md:h-16 px-7 md:px-9 rounded-md bg-primary text-primary-foreground font-bold text-base md:text-lg tracking-tight transition-colors hover:bg-[#33b8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]"
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

        {/* PS section — round-2 findings 4 + 9: h2.kicker for visual consistency + contrast. */}
        <div className="mt-12 max-w-[60ch] mx-auto text-left">
          <h2 className="kicker mb-2">{t.kickerPs}</h2>
          <p className="text-sm md:text-base leading-[1.65] text-muted-foreground italic">
            {r.ps}
          </p>
        </div>

        {/* Tips block — round-2 finding 5: hide entire block when from=quiz-skip (user opted out).
            Round-2 finding 6: from=quiz-gate → hide form, show 1-line note + write-me link. */}
        {!skipPath && (
          <>
            <div className="hairline mt-16 mb-12" />
            <div className="max-w-[60ch] mx-auto">
              <h2 className="kicker mb-3 text-center">{t.kickerTips}</h2>
              {gatePath ? (
                <p className="text-sm md:text-base leading-[1.65] text-muted-foreground text-center">
                  {t.gateNote}
                  <a
                    href="mailto:manu.uhila@taiyka.com"
                    className="underline-offset-4 hover:underline hover:text-primary transition-colors"
                  >
                    {t.gateNoteCta}
                  </a>
                  {t.gateNoteTail}
                </p>
              ) : (
                <>
                  <p className="text-sm md:text-base leading-[1.65] text-muted-foreground mb-5 text-center">
                    {t.tipsBlurb}
                  </p>
                  <ProfileEmailForm profile={profil} lang={lang} />
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
                </>
              )}
            </div>
          </>
        )}

        {/* Finding 9: "Autres profils" rail. */}
        <nav
          aria-label={t.otherProfiles}
          className="mt-16 text-xs font-mono uppercase tracking-wider text-muted-foreground"
        >
          <span>{t.otherProfiles} : </span>
          {rail.map((p, i) => (
            <span key={p.slug}>
              <Link
                href={withLang(`/qcm/resultat/${p.slug}`, lang)}
                className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
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
              className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
            >
              Skool
            </a>
            <a
              href="https://instagram.com/manu_ai.to"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
            >
              Instagram
            </a>
            <a
              href="mailto:manu.uhila@taiyka.com"
              className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
            >
              {t.contactDirect}
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-8 border-t border-border text-xs text-muted-foreground flex flex-wrap justify-center gap-y-2 gap-x-4">
          <span>© {new Date().getFullYear()} · @manu_ai.to</span>
          <span aria-hidden>·</span>
          <span>{t.rights}</span>
        </footer>
      </div>
    </main>
  );
}
