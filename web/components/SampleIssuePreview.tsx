import { cn } from "@/lib/utils";

type Lang = "fr" | "en";

type Story = {
  headline: string;
  take: string;
  source: string;
};

type Copy = {
  cardKicker: string;
  issueLabel: string;
  stories: [Story, Story];
  moreLine: string;
  footerLine: string;
};

const COPY: Record<Lang, Copy> = {
  fr: {
    cardKicker: "AI NEWS · #042",
    issueLabel: "Mardi 12 nov · 7h00",
    stories: [
      {
        headline: "Anthropic sort Claude Opus 4.7 — 1M tokens de contexte",
        take:
          "Pour la première fois un modèle frontier accepte des codebases entières d'un seul coup. Si tu codes avec Claude Code, tes sessions vont durer 3x plus longtemps sans /compact.",
        source: "anthropic.com",
      },
      {
        headline: "OpenAI lance les Agents Apps — un App Store pour GPT",
        take:
          "Sam Altman dévoile un marketplace où n'importe qui peut publier un agent monétisable. C'est le moment de bâtir le tien — la fenêtre va se fermer vite.",
        source: "openai.com",
      },
    ],
    moreLine: "+ 3 autres news ce matin-là",
    footerLine: "→ 5 min de lecture · pas de pub · pas de spam",
  },
  en: {
    cardKicker: "AI NEWS · #042",
    issueLabel: "Tue Nov 12 · 7:00 AM",
    stories: [
      {
        headline: "Anthropic ships Claude Opus 4.7 — 1M token context",
        take:
          "For the first time a frontier model takes entire codebases in one shot. If you code with Claude Code, your sessions just got 3x longer without /compact.",
        source: "anthropic.com",
      },
      {
        headline: "OpenAI launches Agent Apps — an App Store for GPTs",
        take:
          "Sam Altman unveils a marketplace where anyone can publish a monetizable agent. Now is the moment to build yours — the window closes fast.",
        source: "openai.com",
      },
    ],
    moreLine: "+ 3 more stories that morning",
    footerLine: "→ 5 min read · no ads · no spam",
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

      {/* Stories */}
      <ol className="flex flex-col gap-5">
        {c.stories.map((story, idx) => (
          <li key={story.headline} className="flex gap-3">
            <span
              aria-hidden
              className="font-mono-hud text-[10px] tabular-nums tracking-[0.22em] uppercase text-primary/70 pt-1 shrink-0"
            >
              {String(idx + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-1.5 min-w-0">
              <h3 className="text-[0.95rem] md:text-[1rem] leading-snug font-semibold text-[#e8f0fe]">
                {story.headline}
              </h3>
              <p className="text-[0.875rem] leading-[1.55] text-muted-foreground">
                {story.take}
              </p>
              <span className="font-mono-hud text-[10px] tracking-[0.18em] uppercase text-muted-foreground/70">
                {story.source}
              </span>
            </div>
          </li>
        ))}
      </ol>

      {/* + more line */}
      <p className="mt-5 pt-4 border-t border-border/60 font-mono-hud text-[11px] tracking-[0.18em] uppercase text-muted-foreground/80 text-center">
        {c.moreLine}
      </p>

      {/* Footer meta */}
      <p className="mt-3 text-[11px] text-muted-foreground/70 text-center">
        {c.footerLine}
      </p>
    </article>
  );
}
