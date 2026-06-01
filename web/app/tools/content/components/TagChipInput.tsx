"use client";

import { useState } from "react";

type Props = {
  value: string[];
  suggestions: string[];
  onChange: (next: string[]) => void;
  listId?: string;
  placeholder?: string;
};

export default function TagChipInput({
  value,
  suggestions,
  onChange,
  listId = "content-tags",
  placeholder = "Add tag…",
}: Props) {
  const [draft, setDraft] = useState("");

  function commit(raw: string) {
    const t = raw.trim();
    if (!t) return;
    const lower = t.toLowerCase();
    if (value.some((v) => v.toLowerCase() === lower)) return;
    if (value.length >= 20) return;
    onChange([...value, t]);
  }

  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit(draft);
      setDraft("");
      return;
    }
    if (e.key === "Backspace" && draft === "" && value.length > 0) {
      e.preventDefault();
      remove(value.length - 1);
    }
  }

  function onBlur() {
    if (draft.trim()) {
      commit(draft);
      setDraft("");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-[#0a1628]/60 px-2 py-2">
      {value.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="inline-flex items-center gap-1 rounded-md border border-[#00a6ff]/40 bg-[#00a6ff]/10 px-2 py-0.5 text-[11px] text-[#00a6ff]"
        >
          {tag}
          <button
            type="button"
            onClick={() => remove(i)}
            className="text-[#00a6ff]/70 hover:text-[#00e5ff]"
            aria-label={`Remove ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        list={listId}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        placeholder={value.length === 0 ? placeholder : ""}
        className="min-w-32 flex-1 bg-transparent text-sm text-[#e8f0fe] outline-none placeholder:text-[#8da2c0]/60"
      />
      <datalist id={listId}>
        {suggestions.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </div>
  );
}
