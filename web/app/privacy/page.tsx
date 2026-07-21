import Link from "next/link";
import type { Metadata } from "next";
import { withLang } from "@/lib/lang-utils";
import { SITE } from "@/lib/site";

type Lang = "fr" | "en";

// Own canonical + description so the page stops inheriting the root metadata
// (which made it claim to be the homepage). No brand suffix in the title —
// the root layout's title template appends "— L'Atelier".
export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment Taiyka collecte et protège tes données pour la newsletter Le Brief : quelles données, pourquoi, combien de temps, et tes droits.",
  alternates: {
    canonical: `${SITE}/privacy`,
  },
  robots: { index: true, follow: true },
};

// Minimal, honest privacy notice for the Le Brief newsletter (CNIL/GDPR, P1-8).
// Kept in plain language on purpose. Update CONSENT_VERSION in the subscribe
// route when the substance here changes.
export default async function PrivacyPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const sp = await searchParams;
  const lang: Lang = sp?.lang === "en" ? "en" : "fr";

  const t =
    lang === "fr"
      ? {
          topHome: "← L'Atelier · Accueil",
          kicker: "CONFIDENTIALITÉ",
          title: "Politique de confidentialité",
          updated: "Dernière mise à jour : 15 juillet 2026",
          sections: [
            {
              h: "Qui est responsable",
              b: "Le responsable du traitement est Taiyka (Yoan-Manuulutea Uhila), SIRET 99291760900016, 180 Montée de Bellevue, 83210 Solliès-Pont, France. Contact : manu.uhila@taiyka.com.",
            },
            {
              h: "Quelles données et pourquoi",
              b: "Pour la newsletter Le Brief, on collecte ton adresse email, et techniquement ton adresse IP et ton navigateur (user-agent) au moment de l'inscription. Objectif unique : t'envoyer la newsletter et prouver ton consentement. Base légale : ton consentement (double opt-in).",
            },
            {
              h: "Combien de temps on les garde",
              b: "Tant que tu es inscrit. Si tu ne confirmes jamais ton inscription, la donnée est supprimée automatiquement après 30 jours. Si tu te désinscris, on conserve le minimum pour ne plus t'écrire.",
            },
            {
              h: "Qui les traite pour nous",
              b: "Des sous-traitants strictement techniques : Resend (envoi des emails), Supabase (stockage de la liste), Vercel (hébergement du site). Aucune donnée n'est vendue ni utilisée pour de la publicité tierce.",
            },
            {
              h: "Tes droits",
              b: "Tu peux accéder à tes données, les corriger, les supprimer, les récupérer, et retirer ton consentement à tout moment — la désinscription en un clic est dans chaque email. Pour toute demande : manu.uhila@taiyka.com. Tu peux aussi saisir la CNIL (cnil.fr).",
            },
          ],
          back: "Retour à la page du brief →",
        }
      : {
          topHome: "← The Workshop · Home",
          kicker: "PRIVACY",
          title: "Privacy policy",
          updated: "Last updated: 15 July 2026",
          sections: [
            {
              h: "Who is responsible",
              b: "The data controller is Taiyka (Yoan-Manuulutea Uhila), SIRET 99291760900016, 180 Montée de Bellevue, 83210 Solliès-Pont, France. Contact: manu.uhila@taiyka.com.",
            },
            {
              h: "What data and why",
              b: "For the Le Brief newsletter we collect your email address, and technically your IP address and browser (user-agent) at signup. Sole purpose: send you the newsletter and prove your consent. Legal basis: your consent (double opt-in).",
            },
            {
              h: "How long we keep it",
              b: "As long as you're subscribed. If you never confirm, the record is deleted automatically after 30 days. If you unsubscribe, we keep the minimum needed to not contact you again.",
            },
            {
              h: "Who processes it for us",
              b: "Strictly technical processors: Resend (email delivery), Supabase (list storage), Vercel (site hosting). No data is sold or used for third-party advertising.",
            },
            {
              h: "Your rights",
              b: "You can access, correct, delete, and export your data, and withdraw consent at any time — one-click unsubscribe is in every email. For any request: manu.uhila@taiyka.com. You may also lodge a complaint with the CNIL (cnil.fr).",
            },
          ],
          back: "Back to the brief page →",
        };

  return (
    <main className="relative flex-1 w-full flex flex-col z-10 bg-obsidian">
      <div
        className="relative mx-auto w-full max-w-3xl px-6 md:px-10 py-12 md:py-20 flex flex-col flex-1"
        style={{ opacity: 0, animation: "qcm-fade-in 400ms ease-out forwards" }}
      >
        <div className="w-full flex items-center justify-start mb-10 md:mb-14 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase">
          <Link
            href={withLang("/", lang)}
            className="inline-flex items-center min-h-[44px] text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
          >
            {t.topHome}
          </Link>
        </div>

        {/* The legal notice reads as a document: ice-white paper block on the
            obsidian page, comfortable measure, clear heading rhythm. */}
        <article className="panel-light rounded-none border border-border px-6 py-10 sm:px-10 md:px-14 md:py-16">
          {/* Plain .kicker here, not .kicker-accent: electric blue text on the
              ice-white panel fails AA. The blue "›" prefix carries the accent. */}
          <span className="kicker">{t.kicker}</span>

          <h1 className="display-md mt-4 mb-3 max-w-prose">{t.title}</h1>

          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
            {t.updated}
          </p>

          <div className="hairline my-10 md:my-12" />

          <div className="flex flex-col gap-10 md:gap-12">
            {t.sections.map((s) => (
              <section key={s.h} className="max-w-prose">
                <h2 className="mb-3 text-[1.125rem] md:text-[1.25rem] font-bold text-foreground">
                  {s.h}
                </h2>
                <p className="text-[1rem] leading-[1.75] text-muted-foreground">
                  {s.b}
                </p>
              </section>
            ))}
          </div>

          <div className="hairline my-10 md:my-12" />

          <Link
            href={withLang("/brief", lang)}
            className="inline-flex items-center min-h-[44px] text-sm font-medium text-primary underline decoration-2 decoration-[#00a6ff] underline-offset-4 hover:decoration-[#0b0f14] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f8fa] rounded-sm"
          >
            {t.back}
          </Link>
        </article>

        <footer className="mt-auto pt-12 border-t border-border text-xs text-muted-foreground flex flex-wrap justify-center gap-y-2 gap-x-4">
          <span>© {new Date().getFullYear()} · @manu_ai.to</span>
        </footer>
      </div>
    </main>
  );
}
