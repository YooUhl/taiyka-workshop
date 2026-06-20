import type { Copy } from "@/components/ComingSoon/ComingSoon";

export type Lang = "fr" | "en";

export const COPY: Record<Lang, Copy> = {
  fr: {
    title: "Ressources — Bientôt",
    metaDescription: "Mes ressources gratuites arrivent bientôt.",
    headline: "Bientôt, à télécharger.",
    backCta: "← Accueil",
    backHref: "/",
    langSwitch: "EN",
    langSwitchHref: "/resources?lang=en",
  },
  en: {
    title: "Resources — Soon",
    metaDescription: "My free resources are coming soon.",
    headline: "Soon, free to grab.",
    backCta: "← Home",
    backHref: "/?lang=en",
    langSwitch: "FR",
    langSwitchHref: "/resources?lang=fr",
  },
};
