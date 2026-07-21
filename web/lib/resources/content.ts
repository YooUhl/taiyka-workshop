import type { Copy } from "@/components/ComingSoon/ComingSoon";

export type Lang = "fr" | "en";

export const COPY: Record<Lang, Copy> = {
  fr: {
    title: "Ressources — Bientôt",
    metaDescription:
      "Mes ressources gratuites arrivent. En attendant, le pack n8n gratuit est déjà là.",
    headline: "Ça arrive.",
    backCta: "En attendant, récupère le pack n8n gratuit →",
    backHref: "/free-n8n-pack",
    langSwitch: "EN",
    langSwitchHref: "/resources?lang=en",
    langSwitchAria: "Voir en anglais",
    topStatus: "Ressources · L'Atelier",
    homeHref: "/",
    homeLabel: "Accueil",
    ticker: [
      "Ressources gratuites",
      "Le pack n8n gratuit est déjà en ligne",
      "Guides et templates à venir",
    ],
  },
  en: {
    title: "Resources — Soon",
    metaDescription:
      "My free resources are coming. Meanwhile, the free n8n pack is already live.",
    headline: "It's coming.",
    backCta: "Meanwhile, grab the free n8n pack →",
    backHref: "/free-n8n-pack?lang=en",
    langSwitch: "FR",
    langSwitchHref: "/resources?lang=fr",
    langSwitchAria: "View in French",
    topStatus: "Resources · The Workshop",
    homeHref: "/?lang=en",
    homeLabel: "Home",
    ticker: [
      "Free resources",
      "The free n8n pack is already live",
      "Guides and templates on the way",
    ],
  },
};
