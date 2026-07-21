"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import QuizQuestion from "@/components/QuizQuestion";
import QuizProgress from "@/components/QuizProgress";
import { Ticker } from "@/components/site/Ticker";
import { QCM_TICKER } from "@/app/qcm/ticker";
import { QUESTIONS } from "@/lib/quiz-questions";
import type { Answer } from "@/lib/quiz-questions";
import {
  computeProfile,
  computeScores,
  type AnswersMap,
} from "@/lib/quiz-scoring";
import { withLang } from "@/lib/lang-utils";

// Lazy-load the gate: it's only needed after the user answers all 9 questions.
// Keeping it out of the initial bundle trims the JS shipped for the hot path.
const QuizEmailGate = dynamic(() => import("@/components/QuizEmailGate"), {
  ssr: false,
});

type Phase = "question" | "email";

// Namespace storage by lang so that switching languages doesn't replay stale
// answers in a different locale (which would also confuse the profile mapping
// once questions are localized). Each language gets its own bucket.
const storageKeyFor = (lang: "fr" | "en") => `taiyka:quiz:answers:${lang}`;

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

  // Hydrate from localStorage once per lang. If the saved index points past
  // the last question, jump straight to the email phase so the user doesn't
  // have to re-answer anything after a refresh. Re-runs when lang changes so
  // FR / EN read from their own buckets and never mix.
  useEffect(() => {
    // Mark not-yet-hydrated so the persistence effect won't fire mid-swap.
    hydratedRef.current = false;
    // Reset to defaults before loading the new lang bucket so we don't carry
    // over answers from the previous language.
    setAnswers({});
    setIndex(0);
    setPhase("question");
    try {
      const raw =
        typeof window !== "undefined"
          ? window.localStorage.getItem(storageKeyFor(lang))
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
  }, [total, lang]);

  // Persist whenever answers / index change, but only after hydration so we
  // don't overwrite saved state with the initial empty defaults.
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (typeof window === "undefined") return;
    try {
      const payload: PersistedState = { answers, index };
      window.localStorage.setItem(storageKeyFor(lang), JSON.stringify(payload));
    } catch {
      // Storage full / disabled — silently ignore.
    }
  }, [answers, index, lang]);

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
      window.localStorage.removeItem(storageKeyFor(lang));
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
    // Reset local state too — a back-button visit to /qcm/quiz must not
    // replay the just-skipped answers from in-memory state.
    setAnswers({});
    setIndex(0);
    setPhase("question");
    router.push(withLang(`/qcm/resultat/${profile}?from=quiz-skip`, lang));
  }

  // Stable live-region announcer for screen readers. QuizQuestion no longer
  // owns this (the element used to be remounted per question, which prevented
  // NVDA/JAWS from announcing the change). We mutate textContent via ref so
  // the node identity stays stable across question advances.
  const liveRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (phase !== "question") return;
    if (!liveRef.current) return;
    liveRef.current.textContent =
      lang === "fr"
        ? `Question ${index + 1} sur ${total}`
        : `Question ${index + 1} of ${total}`;
  }, [phase, index, total, lang]);

  return (
    <main className="relative flex-1 w-full min-h-screen z-10">
      <Ticker items={QCM_TICKER[lang]} />
      <div
        className="relative mx-auto w-full max-w-2xl px-6 md:px-10 py-10 md:py-16"
        style={{ opacity: 0, animation: "qcm-fade-in 400ms ease-out forwards" }}
      >
        {/* Stable live region: text content swaps on question advance so
            screen readers announce "Question X / Y" without remounting. */}
        <div ref={liveRef} role="status" aria-live="polite" className="sr-only" />

        {phase === "question" && (
          <>
            <div className="w-full flex items-center justify-between mb-6 font-mono-hud text-[11px] tracking-[0.18em] uppercase">
              {index > 0 ? (
                <button
                  onClick={handleBack}
                  className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
                >
                  {t.backStep}
                </button>
              ) : (
                <Link
                  href={withLang("/", lang)}
                  className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
                >
                  {t.backHome}
                </Link>
              )}
              <div className="flex items-center gap-4">
                <Link
                  href={t.langOtherHref}
                  className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
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

            {/* Countdown is hidden on the early questions (Q1-Q4) where it
                only accelerates drop-off, and on the last question where it
                would read "0 questions to go". Only render when 1-3 left. */}
            {remaining > 0 && remaining <= 3 && (
              <p className="mt-3 font-mono-hud text-xs tracking-[0.18em] uppercase text-muted-foreground text-right tabular-nums">
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
                lang={lang}
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
            onComplete={() => {
              clearStorage();
              setAnswers({});
              setIndex(0);
              setPhase("question");
            }}
          />
        )}
      </div>
    </main>
  );
}
