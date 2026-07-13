import { cn } from "@/lib/utils";

type Lang = "fr" | "en";

type Featured = {
  title: string;
  take: string;
  source: string;
};

type Quick = {
  text: string;
  source: string;
};

type Copy = {
  cardKicker: string;
  issueLabel: string;
  featuredLabel: string;
  briefLabel: string;
  featured: Featured[];
  quick: Quick[];
  footerLine: string;
};

// Format C: 3-4 "À la une" featured stories (title + 2-line take) followed by
// an "En bref" quick-hits list. Mirrors what the every-2-days pipeline renders
// (see funnel/n8n-workflows/le-brief-every2days.json).
const COPY: Record<Lang, Copy> = {
  fr: {
    cardKicker: "LE BRIEF · #042",
    issueLabel: "Numéro type",
    featuredLabel: "À la une",
    briefLabel: "En bref",
    featured: [
      {
        title: "Anthropic sort Claude Opus 4.8",
        take: "Contexte 1M tokens, moins cher. Taillé pour les workflows longs et l'analyse de gros documents.",
        source: "anthropic.com",
      },
      {
        title: "n8n ajoute un node agent IA natif",
        take: "Un vrai node agent, sans bricolage. Simplifie les automatisations multi-étapes.",
        source: "n8n.io",
      },
      {
        title: "OpenAI rachète une startup d'agents",
        take: "Deal à 2 Md$ pour accélérer sur les agents autonomes. Signal fort sur la direction du marché.",
        source: "reuters.com",
      },
    ],
    quick: [
      { text: "Un prompt pour automatiser ta veille concurrentielle.", source: "manu_ai.to" },
      { text: "Mistral sort un modèle open 24B qui bat GPT-4o-mini.", source: "mistral.ai" },
      { text: "Cursor 2.0 arrive avec un mode multi-agent.", source: "cursor.sh" },
      { text: "Perplexity lève 500M$ pour son moteur de recherche IA.", source: "techcrunch.com" },
    ],
    footerLine: "→ 2 min de lecture · pas de pub · pas de spam",
  },
  en: {
    cardKicker: "LE BRIEF · #042",
    issueLabel: "Sample issue",
    featuredLabel: "Featured",
    briefLabel: "In brief",
    featured: [
      {
        title: "Anthropic ships Claude Opus 4.8",
        take: "1M token context, cheaper. Built for long workflows and large-document analysis.",
        source: "anthropic.com",
      },
      {
        title: "n8n adds a native AI agent node",
        take: "A real agent node, no hacks. Simplifies multi-step automations.",
        source: "n8n.io",
      },
      {
        title: "OpenAI acquires an agents startup",
        take: "$2B deal to accelerate on autonomous agents. A strong signal on where the market is heading.",
        source: "reuters.com",
      },
    ],
    quick: [
      { text: "A prompt to automate your competitor watch.", source: "manu_ai.to" },
      { text: "Mistral drops an open 24B model that beats GPT-4o-mini.", source: "mistral.ai" },
      { text: "Cursor 2.0 lands with a multi-agent mode.", source: "cursor.sh" },
      { text: "Perplexity raises $500M for its AI search engine.", source: "techcrunch.com" },
    ],
    footerLine: "→ 2-min read · no ads · no spam",
  },
};

export default function SampleIssuePreview({ lang }: { lang: Lang }) {
  const c = COPY[lang];

  return (
    <article
      className={cn(
        "relative w-full max-w-md mx-auto rounded-lg border border-border bg-card/40 p-5 md:p-6 text-left shadow-glow",
        "shadow-hud-inset"
      )}
      aria-label={lang === "fr" ? "Aperçu d'un numéro" : "Sample issue preview"}
    >
      {/* HUD brackets — match featured tile aesthetic */}
      <span aria-hidden className="pointer-events-none absolute left-1.5 top-1.5 h-2.5 w-2.5 border-l border-t border-[var(--hud-bracket-dim)]" />
      <span aria-hidden className="pointer-events-none absolute right-1.5 top-1.5 h-2.5 w-2.5 border-r border-t border-[var(--hud-bracket-dim)]" />
      <span aria-hidden className="pointer-events-none absolute left-1.5 bottom-1.5 h-2.5 w-2.5 border-l border-b border-[var(--hud-bracket-dim)]" />
      <span aria-hidden className="pointer-events-none absolute right-1.5 bottom-1.5 h-2.5 w-2.5 border-r border-b border-[var(--hud-bracket-dim)]" />

      {/* Card header — mimics email subject + date */}
      <header className="mb-4 flex items-center justify-between gap-3 pb-3 border-b border-border/60">
        <span className="font-mono-hud text-[10px] tracking-[0.22em] uppercase text-primary">
          {c.cardKicker}
        </span>
        <span className="font-mono-hud text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
          {c.issueLabel}
        </span>
      </header>

      {/* À la une — featured stories with a short take */}
      <p className="font-mono-hud text-[10px] tracking-[0.22em] uppercase text-primary/80 mb-3">
        {c.featuredLabel}
      </p>
      <ol className="flex flex-col gap-3.5">
        {c.featured.map((item, idx) => (
          <li key={item.title} className="flex gap-3">
            <span
              aria-hidden
              className="font-mono-hud text-[10px] tabular-nums tracking-[0.22em] uppercase text-primary/70 pt-0.5 shrink-0"
            >
              {String(idx + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="text-[0.9rem] md:text-[0.95rem] font-semibold leading-snug text-[#e8f0fe]">
                {item.title}
              </p>
              <p className="text-[0.8rem] leading-snug text-muted-foreground">
                {item.take}
              </p>
              <span className="font-mono-hud text-[10px] tracking-[0.18em] uppercase text-primary/60">
                {item.source}
              </span>
            </div>
          </li>
        ))}
      </ol>

      {/* En bref — quick hits */}
      <p className="font-mono-hud text-[10px] tracking-[0.22em] uppercase text-primary/80 mt-5 mb-3 pt-4 border-t border-border/60">
        {c.briefLabel}
      </p>
      <ul className="flex flex-col gap-2.5">
        {c.quick.map((item) => (
          <li key={item.text} className="flex gap-2.5">
            <span aria-hidden className="text-primary/70 text-[0.85rem] leading-snug shrink-0">
              •
            </span>
            <p className="text-[0.82rem] leading-snug text-[#cdd8ea] min-w-0">
              {item.text}{" "}
              <span className="font-mono-hud text-[10px] tracking-[0.14em] uppercase text-muted-foreground/70">
                — {item.source}
              </span>
            </p>
          </li>
        ))}
      </ul>

      {/* Footer meta */}
      <p className="mt-5 pt-4 border-t border-border/60 text-[11px] text-muted-foreground/70 text-center">
        {c.footerLine}
      </p>
    </article>
  );
}
