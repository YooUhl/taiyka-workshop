import Link from "next/link";
import type { Metadata } from "next";
import EmailCaptureForm from "@/components/EmailCaptureForm";
import { withLang } from "@/lib/lang-utils";
import { SITE } from "@/lib/site";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const isEn = sp?.lang === "en";
  return {
    title: isEn
      ? "Smart Prospect Audit Funnel — 49€ · The Workshop"
      : "Smart Prospect Audit Funnel — 49€ · L'Atelier",
    description: isEn
      ? "The AI audit funnel I use at Taiyka to qualify prospects before a call. Form + Claude + auto debrief. 49€, plug-and-play."
      : "Le funnel d'audit IA que j'utilise chez Taiyka pour qualifier mes prospects avant un call. Form + Claude + debrief auto. 49€, plug-and-play.",
    openGraph: {
      images: ["/og/prospect-audit-funnel.png"],
    },
    alternates: {
      canonical: "/products/prospect-audit-funnel",
      languages: {
        "fr-FR": "/products/prospect-audit-funnel",
        "en-US": "/products/prospect-audit-funnel?lang=en",
      },
    },
  };
}

const GUMROAD_URL = process.env.NEXT_PUBLIC_PROSPECT_AUDIT_FUNNEL_URL || null;
const CANONICAL_URL = `${SITE}/products/prospect-audit-funnel`;

type Lang = "fr" | "en";

type SectionBullet = {
  index: string;
  lead: string;
  body: string;
};

type Copy = {
  topbarBack: string;
  pricePill: string;
  kickerProduct: string;
  h1Line1: string;
  h1Highlight: string;
  hero: string;
  subHero: string;
  kickerForWho: string;
  forWhoLabel: string;
  forYouHeading: string;
  forYou: string[];
  notForYouHeading: string;
  notForYou: string[];
  kickerInside: string;
  insideLabel: string;
  insideBullets: SectionBullet[];
  kickerCTA: string;
  ctaButton: string;
  ctaSoon: string;
  ctaSoonNote: string;
  waitlistCopy: string;
  waitlistSubmit: string;
  ctaNote: string;
  riskReversal: string;
  psLabel: string;
  ps: string;
  langSwitch: string;
  langSwitchHref: string;
  fallbackHeading: string;
  fallback: { label: string; href: string }[];
  footerRights: string;
  faqQ1: string;
  faqQ2: string;
  productName: string;
  productDescription: string;
};

const COPY: Record<Lang, Copy> = {
  fr: {
    topbarBack: "← TAIYKA · Produits",
    pricePill: "Tier 2 · 49€",
    kickerProduct: "§ 01 / Le produit",
    h1Line1: "Qualifie tes prospects",
    h1Highlight: "pendant que tu dors.",
    hero:
      "Le funnel d'audit IA que j'utilise chez Taiyka pour ne plus jamais perdre un call avec un curieux. À toi pour 49€.",
    subHero:
      "Un formulaire d'audit + un agent Claude qui génère une liste de solutions sur-mesure en 20 secondes + un debrief structuré dans ton inbox avant que le prospect ne réserve son créneau. Tu arrives en call avec tout déjà mâché. Plug-and-play, import en 5 min, prêt à tourner en 60 min.",
    kickerForWho: "§ 02 / Pour qui",
    forWhoLabel: "Cible",
    forYouHeading: "C'est pour toi si",
    forYou: [
      "— T'as une agence (ou freelance solo) en AI/automation et tu reçois des leads sans savoir lesquels valent un call",
      "— Tu utilises déjà n8n et Claude (ou t'es prêt à apprendre — 1h max si t'es débutant)",
      "— T'as un Calendly branché et tu veux arrêter de perdre 30 min par « audit gratuit » non qualifié",
      "— Tu veux un système qui montre tes compétences au prospect AVANT le call",
    ],
    notForYouHeading: "C'est PAS pour toi si",
    notForYou: [
      "— Tu fais 200+ leads/mois et tu cherches du Salesforce-grade",
      "— T'as zéro autorité sur ton stack tech et tu peux pas brancher un workflow n8n toi-même",
      "— Tu vends à des particuliers sur Etsy — c'est un funnel B2B, pas e-commerce",
    ],
    kickerInside: "§ 03 / Dedans",
    insideLabel: "Valeur",
    insideBullets: [
      {
        index: "01",
        lead: "14 questions qui filtrent les vrais prospects des curieux.",
        body:
          "Budget, autorité de décision, timeline, douleur opérationnelle. Tu perds plus tes calls avec des gens qui « veulent juste comprendre l'IA ».",
      },
      {
        index: "02",
        lead: "1 workflow n8n importable en 5 min.",
        body:
          "Webhook → Claude → Google Sheets → Gmail debrief → page de succès avec ton lien Calendly. Tout est câblé, prêt à tourner en 60 min.",
      },
      {
        index: "03",
        lead: "Un agent IA qui produit la liste de solutions à ta place.",
        body:
          "Claude lit les réponses, sort 3 à 5 propositions personnalisées + un score de qualification 0-100. Tu vois en un coup d'œil qui mérite ton temps.",
      },
      {
        index: "04",
        lead: "Le debrief automatique avant le call.",
        body:
          "Quand un prospect remplit le form, tu reçois un email structuré : résumé, score, top solutions, données brutes. Tu arrives en call déjà préparé.",
      },
    ],
    kickerCTA: "§ 04 / Récupérer",
    ctaButton: "Récupérer le funnel — 49€",
    ctaSoon: "Bientôt disponible",
    ctaSoonNote: "On finalise les derniers détails.",
    waitlistCopy: "Préviens-moi au lancement — première vague à -20%.",
    waitlistSubmit: "Préviens-moi",
    ctaNote: "Paiement Gumroad · ZIP livré en 30 sec · Pas d'abonnement",
    riskReversal:
      "Pas convaincu en 7 jours ? Remboursement complet, pas de questions.",
    psLabel: "PS",
    ps:
      "Si tu bloques quelque part dans l'install, réponds à l'email de livraison. Je lis tout, je réponds vite.",
    langSwitch: "EN",
    langSwitchHref: "/products/prospect-audit-funnel?lang=en",
    fallbackHeading: "",
    fallback: [
      { label: "Découvre ton profil → QCM", href: "/qcm" },
      { label: "Aller plus loin → Skool", href: "/skool" },
    ],
    footerRights: "Tous droits réservés.",
    faqQ1: "Pour qui c'est ?",
    faqQ2: "Pour qui ce n'est PAS ?",
    productName: "Smart Prospect Audit Funnel",
    productDescription:
      "Le funnel d'audit IA que Manu utilise chez Taiyka pour qualifier ses prospects avant un call. Form + Claude + debrief auto. Plug-and-play.",
  },
  en: {
    topbarBack: "← TAIYKA · Products",
    pricePill: "Tier 2 · 49€",
    kickerProduct: "§ 01 / The product",
    h1Line1: "Qualify your prospects",
    h1Highlight: "while you sleep.",
    hero:
      "The AI audit funnel I use at Taiyka so I never waste another call on a time-waster. Yours for 49€.",
    subHero:
      "An audit form + a Claude agent that generates a tailored solution list in 20 seconds + a structured debrief in your inbox before the prospect books a slot. You walk into the call with the homework already done. Plug-and-play, import in 5 min, fully running in 60 min.",
    kickerForWho: "§ 02 / For whom",
    forWhoLabel: "Target",
    forYouHeading: "It's for you if",
    forYou: [
      "— You run an agency (or solo freelance) in AI/automation and get leads without knowing which ones deserve a call",
      "— You already use n8n and Claude (or you're ready to learn — under an hour if you're a beginner)",
      "— You have Calendly hooked up and you're done wasting 30 min on unqualified “free audits”",
      "— You want a system that proves your skill to the prospect BEFORE the call",
    ],
    notForYouHeading: "It's NOT for you if",
    notForYou: [
      "— You handle 200+ leads/month and need Salesforce-grade tooling",
      "— You have zero authority over your tech stack and can't wire up an n8n workflow yourself",
      "— You sell to consumers on Etsy — this is a B2B funnel, not e-commerce",
    ],
    kickerInside: "§ 03 / Inside",
    insideLabel: "Value",
    insideBullets: [
      {
        index: "01",
        lead: "14 questions that filter real prospects from time-wasters.",
        body:
          "Budget, decision authority, timeline, operational pain. No more losing calls to people who “just want to understand AI”.",
      },
      {
        index: "02",
        lead: "1 n8n workflow you import in 5 min.",
        body:
          "Webhook → Claude → Google Sheets → Gmail debrief → success page with your Calendly link. Everything is wired, fully running in 60 min.",
      },
      {
        index: "03",
        lead: "An AI agent that produces the solution list for you.",
        body:
          "Claude reads the answers, returns 3 to 5 personalized proposals + a 0-100 qualification score. One glance tells you who deserves your time.",
      },
      {
        index: "04",
        lead: "Automatic debrief before the call.",
        body:
          "When a prospect fills the form, you get a structured email: summary, score, top solutions, raw data. You show up ready.",
      },
    ],
    kickerCTA: "§ 04 / Get it",
    ctaButton: "Get the funnel — 49€",
    ctaSoon: "Coming soon",
    ctaSoonNote: "Finalizing last details.",
    waitlistCopy: "Notify me at launch — first wave at -20%.",
    waitlistSubmit: "Notify me",
    ctaNote: "Gumroad checkout · ZIP delivered in 30 sec · No subscription",
    riskReversal:
      "Not convinced in 7 days? Full refund, no questions asked.",
    psLabel: "PS",
    ps:
      "If you get stuck during install, reply to the delivery email. I read everything, I answer fast.",
    langSwitch: "FR",
    langSwitchHref: "/products/prospect-audit-funnel?lang=fr",
    fallbackHeading: "",
    fallback: [
      { label: "Discover your profile → Quiz", href: "/qcm" },
      { label: "Go further → Skool", href: "/skool" },
    ],
    footerRights: "All rights reserved.",
    faqQ1: "Who is it for?",
    faqQ2: "Who is it NOT for?",
    productName: "Smart Prospect Audit Funnel",
    productDescription:
      "The AI audit funnel Manu uses at Taiyka to qualify prospects before a call. Form + Claude + auto debrief. Plug-and-play.",
  },
};

export default async function ProspectAuditFunnelPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const sp = await searchParams;
  const lang: Lang = sp?.lang === "en" ? "en" : "fr";
  const t = COPY[lang];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: t.productName,
    description: t.productDescription,
    brand: {
      "@type": "Brand",
      name: lang === "fr" ? "L'Atelier" : "The Workshop",
    },
    category: "Business / Sales Automation Template",
    image: `${SITE}/og/prospect-audit-funnel.png`,
    offers: {
      "@type": "Offer",
      price: "49",
      priceCurrency: "EUR",
      availability: GUMROAD_URL
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      seller: {
        "@type": "Organization",
        name: lang === "fr" ? "L'Atelier" : "The Workshop",
        url: SITE,
      },
      url: GUMROAD_URL ?? CANONICAL_URL,
    },
    inLanguage: lang === "fr" ? "fr-FR" : "en-US",
  };

  const stripBullet = (s: string) => s.replace(/^—\s*/, "");

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t.faqQ1,
        acceptedAnswer: {
          "@type": "Answer",
          text: t.forYou.map(stripBullet).join(" "),
        },
      },
      {
        "@type": "Question",
        name: t.faqQ2,
        acceptedAnswer: {
          "@type": "Answer",
          text: t.notForYou.map(stripBullet).join(" "),
        },
      },
    ],
  };

  return (
    <main className="relative flex-1 w-full flex flex-col z-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div
        aria-hidden
        className="hidden md:block pointer-events-none absolute inset-x-0 top-0 h-[70vh] paper-grid"
      />

      <div
        className="relative mx-auto w-full max-w-3xl px-6 md:px-10 py-12 md:py-20 flex flex-col flex-1 text-center"
        style={{ opacity: 0, animation: "qcm-fade-in 400ms ease-out forwards" }}
      >
        {/* Top bar */}
        <div className="w-full flex items-center justify-between mb-16 md:mb-24 font-mono text-[11px] tracking-[0.22em] uppercase">
          <Link
            href={withLang("/products", lang)}
            className="inline-flex items-center min-h-[44px] text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
          >
            {t.topbarBack}
          </Link>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 text-muted-foreground text-[10px] sm:text-[11px]">
              <span aria-hidden className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
              {t.pricePill}
            </span>
            <Link
              href={t.langSwitchHref}
              className="inline-flex items-center min-h-[44px] rounded-none border border-border px-3 hover:border-primary hover:text-foreground transition-colors text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]"
            >
              {t.langSwitch}
            </Link>
          </div>
        </div>

        {/* Kicker */}
        <span className="kicker kicker-accent self-center">{t.kickerProduct}</span>

        {/* H1 */}
        <h1 className="display-xl mt-5 mb-8 md:mb-10 text-balance">
          {t.h1Line1} <span className="text-primary">{t.h1Highlight}</span>
        </h1>

        <p className="text-[1.0625rem] md:text-[1.25rem] leading-[1.55] text-foreground text-balance max-w-[55ch] mx-auto mb-10 md:mb-12">
          {t.hero}
        </p>

        <p className="text-[0.9375rem] md:text-[1.0625rem] leading-[1.65] text-muted-foreground max-w-[60ch] mx-auto mb-12 md:mb-16">
          {t.subHero}
        </p>

        <div className="hairline mb-12 md:mb-16" />

        {/* Pour qui */}
        <div className="flex flex-col items-center gap-6 mb-12 md:mb-16">
          <span className="kicker">{t.kickerForWho}</span>
          <div className="w-full max-w-[58ch] mx-auto space-y-6 text-left">
            <div>
              <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-primary mb-3">
                {t.forYouHeading}
              </p>
              <ul className="space-y-3 text-[1rem] md:text-[1.0625rem] leading-[1.6] text-foreground">
                {t.forYou.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground mb-3">
                {t.notForYouHeading}
              </p>
              <ul className="space-y-3 text-[1rem] md:text-[1.0625rem] leading-[1.6] text-muted-foreground">
                {t.notForYou.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="hairline mb-12 md:mb-16" />

        {/* Bullets — Dedans */}
        <div className="flex flex-col items-center gap-6 mb-12 md:mb-16">
          <span className="kicker">{t.kickerInside}</span>
          <ul className="w-full max-w-[58ch] mx-auto space-y-5 text-left">
            {t.insideBullets.map((b) => (
              <li key={b.index} className="flex items-baseline gap-3">
                <span className="font-mono text-[10px] tabular-nums tracking-[0.22em] uppercase text-muted-foreground/70 shrink-0 w-6">
                  {b.index}
                </span>
                <p className="text-[1rem] md:text-[1.0625rem] leading-[1.6] text-foreground">
                  <strong className="text-foreground">{b.lead}</strong> {b.body}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="hairline mb-12 md:mb-16" />

        {/* CTA — blue-edged panel so the conversion point owns the page */}
        <div className="card-line card-line-accent flex flex-col items-center gap-6 px-6 py-10 md:px-10 md:py-12">
          <span className="kicker kicker-accent">{t.kickerCTA}</span>
          {GUMROAD_URL ? (
            <a
              href={GUMROAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 h-14 md:h-16 px-7 md:px-9 rounded-none bg-primary text-primary-foreground font-bold text-base md:text-lg tracking-tight transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]"
            >
              {t.ctaButton}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          ) : (
            <div className="w-full max-w-md flex flex-col items-center gap-3">
              <p className="text-[0.9375rem] md:text-[1rem] leading-[1.55] text-foreground text-balance">
                {t.waitlistCopy}
              </p>
              <EmailCaptureForm
                lang={lang}
                compact
                source="prospect-audit-funnel-waitlist"
                submitLabel={{ fr: "Préviens-moi", en: "Notify me" }}
              />
            </div>
          )}
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
            {t.ctaNote}
          </p>
          <p className="text-foreground font-medium text-sm mt-3 max-w-[55ch] border-l-2 border-primary pl-4 text-left">
            {t.riskReversal}
          </p>
        </div>

        {/* PS */}
        <div className="mt-12 max-w-[60ch] mx-auto">
          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground/70 mb-2">
            {t.psLabel}
          </div>
          <p className="text-sm md:text-base leading-[1.65] text-muted-foreground italic">
            {t.ps}
          </p>
        </div>

        {/* Fallback escape links */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-y-2 gap-x-3 text-xs text-muted-foreground">
          {t.fallback.map((f, i) => (
            <span key={f.href} className="inline-flex items-center gap-3">
              <Link
                href={withLang(f.href, lang)}
                className="inline-flex items-center min-h-[44px] hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
              >
                {f.label}
              </Link>
              {i < t.fallback.length - 1 ? <span aria-hidden>·</span> : null}
            </span>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-12 border-t border-border text-xs text-muted-foreground flex flex-wrap justify-center gap-y-2 gap-x-4">
          <span>© {new Date().getFullYear()} · @manu_ai.to</span>
          <span aria-hidden>·</span>
          <span>{t.footerRights}</span>
        </footer>
      </div>
    </main>
  );
}
