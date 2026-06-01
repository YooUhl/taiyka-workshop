import type { LucideIcon } from "lucide-react";
import {
  Box,
  Braces,
  Bug,
  Cloud,
  Code,
  Database,
  Dumbbell,
  FileCode,
  Funnel,
  Layers,
  Megaphone,
  MessageCircle,
  Palette,
  Quote,
  Sheet,
  Sparkles,
  Telescope,
  Terminal,
  Workflow,
} from "lucide-react";
import type { Lang, PortfolioProject } from "@/lib/portfolio";

type Props = {
  project: PortfolioProject;
  lang: Lang;
};

const LABELS = {
  fr: {
    problem: "PROBLÈME",
    solution: "SOLUTION",
    stack: "STACK",
    telemetry: "TELEMETRY LOG",
  },
  en: {
    problem: "PROBLEM",
    solution: "SOLUTION",
    stack: "STACK",
    telemetry: "TELEMETRY LOG",
  },
};

export type ProjectMeta = {
  codename: string;
  statusPill: string;
  icon: LucideIcon;
  metrics: { value: string; label: string }[];
};

export const PROJECT_META: Record<string, ProjectMeta> = {
  polymaker: {
    codename: "POLY-INTEL-01",
    statusPill: "LIVE · OPS",
    icon: Telescope,
    metrics: [
      { value: "7", label: "PLATFORMS" },
      { value: "1K+", label: "ASSETS/WK" },
      { value: "12H", label: "SAVED/WK" },
    ],
  },
  "ufc-gym": {
    codename: "UFC-WALLIS",
    statusPill: "LIVE · PROD",
    icon: Dumbbell,
    metrics: [
      { value: "<5s", label: "CHECK-IN" },
      { value: "0", label: "MANUAL F-UP" },
      { value: "100%", label: "OFFLINE-OK" },
    ],
  },
  "content-system": {
    codename: "CONTENT-PIPELINE",
    statusPill: "LIVE · DAILY",
    icon: Megaphone,
    metrics: [
      { value: "10MIN", label: "SCRIPT TIME" },
      { value: "20+", label: "REF POSTS" },
      { value: "1×", label: "VOICE MATCH" },
    ],
  },
  "lead-pipeline": {
    codename: "LEAD-PIPELINE",
    statusPill: "LIVE · DAILY",
    icon: Funnel,
    metrics: [
      { value: "6", label: "PLATFORMS" },
      { value: "0", label: "DUPES" },
      { value: "1×/D", label: "RUNS" },
    ],
  },
};

export const FALLBACK_META: ProjectMeta = {
  codename: "PROJECT",
  statusPill: "LIVE",
  icon: Box,
  metrics: [],
};

export function getProjectMeta(slug: string): ProjectMeta {
  return PROJECT_META[slug] ?? { ...FALLBACK_META, codename: slug.toUpperCase() };
}

const TECH_ICONS: Array<[string, LucideIcon]> = [
  ["claude code", Terminal],
  ["claude api", Sparkles],
  ["claude", Sparkles],
  ["anthropic", Sparkles],
  ["custom skills", FileCode],
  ["python", Code],
  ["apify", Bug],
  ["n8n", Workflow],
  ["supabase", Database],
  ["google sheets", Sheet],
  ["next.js", Layers],
  ["typescript", Braces],
  ["tailwind", Palette],
  ["shadcn", Box],
  ["vercel", Cloud],
  ["whatsapp", MessageCircle],
  ["scraped", Quote],
  ["style guide", Quote],
];

function resolveTechIcon(tech: string): LucideIcon {
  const normalized = tech.toLowerCase().trim();
  for (const [key, icon] of TECH_ICONS) {
    if (normalized.includes(key)) return icon;
  }
  return Box;
}

function splitTechLabel(tech: string): string {
  return tech.replace(/\s*\([^)]*\)\s*/g, "").trim();
}

export default function PortfolioDetail({ project, lang }: Props) {
  const content = project[lang];
  const labels = LABELS[lang];
  const meta = getProjectMeta(project.slug);
  const HeroIcon = meta.icon;

  return (
    <article className="relative overflow-hidden rounded-lg border border-primary/50 bg-card/60 shadow-[0_0_36px_rgba(0,166,255,0.22)]">
      {/* HUD corner brackets */}
      <span aria-hidden className="pointer-events-none absolute left-2 top-2 z-10 h-3 w-3 border-l border-t border-primary animate-hud-bracket-pulse" />
      <span aria-hidden className="pointer-events-none absolute right-2 top-2 z-10 h-3 w-3 border-r border-t border-primary animate-hud-bracket-pulse" />
      <span aria-hidden className="pointer-events-none absolute left-2 bottom-2 z-10 h-3 w-3 border-l border-b border-primary animate-hud-bracket-pulse" />
      <span aria-hidden className="pointer-events-none absolute right-2 bottom-2 z-10 h-3 w-3 border-r border-b border-primary animate-hud-bracket-pulse" />

      {/* Ambient diagram SVG — faded background */}
      {project.diagramSvg && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.07] grayscale [&_svg]:w-full [&_svg]:h-full [&_svg]:object-cover"
          style={{
            maskImage: "radial-gradient(ellipse at center, #000 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, #000 30%, transparent 80%)",
          }}
          dangerouslySetInnerHTML={{ __html: project.diagramSvg }}
        />
      )}

      {/* Top console bar */}
      <div className="relative z-10 flex items-center justify-between gap-3 border-b border-border/60 px-5 py-3 font-mono-hud text-[10px] tracking-[0.22em] uppercase">
        <span className="inline-flex items-center gap-2 text-primary">
          <span
            aria-hidden
            className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-hud-bracket-pulse"
          />
          {meta.statusPill}
        </span>
        <span className="text-muted-foreground/80">{meta.codename}</span>
      </div>

      <div className="relative z-10 flex flex-col gap-5 px-5 md:px-6 py-5 md:py-6">
        <header className="flex items-start gap-4">
          <div
            aria-hidden
            className="shrink-0 grid place-items-center rounded-md border border-primary/30 bg-primary/[0.06] w-14 h-14"
          >
            <HeroIcon className="text-primary" strokeWidth={1.4} size={32} />
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <h2
              id="portfolio-detail-title"
              tabIndex={-1}
              className="text-lg md:text-xl font-bold leading-tight tracking-tight text-foreground focus:outline-none"
            >
              {content.title}
            </h2>
            {content.tagline && (
              <p className="text-sm leading-snug text-muted-foreground">
                {content.tagline}
              </p>
            )}
          </div>
        </header>

        {meta.metrics.length > 0 && (
          <div className="grid grid-cols-3 gap-2 border-y border-border/40 py-3">
            {meta.metrics.map((m) => (
              <div key={m.label} className="flex flex-col items-center text-center gap-1">
                <span
                  className="font-display-hud text-2xl md:text-3xl leading-none text-primary tabular-nums"
                  style={{ textShadow: "0 0 16px rgba(0,166,255,0.35)" }}
                >
                  {m.value}
                </span>
                <span className="font-mono-hud text-[9px] tracking-[0.22em] uppercase text-muted-foreground/80">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 text-sm">
          {content.problem && (
            <div className="flex gap-2">
              <span aria-hidden className="font-mono-hud text-[10px] tracking-[0.22em] uppercase text-primary/80 shrink-0 mt-0.5">
                ▸ {labels.problem}
              </span>
              <p className="text-card-foreground/90 leading-snug">
                {content.problem}
              </p>
            </div>
          )}
          {content.solution && (
            <div className="flex gap-2">
              <span aria-hidden className="font-mono-hud text-[10px] tracking-[0.22em] uppercase text-primary/80 shrink-0 mt-0.5">
                ▸ {labels.solution}
              </span>
              <p className="text-card-foreground/90 leading-snug">
                {content.solution}
              </p>
            </div>
          )}
        </div>

        {content.stack.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="font-mono-hud text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
              ▸ {labels.stack}
            </span>
            <div className="flex flex-wrap gap-2">
              {content.stack.map((tech) => {
                const Icon = resolveTechIcon(tech);
                return (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 rounded border border-border/60 bg-card/40 px-2 py-1 font-mono-hud text-[10px] tracking-[0.1em] uppercase text-muted-foreground"
                    title={tech}
                  >
                    <Icon size={12} strokeWidth={1.5} aria-hidden />
                    {splitTechLabel(tech)}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {content.outcome.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-border/40 pt-3">
            <span className="font-mono-hud text-[10px] tracking-[0.22em] uppercase text-[var(--hud-tick)]">
              ─── {labels.telemetry}
            </span>
            <ul className="flex flex-col gap-1.5 text-sm text-card-foreground/90">
              {content.outcome.map((item, i) => (
                <li key={i} className="flex gap-2 leading-snug">
                  <span aria-hidden className="text-primary/80 shrink-0 mt-0.5 font-mono-hud text-xs">
                    ▸
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
