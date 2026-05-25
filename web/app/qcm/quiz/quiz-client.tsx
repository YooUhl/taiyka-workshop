"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import QuizQuestion from "@/components/QuizQuestion";
import QuizProgress from "@/components/QuizProgress";
import { QUESTIONS } from "@/lib/quiz-questions";
import type { Answer } from "@/lib/quiz-questions";
import {
  computeProfile,
  computeScores,
  type AnswersMap,
} from "@/lib/quiz-scoring";

// Lazy-load the gate: it's only needed after the user answers all 9 questions.
// Keeping it out of the initial bundle trims the JS shipped for the hot path.
const QuizEmailGate = dynamic(() => import("@/components/QuizEmailGate"), {
  ssr: false,
});

type Phase = "question" | "email";

const STORAGE_KEY = "taiyka:quiz:answers";

type PersistedState = {
  answers: AnswersMap;
  index: number;
};

const COPY = {
  fr: {
    backHome: "← TAIYKA · Accueil",
    backStep: "← Retour",
    questionCounter: (i: number, t: number) => (
      <>
        Question <span className="text-foreground">{i}</span> / {t}
      </>
    ),
    remaining: (left: number) =>
      left === 1 ? "Plus qu'1 question" : `Plus que ${left} questions`,
    langOther: "EN",
    langOtherHref: "/qcm/quiz?lang=en",
  },
  en: {
    backHome: "← TAIYKA · Home",
    backStep: "← Back",
    questionCounter: (i: number, t: number) => (
      <>
        Question <span className="text-foreground">{i}</span> / {t}
      </>
    ),
    remaining: (left: number) =>
      left === 1 ? "1 question to go" : `${left} questions to go`,
    langOther: "FR",
    langOtherHref: "/qcm/quiz?lang=fr",
  },
} as const;

type Props = {
  lang: "fr" | "en";
};

export default function QuizClient({ lang }: Props) {
  const router = useRouter();
  const t = COPY[lang];

  const [phase, setPhase] = useState<Phase>("question");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersMap>({});
  // Block persistence writes until after we've attempted hydration once,
  // otherwise the initial empty `answers` would clobber whatever is in storage.
  const hydratedRef = useRef(false);

  const total = QUESTIONS.length;
  const current = QUESTIONS[index];
  const remaining = total - (index + 1);

  // Hydrate from localStorage once on mount. If the saved index points past the
  // last question, jump straight to the email phase so the user doesn't have to
  // re-answer anything after a refresh.
  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? window.localStorage.getItem(STORAGE_KEY)
          : null;
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistedState>;
        if (parsed && typeof parsed === "object" && parsed.answers) {
          setAnswers(parsed.answers);
          const savedIdx =
            typeof parsed.index === "number" ? parsed.index : 0;
          if (savedIdx >= total) {
            setIndex(total - 1);
            setPhase("email");
          } else if (savedIdx >= 0) {
            setIndex(savedIdx);
          }
        }
      }
    } catch {
      // Corrupt JSON or storage disabled — ignore and start fresh.
    }
    hydratedRef.current = true;
  }, [total]);

  // Persist whenever answers / index change, but only after hydration so we
  // don't overwrite saved state with the initial empty defaults.
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (typeof window === "undefined") return;
    try {
      const payload: PersistedState = { answers, index };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Storage full / disabled — silently ignore.
    }
  }, [answers, index]);

  const { profile, scores } = useMemo(() => {
    if (phase !== "email") return { profile: null, scores: null };
    return {
      profile: computeProfile(answers),
      scores: computeScores(answers),
    };
  }, [phase, answers]);

  function clearStorage() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  function handleAnswer(questionId: string, answer: Answer) {
    setAnswers((prev) => ({ ...prev, [questionId]: answer.id }));
    if (index < total - 1) {
      setIndex((prev) => prev + 1);
    } else {
      setPhase("email");
    }
  }

  function handleBack() {
    if (index === 0) return;
    setIndex((prev) => prev - 1);
  }

  function handleSkip() {
    if (!profile) return;
    clearStorage();
    router.push(`/qcm/resultat/${profile}?from=quiz-skip`);
  }

  return (
    <main className="relative flex-1 w-full min-h-screen z-10">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[40vh] bg-gradient-glow opacity-40 blur-2xl"
      />

      <div
        className="relative mx-auto w-full max-w-2xl px-6 md:px-10 py-10 md:py-16"
        style={{ opacity: 0, animation: "qcm-fade-in 400ms ease-out forwards" }}
      >
        {phase === "question" && (
          <>
            <div className="w-full flex items-center justify-between mb-6 font-mono text-[11px] tracking-[0.22em] uppercase">
              {index > 0 ? (
                <button
                  onClick={handleBack}
                  className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
                >
                  {t.backStep}
                </button>
              ) : (
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
                >
                  {t.backHome}
                </Link>
              )}
              <div className="flex items-center gap-4">
                <Link
                  href={t.langOtherHref}
                  className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
                  aria-label={`Switch language to ${t.langOther}`}
                >
                  {t.langOther}
                </Link>
                <span className="text-muted-foreground tabular-nums">
                  {t.questionCounter(index + 1, total)}
                </span>
              </div>
            </div>

            <QuizProgress current={index + 1} total={total} />

            {remaining > 0 && (
              <p className="mt-3 font-mono text-xs tracking-[0.18em] uppercase text-muted-foreground text-right tabular-nums">
                {t.remaining(remaining)}
              </p>
            )}

            <div className="mt-14 md:mt-20">
              <QuizQuestion
                key={current.id}
                question={current}
                index={index}
                total={total}
                onAnswer={handleAnswer}
                selectedAnswerId={answers[current.id] ?? null}
              />
            </div>
          </>
        )}

        {phase === "email" && profile && scores && (
          <QuizEmailGate
            profile={profile}
            scores={scores}
            answers={answers}
            lang={lang}
            onSkip={handleSkip}
          />
        )}
      </div>
    </main>
  );
}
