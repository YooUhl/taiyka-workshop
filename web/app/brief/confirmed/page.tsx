import Link from "next/link";
import type { Metadata } from "next";
import { withLang } from "@/lib/lang-utils";

type Lang = "fr" | "en";
type ConfirmStatus = "confirmed" | "already" | "invalid" | "error";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const metadata: Metadata = {
  title: "Inscription · Le Brief",
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
  searchParams: Promise<{ status?: string; lang?: string; token?: string }>;
}) {
  const sp = await searchParams;
  const lang: Lang = sp?.lang === "en" ? "en" : "fr";

  // Two modes:
  //  - confirm : arrived from the email GET link with a token, no status yet.
  //              Show a button that POSTs to /api/brief/confirm (P1-1).
  //  - outcome : arrived after the POST flip, with ?status=.
  const token = sp?.token ?? "";
  const isConfirmMode = !sp?.status && UUID_RE.test(token);

  const t =
    lang === "fr"
      ? {
          topHome: "← L'Atelier · Accueil",
          kicker: "LE BRIEF · INSCRIPTION",
          waitingKicker: "En attendant",
          ctaQcm: "Fais le QCM — 2 min, voir ton profil →",
          ctaSkool: "Entrer dans la communauté Skool →",
          ctaBrief: "Retour à la page du brief →",
          confirm: {
            kicker: "Dernière étape",
            lead: "Confirme",
            accent: "ton inscription.",
            sub: "Un clic sur le bouton et tu es dans la liste. On ne t'ajoute qu'après cette confirmation.",
            button: "Confirmer mon inscription",
          },
          copy: {
            confirmed: {
              kicker: "✓ Confirmé",
              lead: "C'est bon,",
              accent: "t'es dans la liste.",
              sub: "Premier numéro d'ici deux jours. En français, en 2 minutes.",
              showFunnel: true,
            },
            already: {
              kicker: "✓ Déjà confirmé",
              lead: "T'étais déjà",
              accent: "dans la liste.",
              sub: "Rien à faire — prochain numéro d'ici deux jours.",
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
          confirm: {
            kicker: "Last step",
            lead: "Confirm",
            accent: "your subscription.",
            sub: "One click and you're on the list. We only add you after this confirmation.",
            button: "Confirm my subscription",
          },
          copy: {
            confirmed: {
              kicker: "✓ Confirmed",
              lead: "You're all set,",
              accent: "you're on the list.",
              sub: "First issue within two days. In French, in 2 minutes.",
              showFunnel: true,
            },
            already: {
              kicker: "✓ Already confirmed",
              lead: "You were already",
              accent: "on the list.",
              sub: "Nothing to do — next issue within two days.",
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

  const status = normalizeStatus(sp?.status);
  const c = isConfirmMode ? t.confirm : t.copy[status];
  const showFunnel = !isConfirmMode && (t.copy[status] as { showFunnel: boolean }).showFunnel;
  // Preserve lang on the POST target so the outcome page stays in-language.
  const confirmAction = `/api/brief/confirm?token=${encodeURIComponent(token)}${
    lang === "en" ? "&lang=en" : ""
  }`;

  return (
    <main className="relative flex-1 w-full flex flex-col z-10 paper-grid">
      <div
        className="relative mx-auto w-full max-w-2xl px-6 md:px-10 py-12 md:py-20 flex flex-col flex-1"
        style={{ opacity: 0, animation: "qcm-fade-in 400ms ease-out forwards" }}
      >
        {/* Top bar */}
        <div className="w-full flex items-center justify-start mb-16 md:mb-24 font-mono-hud text-[10px] sm:text-[11px] tracking-[0.18em] uppercase">
          <Link
            href={withLang("/", lang)}
            className="inline-flex items-center min-h-[44px] text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
          >
            {t.topHome}
          </Link>
        </div>

        <span className="kicker">{t.kicker}</span>

        <p className="kicker kicker-accent kicker-bare mt-8 mb-4">{c.kicker}</p>

        <h1 className="mb-6 display-lg text-foreground text-balance">
          {c.lead} <span className="text-primary">{c.accent}</span>
        </h1>

        <p className="mb-12 md:mb-16 text-balance text-[1.0625rem] md:text-[1.125rem] leading-[1.6] text-muted-foreground max-w-[54ch]">
          {c.sub}
        </p>

        {isConfirmMode && (
          <form method="post" action={confirmAction} className="mb-12 md:mb-16">
            <button
              type="submit"
              className="inline-flex h-14 items-center justify-center rounded-none bg-primary px-8 text-primary-foreground font-bold text-base md:text-lg tracking-tight transition-colors hover:bg-[#33b8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]"
            >
              {t.confirm.button}
            </button>
          </form>
        )}

        <div className="hairline mb-12 md:mb-16" />

        {showFunnel ? (
          <div className="flex flex-col items-start gap-1">
            <p className="kicker kicker-bare mb-2">{t.waitingKicker}</p>
            <Link
              href={withLang("/qcm", lang)}
              className="inline-flex items-center min-h-[44px] text-[0.95rem] text-primary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
            >
              {t.ctaQcm}
            </Link>
            <Link
              href={withLang("/skool", lang)}
              className="inline-flex items-center min-h-[44px] text-[0.95rem] text-primary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
            >
              {t.ctaSkool}
            </Link>
          </div>
        ) : !isConfirmMode ? (
          <div className="flex flex-col items-start">
            <Link
              href={withLang("/brief", lang)}
              className="inline-flex items-center min-h-[44px] text-[0.95rem] text-primary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
            >
              {t.ctaBrief}
            </Link>
          </div>
        ) : null}

        <footer className="mt-auto pt-10 border-t border-border font-mono-hud text-[10px] tracking-[0.18em] uppercase text-muted-foreground flex flex-wrap gap-y-2 gap-x-4">
          <span>© {new Date().getFullYear()} · @manu_ai.to</span>
        </footer>
      </div>
    </main>
  );
}
