import Link from "next/link";
import type { Metadata } from "next";
import { withLang } from "@/lib/lang-utils";

type Lang = "fr" | "en";
type ConfirmStatus = "confirmed" | "already" | "invalid" | "error";

export const metadata: Metadata = {
  title: "Inscription confirmée · Le Brief · L'Atelier",
  robots: { index: false, follow: false },
};

function normalizeStatus(raw: string | undefined): ConfirmStatus {
  if (raw === "confirmed" || raw === "already" || raw === "invalid" || raw === "error") {
    return raw;
  }
  return "invalid";
}

export default async function BriefConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; lang?: string }>;
}) {
  const sp = await searchParams;
  const lang: Lang = sp?.lang === "en" ? "en" : "fr";
  const status = normalizeStatus(sp?.status);

  const t =
    lang === "fr"
      ? {
          topHome: "← L'Atelier · Accueil",
          kicker: "LE BRIEF · INSCRIPTION",
          waitingKicker: "En attendant",
          ctaQcm: "Fais le QCM — 2 min, voir ton profil →",
          ctaSkool: "Entrer dans la communauté Skool →",
          ctaBrief: "Retour à la page du brief →",
          copy: {
            confirmed: {
              kicker: "✓ Confirmé",
              lead: "C'est bon,",
              accent: "t'es dans la liste.",
              sub: "Premier numéro demain matin, 7h. En français, en 60 secondes.",
              showFunnel: true,
            },
            already: {
              kicker: "✓ Déjà confirmé",
              lead: "T'étais déjà",
              accent: "dans la liste.",
              sub: "Rien à faire — à demain matin, 7h.",
              showFunnel: true,
            },
            invalid: {
              kicker: "Lien invalide",
              lead: "Ce lien est",
              accent: "invalide ou expiré.",
              sub: "Réinscris-toi sur la page du brief, ça prend 10 secondes.",
              showFunnel: false,
            },
            error: {
              kicker: "Erreur",
              lead: "Une erreur",
              accent: "est survenue.",
              sub: "Réessaie dans un instant, ou écris-moi : manu.uhila@taiyka.com.",
              showFunnel: false,
            },
          },
        }
      : {
          topHome: "← The Workshop · Home",
          kicker: "LE BRIEF · SUBSCRIPTION",
          waitingKicker: "While you wait",
          ctaQcm: "Take the quiz — 2 min, see your profile →",
          ctaSkool: "Join the Skool community →",
          ctaBrief: "Back to the brief page →",
          copy: {
            confirmed: {
              kicker: "✓ Confirmed",
              lead: "You're all set,",
              accent: "you're on the list.",
              sub: "First issue tomorrow at 7am. In French, in 60 seconds.",
              showFunnel: true,
            },
            already: {
              kicker: "✓ Already confirmed",
              lead: "You were already",
              accent: "on the list.",
              sub: "Nothing to do — see you tomorrow at 7am.",
              showFunnel: true,
            },
            invalid: {
              kicker: "Invalid link",
              lead: "This link is",
              accent: "invalid or expired.",
              sub: "Sign up again on the brief page — it takes 10 seconds.",
              showFunnel: false,
            },
            error: {
              kicker: "Error",
              lead: "Something",
              accent: "went wrong.",
              sub: "Try again in a moment, or write me: manu.uhila@taiyka.com.",
              showFunnel: false,
            },
          },
        };

  const c = t.copy[status];

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

        <p className="mt-5 mb-3 font-mono text-[11px] tracking-[0.22em] uppercase text-primary">
          {c.kicker}
        </p>

        <h1 className="mb-6 text-balance font-bold tracking-[-0.04em] leading-[0.96] text-[clamp(2rem,7vw,3.75rem)]">
          {c.lead} <span className="text-gradient-hero">{c.accent}</span>
        </h1>

        <p className="mb-12 md:mb-16 text-balance text-[1rem] md:text-[1.0625rem] leading-relaxed text-muted-foreground max-w-[54ch] mx-auto">
          {c.sub}
        </p>

        <div className="hairline mb-14 md:mb-20" />

        {c.showFunnel ? (
          <div className="flex flex-col items-center gap-2 text-sm">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground mb-1">
              {t.waitingKicker}
            </p>
            <Link
              href={withLang("/qcm", lang)}
              className="text-primary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
            >
              {t.ctaQcm}
            </Link>
            <Link
              href={withLang("/skool", lang)}
              className="text-primary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
            >
              {t.ctaSkool}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-sm">
            <Link
              href={withLang("/brief", lang)}
              className="text-primary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
            >
              {t.ctaBrief}
            </Link>
          </div>
        )}

        <footer className="mt-auto pt-12 border-t border-border text-xs text-muted-foreground flex flex-wrap justify-center gap-y-2 gap-x-4">
          <span>© {new Date().getFullYear()} · @manu_ai.to</span>
        </footer>
      </div>
    </main>
  );
}
