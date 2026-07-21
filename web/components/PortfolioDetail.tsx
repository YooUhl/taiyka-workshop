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
    <article className="relative overflow-hidden rounded-none border border-border bg-card shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
      {/* Accent edge — single blue rule across the top of the sheet */}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-primary" />

      {/* Ambient diagram SVG — quiet blueprint texture behind the sheet */}
      {project.diagramSvg && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.06] [&_svg]:w-full [&_svg]:h-full [&_svg]:object-cover"
          dangerouslySetInnerHTML={{ __html: project.diagramSvg }}
        />
      )}

      {/* Top meta bar */}
      <div className="relative z-10 flex items-center justify-between gap-3 border-b border-border bg-arctic-navy/50 px-5 py-3 font-mono-hud text-[10px] tracking-[0.18em] uppercase">
        <span className="inline-flex items-center gap-2 text-primary">
          <span aria-hidden className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
          {meta.statusPill}
        </span>
        <span className="text-muted-foreground">{meta.codename}</span>
      </div>

      <div className="relative z-10 flex flex-col gap-6 px-5 md:px-7 py-6 md:py-8">
        <header className="flex items-start gap-4">
          <div
            aria-hidden
            className="shrink-0 grid place-items-center rounded-none border border-primary/40 bg-arctic-navy w-14 h-14"
          >
            <HeroIcon className="text-primary" strokeWidth={1.4} size={32} />
          </div>
          <div className="flex flex-col gap-1.5 min-w-0">
            <h2
              id="portfolio-detail-title"
              tabIndex={-1}
              className="display-md display-caps text-foreground focus:outline-none"
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
          <div className="grid grid-cols-3 gap-2 border-y border-border py-5">
            {meta.metrics.map((m) => (
              <div key={m.label} className="flex flex-col items-center text-center gap-1.5">
                <span className="text-2xl md:text-3xl font-bold leading-none tracking-tight text-primary tabular-nums">
                  {m.value}
                </span>
                <span className="font-mono-hud text-[9px] tracking-[0.18em] uppercase text-muted-foreground">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-5 text-sm">
          {content.problem && (
            <div className="flex flex-col gap-2">
              <span aria-hidden className="kicker kicker-accent">
                {labels.problem}
              </span>
              <p className="text-card-foreground leading-relaxed">
                {content.problem}
              </p>
            </div>
          )}
          {content.solution && (
            <div className="flex flex-col gap-2">
              <span aria-hidden className="kicker kicker-accent">
                {labels.solution}
              </span>
              <p className="text-card-foreground leading-relaxed">
                {content.solution}
              </p>
            </div>
          )}
        </div>

        {content.stack.length > 0 && (
          <div className="flex flex-col gap-3">
            <span className="kicker">{labels.stack}</span>
            <div className="flex flex-wrap gap-2">
              {content.stack.map((tech) => {
                const Icon = resolveTechIcon(tech);
                return (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-arctic-navy/60 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.1em] uppercase text-muted-foreground"
                    title={tech}
                  >
                    <Icon size={12} strokeWidth={1.5} aria-hidden className="text-glacier-blue" />
                    {splitTechLabel(tech)}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {content.outcome.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-border pt-5">
            <span className="kicker">{labels.telemetry}</span>
            <ul className="flex flex-col gap-2 text-sm text-card-foreground">
              {content.outcome.map((item, i) => (
                <li key={i} className="flex gap-3 leading-relaxed">
                  <span aria-hidden className="text-primary shrink-0 select-none">
                    —
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
