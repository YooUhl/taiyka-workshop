"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
import { PILLARS, PILLAR_LABELS, type Pillar } from "@/lib/content/pillars";
import Chip from "./Chip";

type Initial = {
  q: string;
  platform?: Platform;
  format?: Format;
  status?: Status;
  pillar?: Pillar;
  priority?: Priority;
  tag: string;
  scheduledFrom: string;
  scheduledTo: string;
  sort?: Sort;
};

const SORT_LABELS: Record<Sort, string> = {
  updated_desc: "Recently updated",
  scheduled_asc: "Scheduled (soonest)",
  priority_desc: "Priority (high → low)",
  created_desc: "Newest",
};

export default function IdeaFilters({
  initial,
  suggestions,
}: {
  initial: Initial;
  suggestions: string[];
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(initial.q);
  const [tag, setTag] = useState(initial.tag);
  const [from, setFrom] = useState(initial.scheduledFrom);
  const [to, setTo] = useState(initial.scheduledTo);

  useEffect(() => {
    setQ(initial.q);
  }, [initial.q]);
  useEffect(() => {
    setTag(initial.tag);
  }, [initial.tag]);
  useEffect(() => {
    setFrom(initial.scheduledFrom);
  }, [initial.scheduledFrom]);
  useEffect(() => {
    setTo(initial.scheduledTo);
  }, [initial.scheduledTo]);

  function push(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(sp?.toString() ?? "");
    for (const [k, v] of Object.entries(next)) {
      if (v === undefined || v === "") params.delete(k);
      else params.set(k, v);
    }
    const qs = params.toString();
    router.push(qs ? `/tools/content?${qs}` : "/tools/content");
  }

  function toggleParam(
    key: "platform" | "format" | "status" | "pillar" | "priority",
    value: string,
  ) {
    const current = sp?.get(key);
    push({ [key]: current === value ? undefined : value });
  }

  function onSearchKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      push({ q: q.trim() || undefined });
    }
  }

  const platform = initial.platform;
  const format = initial.format;
  const status = initial.status;
  const pillar = initial.pillar;
  const priority = initial.priority;
  const sort = initial.sort ?? "updated_desc";

  const anyActive =
    !!(q || platform || format || status || pillar || priority || tag || from || to) ||
    (initial.sort && initial.sort !== "updated_desc");

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#0f1a2e]/40 p-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onSearchKey}
          onBlur={() => push({ q: q.trim() || undefined })}
          placeholder="Search title or notes…"
          className="h-10 w-full flex-1 rounded-lg border border-white/10 bg-[#0a1628]/60 px-3 text-sm text-[#e8f0fe] placeholder:text-[#8da2c0]/60 focus:border-[#00a6ff] focus:outline-none focus:ring-2 focus:ring-[#00a6ff]/30"
        />
        <select
          value={sort}
          onChange={(e) => push({ sort: e.target.value === "updated_desc" ? undefined : e.target.value })}
          className="h-10 rounded-lg border border-white/10 bg-[#0a1628]/60 px-3 text-sm text-[#e8f0fe] focus:border-[#00a6ff] focus:outline-none"
        >
          {SORTS.map((s) => (
            <option key={s} value={s}>
              {SORT_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Chip
            key={s}
            active={status === s}
            onClick={() => toggleParam("status", s)}
          >
            {s}
          </Chip>
        ))}
        <Divider />
        {FORMATS.map((f) => (
          <Chip
            key={f}
            active={format === f}
            onClick={() => toggleParam("format", f)}
          >
            {f}
          </Chip>
        ))}
        <Divider />
        {PLATFORMS.map((p) => (
          <Chip
            key={p}
            active={platform === p}
            onClick={() => toggleParam("platform", p)}
          >
            {p}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8da2c0]">
          Pillar
        </span>
        {PILLARS.map((p) => (
          <Chip
            key={p}
            active={pillar === p}
            onClick={() => toggleParam("pillar", p)}
          >
            {PILLAR_LABELS[p]}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8da2c0]">
          Priority
        </span>
        {PRIORITIES.map((p) => (
          <Chip
            key={p}
            active={priority === p}
            onClick={() => toggleParam("priority", p)}
          >
            {p}
          </Chip>
        ))}
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <input
          list="content-filter-tags"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          onBlur={() => push({ tag: tag.trim() || undefined })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              push({ tag: tag.trim() || undefined });
            }
          }}
          placeholder="Filter by tag…"
          className="h-10 w-full flex-1 rounded-lg border border-white/10 bg-[#0a1628]/60 px-3 text-sm text-[#e8f0fe] placeholder:text-[#8da2c0]/60 focus:border-[#00a6ff] focus:outline-none focus:ring-2 focus:ring-[#00a6ff]/30 md:max-w-xs"
        />
        <datalist id="content-filter-tags">
          {suggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8da2c0]">
            Scheduled
          </span>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            onBlur={() => push({ scheduledFrom: from || undefined })}
            className="h-10 rounded-lg border border-white/10 bg-[#0a1628]/60 px-2 text-sm text-[#e8f0fe] focus:border-[#00a6ff] focus:outline-none"
          />
          <span className="text-xs text-[#8da2c0]">→</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            onBlur={() => push({ scheduledTo: to || undefined })}
            className="h-10 rounded-lg border border-white/10 bg-[#0a1628]/60 px-2 text-sm text-[#e8f0fe] focus:border-[#00a6ff] focus:outline-none"
          />
        </div>
        {anyActive && (
          <button
            onClick={() => router.push("/tools/content")}
            className="ml-auto text-xs text-[#8da2c0] hover:text-[#e8f0fe]"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}

function Divider() {
  return <span className="mx-1 self-center h-4 w-px bg-white/10" />;
}
