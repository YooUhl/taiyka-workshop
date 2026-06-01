import Link from "next/link";
import { listIdeas, listAllTags } from "@/lib/content/queries";
import {
  PLATFORMS,
  FORMATS,
  STATUSES,
  PRIORITIES,
  SORTS,
} from "@/lib/content/types";
import type {
  Platform,
  Format,
  Status,
  Priority,
  Sort,
} from "@/lib/content/types";
import { PILLARS, pillarLabel, type Pillar } from "@/lib/content/pillars";
import IdeaFilters from "./components/IdeaFilters";

type SearchParams = { [k: string]: string | string[] | undefined };

function pick<T extends string>(
  raw: string | string[] | undefined,
  allowed: readonly T[],
): T | undefined {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (typeof v !== "string") return undefined;
  return (allowed as readonly string[]).includes(v) ? (v as T) : undefined;
}

function str(raw: string | string[] | undefined): string | undefined {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return typeof v === "string" && v.trim() ? v : undefined;
}

const STATUS_STYLES: Record<Status, string> = {
  draft: "bg-[#8da2c0]/20 text-[#8da2c0] border-[#8da2c0]/30",
  scripted: "bg-[#a78bfa]/20 text-[#c4b5fd] border-[#a78bfa]/30",
  "in-production": "bg-[#f59e0b]/20 text-[#fcd34d] border-[#f59e0b]/30",
  edited: "bg-[#10b981]/20 text-[#6ee7b7] border-[#10b981]/30",
  ready: "bg-[#00a6ff]/20 text-[#00a6ff] border-[#00a6ff]/40",
  published: "bg-[#00e5ff]/20 text-[#00e5ff] border-[#00e5ff]/40",
  archived: "bg-white/5 text-[#8da2c0]/60 border-white/10",
};

const PRIORITY_STYLES: Record<Priority, string> = {
  high: "bg-red-500/15 text-red-300 border-red-500/30",
  medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  low: "bg-[#00a6ff]/10 text-[#8da2c0] border-white/10",
};

function shortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default async function ContentIdeasPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const q = str(sp.q);
  const platform = pick<Platform>(sp.platform, PLATFORMS);
  const format = pick<Format>(sp.format, FORMATS);
  const status = pick<Status>(sp.status, STATUSES);
  const pillar = pick<Pillar>(sp.pillar, PILLARS);
  const priority = pick<Priority>(sp.priority, PRIORITIES);
  const sort = pick<Sort>(sp.sort, SORTS);
  const tag = str(sp.tag);
  const scheduledFrom = str(sp.scheduledFrom);
  const scheduledTo = str(sp.scheduledTo);

  const [ideas, tagSuggestions] = await Promise.all([
    listIdeas({
      q,
      platform,
      format,
      status,
      pillar,
      priority,
      tag,
      scheduledFrom,
      scheduledTo,
      sort,
    }),
    listAllTags(),
  ]);

  const now = Date.now();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#00a6ff]">
            Content · Ideas
          </p>
          <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight md:text-3xl">
            {ideas.length} idea{ideas.length === 1 ? "" : "s"}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/tools/content/dump"
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-[#8da2c0] hover:border-[#00a6ff]/40 hover:text-[#e8f0fe]"
          >
            Brain dump
          </Link>
          <Link
            href="/tools/content/new"
            className="rounded-lg bg-gradient-to-r from-[#00a6ff] to-[#00e5ff] px-4 py-2 text-sm font-semibold text-[#0a1628] shadow-[0_0_20px_rgba(0,166,255,0.35)] hover:opacity-95"
          >
            + New idea
          </Link>
        </div>
      </div>

      <IdeaFilters
        initial={{
          q: q ?? "",
          platform,
          format,
          status,
          pillar,
          priority,
          tag: tag ?? "",
          scheduledFrom: scheduledFrom ?? "",
          scheduledTo: scheduledTo ?? "",
          sort,
        }}
        suggestions={tagSuggestions}
      />

      {ideas.length === 0 ? (
        <div className="rounded-2xl border border-[#00a6ff]/20 bg-[#0f1a2e]/60 p-8 text-center text-sm text-[#8da2c0]">
          No ideas yet. Hit{" "}
          <span className="text-[#00a6ff]">+ New idea</span> to capture one.
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/5 bg-[#0f1a2e]/40">
          {ideas.map((i) => {
            const pillarText = pillarLabel(i.pillar);
            const visibleTags = (i.tags ?? []).slice(0, 4);
            const extraTags = Math.max(0, (i.tags?.length ?? 0) - visibleTags.length);
            const scheduledIso = i.scheduled_for;
            const overdue =
              scheduledIso &&
              new Date(scheduledIso).getTime() < now &&
              i.status !== "published" &&
              i.status !== "archived";
            return (
              <li key={i.id}>
                <Link
                  href={`/tools/content/${i.id}`}
                  className="flex flex-col gap-2 px-4 py-3 hover:bg-[#0f1a2e] md:px-5 md:py-4"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`inline-flex w-fit items-center rounded-md border px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.18em] ${STATUS_STYLES[i.status]}`}
                    >
                      {i.status}
                    </span>
                    <span className="flex-1 truncate text-sm font-medium text-[#e8f0fe] md:text-base">
                      {i.title}
                    </span>
                    <span className="hidden text-xs text-[#8da2c0] md:inline">
                      {i.format}
                    </span>
                    <span className="hidden text-xs text-[#8da2c0] md:inline">
                      {i.platform.join(", ") || "—"}
                    </span>
                  </div>

                  {(scheduledIso ||
                    pillarText ||
                    i.priority !== "medium" ||
                    visibleTags.length > 0) && (
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      {scheduledIso && (
                        <span
                          className={`inline-flex items-center rounded-md border px-1.5 py-0.5 ${
                            overdue
                              ? "border-red-500/40 bg-red-500/10 text-red-300"
                              : "border-white/10 bg-white/5 text-[#8da2c0]"
                          }`}
                        >
                          {overdue ? "⚠ " : "📅 "}
                          {shortDate(scheduledIso)}
                        </span>
                      )}
                      {i.priority !== "medium" && (
                        <span
                          className={`inline-flex items-center rounded-md border px-1.5 py-0.5 uppercase tracking-wide ${PRIORITY_STYLES[i.priority]}`}
                        >
                          {i.priority}
                        </span>
                      )}
                      {pillarText && (
                        <span className="inline-flex items-center rounded-md border border-[#00e5ff]/30 bg-[#00e5ff]/10 px-1.5 py-0.5 text-[#00e5ff]">
                          {pillarText}
                        </span>
                      )}
                      {visibleTags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center rounded-md border border-[#00a6ff]/30 bg-[#00a6ff]/10 px-1.5 py-0.5 text-[#00a6ff]"
                        >
                          {t}
                        </span>
                      ))}
                      {extraTags > 0 && (
                        <span className="text-[#8da2c0]">+{extraTags}</span>
                      )}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
