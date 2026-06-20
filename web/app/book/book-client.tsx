"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { cn } from "@/lib/utils";
import {
  COPY,
  PROJECT_DESCRIPTION_MAX,
  PROJECT_DESCRIPTION_MIN,
  isValidEmail,
  type Lang,
  type ProjectTypeKey,
  type RoleKey,
} from "@/lib/book/content";

type Phase = "q1" | "q2" | "q3" | "contact" | "calendly";

type CalendlyAPI = {
  initInlineWidget: (opts: {
    url: string;
    parentElement: HTMLElement;
    prefill?: {
      name?: string;
      email?: string;
      customAnswers?: Record<string, string>;
    };
    utm?: Record<string, string>;
    locale?: string;
  }) => void;
};

declare global {
  interface Window {
    Calendly?: CalendlyAPI;
  }
}

type StoredAnswers = {
  role: RoleKey | null;
  projectType: ProjectTypeKey | null;
  projectDescription: string;
  name: string;
  email: string;
  location: string;
};

const EMPTY: StoredAnswers = {
  role: null,
  projectType: null,
  projectDescription: "",
  name: "",
  email: "",
  location: "",
};

const getStorageKey = (lang: Lang) => `taiyka:book:answers:${lang}`;
const TOTAL_STEPS = 4;

function stepIndex(phase: Phase): number {
  if (phase === "q1") return 1;
  if (phase === "q2") return 2;
  if (phase === "q3") return 3;
  return 4;
}

export default function BookClient({ lang }: { lang: Lang }) {
  const c = COPY[lang];

  const [phase, setPhase] = useState<Phase>("q1");
  const [answers, setAnswers] = useState<StoredAnswers>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calendlyUrl, setCalendlyUrl] = useState<string | null>(null);
  const [calendlyScriptReady, setCalendlyScriptReady] = useState(false);
  const [booked, setBooked] = useState(false);

  const hydrated = useRef(false);
  const calendlyMountRef = useRef<HTMLDivElement | null>(null);
  const calendlyInitialized = useRef(false);
  const answersRef = useRef(answers);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [phase]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(getStorageKey(lang));
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoredAnswers>;
        setAnswers({ ...EMPTY, ...parsed });
      }
    } catch {
      // ignore — stale/corrupt storage just resets
    }
    hydrated.current = true;
  }, [lang]);

  // Persist on every change
  useEffect(() => {
    if (!hydrated.current) return;
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(getStorageKey(lang), JSON.stringify(answers));
    } catch {
      // storage may be unavailable (private mode) — silently skip
    }
  }, [answers, lang]);

  // Listen for Calendly postMessage events. Fires "calendly.event_scheduled" when user confirms slot.
  useEffect(() => {
    if (phase !== "calendly") return;
    function handler(e: MessageEvent) {
      if (e.origin !== "https://calendly.com") return;
      if (typeof e.data !== "object" || e.data == null) return;
      const event = (e.data as { event?: unknown }).event;
      if (typeof event !== "string") return;
      if (!event.startsWith("calendly.")) return;
      if (event === "calendly.event_scheduled") {
        setBooked(true);
      }
    }
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [phase]);

  // Init Calendly inline widget once: phase reaches calendly, URL ready, script loaded, mount node present.
  useEffect(() => {
    if (phase !== "calendly") return;
    if (!calendlyUrl) return;
    if (!calendlyScriptReady) return;
    if (!calendlyMountRef.current) return;
    if (calendlyInitialized.current) return;
    if (!window.Calendly) return;
    window.Calendly.initInlineWidget({
      url: calendlyUrl,
      parentElement: calendlyMountRef.current,
      prefill: {
        name: answersRef.current.name,
        email: answersRef.current.email,
        // Maps to Calendly custom questions by position. The event must have
        // matching custom questions configured in the dashboard (Event type →
        // Booking page → Questions). Extra keys are silently ignored if the
        // event has fewer questions.
        customAnswers: {
          a1: answersRef.current.projectDescription,
          a2: answersRef.current.location,
        },
      },
      locale: lang,
    });
    calendlyInitialized.current = true;
  }, [
    phase,
    calendlyUrl,
    calendlyScriptReady,
  ]);

  useEffect(() => {
    if (phase !== "calendly") {
      calendlyInitialized.current = false;
    }
  }, [phase]);

  useEffect(() => {
    if (booked) calendlyInitialized.current = false;
  }, [booked]);

  const isContactValid = useMemo(() => {
    return (
      answers.name.trim().length >= 1 &&
      isValidEmail(answers.email.trim()) &&
      answers.location.trim().length >= 1
    );
  }, [answers.name, answers.email, answers.location]);

  const q3Length = answers.projectDescription.trim().length;
  const isQ3Valid =
    q3Length >= PROJECT_DESCRIPTION_MIN && q3Length <= PROJECT_DESCRIPTION_MAX;

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          lang,
          role: answers.role,
          projectType: answers.projectType,
          projectDescription: answers.projectDescription.trim(),
          name: answers.name.trim(),
          email: answers.email.trim(),
          location: answers.location.trim(),
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        calendlyUrl?: string | null;
        error?: string;
        issues?: { field: string; message: string }[];
      };
      if (!res.ok || !data.ok) {
        setError(data.issues?.[0]?.message ?? data.error ?? c.errorGeneric);
        setSubmitting(false);
        return;
      }
      setCalendlyUrl(data.calendlyUrl ?? null);
      setPhase("calendly");
      // Successful submit — clear local draft so a refresh doesn't reload it
      try {
        window.localStorage.removeItem(getStorageKey(lang));
      } catch {
        // ignore
      }
    } catch {
      setError(c.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative flex-1 w-full flex flex-col z-10 min-h-screen">
      <div
        className="relative mx-auto w-full max-w-xl px-6 pt-6 pb-12 flex flex-col flex-1"
        style={{ opacity: 0, animation: "qcm-fade-in 400ms ease-out forwards" }}
      >
        {/* Top bar — back home + step indicator + lang toggle */}
        <div className="w-full flex items-center justify-between mb-10 md:mb-14 font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
          <Link
            href={lang === "en" ? "/?lang=en" : "/"}
            className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm px-1"
          >
            <span aria-hidden>← </span>
            {lang === "fr" ? "Retour" : "Back"}
          </Link>
          {phase !== "calendly" && phase !== "contact" && (
            <span className="text-foreground/70">
              {c.step(stepIndex(phase), TOTAL_STEPS)}
            </span>
          )}
          <Link
            href={c.langSwitchHref}
            className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm px-1"
          >
            {c.langSwitch}
          </Link>
        </div>

        {phase === "q1" && (
          <Step
            question={c.q1Question}
            stepLabel={c.step(1, TOTAL_STEPS)}
            headingRef={headingRef}
          >
            <ChoiceList
              choices={c.q1Choices}
              selected={answers.role}
              onSelect={(key) => {
                setAnswers((a) => ({ ...a, role: key }));
                setPhase("q2");
              }}
            />
          </Step>
        )}

        {phase === "q2" && (
          <Step
            question={c.q2Question}
            stepLabel={c.step(2, TOTAL_STEPS)}
            onBack={() => setPhase("q1")}
            backLabel={c.back}
            headingRef={headingRef}
          >
            <ChoiceList
              choices={c.q2Choices}
              selected={answers.projectType}
              onSelect={(key) => {
                setAnswers((a) => ({ ...a, projectType: key }));
                setPhase("q3");
              }}
            />
          </Step>
        )}

        {phase === "q3" && (
          <Step
            question={c.q3Question}
            stepLabel={c.step(3, TOTAL_STEPS)}
            onBack={() => setPhase("q2")}
            backLabel={c.back}
            headingRef={headingRef}
          >
            <div className="flex flex-col gap-3">
              <textarea
                value={answers.projectDescription}
                onChange={(e) =>
                  setAnswers((a) => ({ ...a, projectDescription: e.target.value }))
                }
                placeholder={c.q3Placeholder}
                rows={6}
                maxLength={PROJECT_DESCRIPTION_MAX}
                className="w-full rounded-md border border-white/15 bg-white/[0.02] px-4 py-3 text-[0.95rem] md:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:bg-white/[0.05] transition-colors resize-y min-h-[160px]"
              />
              <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
                <span>{c.q3MinChars}</span>
                <span className={cn(isQ3Valid ? "text-primary" : "text-muted-foreground/60")}>
                  {q3Length} / {PROJECT_DESCRIPTION_MAX}
                </span>
              </div>
              <button
                type="button"
                disabled={!isQ3Valid}
                onClick={() => setPhase("contact")}
                className={cn(
                  "self-end mt-2 rounded-full py-3 px-6 text-[0.95rem] font-semibold tracking-tight transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]",
                  isQ3Valid
                    ? "bg-gradient-hero text-[#0a1628] shadow-glow hover:scale-[1.02]"
                    : "bg-white/[0.05] text-muted-foreground cursor-not-allowed",
                )}
              >
                {c.next}
              </button>
            </div>
          </Step>
        )}

        {phase === "contact" && (
          <Step
            stepLabel={c.contactKicker}
            question={c.contactTitle}
            onBack={() => setPhase("q3")}
            backLabel={c.back}
            headingRef={headingRef}
          >
            <p className="text-[0.95rem] text-foreground/70 mb-6 leading-relaxed">
              {c.contactBlurb}
            </p>
            <div className="flex flex-col gap-5">
              <Field
                label={c.nameLabel}
                value={answers.name}
                onChange={(v) => setAnswers((a) => ({ ...a, name: v }))}
                placeholder={c.namePlaceholder}
                type="text"
                autoComplete="name"
              />
              <Field
                label={c.emailLabel}
                value={answers.email}
                onChange={(v) => setAnswers((a) => ({ ...a, email: v }))}
                placeholder={c.emailPlaceholder}
                type="email"
                autoComplete="email"
              />
              <Field
                label={c.locationLabel}
                value={answers.location}
                onChange={(v) => setAnswers((a) => ({ ...a, location: v }))}
                placeholder={c.locationPlaceholder}
                hint={c.locationHint}
                type="text"
                autoComplete="address-level2"
              />

              {error && (
                <p className="text-sm text-[#ff7a7a]" role="alert">
                  {error}
                </p>
              )}

              <button
                type="button"
                disabled={!isContactValid || submitting}
                onClick={submit}
                className={cn(
                  "mt-2 rounded-full py-4 px-6 text-[0.95rem] md:text-base font-semibold tracking-tight transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]",
                  isContactValid && !submitting
                    ? "bg-gradient-hero text-[#0a1628] shadow-glow hover:scale-[1.02]"
                    : "bg-white/[0.05] text-muted-foreground cursor-not-allowed",
                )}
              >
                {submitting ? c.submitting : c.submit}
              </button>
            </div>
          </Step>
        )}

        {phase === "calendly" && booked && (
          <div className="flex flex-col items-center text-center py-8">
            <div
              aria-hidden
              className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full border border-[#10b981]/40 bg-[#10b981]/10 mb-8"
              style={{ boxShadow: "0 0 48px rgba(16,185,129,0.25)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10b981"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10 md:w-12 md:h-12"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="kicker mb-4">{c.bookedKicker}</p>
            <h1 className="text-balance font-bold tracking-[-0.02em] leading-tight text-[clamp(1.75rem,5vw,2.5rem)] mb-3">
              {c.bookedTitle}
            </h1>
            <p className="text-[0.95rem] text-foreground/75 mb-10 leading-relaxed max-w-md">
              {c.bookedBlurb}
            </p>
            <Link
              href={lang === "en" ? "/?lang=en" : "/"}
              className="inline-block rounded-full py-4 px-8 text-[0.95rem] md:text-base font-semibold tracking-tight bg-gradient-hero text-[#0a1628] shadow-glow hover:scale-[1.02] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]"
            >
              {c.backHomeCta} <span aria-hidden>→</span>
            </Link>
          </div>
        )}

        {phase === "calendly" && !booked && (
          <div>
            <p className="kicker mb-4">{c.calendlyKicker}</p>
            <h1 className="text-balance font-bold tracking-[-0.02em] leading-tight text-[clamp(1.75rem,5vw,2.5rem)] mb-3">
              {calendlyUrl ? c.calendlyTitle : c.calendlyMissingTitle}
            </h1>
            <p className="text-[0.95rem] text-foreground/75 mb-8 leading-relaxed">
              {calendlyUrl ? c.calendlyBlurb : c.calendlyMissingBlurb}
            </p>
            {calendlyUrl ? (
              <>
                <Script
                  src="https://assets.calendly.com/assets/external/widget.js"
                  strategy="afterInteractive"
                  onLoad={() => setCalendlyScriptReady(true)}
                  onReady={() => setCalendlyScriptReady(true)}
                />
                <div
                  ref={calendlyMountRef}
                  className="w-full rounded-md overflow-hidden border border-white/10 bg-white"
                  style={{ minWidth: 320, height: "min(85vh, 820px)", minHeight: 600 }}
                />
              </>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}

function Step({
  question,
  stepLabel,
  onBack,
  backLabel,
  headingRef,
  children,
}: {
  question: string;
  stepLabel?: string;
  onBack?: () => void;
  backLabel?: string;
  headingRef?: React.Ref<HTMLHeadingElement>;
  children: React.ReactNode;
}) {
  return (
    <div>
      {stepLabel && (
        <p className="kicker mb-4" aria-hidden>
          {stepLabel}
        </p>
      )}
      <h1 ref={headingRef} tabIndex={-1} className="text-balance font-bold tracking-[-0.02em] leading-tight text-[clamp(1.75rem,5vw,2.5rem)] mb-8 md:mb-10 focus:outline-none">
        {question}
      </h1>
      {children}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm px-1"
        >
          <span aria-hidden>←</span> {backLabel}
        </button>
      )}
    </div>
  );
}

function ChoiceList<T extends string>({
  choices,
  selected,
  onSelect,
}: {
  choices: { key: T; label: string }[];
  selected: T | null;
  onSelect: (key: T) => void;
}) {
  return (
    <ul className="flex flex-col gap-3">
      {choices.map((choice) => {
        const isSelected = selected === choice.key;
        return (
          <li key={choice.key}>
            <button
              type="button"
              onClick={() => onSelect(choice.key)}
              className={cn(
                "block w-full text-left rounded-full py-4 px-6 text-[0.95rem] md:text-base font-medium tracking-tight transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]",
                "border bg-white/[0.02] hover:scale-[1.01]",
                isSelected
                  ? "border-primary/60 bg-primary/[0.08] text-foreground"
                  : "border-white/15 text-foreground hover:border-primary/60 hover:bg-white/[0.05]",
              )}
            >
              {choice.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  hint?: string;
  type: "text" | "email";
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-md border border-white/15 bg-white/[0.02] px-4 py-3 text-[0.95rem] md:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:bg-white/[0.05] transition-colors"
      />
      {hint && (
        <span className="text-xs text-muted-foreground/80">{hint}</span>
      )}
    </label>
  );
}
