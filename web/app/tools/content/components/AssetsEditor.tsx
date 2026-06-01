"use client";

import { useState, useTransition } from "react";
import {
  addAsset,
  removeAsset,
  reorderAssets,
  updateAssetDescription,
} from "@/lib/content/actions";
import {
  ASSET_KINDS,
  type Asset,
  type AssetKind,
  type Format,
} from "@/lib/content/types";
import { cn } from "@/lib/utils";

type Props = { ideaId: string; format: Format; items: Asset[] };

const KIND_LABEL: Record<AssetKind, string> = {
  image_idea: "Image idea",
  carousel_slide: "Carousel slide",
  story_frame: "Story frame",
};

const DEFAULT_KIND_BY_FORMAT: Record<Format, AssetKind> = {
  video: "image_idea",
  image: "image_idea",
  carousel: "carousel_slide",
  story: "story_frame",
};

export default function AssetsEditor({ ideaId, format, items }: Props) {
  const [kind, setKind] = useState<AssetKind>(DEFAULT_KIND_BY_FORMAT[format]);
  const [desc, setDesc] = useState("");
  const [pending, startTransition] = useTransition();

  function onAdd() {
    if (!desc.trim()) return;
    const d = desc;
    setDesc("");
    startTransition(async () => {
      await addAsset(ideaId, kind, d);
    });
  }

  function onRemove(id: string) {
    startTransition(async () => {
      await removeAsset(ideaId, id);
    });
  }

  function onMove(id: string, dir: -1 | 1) {
    const sameKind = items.filter((a) => a.kind === kind);
    const idx = sameKind.findIndex((a) => a.id === id);
    if (idx < 0) return;
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= sameKind.length) return;
    const next = [...sameKind];
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    startTransition(async () => {
      await reorderAssets(
        ideaId,
        next.map((a) => a.id),
      );
    });
  }

  function onEditDesc(id: string, newDesc: string) {
    startTransition(async () => {
      await updateAssetDescription(ideaId, id, newDesc);
    });
  }

  const filtered = items.filter((a) => a.kind === kind);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-heading text-lg font-semibold">Assets</h2>
        <div className="flex gap-1">
          {ASSET_KINDS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={cn(
                "rounded-md border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide transition-colors",
                kind === k
                  ? "border-[#00a6ff] bg-[#00a6ff]/15 text-[#00a6ff]"
                  : "border-white/10 bg-transparent text-[#8da2c0] hover:text-[#e8f0fe]",
              )}
            >
              {KIND_LABEL[k]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 rounded-xl border border-white/10 bg-[#0f1a2e]/60 p-4">
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
          placeholder={`Describe the ${KIND_LABEL[kind].toLowerCase()}…`}
          className="h-10 flex-1 rounded-lg border border-white/10 bg-[#0a1628]/60 px-3 text-sm text-[#e8f0fe] placeholder:text-[#8da2c0]/60 focus:border-[#00a6ff] focus:outline-none focus:ring-2 focus:ring-[#00a6ff]/30"
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

      {filtered.length === 0 ? (
        <p className="text-xs text-[#8da2c0]">No {KIND_LABEL[kind].toLowerCase()}s yet.</p>
      ) : (
        <ol className="flex flex-col gap-2">
          {filtered.map((a, i) => (
            <li
              key={a.id}
              className="flex items-start gap-3 rounded-lg border border-white/5 bg-[#0f1a2e]/40 px-4 py-3"
            >
              <span className="font-mono text-[11px] text-[#8da2c0]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <textarea
                defaultValue={a.description}
                onBlur={(e) => {
                  if (e.target.value !== a.description) {
                    onEditDesc(a.id, e.target.value);
                  }
                }}
                className="min-h-10 flex-1 resize-y bg-transparent text-sm text-[#e8f0fe] outline-none"
              />
              <div className="flex flex-col gap-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => onMove(a.id, -1)}
                  disabled={i === 0}
                  className="text-[#8da2c0] hover:text-[#e8f0fe] disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => onMove(a.id, +1)}
                  disabled={i === filtered.length - 1}
                  className="text-[#8da2c0] hover:text-[#e8f0fe] disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
              <button
                type="button"
                onClick={() => onRemove(a.id)}
                className="text-xs text-[#8da2c0] hover:text-red-400"
              >
                ✕
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
