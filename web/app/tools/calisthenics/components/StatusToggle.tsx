"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { updateStatus } from "@/lib/calisthenics/actions";
import type { ProgressStatus } from "@/lib/calisthenics/types";

type Props = {
  skillId: string;
  slug: string;
  initialStatus: ProgressStatus;
  locked: boolean;
};

const OPTIONS: { value: Exclude<ProgressStatus, "locked">; label: string }[] = [
  { value: "unlocked", label: "Unlocked" },
  { value: "practicing", label: "Practicing" },
  { value: "mastered", label: "Mastered" },
];

export default function StatusToggle({ skillId, slug, initialStatus, locked }: Props) {
  const [status, setStatus] = useState<ProgressStatus>(initialStatus);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  if (locked) {
    return (
      <p className="text-sm text-[#8da2c0] italic">
        Locked — master all prerequisites first.
      </p>
    );
  }

  function pick(next: Exclude<ProgressStatus, "locked">) {
    setError("");
    const prev = status;
    setStatus(next);
    startTransition(async () => {
      const res = await updateStatus(skillId, slug, next);
      if (!("ok" in res) || !res.ok) {
        setStatus(prev);
        setError(res.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div role="radiogroup" aria-label="Status" className="flex flex-wrap gap-2">
        {OPTIONS.map((o) => {
          const active = status === o.value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={pending}
              onClick={() => pick(o.value)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]",
                "disabled:cursor-not-allowed disabled:opacity-60",
                active
                  ? "border-[#00a6ff] bg-[#00a6ff]/15 text-[#00a6ff]"
                  : "border-[#1a2a4a] text-[#8da2c0] hover:border-[#00a6ff]/40 hover:text-[#e8f0fe]",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="text-xs text-[#c92a2a]">
          {error}
        </p>
      )}
    </div>
  );
}
