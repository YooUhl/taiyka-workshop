import Link from "next/link";
import { titleSlug, getStatusVariant, type Project } from "./_data";

export function TopBar() {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="mx-auto max-w-3xl px-5 md:px-6 py-6 md:py-7 text-center">
        <Link
          href="/manu-uhila-work-87k9"
          className="font-bold text-[#0A1628] text-base md:text-lg hover:text-[#0077cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077cc] focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:rounded-sm transition-colors motion-reduce:transition-none"
        >
          Yoan Uhila
        </Link>
      </div>
    </div>
  );
}

export function Hero({
  kicker = "Portfolio",
  title,
  meta = "Based in France · Building automation systems since 2024",
  compact = false,
}: {
  kicker?: string;
  title: string;
  meta?: string;
  compact?: boolean;
}) {
  const padding = compact ? "py-14 md:py-20" : "py-20 md:py-28";
  return (
    <section aria-labelledby="hero-heading" className="bg-[#0A1628] text-white">
      <div className={`mx-auto max-w-3xl px-5 md:px-6 ${padding} text-center`}>
        <p className="text-sm md:text-base font-semibold uppercase tracking-[0.24em] text-[#00A6FF] mb-5">
          {kicker}
        </p>
        <h1 id="hero-heading" className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {title}
        </h1>
        <p className="text-sm md:text-base text-slate-300 tracking-wide">
          {meta}
        </p>
      </div>
    </section>
  );
}

export function SectionPanel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 md:p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0077cc] mb-3">
        {label}
      </div>
      <p className="text-[15px] md:text-base text-slate-700 leading-relaxed">
        {children}
      </p>
    </div>
  );
}

export function BuildPanel({ bullets }: { bullets: string[] }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 md:p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0077cc] mb-3">
        Build
      </div>
      <ul className="space-y-2 text-[15px] md:text-base text-slate-700 leading-relaxed">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProjectCard({ p, position }: { p: Project; position: number }) {
  const slug = titleSlug(p.title);
  const variant = getStatusVariant(p.status);
  const positionLabel = String(position).padStart(2, "0");
  const isOwn = p.group === "own";
  return (
    <article
      id={slug}
      className="scroll-mt-24 border border-slate-200 rounded-xl bg-white p-6 md:p-8 shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-xs md:text-sm text-slate-400 tabular-nums tracking-[0.15em]">
          {positionLabel}
        </span>
        {!isOwn && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] md:text-xs font-medium uppercase tracking-wide shrink-0 ${variant.pillClasses}`}
          >
            <span aria-hidden className={`inline-block w-1.5 h-1.5 rounded-full ${variant.dotClasses}`} />
            {variant.label}
          </span>
        )}
      </div>
      <div className="mt-5">
        <div className="flex items-start gap-3">
          <p.icon
            aria-hidden
            className="text-[#00A6FF] mt-1 shrink-0"
            size={24}
            strokeWidth={1.75}
          />
          <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#0A1628] leading-tight">
            {p.title}
          </h3>
        </div>
        {isOwn && p.clientContext && (
          <p className="text-sm text-slate-600 leading-relaxed mt-1.5">
            {p.clientContext}
          </p>
        )}
      </div>

      <p className="text-[15px] md:text-base text-slate-600 leading-relaxed mt-4">
        {p.tagline}
      </p>

      {isOwn ? (
        <div className="mt-8 space-y-4">
          <SectionPanel label="Context">{p.context}</SectionPanel>
          <BuildPanel bullets={p.build} />
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {p.clientContext && (
            <SectionPanel label="Client description">{p.clientContext}</SectionPanel>
          )}
          {p.problem && (
            <SectionPanel label="Problem">{p.problem}</SectionPanel>
          )}
          {p.solution && (
            <SectionPanel label="Solution">{p.solution}</SectionPanel>
          )}
          <BuildPanel bullets={p.build} />
          {p.results && (
            <SectionPanel label="Results">{p.results}</SectionPanel>
          )}
        </div>
      )}

      {p.stack.length > 0 && (
        <div className="mt-8">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-3">
            Stack
          </div>
          <div className="flex flex-wrap gap-2">
            {p.stack.map((t) => (
              <span
                key={t}
                className="inline-block text-xs font-mono text-slate-600 bg-slate-100 rounded-full px-2.5 py-1"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 md:mt-20 pt-8 border-t border-slate-200 text-sm text-slate-500 text-center">
      <p>
        Contact at{" "}
        <a
          href="mailto:manu.uhila@taiyka.com"
          className="inline-block py-1 text-slate-700 underline decoration-[#00A6FF] underline-offset-4 hover:text-[#0077cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077cc] focus-visible:ring-offset-2 focus-visible:ring-offset-[#e8f0fb] focus-visible:rounded-sm transition-colors motion-reduce:transition-none"
        >
          manu.uhila@taiyka.com
        </a>
      </p>
    </footer>
  );
}
