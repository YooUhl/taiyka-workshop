"use client";

import { useMemo, useState, useTransition } from "react";
import { markMastered } from "@/lib/calisthenics/actions";
import type { Attempt, MasteryCondition, ProgressStatus } from "@/lib/calisthenics/types";

type Props = {
  skillId: string;
  slug: string;
  conditions: MasteryCondition[];
  attempts: Attempt[];
  currentStatus: ProgressStatus;
};

/**
 * A condition is "auto-met" if at least one attempt with matching condition_key
 * has met=true. The user can also tick boxes manually for conditions without
 * structured attempts (e.g. "form" checks).
 */
function autoMetConditions(
  conditions: MasteryCondition[],
  attempts: Attempt[],
): Set<string> {
  const met = new Set<string>();
  for (const a of attempts) {
    if (a.met) met.add(a.condition_key);
  }
  return new Set(
    conditions.filter((c) => met.has(c.label)).map((c) => c.label),
  );
}

export default function MasteryChecklist({
  skillId,
  slug,
  conditions,
  attempts,
  currentStatus,
}: Props) {
  const auto = useMemo(
    () => autoMetConditions(conditions, attempts),
    [conditions, attempts],
  );
  const [manual, setManual] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const allMet = useMemo(() => {
    if (conditions.length === 0) return false;
    return conditions.every(
      (c) => auto.has(c.label) || manual.has(c.label),
    );
  }, [conditions, auto, manual]);

  const alreadyMastered = currentStatus === "mastered";

  function toggle(label: string) {
    setManual((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  function onMaster() {
    setError("");
    startTransition(async () => {
      const res = await markMastered(skillId, slug);
      if (!res.ok) setError(res.error);
    });
  }

  if (conditions.length === 0) {
    return (
      <p className="text-sm text-[#8da2c0] italic">
        No mastery conditions defined for this skill.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-2">
        {conditions.map((c) => {
          const autoChecked = auto.has(c.label);
          const manualChecked = manual.has(c.label);
          const checked = autoChecked || manualChecked;
          return (
            <li key={c.label} className="flex items-center gap-3">
              <input
                id={`cond-${c.label}`}
                type="checkbox"
                checked={checked}
                disabled={autoChecked || alreadyMastered}
                onChange={() => toggle(c.label)}
                className="h-4 w-4 accent-[#00a6ff]"
              />
              <label
                htmlFor={`cond-${c.label}`}
                className="text-sm text-[#e8f0fe]"
              >
                {c.label}
                {autoChecked && (
                  <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#00e5ff]">
                    auto · from attempts
                  </span>
                )}
              </label>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={onMaster}
        disabled={!allMet || pending || alreadyMastered}
        className="self-start rounded-md bg-gradient-hero px-4 py-2 text-sm font-semibold text-[#0a1628] shadow-glow disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]"
      >
        {alreadyMastered
          ? "✓ Mastered"
          : pending
            ? "Saving…"
            : "Mark mastered"}
      </button>

      {error && (
        <p role="alert" className="text-xs text-[#c92a2a]">
          {error}
        </p>
      )}
    </div>
  );
}
