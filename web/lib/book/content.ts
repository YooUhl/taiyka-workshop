export type Lang = "fr" | "en";

export type RoleKey = "business_owner" | "employee" | "student" | "other";
export type ProjectTypeKey = "business" | "personal" | "collab";

export const ROLE_KEYS: readonly RoleKey[] = [
  "business_owner",
  "employee",
  "student",
  "other",
] as const;

export const PROJECT_TYPE_KEYS: readonly ProjectTypeKey[] = [
  "business",
  "personal",
  "collab",
] as const;

type Choice<T extends string> = { key: T; label: string };

type Copy = {
  title: string;
  metaDescription: string;
  step: (current: number, total: number) => string;
  langSwitch: string;
  langSwitchHref: string;

  q1Question: string;
  q1Choices: Choice<RoleKey>[];

  q2Question: string;
  q2Choices: Choice<ProjectTypeKey>[];

  q3Question: string;
  q3Placeholder: string;
  q3MinChars: string;

  contactKicker: string;
  contactTitle: string;
  contactBlurb: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  locationLabel: string;
  locationPlaceholder: string;
  locationHint: string;

  next: string;
  back: string;
  submit: string;
  submitting: string;
  retry: string;

  calendlyKicker: string;
  calendlyTitle: string;
  calendlyBlurb: string;
  calendlyMissingTitle: string;
  calendlyMissingBlurb: string;

  bookedKicker: string;
  bookedTitle: string;
  bookedBlurb: string;
  backHomeCta: string;

  errorGeneric: string;
  errorRequired: string;
  errorEmail: string;
  errorLength: (min: number, max: number) => string;
};

export const COPY: Record<Lang, Copy> = {
  fr: {
    title: "Réserver un appel — My Workshop",
    metaDescription:
      "3 questions courtes pour préparer notre appel, puis choisis ton créneau.",
    step: (current, total) => `Étape ${current} / ${total}`,
    langSwitch: "EN",
    langSwitchHref: "/book?lang=en",

    q1Question: "Tu es ?",
    q1Choices: [
      { key: "business_owner", label: "Chef d'entreprise" },
      { key: "employee", label: "Salarié" },
      { key: "student", label: "Étudiant" },
      { key: "other", label: "Autre" },
    ],

    q2Question: "Quel type de projet ?",
    q2Choices: [
      { key: "business", label: "Pour mon entreprise" },
      { key: "personal", label: "Perso" },
      { key: "collab", label: "Collaboration" },
    ],

    q3Question: "Décris ton projet en quelques lignes",
    q3Placeholder:
      "Par exemple : automatiser ma prospection LinkedIn → CRM, ou créer un agent qui répond aux DMs Instagram…",
    q3MinChars: "Minimum 20 caractères",

    contactKicker: "Dernière étape",
    contactTitle: "Tes coordonnées",
    contactBlurb:
      "On t'envoie la confirmation du rendez-vous et je prépare l'appel avec tes réponses.",
    nameLabel: "Nom",
    namePlaceholder: "Manu Uhila",
    emailLabel: "Email",
    emailPlaceholder: "tonemail@exemple.com",
    locationLabel: "Localisation",
    locationPlaceholder: "Paris, France",
    locationHint: "Ville et pays — pour gérer le décalage horaire.",

    next: "Suivant",
    back: "Retour",
    submit: "Choisir un créneau",
    submitting: "Envoi…",
    retry: "Réessayer",

    calendlyKicker: "Choisis ton créneau",
    calendlyTitle: "Réserve l'appel",
    calendlyBlurb: "Tes infos sont déjà pré-remplies. Plus qu'à choisir l'heure.",
    calendlyMissingTitle: "Réservé reçu ✅",
    calendlyMissingBlurb:
      "On t'a bien enregistré. Je reviens vers toi par email avec un lien Calendly dans la journée.",

    bookedKicker: "C'est noté",
    bookedTitle: "Rendez-vous confirmé",
    bookedBlurb:
      "On se voit bientôt. Tu reçois la confirmation par email avec le lien d'appel.",
    backHomeCta: "Retour à l'accueil",

    errorGeneric: "Une erreur est survenue. Réessaie dans un instant.",
    errorRequired: "Ce champ est requis.",
    errorEmail: "Email invalide.",
    errorLength: (min, max) =>
      `Doit faire entre ${min} et ${max} caractères.`,
  },
  en: {
    title: "Book a call — My Workshop",
    metaDescription:
      "3 short questions to prep the call, then pick your slot.",
    step: (current, total) => `Step ${current} / ${total}`,
    langSwitch: "FR",
    langSwitchHref: "/book?lang=fr",

    q1Question: "You are?",
    q1Choices: [
      { key: "business_owner", label: "Business owner" },
      { key: "employee", label: "Employee" },
      { key: "student", label: "Student" },
      { key: "other", label: "Other" },
    ],

    q2Question: "Project type?",
    q2Choices: [
      { key: "business", label: "For my business" },
      { key: "personal", label: "Personal" },
      { key: "collab", label: "Collaboration" },
    ],

    q3Question: "Describe your project in a few lines",
    q3Placeholder:
      "For example: automate my LinkedIn prospecting → CRM, or build an agent that replies to Instagram DMs…",
    q3MinChars: "20 characters minimum",

    contactKicker: "Final step",
    contactTitle: "Your details",
    contactBlurb:
      "We send the booking confirmation and I prep the call with your answers.",
    nameLabel: "Name",
    namePlaceholder: "Manu Uhila",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    locationLabel: "Location",
    locationPlaceholder: "Paris, France",
    locationHint: "City and country — so I handle the timezone before the call.",

    next: "Next",
    back: "Back",
    submit: "Pick a slot",
    submitting: "Sending…",
    retry: "Retry",

    calendlyKicker: "Pick your slot",
    calendlyTitle: "Book the call",
    calendlyBlurb: "Your info is already prefilled. Just pick a time.",
    calendlyMissingTitle: "Got it ✅",
    calendlyMissingBlurb:
      "You're saved. I'll email you a Calendly link within the day.",

    bookedKicker: "Confirmed",
    bookedTitle: "Your call is booked",
    bookedBlurb:
      "See you soon. You'll get the confirmation by email with the call link.",
    backHomeCta: "Back to home",

    errorGeneric: "Something went wrong. Try again in a moment.",
    errorRequired: "This field is required.",
    errorEmail: "Invalid email.",
    errorLength: (min, max) =>
      `Must be between ${min} and ${max} characters.`,
  },
};

export const PROJECT_DESCRIPTION_MIN = 20;
export const PROJECT_DESCRIPTION_MAX = 2000;
export const NAME_MIN = 1;
export const NAME_MAX = 120;
export const LOCATION_MIN = 1;
export const LOCATION_MAX = 200;

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value);
}
