import Link from "next/link";
import type { Metadata } from "next";
import { withLang } from "@/lib/lang-utils";

type Lang = "fr" | "en";
type UnsubStatus = "done" | "invalid" | "error";

export const metadata: Metadata = {
  title: "Désinscription · Le Brief · L'Atelier",
  robots: { index: false, follow: false },
};

function normalizeStatus(raw: string | undefined): UnsubStatus {
  if (raw === "done" || raw === "invalid" || raw === "error") return raw;
  return "invalid";
}

// The one-click unsubscribe link in every issue hits /api/brief/unsubscribe,
// which flips the row and redirects here with ?status=. This page only renders
// the outcome — no form, no client fetch.
export default async function UnsubscribePage({
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
          kicker: "DÉSINSCRIPTION · LE BRIEF",
          ctaHome: "Retour à l'accueil →",
          ctaBrief: "Voir la page du brief →",
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
          {c.badge}
        </p>

        <h1 className="mb-6 text-balance font-bold tracking-[-0.04em] leading-[0.96] text-[clamp(2rem,7vw,3.75rem)]">
          {c.lead} <span className="text-gradient-hero">{c.accent}</span>
        </h1>

        <p className="mb-12 md:mb-16 text-balance text-[1rem] md:text-[1.0625rem] leading-relaxed text-muted-foreground max-w-[54ch] mx-auto">
          {c.sub}
        </p>

        <div className="hairline mb-14 md:mb-20" />

        <div className="flex flex-col items-center gap-2 text-sm">
          <Link
            href={withLang("/", lang)}
            className="text-primary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
          >
            {t.ctaHome}
          </Link>
          <Link
            href={withLang("/brief", lang)}
            className="text-primary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
          >
            {t.ctaBrief}
          </Link>
        </div>

        <footer className="mt-auto pt-12 border-t border-border text-xs text-muted-foreground flex flex-wrap justify-center gap-y-2 gap-x-4">
          <span>© {new Date().getFullYear()} · @manu_ai.to</span>
        </footer>
      </div>
    </main>
  );
}
