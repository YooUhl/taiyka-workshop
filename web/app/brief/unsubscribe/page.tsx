import Link from "next/link";
import type { Metadata } from "next";
import { withLang } from "@/lib/lang-utils";

type Lang = "fr" | "en";
type UnsubStatus = "done" | "invalid" | "error";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const metadata: Metadata = {
  title: "Désinscription · Le Brief · L'Atelier",
  robots: { index: false, follow: false },
};

function normalizeStatus(raw: string | undefined): UnsubStatus {
  if (raw === "done" || raw === "invalid" || raw === "error") return raw;
  return "invalid";
}

// The footer link (GET) forwards here with ?token= and no status: we show a
// confirm button that POSTs to /api/brief/unsubscribe (so mail scanners can't
// unsubscribe people by prefetching the link). After the POST flip the route
// redirects back here with ?status= and we render the outcome.
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; lang?: string; token?: string }>;
}) {
  const sp = await searchParams;
  const lang: Lang = sp?.lang === "en" ? "en" : "fr";

  const token = sp?.token ?? "";
  const isConfirmMode = !sp?.status && UUID_RE.test(token);
  const status = normalizeStatus(sp?.status);

  const t =
    lang === "fr"
      ? {
          topHome: "← L'Atelier · Accueil",
          kicker: "DÉSINSCRIPTION · LE BRIEF",
          ctaHome: "Retour à l'accueil →",
          ctaBrief: "Voir la page du brief →",
          confirm: {
            badge: "Confirmer",
            lead: "Te désinscrire",
            accent: "de Le Brief ?",
            sub: "Un clic et tu ne reçois plus rien. Tu pourras toujours revenir.",
            button: "Confirmer la désinscription",
          },
          copy: {
            done: {
              badge: "✓ TERMINÉ",
              lead: "On t'enlève",
              accent: "de la liste.",
              sub: "Plus aucun mail. Si tu changes d'avis, le formulaire d'inscription est toujours là.",
            },
            invalid: {
              badge: "Lien invalide",
              lead: "Ce lien est",
              accent: "invalide ou expiré.",
              sub: "Si tu reçois encore des mails, écris-moi : manu.uhila@taiyka.com.",
            },
            error: {
              badge: "Erreur",
              lead: "Une erreur",
              accent: "est survenue.",
              sub: "Réessaie dans un instant, ou écris-moi : manu.uhila@taiyka.com.",
            },
          },
        }
      : {
          topHome: "← The Workshop · Home",
          kicker: "UNSUBSCRIBE · LE BRIEF",
          ctaHome: "Back to home →",
          ctaBrief: "See the brief page →",
          confirm: {
            badge: "Confirm",
            lead: "Unsubscribe",
            accent: "from Le Brief?",
            sub: "One click and you stop receiving it. You can always come back.",
            button: "Confirm unsubscribe",
          },
          copy: {
            done: {
              badge: "✓ DONE",
              lead: "You're off",
              accent: "the list.",
              sub: "No more emails. If you change your mind, the signup form is still there.",
            },
            invalid: {
              badge: "Invalid link",
              lead: "This link is",
              accent: "invalid or expired.",
              sub: "If you still get emails, write me: manu.uhila@taiyka.com.",
            },
            error: {
              badge: "Error",
              lead: "Something",
              accent: "went wrong.",
              sub: "Try again in a moment, or write me: manu.uhila@taiyka.com.",
            },
          },
        };

  const c = isConfirmMode ? t.confirm : t.copy[status];
  const unsubAction = `/api/brief/unsubscribe?token=${encodeURIComponent(token)}${
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

        <p className="kicker kicker-bare mt-8 mb-4">{c.badge}</p>

        <h1 className="mb-6 display-lg text-foreground text-balance">
          {c.lead} <span className="text-glacier-blue">{c.accent}</span>
        </h1>

        <p className="mb-12 md:mb-16 text-balance text-[1.0625rem] md:text-[1.125rem] leading-[1.6] text-muted-foreground max-w-[54ch]">
          {c.sub}
        </p>

        {isConfirmMode && (
          <form method="post" action={unsubAction} className="mb-12 md:mb-16">
            <button
              type="submit"
              className="card-line inline-flex h-14 items-center justify-center px-8 text-foreground font-semibold text-base md:text-lg tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]"
            >
              {t.confirm.button}
            </button>
          </form>
        )}

        <div className="hairline mb-12 md:mb-16" />

        {!isConfirmMode && (
          <div className="flex flex-col items-start gap-1">
            <Link
              href={withLang("/", lang)}
              className="inline-flex items-center min-h-[44px] text-[0.95rem] text-primary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
            >
              {t.ctaHome}
            </Link>
            <Link
              href={withLang("/brief", lang)}
              className="inline-flex items-center min-h-[44px] text-[0.95rem] text-primary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
            >
              {t.ctaBrief}
            </Link>
          </div>
        )}

        <footer className="mt-auto pt-10 border-t border-border font-mono-hud text-[10px] tracking-[0.18em] uppercase text-muted-foreground flex flex-wrap gap-y-2 gap-x-4">
          <span>© {new Date().getFullYear()} · @manu_ai.to</span>
        </footer>
      </div>
    </main>
  );
}
