export type Lang = "fr" | "en";

// New role enum after AUDIT-BOOK-V3 audience tightening (P0-12).
// Old keys removed: "business_owner" → "founder", "employee" removed,
// "student" → "early" (re-purposed). Existing rows in book.qualifications
// retain their original values; the CHECK constraint was relaxed in
// sql/005_book_fixes.sql to accept both old + new during transition.
export type RoleKey = "founder" | "freelance" | "early" | "other";
export type ProjectTypeKey =
  | "business"
  | "side_project"
  | "partnership"
  | "other";

export const ROLE_KEYS: readonly RoleKey[] = [
  "founder",
  "freelance",
  "early",
  "other",
] as const;

export const PROJECT_TYPE_KEYS: readonly ProjectTypeKey[] = [
  "business",
  "side_project",
  "partnership",
  "other",
] as const;

type Choice<T extends string> = { key: T; label: string };

type HeroCopy = {
  outcome: string;
  purpose: string;
  logistics: string;
  notReadyLabel: string;
  notReadyHref: string;
};

type TrustItem = {
  label: string;
  detail: string;
};

type Copy = {
  title: string;
  metaDescription: string;

  ticker: string[];
  trust: TrustItem[];
  ogSiteName: string;
  step: (current: number, total: number) => string;
  langSwitch: string;
  langSwitchHref: string;
  homeLabel: string;

  hero: HeroCopy;

  q1Question: string;
  q1Choices: Choice<RoleKey>[];

  q2Question: string;
  q2Choices: Choice<ProjectTypeKey>[];

  q3Question: string;
  q3Placeholder: string;
  q3Hint: string;
  q3Examples: string[];

  contactKicker: string;
  contactTitle: string;
  contactBlurb: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  emailTrustHint: string;
  locationLabel: string;
  locationPlaceholder: string;
  locationHint: string;
  locationOptional: string;

  next: string;
  back: string;
  submit: string;
  submitting: string;
  submittingLong: string;
  retry: string;

  calendlyKicker: string;
  calendlyTitle: string;
  calendlyBlurb: string;
  calendlyTimezoneHint: string;
  calendlyLoadingTitle: string;
  calendlyFallbackTitle: string;
  calendlyFallbackBlurb: string;
  calendlyOpenInNewTab: string;
  calendlyScriptFailedTitle: string;
  calendlyScriptFailedBlurb: string;
  calendlyMissingTitle: string;
  calendlyMissingBlurb: string;

  bookedKicker: string;
  bookedTitle: string;
  bookedBlurb: string;
  backHomeCta: string;
  bookedUpsellTitle: string;
  bookedUpsells: { label: string; href: string; external?: boolean }[];

  errorGeneric: string;
  errorRateLimit: string;
  errorRequired: string;
  errorEmail: string;
  errorLength: (min: number, max: number) => string;
  draftRestoreFailed: string;
  storageDisabled: string;
};

export const COPY: Record<Lang, Copy> = {
  fr: {
    title: "Réserver un appel avec Manu — L'Atelier",
    metaDescription:
      "30 min en visio pour cadrer ton projet d'automatisation IA. 3 questions rapides, puis ton créneau. Gratuit, sans engagement.",
    ogSiteName: "L'Atelier",

    ticker: [
      "Appel de 30 minutes",
      "En visio",
      "Gratuit, sans engagement",
      "C'est moi qui réponds",
    ],
    trust: [
      { label: "30 minutes", detail: "Pas plus, pas moins" },
      { label: "Gratuit", detail: "Sans engagement derrière" },
      { label: "En direct", detail: "Avec moi, pas un commercial" },
    ],
    step: (current, total) => `Étape ${current} / ${total}`,
    langSwitch: "EN",
    langSwitchHref: "/book?lang=en",
    homeLabel: "Accueil",

    hero: {
      outcome: "On se cale 30 minutes ?",
      purpose:
        "On parle de ton projet, de tes besoins, et des problèmes que tu veux régler en ce moment.",
      logistics: "3 questions courtes (45 s), puis tu choisis ton créneau.",
      notReadyLabel:
        "Pas encore prêt ? Récupère 5 automatisations gratuites, prêtes à l'emploi →",
      notReadyHref: "/free-n8n-pack",
    },

    q1Question: "D'abord, tu fais quoi ?",
    q1Choices: [
      { key: "founder", label: "Chef d'entreprise" },
      { key: "freelance", label: "Indépendant ou freelance" },
      { key: "early", label: "Je lance mon projet" },
      { key: "other", label: "Autre" },
    ],

    q2Question: "C'est pour quel projet ?",
    q2Choices: [
      { key: "business", label: "Pour mon entreprise" },
      { key: "side_project", label: "Pour un side-project" },
      { key: "partnership", label: "Un partenariat ou collab pro" },
      { key: "other", label: "Autre" },
    ],

    q3Question: "Décris ton projet en quelques lignes",
    q3Placeholder:
      "Par exemple : automatiser le suivi de mes devis et factures, qualifier mes leads entrants, ou créer un agent qui répond aux demandes clients la nuit…",
    q3Hint: "Quelques lignes suffisent.",
    q3Examples: [
      "Automatiser ma prospection",
      "Agent IA pour mes DMs",
      "Pas encore sûr — je veux explorer",
    ],

    contactKicker: "",
    contactTitle: "Tes coordonnées",
    contactBlurb:
      "Je prépare ton appel à partir de tes réponses. La confirmation arrive par email juste après.",
    nameLabel: "Nom",
    namePlaceholder: "Jean Dupont",
    emailLabel: "Email",
    emailPlaceholder: "prenom@exemple.com",
    emailTrustHint: "Pas de spam, pas de revente. C'est moi qui réponds.",
    locationLabel: "Localisation",
    locationPlaceholder: "Paris, France",
    locationHint: "Ville et pays — pour que je cale le bon fuseau horaire.",
    locationOptional: "(optionnel)",

    next: "Continuer → dernière étape",
    back: "Retour",
    submit: "Voir les créneaux dispo",
    submitting: "Je note ça…",
    submittingLong: "Préparation de tes créneaux…",
    retry: "Réessayer",

    calendlyKicker: "Étape finale",
    calendlyTitle: "Choisis ton créneau",
    calendlyBlurb:
      "Tes infos sont déjà pré-remplies. Choisis l'heure qui t'arrange — 30 min, en visio, on parle vrai.",
    calendlyTimezoneHint:
      "Les créneaux s'affichent dans ton fuseau horaire (modifiable en haut du calendrier).",
    calendlyLoadingTitle: "Préparation de tes créneaux…",
    calendlyFallbackTitle: "Ça prend plus de temps que prévu",
    calendlyFallbackBlurb:
      "Ouvre Calendly directement dans un nouvel onglet — tes réponses sont déjà enregistrées.",
    calendlyOpenInNewTab: "Ouvrir Calendly dans un nouvel onglet",
    calendlyScriptFailedTitle: "Calendly se charge pas",
    calendlyScriptFailedBlurb:
      "Ton ad-blocker peut bloquer le widget. Désactive-le pour ce site, ou écris-moi à manu.uhila@taiyka.com pour le lien direct.",
    calendlyMissingTitle: "Bien reçu",
    calendlyMissingBlurb:
      "Tes réponses sont enregistrées. Je t'envoie un lien de réservation à la main d'ici demain (jours ouvrés) — check tes spams.",

    bookedKicker: "Bien joué",
    bookedTitle: "On est calés",
    bookedBlurb:
      "À très vite. Le mail de confirmation arrive avec le lien — check tes spams au cas où. Prépare 1 ou 2 questions concrètes, on attaque direct.",
    backHomeCta: "Retour à l'accueil",
    bookedUpsellTitle: "En attendant l'appel",
    bookedUpsells: [
      {
        label: "Récupère 5 automatisations gratuites, prêtes à l'emploi (bonne prépa pour notre appel)",
        href: "/free-n8n-pack",
      },
      {
        label: "Découvre ma communauté Skool pour entrepreneurs IA (ouverture bientôt)",
        href: "/skool",
      },
      {
        label: "Suis-moi sur Instagram @manu_ai.to pour du contenu quotidien",
        href: "https://instagram.com/manu_ai.to",
        external: true,
      },
    ],

    errorGeneric:
      "Ça a coincé de notre côté. Réessaie dans 30 secondes — ou écris-moi direct à manu.uhila@taiyka.com.",
    errorRateLimit:
      "Tu as déjà envoyé ta demande. Si tu n'as rien reçu dans 5 min, écris-moi à manu.uhila@taiyka.com.",
    errorRequired: "Ce champ est requis.",
    errorEmail:
      "Cet email a l'air cassé — vérifie le @ et la fin de l'adresse.",
    errorLength: (min, max) =>
      `Entre ${min} et ${max} caractères, stp.`,
    draftRestoreFailed:
      "Impossible de restaurer ton brouillon — repars de zéro.",
    storageDisabled:
      "Ton navigateur bloque le stockage local. Évite de rafraîchir, sinon tu perds tes réponses.",
  },
  en: {
    title: "Book a call with Manu — The Workshop",
    metaDescription:
      "30 min video call to scope your AI automation project. 3 quick questions, then your slot. Free, no commitment.",
    ogSiteName: "The Workshop",

    ticker: [
      "30-minute call",
      "Over video",
      "Free, no strings",
      "I'm the one who replies",
    ],
    trust: [
      { label: "30 minutes", detail: "No more, no less" },
      { label: "Free", detail: "Nothing to sign after" },
      { label: "Direct", detail: "With me, not a salesperson" },
    ],
    step: (current, total) => `Step ${current} / ${total}`,
    langSwitch: "FR",
    langSwitchHref: "/book?lang=fr",
    homeLabel: "Home",

    hero: {
      outcome: "Let's grab 30 minutes.",
      purpose:
        "We talk about your project, what you need, and the problems you want to solve right now.",
      logistics: "3 short questions (45 s), then pick your slot.",
      notReadyLabel:
        "Not ready yet? Grab 5 free automations, ready to use →",
      notReadyHref: "/free-n8n-pack?lang=en",
    },

    q1Question: "First — what do you do?",
    q1Choices: [
      { key: "founder", label: "Business owner" },
      { key: "freelance", label: "Freelance or independent" },
      { key: "early", label: "Launching my project" },
      { key: "other", label: "Other" },
    ],

    q2Question: "What's this project for?",
    q2Choices: [
      { key: "business", label: "For my business" },
      { key: "side_project", label: "For a side project" },
      { key: "partnership", label: "Partnership or pro collab" },
      { key: "other", label: "Other" },
    ],

    q3Question: "Describe your project in a few lines",
    q3Placeholder:
      "For example: automate quote and invoice follow-ups, qualify inbound leads, or build an agent that handles customer questions overnight…",
    q3Hint: "A few lines are enough.",
    q3Examples: [
      "Automate my outreach",
      "AI agent for my DMs",
      "Not sure yet — I want to explore",
    ],

    contactKicker: "",
    contactTitle: "Your details",
    contactBlurb:
      "I prep your call from your answers. Confirmation lands in your inbox right after.",
    nameLabel: "Name",
    namePlaceholder: "Jane Doe",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    emailTrustHint: "No spam, no resale. I'm the one who replies.",
    locationLabel: "Location",
    locationPlaceholder: "Paris, France",
    locationHint: "City and country — so I lock the right timezone before the call.",
    locationOptional: "(optional)",

    next: "Continue → final step",
    back: "Back",
    submit: "See available slots",
    submitting: "Saving your answers…",
    submittingLong: "Loading your slots…",
    retry: "Retry",

    calendlyKicker: "Final step",
    calendlyTitle: "Pick your slot",
    calendlyBlurb:
      "Your info is already prefilled. Pick the time that works — 30 min, on video, straight talk.",
    calendlyTimezoneHint:
      "Slots show in your local timezone (you can change it at the top of the calendar).",
    calendlyLoadingTitle: "Loading your slots…",
    calendlyFallbackTitle: "Taking longer than expected",
    calendlyFallbackBlurb:
      "Open Calendly directly in a new tab — your answers are already saved.",
    calendlyOpenInNewTab: "Open Calendly in a new tab",
    calendlyScriptFailedTitle: "Calendly didn't load",
    calendlyScriptFailedBlurb:
      "Your ad-blocker may be blocking the widget. Disable it for this site, or email me at manu.uhila@taiyka.com for the direct link.",
    calendlyMissingTitle: "Got it",
    calendlyMissingBlurb:
      "Your answers are saved. I'll send you a booking link myself by tomorrow (business days) — keep an eye on your spam folder.",

    bookedKicker: "Nice",
    bookedTitle: "We're locked in",
    bookedBlurb:
      "Talk soon. Confirmation email is on the way with the call link — check spam just in case. Bring 1 or 2 concrete questions, we'll get straight to it.",
    backHomeCta: "Back to home",
    bookedUpsellTitle: "While you wait",
    bookedUpsells: [
      {
        label: "Grab 5 free automations, ready to use (good prep for our call)",
        href: "/free-n8n-pack?lang=en",
      },
      {
        label: "Check out my Skool community for AI entrepreneurs (opening soon)",
        href: "/skool?lang=en",
      },
      {
        label: "Follow me on Instagram @manu_ai.to for daily content",
        href: "https://instagram.com/manu_ai.to",
        external: true,
      },
    ],

    errorGeneric:
      "Something jammed on our end. Try again in 30 seconds — or email me directly at manu.uhila@taiyka.com.",
    errorRateLimit:
      "You've already submitted this. If nothing landed in 5 min, email me at manu.uhila@taiyka.com.",
    errorRequired: "This field is required.",
    errorEmail:
      "That email looks off — double-check the @ and the ending.",
    errorLength: (min, max) =>
      `Between ${min} and ${max} characters, please.`,
    draftRestoreFailed:
      "Couldn't restore your saved progress — starting fresh.",
    storageDisabled:
      "Your browser blocks local storage. Don't refresh — your answers will be lost.",
  },
};

export const PROJECT_DESCRIPTION_MIN = 20;
export const PROJECT_DESCRIPTION_MAX = 2000;
export const NAME_MIN = 2;
export const NAME_MAX = 120;
export const LOCATION_MIN = 3;
export const LOCATION_MAX = 200;
export const EMAIL_MIN = 5;
export const EMAIL_MAX = 320;

// Intentional permissive regex — catches typos, not RFC-compliant.
// Calendly + the user's own inbox are the true verification.
const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function isValidEmail(value: string): boolean {
  if (value.length < EMAIL_MIN || value.length > EMAIL_MAX) return false;
  return EMAIL_REGEX.test(value);
}

export function hasLetterChar(value: string): boolean {
  return /\p{L}/u.test(value);
}
