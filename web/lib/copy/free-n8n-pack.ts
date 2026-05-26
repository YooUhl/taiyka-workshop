/**
 * Typed copy for /free-n8n-pack.
 * Replaces the request-time fs.readFileSync of products/free-n8n-pack/copy/sales-*.md
 * (which fails on Vercel serverless because the products/ folder lives outside
 * the bundled web/ tree).
 *
 * Keep both languages in sync. FR is the default.
 */

export type FreeN8nPackCopy = {
  kicker: string;
  kickerFromQcm: string;
  statusPill: string;
  h1Line1: string;
  h1Line1Gradient: string;
  h1Line2: string;
  subHero: string;
  bulletsKicker: string;
  bullets: string[];
  formKicker: string;
  formIntro: string;
  reassurance: string;
  backHome: string;
  backFromQcm: string;
  langSwitchLabel: string;
  langSwitchHref: string;
  upsellKicker: string;
  upsellPrimary: string;
  upsellPrimaryHref: string;
  upsellSecondary: string;
  upsellSecondaryHref: string;
};

export const FREE_N8N_PACK_COPY: Record<"fr" | "en", FreeN8nPackCopy> = {
  fr: {
    kicker: "PACK N8N · GRATUIT",
    kickerFromQcm: "PROFIL EXPLORATEUR · TON PACK DE DÉPART",
    statusPill: "Pack gratuit · ZIP en 2 min",
    h1Line1: "5 workflows n8n que j'utilise vraiment",
    h1Line1Gradient: "dans mon business.",
    h1Line2: "Gratuits. À toi.",
    subHero:
      "Pas de théorie. Pas de \"10 idées pour utiliser l'IA\". Juste 5 fichiers .json que tu importes dans ton n8n et qui tournent en 30 minutes.",
    bulletsKicker: "DEDANS · 5 WORKFLOWS",
    bullets: [
      "Un digest d'actus IA quotidien dans ta boîte mail (zero scroll Twitter)",
      "Un système qui trouve l'email du fondateur de n'importe quelle boîte",
      "Un scraper Google Maps qui te sort 100 leads locaux en 2 minutes",
      "Un tracker des bestsellers Amazon sur 10 marchés",
      "Un système de veille Instagram concurrentiel (le bonus advanced)",
    ],
    formKicker: "RÉCUPÉRER LE PACK",
    formIntro: "Entre ton email. Le ZIP arrive en moins de 2 minutes.",
    reassurance: "ZIP dans 2 min max. Spam zéro.",
    backHome: "← TAIYKA · Accueil",
    backFromQcm: "← Retour à ton profil",
    langSwitchLabel: "EN",
    langSwitchHref: "/free-n8n-pack?lang=en",
    upsellKicker: "PENDANT QUE LE ZIP ARRIVE",
    upsellPrimary: "Voir le Smart Prospect Audit Funnel →",
    upsellPrimaryHref: "/products/prospect-audit-funnel",
    upsellSecondary: "Ou rejoins la communauté Skool →",
    upsellSecondaryHref: "/skool",
  },
  en: {
    kicker: "N8N PACK · FREE",
    kickerFromQcm: "EXPLORER PROFILE · YOUR STARTER PACK",
    statusPill: "Free pack · ZIP in 2 min",
    h1Line1: "5 n8n workflows I actually use",
    h1Line1Gradient: "in my business.",
    h1Line2: "Free. Take them.",
    subHero:
      "No theory. No \"10 ways to use AI\". Just 5 .json files you import into n8n. Running in 30 minutes.",
    bulletsKicker: "INSIDE · 5 WORKFLOWS",
    bullets: [
      "A daily AI news digest in your inbox (zero Twitter scrolling)",
      "A system that finds the founder email of any company",
      "A Google Maps scraper that pulls 100 local leads in 2 minutes",
      "A tracker for Amazon bestsellers across 10 markets",
      "An Instagram competitive monitoring system (the advanced bonus)",
    ],
    formKicker: "GET THE PACK",
    formIntro: "Drop your email. The ZIP arrives in under 2 minutes.",
    reassurance: "ZIP in under 2 min. No spam.",
    backHome: "← TAIYKA · Home",
    backFromQcm: "← Back to your profile",
    langSwitchLabel: "FR",
    langSwitchHref: "/free-n8n-pack?lang=fr",
    upsellKicker: "WHILE THE ZIP LANDS",
    upsellPrimary: "See the Smart Prospect Audit Funnel →",
    upsellPrimaryHref: "/products/prospect-audit-funnel?lang=en",
    upsellSecondary: "Or join the Skool community →",
    upsellSecondaryHref: "/skool?lang=en",
  },
};
