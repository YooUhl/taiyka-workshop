"use client";

import { useState, useTransition, type FormEvent } from "react";
import { addAttempt, removeAttempt } from "@/lib/calisthenics/actions";
import type { Attempt, MasteryCondition } from "@/lib/calisthenics/types";

type Props = {
  skillId: string;
  slug: string;
  conditions: MasteryCondition[];
  initialAttempts: Attempt[];
};

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function AttemptLogger({
  skillId,
  slug,
  conditions,
  initialAttempts,
}: Props) {
  const firstCondKey = conditions[0]?.label ?? "custom";
  const [date, setDate] = useState(todayISO());
  const [condKey, setCondKey] = useState<string>(firstCondKey);
  const [value, setValue] = useState("");
  const [met, setMet] = useState<boolean>(false);
  const [items, setItems] = useState<Attempt[]>(initialAttempts);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const attempt: Attempt = {
      date,
      condition_key: condKey,
      value: Number.isNaN(Number(value)) ? value : Number(value),
      met,
    };
    const optimistic = [...items, attempt];
    setItems(optimistic);
    setValue("");
    setMet(false);
    startTransition(async () => {
      const res = await addAttempt(skillId, slug, attempt);
      if (!res.ok) {
        setItems(items);
        setError(res.error);
      }
    });
  }

  function onRemove(idx: number) {
    setError("");
    const prev = items;
    setItems(items.filter((_, i) => i !== idx));
    startTransition(async () => {
      const res = await removeAttempt(skillId, slug, idx);
      if (!res.ok) {
        setItems(prev);
        setError(res.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <label className="flex flex-col gap-1 text-xs text-[#8da2c0]">
            <span>Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 rounded-md border border-[#1a2a4a] bg-[#0f1a2e]/60 px-3 text-sm text-[#e8f0fe] focus:border-[#00a6ff] focus:outline-none focus:ring-2 focus:ring-[#00a6ff]/30"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-[#8da2c0]">
            <span>Condition</span>
            <select
              value={condKey}
              onChange={(e) => setCondKey(e.target.value)}
              className="h-10 rounded-md border border-[#1a2a4a] bg-[#0f1a2e]/60 px-3 text-sm text-[#e8f0fe] focus:border-[#00a6ff] focus:outline-none focus:ring-2 focus:ring-[#00a6ff]/30"
            >
              {conditions.length === 0 && <option value="custom">custom</option>}
              {conditions.map((c) => (
                <option key={c.label} value={c.label}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-[#8da2c0]">
            <span>Value</span>
            <input
              type="text"
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. 18 or 22s"
              className="h-10 rounded-md border border-[#1a2a4a] bg-[#0f1a2e]/60 px-3 text-sm text-[#e8f0fe] placeholder:text-[#8da2c0]/60 focus:border-[#00a6ff] focus:outline-none focus:ring-2 focus:ring-[#00a6ff]/30"
            />
          </label>
          <label className="flex items-end gap-2 text-sm text-[#e8f0fe]">
            <input
              type="checkbox"
              checked={met}
              onChange={(e) => setMet(e.target.checked)}
              className="h-4 w-4 accent-[#00a6ff]"
            />
            <span>Met condition</span>
          </label>
        </div>
        <button
          type="submit"
          disabled={pending || !value}
          className="self-start rounded-md bg-[#00a6ff] px-4 py-2 text-sm font-semibold text-[#0a1628] hover:bg-[#00e5ff] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]"
        >
          {pending ? "Saving…" : "Log attempt"}
        </button>
        {error && (
          <p role="alert" className="text-xs text-[#c92a2a]">
            {error}
          </p>
        )}
      </form>

      <ul className="flex flex-col gap-1">
        {items.length === 0 && (
          <li className="text-sm text-[#8da2c0] italic">No attempts logged yet.</li>
        )}
        {items.map((a, i) => (
          <li
            key={`${a.date}-${i}`}
            className="flex items-center justify-between gap-3 rounded-md border border-[#1a2a4a] bg-[#0f1a2e]/40 px-3 py-2 text-sm"
          >
            <span className="font-mono text-xs text-[#8da2c0]">{a.date}</span>
            <span className="flex-1 text-[#e8f0fe]">
              <span className="text-[#8da2c0]">{a.condition_key}:</span> {String(a.value)}
            </span>
            <span
              className={
                a.met
                  ? "font-mono text-[10px] uppercase tracking-[0.18em] text-[#00e5ff]"
                  : "font-mono text-[10px] uppercase tracking-[0.18em] text-[#8da2c0]"
              }
            >
              {a.met ? "Met" : "Missed"}
            </span>
            <button
              type="button"
              onClick={() => onRemove(i)}
              aria-label="Remove attempt"
              className="text-[#c92a2a] hover:text-[#e8f0fe]"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
