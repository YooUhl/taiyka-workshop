"use client";

import { useState, useTransition } from "react";
import { addBroll, removeBroll } from "@/lib/content/actions";
import type { BrollIdea } from "@/lib/content/types";

type Props = { ideaId: string; items: BrollIdea[] };

export default function BrollEditor({ ideaId, items }: Props) {
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const [pending, startTransition] = useTransition();

  function onAdd() {
    if (!desc.trim()) return;
    const d = desc;
    const u = url;
    setDesc("");
    setUrl("");
    startTransition(async () => {
      await addBroll(ideaId, d, u);
    });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      onAdd();
    }
  }

  function onRemove(id: string) {
    startTransition(async () => {
      await removeBroll(ideaId, id);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-heading text-lg font-semibold">B-roll ideas</h2>

      <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-[#0f1a2e]/60 p-4 md:flex-row">
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Close-up of n8n canvas while talking…"
          className="h-10 flex-1 rounded-lg border border-white/10 bg-[#0a1628]/60 px-3 text-sm text-[#e8f0fe] placeholder:text-[#8da2c0]/60 focus:border-[#00a6ff] focus:outline-none focus:ring-2 focus:ring-[#00a6ff]/30"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Reference URL (optional)"
          className="h-10 w-full rounded-lg border border-white/10 bg-[#0a1628]/60 px-3 text-sm text-[#e8f0fe] placeholder:text-[#8da2c0]/60 focus:border-[#00a6ff] focus:outline-none focus:ring-2 focus:ring-[#00a6ff]/30 md:w-72"
        />
        <button
          type="button"
          onClick={onAdd}
          disabled={pending || !desc.trim()}
          className="h-10 rounded-lg bg-[#00a6ff]/15 px-4 text-sm font-medium text-[#00a6ff] hover:bg-[#00a6ff]/25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-[#8da2c0]">No b-roll yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((b) => (
            <li
              key={b.id}
              className="flex items-center gap-3 rounded-lg border border-white/5 bg-[#0f1a2e]/40 px-4 py-2.5"
            >
              <span className="flex-1 text-sm text-[#e8f0fe]">
                {b.description}
              </span>
              {b.ref_url ? (
                <a
                  href={b.ref_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#00a6ff] hover:underline"
                >
                  ref
                </a>
              ) : null}
              <button
                type="button"
                onClick={() => onRemove(b.id)}
                className="text-xs text-[#8da2c0] hover:text-red-400"
              >
                remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
