import type { Copy } from "@/components/ComingSoon/ComingSoon";

export type Lang = "fr" | "en";

export const COPY: Record<Lang, Copy> = {
  fr: {
    title: "La boutique — Bientôt",
    metaDescription: "Ma boutique de produits IA ouvre bientôt.",
    headline: "La boutique ouvre bientôt.",
    backCta: "← Accueil",
    backHref: "/",
    langSwitch: "EN",
    langSwitchHref: "/shop?lang=en",
  },
  en: {
    title: "The Shop — Soon",
    metaDescription: "My AI products shop is opening soon.",
    headline: "The shop opens soon.",
    backCta: "← Home",
    backHref: "/?lang=en",
    langSwitch: "FR",
    langSwitchHref: "/shop?lang=fr",
  },
};
