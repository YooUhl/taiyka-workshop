import Link from "next/link";
import type { Metadata } from "next";

type Lang = "fr" | "en";

type DedansItem = {
  title: string;
  body: string;
};

type Copy = {
  topLeftHome: string;
  metaPill: string;
  kickerCommunity: string;
  h1Lead: string;
  h1Accent: string;
  h1Trail: string;
  kickerManifesto: string;
  manifesto1: string;
  manifesto2: string;
  kickerWho: string;
  whoForYouLabel: string;
  whoForYou: string[];
  whoNotForYouLabel: string;
  whoNotForYou: string[];
  kickerInside: string;
  inside: DedansItem[];
  kickerPricing: string;
  pricingHeadline: string;
  pricingDetails: string;
  kickerEnter: string;
  enterCopy: string;
  ctaButton: string;
  ctaMeta: string;
  stickyCta: string;
  kickerPs: string;
  psCopy: string;
  footerRights: string;
  langSwitch: string;
  langSwitchHref: string;
  ogLocale: string;
  metaTitle: string;
  metaDescription: string;
};

const COPY: Record<Lang, Copy> = {
  fr: {
    topLeftHome: "← TAIYKA · Accueil",
    metaPill: "Lancement · 100 places fondateurs",
    kickerCommunity: "LA COMMUNAUTÉ",
    h1Lead: "T'as plus besoin",
    h1Accent: "d'une formation.",
    h1Trail: "T'as besoin d'être au bon endroit.",
    kickerManifesto: "MANIFESTE",
    manifesto1:
      "Tu peux empiler 12 formations IA, t'abonner à 4 newsletters, suivre 50 créateurs sur LinkedIn — si t'es seul devant ton écran à 23h, tu shipperas rien.",
    manifesto2:
      "Ce qui te fait avancer c'est pas un module de plus. C'est des gens qui buildent en même temps que toi, un cadre qui te force à finir ce que tu commences, et quelqu'un qui te dit «non, là tu tournes en rond — fais ça à la place». C'est ce que j'ai construit ici.",
    kickerWho: "POUR QUI",
    whoForYouLabel: "C'est pour toi si",
    whoForYou: [
      "T'as joué avec ChatGPT, Claude, peut-être un peu n8n — et tu sens que t'es à 5% de ce que tu pourrais faire avec",
      "T'es entrepreneur, freelance, ou employé qui veut le devenir — et tu veux ajouter «agent IA» à ce que tu sais vendre",
      "T'en as marre d'apprendre dans le vide. Tu veux un cadre, un agenda, un truc qui tourne au bout de 12 semaines",
      "Tu fonctionnes mieux quand t'es entouré. Buildr seul à 1h du mat', t'as déjà donné",
      "Tu veux poser des questions à quelqu'un qui a déjà fait ce que tu cherches à faire — pas à un Discord random",
    ],
    whoNotForYouLabel: "C'est PAS pour toi si",
    whoNotForYou: [
      "Tu cherches une formation passive à regarder pendant que tu manges. Ici on build. Si tu veux consommer, t'as YouTube",
      "Tu veux apprendre Python from scratch. Nous on fait du n8n + Claude API + outils pros. Le code dur, c'est ailleurs",
      "Tu cherches le «secret» pour faire 10k/mois sans rien shipper. J'ai pas ça à te vendre",
      "Tu veux te plaindre dans le chat sans jamais finir un build. Au bout de 4 semaines sans progrès, je te rembourse et tu pars",
    ],
    kickerInside: "DEDANS",
    inside: [
      {
        title: "Parcours structuré sur 12 semaines",
        body: "— de «j'ai jamais buildé d'agent» à «j'en ai un en prod chez un client». On avance ensemble.",
      },
      {
        title: "Un nouveau module chaque semaine",
        body: "— concept, build, packaging, vente. Vidéo + workflow n8n + prompt ready-to-import.",
      },
      {
        title: "Un call live toutes les semaines avec moi",
        body: "— questions, review de ton build en direct, on débloque en 20 min ce que tu cherches depuis 3 jours.",
      },
      {
        title: "Bibliothèque de workflows n8n + skills Claude",
        body: "— nouvel agent fonctionnel par mois min. Tu télécharges, tu adaptes.",
      },
      {
        title: "Canal «ship your build»",
        body: "— tu postes ce que tu construis, les autres testent, te disent ce qui marche et ce qui marche pas. Feedback en heures, pas en semaines.",
      },
      {
        title: "Tarif fondateur garanti à vie",
        body: "pour les 100 premiers — quel que soit le prix après, le tien bouge plus.",
      },
    ],
    kickerPricing: "TARIF",
    pricingHeadline: "Annonce du tarif fondateur au lancement.",
    pricingDetails:
      "Mensuel ou annuel — tu choisis. Verrouillé à vie pour les 100 premiers.",
    kickerEnter: "ENTRER",
    enterCopy:
      "Si t'as lu jusqu'ici, t'as déjà décidé. Le clic c'est la formalité.",
    ctaButton: "Entrer dans la communauté",
    ctaMeta: "100 places fondateurs · Tarif verrouillé à vie · Annule quand tu veux",
    stickyCta: "Entrer dans la communauté →",
    kickerPs: "PS",
    psCopy:
      "Le tarif fondateur, c'est pas une urgence marketing — c'est mathématique. Quand on est 100, je ferme. Le prochain qui rentre paie le nouveau prix, et le nouveau prix sera plus élevé.",
    footerRights: "Tous droits réservés.",
    langSwitch: "EN",
    langSwitchHref: "/skool?lang=en",
    ogLocale: "fr_FR",
    metaTitle: "La communauté Skool — Taiyka",
    metaDescription:
      "T'as plus besoin d'une formation. T'as besoin d'être au bon endroit. Communauté de gens qui buildent des agents IA pour de vrai. Lancement en cours.",
  },
  en: {
    topLeftHome: "← TAIYKA · Home",
    metaPill: "Launching · 100 founder seats",
    kickerCommunity: "THE COMMUNITY",
    h1Lead: "You don't need",
    h1Accent: "another course.",
    h1Trail: "You need to be in the right room.",
    kickerManifesto: "MANIFESTO",
    manifesto1:
      "You can stack 12 AI courses, subscribe to 4 newsletters, follow 50 creators on LinkedIn — if you're alone in front of your screen at 11pm, you'll ship nothing.",
    manifesto2:
      "What moves you forward isn't one more module. It's people building alongside you, a frame that forces you to finish what you start, and someone telling you \"no, you're going in circles — do this instead.\" That's what I built here.",
    kickerWho: "WHO FOR",
    whoForYouLabel: "This is for you if",
    whoForYou: [
      "You've played with ChatGPT, Claude, maybe a bit of n8n — and you feel you're at 5% of what you could be doing with it",
      "You're an entrepreneur, freelancer, or employee who wants to become one — and you want to add \"AI agent\" to what you can sell",
      "You're tired of learning into the void. You want a frame, a schedule, something that ships at week 12",
      "You work better surrounded. Building solo at 1am — you've already given that a shot",
      "You want to ask questions to someone who's already done what you're trying to do — not a random Discord",
    ],
    whoNotForYouLabel: "This is NOT for you if",
    whoNotForYou: [
      "You're looking for a passive course to watch while you eat. Here we build. If you want to consume, you have YouTube",
      "You want to learn Python from scratch. We do n8n + Claude API + pro tools. Hardcore code is elsewhere",
      "You're after the \"secret\" to 10k/month without shipping anything. I don't have that to sell you",
      "You want to vent in the chat without ever finishing a build. After 4 weeks without progress, I refund you and you leave",
    ],
    kickerInside: "INSIDE",
    inside: [
      {
        title: "Structured 12-week path",
        body: "— from \"I've never built an agent\" to \"I have one in production at a client.\" We move together.",
      },
      {
        title: "A new module every week",
        body: "— concept, build, packaging, sales. Video + n8n workflow + ready-to-import prompt.",
      },
      {
        title: "A live call with me every week",
        body: "— questions, live review of your build, we unblock in 20 min what you've been stuck on for 3 days.",
      },
      {
        title: "Library of n8n workflows + Claude skills",
        body: "— one new working agent per month minimum. You download, you adapt.",
      },
      {
        title: "\"Ship your build\" channel",
        body: "— you post what you're building, others test it, tell you what works and what doesn't. Feedback in hours, not weeks.",
      },
      {
        title: "Founder pricing locked for life",
        body: "for the first 100 — whatever the price becomes after, yours doesn't move.",
      },
    ],
    kickerPricing: "PRICING",
    pricingHeadline: "Founder pricing announced at launch.",
    pricingDetails:
      "Monthly or annual — your call. Locked for life for the first 100.",
    kickerEnter: "ENTER",
    enterCopy:
      "If you read this far, you've already decided. The click is just the formality.",
    ctaButton: "Enter the community",
    ctaMeta: "100 founder seats · Locked-for-life pricing · Cancel anytime",
    stickyCta: "Enter the community →",
    kickerPs: "PS",
    psCopy:
      "Founder pricing isn't a marketing urgency — it's just math. When we're 100, I close. The next one in pays the new price, and the new price will be higher.",
    footerRights: "All rights reserved.",
    langSwitch: "FR",
    langSwitchHref: "/skool",
    ogLocale: "en_US",
    metaTitle: "The Skool community — Taiyka",
    metaDescription:
      "You don't need another course. You need to be in the right room. A community of people building real AI agents. Launching now.",
  },
};

const SKOOL_URL = "https://www.skool.com/taiyka";

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
      canonical: "/skool",
      languages: {
        "fr-FR": "/skool",
        "en-US": "/skool?lang=en",
      },
    },
    openGraph: {
      type: "website",
      locale: c.ogLocale,
      title: c.metaTitle,
      description: c.metaDescription,
      images: [
        {
          url: "/og/skool.png",
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
      images: ["/og/skool.png"],
      creator: "@manu_ai.to",
    },
  };
}

const skoolSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Taiyka — The Workshop",
  description:
    "Communauté de builders IA. 12 semaines. 100 places fondateurs.",
  provider: {
    "@type": "Organization",
    name: "Taiyka",
    url: "https://taiyka.com",
  },
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT12W",
    location: {
      "@type": "VirtualLocation",
      url: SKOOL_URL,
    },
  },
};

export default async function SkoolLandingPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const sp = await searchParams;
  const lang: Lang = sp?.lang === "en" ? "en" : "fr";
  const c = COPY[lang];

  return (
    <main className="relative flex-1 w-full flex flex-col z-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(skoolSchema) }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[60vh] bg-gradient-glow opacity-60 blur-2xl"
      />

      <div
        className="relative mx-auto w-full max-w-3xl px-6 md:px-10 py-12 md:py-20 pb-28 md:pb-20 flex flex-col flex-1 text-center"
        style={{ opacity: 0, animation: "qcm-fade-in 400ms ease-out forwards" }}
      >
        {/* Top bar */}
        <div className="w-full flex items-center justify-between mb-16 md:mb-24 font-mono text-[11px] tracking-[0.22em] uppercase gap-3">
          <Link
            href={lang === "en" ? "/?lang=en" : "/"}
            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
          >
            {c.topLeftHome}
          </Link>
          <span className="hidden sm:inline-flex items-center gap-2 text-muted-foreground">
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
        <span className="kicker">{c.kickerCommunity}</span>

        {/* H1 */}
        <h1 className="mt-5 mb-10 md:mb-12 text-balance font-bold tracking-[-0.04em] leading-[0.96] text-[clamp(2.5rem,8vw,4.75rem)]">
          {c.h1Lead}{" "}
          <span className="text-gradient-hero">{c.h1Accent}</span>{" "}
          <span className="text-foreground/75">{c.h1Trail}</span>
        </h1>

        <div className="hairline mb-12 md:mb-16" />

        {/* Manifesto */}
        <div className="flex flex-col items-center gap-6 mb-12 md:mb-16">
          <div className="flex flex-col items-center gap-2">
            <h2 className="kicker">{c.kickerManifesto}</h2>
          </div>
          <div className="w-full max-w-[58ch] mx-auto">
            <blockquote className="relative pt-5">
              <span aria-hidden className="absolute left-1/2 -translate-x-1/2 top-0 h-px w-12 bg-primary" />
              <p className="text-[1.0625rem] md:text-[1.25rem] leading-[1.65] text-[#e8f0fe] text-balance">
                {c.manifesto1}
              </p>
              <p className="mt-5 text-[1.0625rem] md:text-[1.125rem] leading-[1.65] text-muted-foreground text-balance">
                {c.manifesto2}
              </p>
            </blockquote>
          </div>
        </div>

        <div className="hairline mb-12 md:mb-16" />

        {/* Pour qui */}
        <div className="flex flex-col items-center gap-6 mb-12 md:mb-16">
          <div className="flex flex-col items-center gap-2">
            <h2 className="kicker">{c.kickerWho}</h2>
          </div>
          <div className="w-full max-w-[58ch] mx-auto space-y-6">
            <div>
              <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-primary mb-3">{c.whoForYouLabel}</p>
              <ul className="space-y-3 text-[1rem] md:text-[1.0625rem] leading-[1.6] text-[#e8f0fe]">
                {c.whoForYou.map((item, i) => (
                  <li key={`for-${i}`}>— {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground mb-3">{c.whoNotForYouLabel}</p>
              <ul className="space-y-3 text-[1rem] md:text-[1.0625rem] leading-[1.6] text-muted-foreground">
                {c.whoNotForYou.map((item, i) => (
                  <li key={`not-${i}`}>— {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="hairline mb-12 md:mb-16" />

        {/* Dedans */}
        <div className="flex flex-col items-center gap-6 mb-12 md:mb-16">
          <div className="flex flex-col items-center gap-2">
            <h2 className="kicker">{c.kickerInside}</h2>
          </div>
          <ul className="w-full max-w-[58ch] mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {c.inside.map((item, i) => (
              <li key={`inside-${i}`} className="flex flex-col items-center gap-1.5 text-center">
                <span className="font-mono text-[10px] tabular-nums tracking-[0.22em] uppercase text-muted-foreground/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[1rem] md:text-[1.0625rem] leading-[1.6] text-[#e8f0fe]">
                  <strong className="text-foreground">{item.title}</strong> {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="hairline mb-12 md:mb-16" />

        {/* Prix — placeholder pending launch */}
        <div className="flex flex-col items-center gap-6 mb-12 md:mb-16">
          <div className="flex flex-col items-center gap-2">
            <h2 className="kicker">{c.kickerPricing}</h2>
          </div>
          <div className="w-full max-w-[58ch] mx-auto space-y-5">
            <p className="text-[1.25rem] md:text-[1.5rem] leading-[1.4] text-[#e8f0fe] font-semibold">
              <span className="text-gradient-hero">{c.pricingHeadline}</span>
            </p>
            <p className="text-[1rem] md:text-[1.0625rem] leading-[1.65] text-muted-foreground">
              {c.pricingDetails}
            </p>
          </div>
        </div>

        <div className="hairline-strong mb-16 md:mb-24" />

        {/* CTA */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <h2 className="kicker kicker-accent">{c.kickerEnter}</h2>
          <p className="text-[1rem] md:text-[1.0625rem] leading-[1.6] text-muted-foreground max-w-[55ch]">
            {c.enterCopy}
          </p>
          <a
            href={SKOOL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover-grow group inline-flex items-center gap-3 h-14 md:h-16 px-7 md:px-9 rounded-md bg-gradient-hero text-[#0a1628] font-bold text-base md:text-lg tracking-tight shadow-glow hover:shadow-[0_0_60px_rgba(0,166,255,0.55)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]"
          >
            {c.ctaButton}
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
            {c.ctaMeta}
          </p>
        </div>

        {/* PS */}
        <div className="mt-12 max-w-[60ch] mx-auto">
          <h2 className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground/70 mb-2 font-normal">
            {c.kickerPs}
          </h2>
          <p className="text-sm md:text-base leading-[1.65] text-muted-foreground italic">
            {c.psCopy}
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-12 border-t border-border text-xs text-muted-foreground flex flex-wrap justify-center gap-y-2 gap-x-4">
          <span>© {new Date().getFullYear()} Taiyka · @manu_ai.to</span>
          <span aria-hidden>·</span>
          <span>{c.footerRights}</span>
        </footer>
      </div>

      {/* Sticky bottom CTA — mobile only */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border bg-navy/95 backdrop-blur p-3">
        <a
          href={SKOOL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-3 rounded-md bg-gradient-hero text-[#0a1628] font-bold text-sm tracking-tight shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]"
        >
          {c.stickyCta}
        </a>
      </div>
    </main>
  );
}
