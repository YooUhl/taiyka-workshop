export type Lang = "fr" | "en";

export type CategoryKey = "workflows" | "skills" | "agents" | "dfy";

export const CATEGORY_KEYS: readonly CategoryKey[] = [
  "workflows",
  "skills",
  "agents",
  "dfy",
] as const;

// A tab in the category strip. `live` drives whether the rail renders products
// or the empty state.
type CategoryTab = {
  key: CategoryKey;
  label: string;
  live: boolean;
  status: string;
  heading: string;
  emptyState: string;
};

type Tile = {
  key: Exclude<CategoryKey, "workflows">;
  display: string;
  label: string;
  blurb: string;
  status: string;
};

type FaqItem = {
  q: string;
  a: string;
};

type TrustItem = {
  label: string;
  detail: string;
};

type Copy = {
  title: string;
  metaDescription: string;

  topStatus: string;
  langSwitch: string;
  langSwitchHref: string;
  backLabel: string;

  ticker: string[];

  heroProof: string;
  heroTitleLead: string;
  heroTitleAccent: string;
  heroSubtitle: string;
  heroCta: string;
  heroTrust: string[];
  heroPanelKicker: string;
  heroPanelTitle: string;
  heroPanelNote: string;

  tabsAriaLabel: string;
  categories: CategoryTab[];

  tilesKicker: string;
  tiles: Tile[];

  featureKicker: string;
  featureTitle: string;
  featureBlurb: string;
  featureCta: string;
  featureSlug: string;

  faqKicker: string;
  faqTitle: string;
  faq: FaqItem[];

  trust: TrustItem[];

  waitlistKicker: string;
  waitlistTitle: string;
  waitlistBlurb: string;
  waitlistEmailLabel: string;
  waitlistEmailPlaceholder: string;
  waitlistSubmit: string;
  waitlistSubmitting: string;
  waitlistSuccess: string;
  waitlistAlready: string;
  waitlistError: string;

  skoolKicker: string;
  skoolTitle: string;
  skoolBlurb: string;
  skoolCta: string;

  footerNote: string;
};

export const COPY: Record<Lang, Copy> = {
  fr: {
    title: "Boutique — L'Atelier",
    metaDescription:
      "Workflows, skills et agents IA — la boutique ouvre bientôt. Mets-toi sur la liste.",

    topStatus: "BOUTIQUE · L'ATELIER",
    langSwitch: "EN",
    langSwitchHref: "/shop?lang=en",
    backLabel: "Retour",

    ticker: [
      "Workflows n8n prêts à l'emploi",
      "Fichiers .json à importer",
      "Guide de setup inclus",
      "Mises à jour offertes",
    ],

    heroProof: "3 packs · construits pour de vrais clients",
    heroTitleLead: "Des systèmes qui tournent",
    heroTitleAccent: "pendant que tu dors.",
    heroSubtitle:
      "Des workflows n8n que j'ai construits pour mes clients, packagés pour que tu les importes chez toi. Tu remplis tes clés API, ça tourne.",
    heroCta: "Voir les packs",
    heroTrust: ["Accès immédiat", "Guide de setup", "Mises à jour offertes"],
    heroPanelKicker: "Première vague",
    heroPanelTitle: "Workflows",
    heroPanelNote:
      "La première catégorie ouvre. Skills, agents et done-for-you arrivent après.",

    tabsAriaLabel: "Catégories de la boutique",
    categories: [
      {
        key: "workflows",
        label: "Workflows",
        live: true,
        status: "En ligne",
        heading: "Workflows",
        emptyState: "",
      },
      {
        key: "skills",
        label: "Skills",
        live: false,
        status: "Bientôt",
        heading: "Skills",
        emptyState:
          "Skills Claude Code et bibliothèques de prompts pour transformer ton IDE en équipe IA. Pas encore en ligne — mets-toi sur la liste plus bas.",
      },
      {
        key: "agents",
        label: "Agents",
        live: false,
        status: "Bientôt",
        heading: "Agents",
        emptyState:
          "Des agents complets — workflows, base de données et interface — qui prennent un cas d'usage de bout en bout. Pas encore en ligne.",
      },
      {
        key: "dfy",
        label: "Done-for-you",
        live: false,
        status: "Sur demande",
        heading: "Done-for-you",
        emptyState:
          "Je construis le système, tu l'utilises. Pour les opérateurs qui préfèrent déléguer. Réserve un appel et on en parle.",
      },
    ],

    tilesKicker: "Ce qui arrive",
    tiles: [
      {
        key: "skills",
        display: "SKILLS",
        label: "Skills",
        blurb: "Skills Claude Code et bibliothèques de prompts.",
        status: "Bientôt",
      },
      {
        key: "agents",
        display: "AGENTS",
        label: "Agents",
        blurb: "Des agents IA complets, de bout en bout.",
        status: "Bientôt",
      },
      {
        key: "dfy",
        display: "DFY",
        label: "Done-for-you",
        blurb: "Je construis, tu utilises.",
        status: "Sur demande",
      },
    ],

    featureKicker: "Le plus demandé",
    featureTitle: "Pack Acquisition",
    featureBlurb:
      "8 workflows pour scraper tes prospects, vérifier les emails, personnaliser chaque message avec Claude et suivre la pipeline dans un Sheet. Compte 30 minutes de setup si tu connais n8n, une heure sinon.",
    featureCta: "Voir le pack",
    featureSlug: "acquisition-pack",

    faqKicker: "Questions",
    faqTitle: "Ce qu'on me demande",
    faq: [
      {
        q: "C'est quoi exactement, un pack de workflows ?",
        a: "Des fichiers .json que tu importes dans ton n8n. Chaque workflow est documenté et testé, et le pack vient avec un guide de setup pas à pas.",
      },
      {
        q: "Il me faut quoi pour les faire tourner ?",
        a: "Une instance n8n — cloud ou auto-hébergée — et les clés API des outils utilisés par le pack. Chaque fiche produit liste les variables à renseigner avant l'achat.",
      },
      {
        q: "Je débute sur n8n, c'est jouable ?",
        a: "Oui. Le guide te prend étape par étape. Compte une heure pour un premier pack si tu n'as jamais touché n8n, une trentaine de minutes si tu connais l'outil.",
      },
      {
        q: "Comment je reçois le pack après l'achat ?",
        a: "Le lien de téléchargement arrive tout de suite après le paiement. Pas d'attente, pas de validation manuelle.",
      },
      {
        q: "Les mises à jour sont incluses ?",
        a: "Oui. Quand je corrige ou j'améliore un workflow, tu récupères la nouvelle version sans repayer.",
      },
    ],

    trust: [
      { label: "Accès immédiat", detail: "Téléchargement dès le paiement" },
      { label: "Guide de setup", detail: "Pas à pas, variables listées" },
      { label: "Mises à jour offertes", detail: "Les versions suivantes sont à toi" },
    ],

    waitlistKicker: "Liste d'attente",
    waitlistTitle: "Sois prévenu en premier",
    waitlistBlurb:
      "Un email quand le premier produit est en ligne. Pas de spam, pas de newsletter — juste le drop.",
    waitlistEmailLabel: "Email",
    waitlistEmailPlaceholder: "tonemail@exemple.com",
    waitlistSubmit: "Rejoindre la liste",
    waitlistSubmitting: "Envoi…",
    waitlistSuccess: "Bien noté. Tu seras prévenu.",
    waitlistAlready: "Tu es déjà sur la liste. À bientôt.",
    waitlistError: "Une erreur est survenue. Réessaie dans un instant.",

    skoolKicker: "Communauté",
    skoolTitle: "Pionniers",
    skoolBlurb:
      "L'accès permanent au playbook et à la communauté autour de l'automatisation IA.",
    skoolCta: "Rejoindre Pionniers",

    footerNote: "Tous les contenus sont produits par Manu · Taiyka.",
  },
  en: {
    title: "Shop — The Workshop",
    metaDescription:
      "AI workflows, skills, and agents — the shop opens soon. Join the waitlist.",

    topStatus: "SHOP · THE WORKSHOP",
    langSwitch: "FR",
    langSwitchHref: "/shop?lang=fr",
    backLabel: "Back",

    ticker: [
      "Ready-to-run n8n workflows",
      ".json files you import",
      "Setup guide included",
      "Free updates",
    ],

    heroProof: "3 packs · built for real clients",
    heroTitleLead: "Systems that keep running",
    heroTitleAccent: "while you sleep.",
    heroSubtitle:
      "n8n workflows I built for my clients, packaged so you can import them into your own stack. Drop in your API keys and they run.",
    heroCta: "See the packs",
    heroTrust: ["Instant access", "Setup guide", "Free updates"],
    heroPanelKicker: "First wave",
    heroPanelTitle: "Workflows",
    heroPanelNote:
      "The first category is opening. Skills, agents, and done-for-you follow.",

    tabsAriaLabel: "Shop categories",
    categories: [
      {
        key: "workflows",
        label: "Workflows",
        live: true,
        status: "Live",
        heading: "Workflows",
        emptyState: "",
      },
      {
        key: "skills",
        label: "Skills",
        live: false,
        status: "Soon",
        heading: "Skills",
        emptyState:
          "Claude Code skills and prompt libraries that turn your IDE into an AI team. Not live yet — join the list below.",
      },
      {
        key: "agents",
        label: "Agents",
        live: false,
        status: "Soon",
        heading: "Agents",
        emptyState:
          "Full agents — workflows, database, and interface — handling a use case end to end. Not live yet.",
      },
      {
        key: "dfy",
        label: "Done-for-you",
        live: false,
        status: "On request",
        heading: "Done-for-you",
        emptyState:
          "I build the system, you use it. For operators who would rather delegate. Book a call and let's talk.",
      },
    ],

    tilesKicker: "What's coming",
    tiles: [
      {
        key: "skills",
        display: "SKILLS",
        label: "Skills",
        blurb: "Claude Code skills and prompt libraries.",
        status: "Soon",
      },
      {
        key: "agents",
        display: "AGENTS",
        label: "Agents",
        blurb: "Complete AI agents, end to end.",
        status: "Soon",
      },
      {
        key: "dfy",
        display: "DFY",
        label: "Done-for-you",
        blurb: "I build it, you use it.",
        status: "On request",
      },
    ],

    featureKicker: "Most asked for",
    featureTitle: "Acquisition Pack",
    featureBlurb:
      "8 workflows to scrape your leads, verify emails, personalise every message with Claude, and track the pipeline in a Sheet. Around 30 minutes of setup if you know n8n, an hour if you don't.",
    featureCta: "See the pack",
    featureSlug: "acquisition-pack",

    faqKicker: "Questions",
    faqTitle: "What people ask",
    faq: [
      {
        q: "What exactly is a workflow pack?",
        a: ".json files you import into your own n8n. Every workflow is documented and tested, and the pack ships with a step-by-step setup guide.",
      },
      {
        q: "What do I need to run them?",
        a: "An n8n instance — cloud or self-hosted — and API keys for the tools the pack uses. Each product page lists the variables you'll need before you buy.",
      },
      {
        q: "I'm new to n8n. Can I still use this?",
        a: "Yes. The guide walks you through it. Budget an hour for your first pack if you've never touched n8n, about thirty minutes if you have.",
      },
      {
        q: "How do I get the pack after buying?",
        a: "The download link arrives right after payment. No waiting, no manual approval.",
      },
      {
        q: "Are updates included?",
        a: "Yes. When I fix or improve a workflow, you get the new version at no extra cost.",
      },
    ],

    trust: [
      { label: "Instant access", detail: "Download the moment you pay" },
      { label: "Setup guide", detail: "Step by step, variables listed" },
      { label: "Free updates", detail: "Every later version is yours" },
    ],

    waitlistKicker: "Waitlist",
    waitlistTitle: "Be the first to know",
    waitlistBlurb:
      "One email when the first product goes live. No spam, no newsletter — just the drop.",
    waitlistEmailLabel: "Email",
    waitlistEmailPlaceholder: "you@example.com",
    waitlistSubmit: "Join the list",
    waitlistSubmitting: "Sending…",
    waitlistSuccess: "Got it. You'll hear from me.",
    waitlistAlready: "You're already on the list. Talk soon.",
    waitlistError: "Something went wrong. Try again in a moment.",

    skoolKicker: "Community",
    skoolTitle: "Pioneers",
    skoolBlurb:
      "Permanent access to the playbook and the community around AI automation.",
    skoolCta: "Join Pioneers",

    footerNote: "All content built by Manu · Taiyka.",
  },
};

export const EMAIL_MAX = 320;

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value);
}
