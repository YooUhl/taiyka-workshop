"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { bulkCreateIdeas } from "@/lib/content/actions";
import {
  PLATFORMS,
  FORMATS,
  type Platform,
  type Format,
  type Priority,
} from "@/lib/content/types";
import type { Pillar } from "@/lib/content/pillars";
import Chip from "./Chip";
import PillarChips from "./PillarChips";
import PriorityChips from "./PriorityChips";

export default function BrainDumpForm() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [platform, setPlatform] = useState<Platform[]>([]);
  const [format, setFormat] = useState<Format>("video");
  const [pillar, setPillar] = useState<Pillar | null>(null);
  const [priority, setPriority] = useState<Priority>("medium");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const detected = useMemo(() => {
    const lines = Array.from(
      new Set(
        text
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean),
      ),
    );
    return Math.min(lines.length, 200);
  }, [text]);

  function togglePlatform(p: Platform) {
    setPlatform((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (detected === 0 || pending) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await bulkCreateIdeas(text, {
          platform,
          format,
          pillar,
          priority,
        });
        if (res.created === 0) {
          setError("Nothing to create.");
          return;
        }
        router.push("/tools/content");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed";
        setError(msg);
      }
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0f1a2e]/60 p-6"
    >
      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8da2c0]">
          Ideas (one per line)
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={14}
          autoFocus
          placeholder={"Reel on n8n + Claude\nCarousel: 5 cold email mistakes\nStory: my morning stack"}
          className="w-full rounded-lg border border-white/10 bg-[#0a1628]/60 p-3 font-mono text-sm text-[#e8f0fe] placeholder:text-[#8da2c0]/60 focus:border-[#00a6ff] focus:outline-none focus:ring-2 focus:ring-[#00a6ff]/30"
        />
        <span className="text-xs text-[#8da2c0]">
          {detected} idea{detected === 1 ? "" : "s"} detected
          {detected === 200 ? " (capped)" : ""}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8da2c0]">
          Platforms
        </span>
        {PLATFORMS.map((p) => (
          <Chip
            key={p}
            active={platform.includes(p)}
            onClick={() => togglePlatform(p)}
          >
            {p}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8da2c0]">
          Format
        </span>
        {FORMATS.map((f) => (
          <Chip key={f} active={format === f} onClick={() => setFormat(f)}>
            {f}
          </Chip>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8da2c0]">
          Pillar (optional)
        </span>
        <PillarChips value={pillar} onChange={setPillar} />
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8da2c0]">
          Priority
        </span>
        <PriorityChips value={priority} onChange={setPriority} />
      </div>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={detected === 0 || pending}
          className="rounded-lg bg-gradient-to-r from-[#00a6ff] to-[#00e5ff] px-4 py-2 text-sm font-semibold text-[#0a1628] shadow-[0_0_20px_rgba(0,166,255,0.35)] disabled:cursor-not-allowed disabled:opacity-50 hover:opacity-95"
        >
          {pending ? "Creating…" : `Create ${detected} idea${detected === 1 ? "" : "s"}`}
        </button>
      </div>
    </form>
  );
}
