"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { upsertSection, deleteSection } from "@/lib/content/actions";
import {
  SECTION_TYPES,
  type VideoSection,
  type SectionType,
} from "@/lib/content/types";

type Props = {
  ideaId: string;
  sections: VideoSection[];
};

const LABELS: Record<SectionType, { label: string; placeholder: string }> = {
  hook: {
    label: "Hook",
    placeholder: "First 3 seconds — what stops the scroll?",
  },
  body: {
    label: "Body",
    placeholder: "The point, the demo, the story…",
  },
  cta: {
    label: "CTA",
    placeholder: "Comment, DM, follow, link in bio…",
  },
};

export default function SectionsEditor({ ideaId, sections }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold">Video sections</h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8da2c0]">
          Auto-saves on pause
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {SECTION_TYPES.map((t) => {
          const existing = sections.find((s) => s.section_type === t);
          return (
            <SectionCard
              key={t}
              ideaId={ideaId}
              type={t}
              existing={existing}
            />
          );
        })}
      </div>
    </div>
  );
}

function SectionCard({
  ideaId,
  type,
  existing,
}: {
  ideaId: string;
  type: SectionType;
  existing: VideoSection | undefined;
}) {
  const meta = LABELS[type];
  const [value, setValue] = useState(existing?.content ?? "");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const lastSaved = useRef(existing?.content ?? "");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setValue(existing?.content ?? "");
    lastSaved.current = existing?.content ?? "";
  }, [existing?.content]);

  function schedule(next: string) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => commit(next), 600);
  }

  function commit(next: string) {
    if (next === lastSaved.current) return;
    lastSaved.current = next;
    startTransition(async () => {
      await upsertSection({
        idea_id: ideaId,
        section_type: type,
        content: next,
        id: existing?.id,
        order_idx: existing?.order_idx ?? 0,
      });
      setSavedAt(Date.now());
    });
  }

  async function onDelete() {
    if (!existing) return;
    if (!confirm(`Clear the ${meta.label}?`)) return;
    setValue("");
    lastSaved.current = "";
    startTransition(async () => {
      await deleteSection(ideaId, existing.id);
    });
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-[#0f1a2e]/60 p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#00a6ff]">
          {meta.label}
        </span>
        {existing ? (
          <button
            type="button"
            onClick={onDelete}
            className="text-[10px] text-[#8da2c0] hover:text-red-400"
          >
            clear
          </button>
        ) : null}
      </div>
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          schedule(e.target.value);
        }}
        onBlur={() => commit(value)}
        placeholder={meta.placeholder}
        className="min-h-32 w-full resize-y rounded-lg border border-white/10 bg-[#0a1628]/60 p-3 text-sm text-[#e8f0fe] placeholder:text-[#8da2c0]/60 focus:border-[#00a6ff] focus:outline-none focus:ring-2 focus:ring-[#00a6ff]/30"
      />
      <span className="text-[10px] text-[#8da2c0]">
        {pending ? "Saving…" : savedAt ? "Saved" : ""}
      </span>
    </div>
  );
}
