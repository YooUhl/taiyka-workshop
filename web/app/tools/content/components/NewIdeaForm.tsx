"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createIdea } from "@/lib/content/actions";
import { PLATFORMS, FORMATS } from "@/lib/content/types";
import type { Platform, Format } from "@/lib/content/types";
import { cn } from "@/lib/utils";

const INPUT_CLS =
  "h-12 w-full rounded-lg border border-white/10 bg-[#0a1628]/60 px-4 text-base text-[#e8f0fe] placeholder:text-[#8da2c0]/60 focus:border-[#00a6ff] focus:outline-none focus:ring-2 focus:ring-[#00a6ff]/30";

export default function NewIdeaForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState<Platform[]>([]);
  const [format, setFormat] = useState<Format>("video");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function togglePlatform(p: Platform) {
    setPlatform((curr) =>
      curr.includes(p) ? curr.filter((x) => x !== p) : [...curr, p],
    );
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Title required");
      return;
    }
    const fd = new FormData();
    fd.set("title", title.trim());
    fd.set("format", format);
    for (const p of platform) fd.append("platform", p);

    startTransition(async () => {
      try {
        await createIdea(fd);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to create";
        if (msg === "NEXT_REDIRECT") return;
        setError(msg);
      }
    });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      (e.currentTarget as HTMLFormElement).requestSubmit();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      router.push("/tools/content");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      onKeyDown={onKeyDown}
      className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-[#0f1a2e]/60 p-6 md:p-8"
    >
      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8da2c0]">
          Title
        </label>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Reel sur n8n — onboarding client"
          className={INPUT_CLS}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8da2c0]">
          Platforms
        </label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => {
            const active = platform.includes(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() => togglePlatform(p)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors",
                  active
                    ? "border-[#00a6ff] bg-[#00a6ff]/15 text-[#00a6ff]"
                    : "border-white/10 bg-transparent text-[#8da2c0] hover:text-[#e8f0fe]",
                )}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8da2c0]">
          Format
        </label>
        <div className="flex flex-wrap gap-2">
          {FORMATS.map((f) => {
            const active = format === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors",
                  active
                    ? "border-[#00a6ff] bg-[#00a6ff]/15 text-[#00a6ff]"
                    : "border-white/10 bg-transparent text-[#8da2c0] hover:text-[#e8f0fe]",
                )}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {error ? (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-3 pt-2">
        <p className="text-[11px] text-[#8da2c0]">
          <kbd className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">⌘↩</kbd> save · <kbd className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">esc</kbd> back
        </p>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-gradient-to-r from-[#00a6ff] to-[#00e5ff] px-5 py-2 text-sm font-semibold text-[#0a1628] shadow-[0_0_20px_rgba(0,166,255,0.35)] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving..." : "Create"}
        </button>
      </div>
    </form>
  );
}
