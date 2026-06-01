"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateIdea, deleteIdea } from "@/lib/content/actions";
import {
  PLATFORMS,
  FORMATS,
  STATUSES,
  type Idea,
  type Platform,
  type Format,
  type Status,
  type Priority,
} from "@/lib/content/types";
import { isPillar, type Pillar } from "@/lib/content/pillars";
import Chip from "./Chip";
import PillarChips from "./PillarChips";
import PriorityChips from "./PriorityChips";
import TagChipInput from "./TagChipInput";

type Props = { idea: Idea; suggestions: string[] };

// datetime-local <input> uses naive local time (no TZ).
// toLocalInput: ISO string → "YYYY-MM-DDTHH:mm" in user's local TZ.
// fromLocalInput: "YYYY-MM-DDTHH:mm" → ISO string (or null).
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("sv-SE").replace(" ", "T").slice(0, 16);
}
function fromLocalInput(local: string): string | null {
  if (!local) return null;
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export default function IdeaEditor({ idea, suggestions }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(idea.title);
  const [status, setStatus] = useState<Status>(idea.status);
  const [format, setFormat] = useState<Format>(idea.format);
  const [platform, setPlatform] = useState<Platform[]>(idea.platform);
  const [notes, setNotes] = useState(idea.notes ?? "");
  const [tags, setTags] = useState<string[]>(idea.tags ?? []);
  const [pillar, setPillar] = useState<Pillar | null>(
    idea.pillar && isPillar(idea.pillar) ? idea.pillar : null,
  );
  const [priority, setPriority] = useState<Priority>(idea.priority);
  const [scheduledLocal, setScheduledLocal] = useState<string>(
    toLocalInput(idea.scheduled_for),
  );
  const [inspirationUrl, setInspirationUrl] = useState<string>(
    idea.inspiration_url ?? "",
  );

  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);

  function save(patch: Parameters<typeof updateIdea>[1]) {
    startTransition(async () => {
      await updateIdea(idea.id, patch);
      setSavedAt(Date.now());
    });
  }

  function toggle(p: Platform) {
    const next = platform.includes(p)
      ? platform.filter((x) => x !== p)
      : [...platform, p];
    setPlatform(next);
    save({ platform: next });
  }

  function pickFormat(f: Format) {
    setFormat(f);
    save({ format: f });
  }

  function pickStatus(s: Status) {
    setStatus(s);
    save({ status: s });
  }

  function pickPillar(p: Pillar | null) {
    setPillar(p);
    save({ pillar: p });
  }

  function pickPriority(p: Priority) {
    setPriority(p);
    save({ priority: p });
  }

  function changeTags(next: string[]) {
    setTags(next);
    save({ tags: next });
  }

  function onScheduledChange(v: string) {
    setScheduledLocal(v);
    save({ scheduled_for: fromLocalInput(v) });
  }

  function onTitleBlur() {
    const t = title.trim();
    if (!t || t === idea.title) return;
    save({ title: t });
  }

  function onNotesBlur() {
    if ((notes ?? "") === (idea.notes ?? "")) return;
    save({ notes });
  }

  function onInspirationBlur() {
    if (inspirationUrl === (idea.inspiration_url ?? "")) return;
    save({ inspiration_url: inspirationUrl || null });
  }

  async function onDelete() {
    if (!confirm("Delete this idea? This cannot be undone.")) return;
    startTransition(async () => {
      try {
        await deleteIdea(idea.id);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "";
        if (msg === "NEXT_REDIRECT") return;
        alert("Failed to delete");
      }
    });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      (e.target as HTMLElement).blur();
    }
    if (e.key === "Escape") {
      router.push("/tools/content");
    }
  }

  return (
    <div
      onKeyDown={onKeyDown}
      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0f1a2e]/60 p-6"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={onTitleBlur}
        className="w-full bg-transparent text-2xl font-semibold text-[#e8f0fe] outline-none focus:ring-0 md:text-3xl"
      />

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Chip key={s} active={status === s} onClick={() => pickStatus(s)}>
            {s}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8da2c0]">
          Format
        </span>
        {FORMATS.map((f) => (
          <Chip key={f} active={format === f} onClick={() => pickFormat(f)}>
            {f}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8da2c0]">
          Platforms
        </span>
        {PLATFORMS.map((p) => (
          <Chip key={p} active={platform.includes(p)} onClick={() => toggle(p)}>
            {p}
          </Chip>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8da2c0]">
          Pillar
        </span>
        <PillarChips value={pillar} onChange={pickPillar} />
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8da2c0]">
          Priority
        </span>
        <PriorityChips value={priority} onChange={pickPriority} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8da2c0]">
            Scheduled for
          </span>
          <input
            type="datetime-local"
            value={scheduledLocal}
            onChange={(e) => onScheduledChange(e.target.value)}
            className="h-10 w-full rounded-lg border border-white/10 bg-[#0a1628]/60 px-3 text-sm text-[#e8f0fe] focus:border-[#00a6ff] focus:outline-none focus:ring-2 focus:ring-[#00a6ff]/30"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8da2c0]">
            Inspiration URL
          </span>
          <input
            type="url"
            value={inspirationUrl}
            onChange={(e) => setInspirationUrl(e.target.value)}
            onBlur={onInspirationBlur}
            placeholder="https://…"
            className="h-10 w-full rounded-lg border border-white/10 bg-[#0a1628]/60 px-3 text-sm text-[#e8f0fe] placeholder:text-[#8da2c0]/60 focus:border-[#00a6ff] focus:outline-none focus:ring-2 focus:ring-[#00a6ff]/30"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8da2c0]">
          Tags
        </span>
        <TagChipInput
          value={tags}
          suggestions={suggestions}
          onChange={changeTags}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8da2c0]">
          Notes
        </span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={onNotesBlur}
          placeholder="Anything else — angle, references, voice memo links…"
          className="min-h-24 w-full rounded-lg border border-white/10 bg-[#0a1628]/60 p-3 text-sm text-[#e8f0fe] placeholder:text-[#8da2c0]/60 focus:border-[#00a6ff] focus:outline-none focus:ring-2 focus:ring-[#00a6ff]/30"
        />
      </div>

      <div className="flex items-center justify-between text-xs text-[#8da2c0]">
        <span>
          {pending ? "Saving…" : savedAt ? "Saved" : "All changes save automatically"}
        </span>
        <button
          type="button"
          onClick={onDelete}
          className="text-xs text-red-400/70 hover:text-red-400"
        >
          Delete idea
        </button>
      </div>
    </div>
  );
}
