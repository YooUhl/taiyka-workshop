import Link from "next/link";
import type { Metadata } from "next";
import { withLang } from "@/lib/lang-utils";
import UnsubscribeClient from "./UnsubscribeClient";

type Lang = "fr" | "en";

export const metadata: Metadata = {
  title: "Désinscription · AI NEWS · Taiyka",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; email?: string }>;
}) {
  const sp = await searchParams;
  const lang: Lang = sp?.lang === "en" ? "en" : "fr";
  const email = (sp?.email || "").trim();

  const t =
    lang === "fr"
      ? {
          topHome: "← TAIYKA · Accueil",
          kicker: "DÉSINSCRIPTION · AI NEWS",
          h1Lead: "On t'enlève",
          h1Accent: "de la liste.",
          intro: "Confirme la désinscription pour cet email :",
          missing:
            "Aucun email détecté dans le lien. Tu peux entrer le tien ci-dessous pour finaliser.",
          button: "Confirmer la désinscription",
          submitting: "Désinscription…",
          successKicker: "✓ TERMINÉ",
          successTitle: "Plus de mails — tu n'es plus dans la liste.",
          successSub:
            "Si tu changes d'avis, le formulaire d'inscription est toujours là.",
          ctaHome: "Retour à l'accueil",
          ctaBrief: "Voir la page du brief",
          error:
            "Ça a pas pris. Réessaie, ou écris-moi : manu.uhila@taiyka.com.",
        }
      : {
          topHome: "← TAIYKA · Home",
          kicker: "UNSUBSCRIBE · AI NEWS",
          h1Lead: "We're taking you",
          h1Accent: "off the list.",
          intro: "Confirm unsubscribe for this email:",
          missing:
            "No email detected in the link. Enter yours below to finish.",
          button: "Confirm unsubscribe",
          submitting: "Unsubscribing…",
          successKicker: "✓ DONE",
          successTitle: "No more emails — you're off the list.",
          successSub:
            "If you change your mind, the signup form is still there.",
          ctaHome: "Back to home",
          ctaBrief: "See the brief page",
          error: "Didn't go through. Try again, or write me: manu.uhila@taiyka.com.",
        };

  return (
    <main className="relative flex-1 w-full flex flex-col z-10">
      <div
        aria-hidden
        className="hidden md:block pointer-events-none fixed inset-x-0 top-0 h-[60vh] bg-gradient-glow opacity-60 blur-2xl"
      />

      <div
        className="relative mx-auto w-full max-w-2xl px-6 md:px-10 py-12 md:py-20 flex flex-col flex-1 text-center"
        style={{ opacity: 0, animation: "qcm-fade-in 400ms ease-out forwards" }}
      >
        {/* Top bar */}
        <div className="w-full flex items-center justify-start mb-14 md:mb-20 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase">
          <Link
            href={withLang("/", lang)}
            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
          >
            {t.topHome}
          </Link>
        </div>

        <span className="kicker">{t.kicker}</span>

        <h1 className="mt-5 mb-12 md:mb-16 text-balance font-bold tracking-[-0.04em] leading-[0.96] text-[clamp(2rem,7vw,3.75rem)]">
          {t.h1Lead}{" "}
          <span className="text-gradient-hero">{t.h1Accent}</span>
        </h1>

        <div className="hairline mb-14 md:mb-20" />

        <div className="w-full max-w-md mx-auto text-left">
          <UnsubscribeClient
            initialEmail={email}
            t={{
              intro: t.intro,
              missing: t.missing,
              button: t.button,
              submitting: t.submitting,
              successKicker: t.successKicker,
              successTitle: t.successTitle,
              successSub: t.successSub,
              ctaHome: t.ctaHome,
              ctaBrief: t.ctaBrief,
              error: t.error,
            }}
            lang={lang}
          />
        </div>

        <footer className="mt-auto pt-12 border-t border-border text-xs text-muted-foreground flex flex-wrap justify-center gap-y-2 gap-x-4">
          <span>© {new Date().getFullYear()} Taiyka · @manu_ai.to</span>
        </footer>
      </div>
    </main>
  );
}
