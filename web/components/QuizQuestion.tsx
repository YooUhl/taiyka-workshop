"use client";

import { useState, useRef, useEffect } from "react";
import type { Question, Answer } from "@/lib/quiz-questions";
import { cn } from "@/lib/utils";

type Lang = "fr" | "en";

type Props = {
  question: Question;
  index: number;
  total: number;
  onAnswer: (questionId: string, answer: Answer) => void;
  /**
   * Optional: when navigating back to a previously answered question,
   * the parent can pass the prior selection id to restore the visual state.
   * Defaults to undefined (no prefill) for backward compatibility.
   */
  selectedAnswerId?: string | null;
  /**
   * Display language. Defaults to "fr". When the underlying question/answer
   * `text` field is a `{ fr, en }` object, we read `text[lang]` and fall back
   * to `text.fr`. When it's a plain string (old shape), we use it as-is.
   */
  lang?: Lang;
};

/**
 * Narrow type guard — handles both the legacy flat-string shape and the
 * bilingual `{ fr, en }` shape that Wave 3-A2 introduces. Keeps the file
 * backward-compatible while the data layer is in flight.
 */
function readText(value: unknown, lang: Lang): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const preferred = obj[lang];
    if (typeof preferred === "string") return preferred;
    const fallback = obj.fr;
    if (typeof fallback === "string") return fallback;
  }
  return "";
}

export default function QuizQuestion({
  question,
  index,
  total,
  onAnswer,
  selectedAnswerId,
  lang = "fr",
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(
    selectedAnswerId ?? null
  );
  const timeoutRef = useRef<number | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  // Reset / prefill selection whenever the question changes (e.g. back-navigation).
  useEffect(() => {
    setSelectedId(selectedAnswerId ?? null);
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [question.id, selectedAnswerId]);

  // Move focus to the new question heading after question changes so screen
  // readers (and keyboard users) follow the auto-advance. VoiceOver narrates
  // the focused heading; NVDA/JAWS users get the stable live region hoisted
  // in the parent (Wave 3-C3).
  useEffect(() => {
    headingRef.current?.focus();
  }, [question.id]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  function handleClick(answer: Answer) {
    if (selectedId) return;
    setSelectedId(answer.id);
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    // Respect prefers-reduced-motion: advance immediately rather than waiting
    // for the 90 ms visual settle.
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      onAnswer(question.id, answer);
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
      onAnswer(question.id, answer);
    }, 90);
  }

  const isMotivation = !!question.isMotivationFilter;
  const headingId = `quiz-q-${question.id}`;
  const current = index + 1;

  const questionText = readText((question as { text: unknown }).text, lang);

  return (
    <div
      key={question.id}
      style={{ animation: "qcm-fade-slide 320ms ease-out" }}
      className="w-full"
    >
      {/* Live region for screen-reader progression is hoisted to the stable
          parent (Wave 3-C3) — re-mounting it here on every question swap
          prevented NVDA/JAWS from announcing the update. */}

      <span className="kicker inline-flex mb-5">
        Q{String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>

      <h2
        id={headingId}
        ref={headingRef}
        tabIndex={-1}
        className={cn(
          "mt-2 mb-10 md:mb-14 text-balance font-bold tracking-[-0.03em] leading-[1.05] text-foreground outline-none",
          isMotivation
            ? "text-[clamp(1.85rem,4.8vw,3rem)]"
            : "text-[clamp(1.6rem,4.2vw,2.6rem)]"
        )}
      >
        {questionText}
      </h2>

      <ul className="flex flex-col gap-3">
        {question.answers.map((a, i) => {
          const letter = String.fromCharCode(65 + i);
          const isSelected = selectedId === a.id;
          const answerLabel =
            readText((a as { text?: unknown; label?: unknown }).text, lang) ||
            readText((a as { label?: unknown }).label, lang);
          return (
            <li key={a.id}>
              <button
                onClick={() => handleClick(a)}
                // Only dim the three non-selected options after a click, so the
                // screen reader doesn't announce "dimmed" on the button the
                // user just chose.
                disabled={!!selectedId && !isSelected}
                aria-pressed={isSelected}
                className={cn(
                  "group relative w-full text-left flex items-center gap-4 sm:gap-5 px-5 md:px-6 py-5 md:py-6 min-h-[64px] rounded-md border motion-safe:transition-all overflow-hidden",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]",
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card/40 hover:bg-card/70 hover:border-primary/50",
                  selectedId && !isSelected && "opacity-50"
                )}
              >
                {/* Slim left-edge color bar replaces the old hairline between letter and label. */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-0 top-0 bottom-0 w-px motion-safe:transition-colors",
                    isSelected
                      ? "bg-primary"
                      : "bg-primary/20 group-hover:bg-primary/60"
                  )}
                />
                <span
                  className={cn(
                    "font-bold text-sm md:text-base tabular-nums motion-safe:transition-colors",
                    isSelected
                      ? "text-primary"
                      : "text-primary/80 group-hover:text-primary"
                  )}
                >
                  {letter}
                </span>
                <span className="flex-1 text-[0.9375rem] md:text-[1.0625rem] leading-[1.5] text-foreground">
                  {answerLabel}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "shrink-0 motion-safe:transition-all",
                    isSelected
                      ? "text-primary translate-x-1"
                      : "text-muted-foreground group-hover:text-primary group-hover:translate-x-1"
                  )}
                >
                  →
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-10 font-mono text-xs tracking-[0.22em] uppercase text-muted-foreground text-center">
        {lang === "en"
          ? "Honest answer · You can go back"
          : "Réponse honnête · Tu peux revenir en arrière"}
      </p>
    </div>
  );
}
