import type { Copy } from "@/components/ComingSoon/ComingSoon";

export type Lang = "fr" | "en";

export const COPY: Record<Lang, Copy> = {
  fr: {
    title: "Mon Skool — Bientôt",
    metaDescription:
      "Ma communauté privée pour entrepreneurs IA arrive bientôt.",
    headline: "L'Atelier ouvre bientôt.",
    backCta: "← Accueil",
    backHref: "/",
    langSwitch: "EN",
    langSwitchHref: "/skool?lang=en",
    langSwitchAria: "Voir en anglais",
    topStatus: "Communauté · L'Atelier",
    homeHref: "/",
    homeLabel: "Accueil",
    ticker: [
      "La communauté Pionniers",
      "Ouverture bientôt",
      "Les systèmes, les coulisses, l'entraide",
    ],
  },
  en: {
    title: "My Skool — Soon",
    metaDescription:
      "My private community for AI entrepreneurs is opening soon.",
    headline: "The Workshop opens soon.",
    backCta: "← Home",
    backHref: "/?lang=en",
    langSwitch: "FR",
    langSwitchHref: "/skool?lang=fr",
    langSwitchAria: "View in French",
    topStatus: "Community · The Workshop",
    homeHref: "/?lang=en",
    homeLabel: "Home",
    ticker: [
      "The Pioneers community",
      "Opening soon",
      "The systems, the behind-the-scenes, the support",
    ],
  },
};
