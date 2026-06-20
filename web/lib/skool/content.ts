import type { Copy } from "@/components/ComingSoon/ComingSoon";

export type Lang = "fr" | "en";

export const COPY: Record<Lang, Copy> = {
  fr: {
    title: "Mon Skool — Bientôt",
    metaDescription:
      "Ma communauté privée pour entrepreneurs IA arrive bientôt.",
    headline: "L'atelier ouvre bientôt.",
    backCta: "← Accueil",
    backHref: "/",
    langSwitch: "EN",
    langSwitchHref: "/skool?lang=en",
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
  },
};
