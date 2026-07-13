export type Lang = "fr" | "en";

export type CategoryKey = "workflows" | "skills" | "agents" | "dfy";

export const CATEGORY_KEYS: readonly CategoryKey[] = [
  "workflows",
  "skills",
  "agents",
  "dfy",
] as const;

type LiveCategory = {
  key: "workflows";
  index: string;
  label: string;
  description: string;
};

type CollapsedCategory = {
  key: "skills" | "agents" | "dfy";
  index: string;
  label: string;
  teaser: string;
  comingSoon: string;
};

type Copy = {
  title: string;
  metaDescription: string;

  topStatus: string;
  langSwitch: string;
  langSwitchHref: string;
  backLabel: string;

  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;

  previewBanner: string;

  workflowsCategory: LiveCategory;
  collapsedCategories: CollapsedCategory[];

  hoverHint: string;

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

    heroKicker: "Première vague",
    heroTitle: "La boutique",
    heroSubtitle:
      "Une bibliothèque de workflows, skills et agents IA. La première catégorie ouvre — les autres arrivent.",

    previewBanner: "Catalogue en cours de construction — premiers produits bientôt en ligne.",

    workflowsCategory: {
      key: "workflows",
      index: "01",
      label: "Workflows",
      description:
        "Packs de workflows n8n prêts à l'emploi pour automatiser ton acquisition, ton contenu et tes opérations.",
    },
    collapsedCategories: [
      {
        key: "skills",
        index: "02",
        label: "Skills",
        teaser:
          "Skills Claude Code et bibliothèques de prompts pour transformer ton IDE en équipe IA.",
        comingSoon: "Bientôt",
      },
      {
        key: "agents",
        index: "03",
        label: "Agents",
        teaser:
          "Agents IA complets — workflows, base de données et interface — qui prennent en charge un cas d'usage de bout en bout.",
        comingSoon: "Bientôt",
      },
      {
        key: "dfy",
        index: "04",
        label: "Done-for-you",
        teaser:
          "Je construis le système, tu l'utilises. Pour les opérateurs qui veulent gagner du temps.",
        comingSoon: "Sur demande",
      },
    ],

    hoverHint: "Voir le détail",

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

    heroKicker: "First wave",
    heroTitle: "The Shop",
    heroSubtitle:
      "A library of AI workflows, skills, and agents. The first category is opening — the others land next.",

    previewBanner: "Catalog under construction — first products coming online soon.",

    workflowsCategory: {
      key: "workflows",
      index: "01",
      label: "Workflows",
      description:
        "Ready-to-use n8n workflow packs to automate your acquisition, content, and operations.",
    },
    collapsedCategories: [
      {
        key: "skills",
        index: "02",
        label: "Skills",
        teaser:
          "Claude Code skills and prompt libraries that turn your IDE into an AI team.",
        comingSoon: "Soon",
      },
      {
        key: "agents",
        index: "03",
        label: "Agents",
        teaser:
          "Full AI agents — workflows, database, and UI — handling a use case end-to-end.",
        comingSoon: "Soon",
      },
      {
        key: "dfy",
        index: "04",
        label: "Done-for-you",
        teaser:
          "I build the system, you use it. For operators who want to move fast.",
        comingSoon: "On request",
      },
    ],

    hoverHint: "See details",

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
