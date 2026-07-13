"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  COPY,
  EMAIL_MAX,
  LOCATION_MIN,
  NAME_MIN,
  PROJECT_DESCRIPTION_MAX,
  PROJECT_DESCRIPTION_MIN,
  hasLetterChar,
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
    prefill?: { name?: string; email?: string };
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

type StoredDraft = {
  version: 2;
  phase: Phase;
  answers: StoredAnswers;
};

type BookedRecord = {
  at: number;
  email: string;
};

const EMPTY: StoredAnswers = {
  role: null,
  projectType: null,
  projectDescription: "",
  name: "",
  email: "",
  location: "",
};

// Single language-agnostic storage key. Lang is a routing concern only.
const DRAFT_KEY = "taiyka:book:draft:v2";
const BOOKED_KEY = "taiyka:book:booked:v1";
const BOOKED_TTL_MS = 24 * 60 * 60 * 1000;
const PHASES: Phase[] = ["q1", "q2", "q3", "contact", "calendly"];
const TOTAL_STEPS = 4;
const PERSIST_DEBOUNCE_MS = 300;
const CALENDLY_FALLBACK_MS = 8000;

function stepIndex(phase: Phase): number {
  if (phase === "q1") return 1;
  if (phase === "q2") return 2;
  if (phase === "q3") return 3;
  return 4;
}

function readDraft(): StoredDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredDraft>;
    if (parsed?.version !== 2) return null;
    if (!parsed.phase || !PHASES.includes(parsed.phase)) return null;
    if (!parsed.answers || typeof parsed.answers !== "object") return null;
    return {
      version: 2,
      phase: parsed.phase,
      answers: { ...EMPTY, ...parsed.answers },
    };
  } catch {
    return null;
  }
}

function readBooked(): BookedRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(BOOKED_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<BookedRecord>;
    if (typeof parsed?.at !== "number") return null;
    if (Date.now() - parsed.at > BOOKED_TTL_MS) return null;
    return { at: parsed.at, email: parsed.email ?? "" };
  } catch {
    return null;
  }
}

function detectStorage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem("__taiyka_test", "x");
    window.localStorage.removeItem("__taiyka_test");
    return true;
  } catch {
    return false;
  }
}

function detectInAppBrowser(ua: string): boolean {
  return /FBAN|FBAV|Instagram|Line\/|Twitter|LinkedIn|GSA\//i.test(ua);
}

type FieldErrors = Partial<Record<"name" | "email" | "location", string>>;

export default function BookClient({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const router = useRouter();
  const searchParams = useSearchParams();

  const [phase, setPhase] = useState<Phase>("q1");
  const [answers, setAnswers] = useState<StoredAnswers>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submittingLong, setSubmittingLong] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [calendlyUrl, setCalendlyUrl] = useState<string | null>(null);
  const [calendlyScriptReady, setCalendlyScriptReady] = useState(false);
  const [calendlyScriptFailed, setCalendlyScriptFailed] = useState(false);
  const [calendlyFallback, setCalendlyFallback] = useState(false);
  const [booked, setBooked] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [draftRestoreFailed, setDraftRestoreFailed] = useState(false);
  const [inAppBrowser, setInAppBrowser] = useState(false);
  // Honeypot — must stay empty
  const [companyWebsite, setCompanyWebsite] = useState("");

  const hydrated = useRef(false);
  const calendlyMountRef = useRef<HTMLDivElement | null>(null);
  const calendlyInitialized = useRef(false);
  const answersRef = useRef(answers);
  const phaseRef = useRef(phase);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const inFlight = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Detect storage + in-app browser + booked flag + URL-driven phase on mount.
  useEffect(() => {
    setStorageAvailable(detectStorage());
    setInAppBrowser(detectInAppBrowser(navigator.userAgent));

    const bookedRecord = readBooked();
    if (bookedRecord) {
      setBooked(true);
      setPhase("calendly");
      return;
    }

    const urlStep = searchParams.get("step");
    const draft = readDraft();

    if (draft) {
      setAnswers(draft.answers);
      // Prefer URL step if set + valid; else stored phase; degrade to q1.
      if (urlStep && PHASES.includes(urlStep as Phase)) {
        setPhase(urlStep as Phase);
      } else if (draft.phase !== "calendly") {
        setPhase(draft.phase);
      }
    } else {
      // No draft — still respect URL step if set.
      if (urlStep && PHASES.includes(urlStep as Phase) && urlStep !== "calendly") {
        setPhase(urlStep as Phase);
      }
    }

    // Storage-disabled detection wasn't a draft restore error.
    if (storageAvailable === false) {
      // Don't show restore-fail if storage is just unavailable.
    } else {
      // Detect explicit corruption — try reading raw value and JSON.parse it.
      try {
        const raw = window.localStorage.getItem(DRAFT_KEY);
        if (raw) {
          JSON.parse(raw);
        }
      } catch {
        setDraftRestoreFailed(true);
      }
    }

    hydrated.current = true;
    isInitialMount.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist draft (debounced) — never persist on calendly phase (already submitted).
  useEffect(() => {
    if (!hydrated.current) return;
    if (typeof window === "undefined") return;
    if (phase === "calendly") return;
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      try {
        const draft: StoredDraft = { version: 2, phase, answers };
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      } catch {
        // quota / private mode — already surfaced via storageAvailable banner.
      }
    }, PERSIST_DEBOUNCE_MS);
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
    };
  }, [phase, answers]);

  // Sync phase to URL search param so browser back/forward works.
  useEffect(() => {
    if (!hydrated.current) return;
    const current = searchParams.get("step");
    if (current === phase) return;
    const params = new URLSearchParams(searchParams.toString());
    if (phase === "q1") {
      params.delete("step");
    } else {
      params.set("step", phase);
    }
    const qs = params.toString();
    router.replace(qs ? `/book?${qs}` : "/book", { scroll: false });
  }, [phase, router, searchParams]);

  // Focus heading on phase change — preventScroll keeps the mobile soft
  // keyboard from collapsing on every transition.
  useEffect(() => {
    if (isInitialMount.current) return;
    headingRef.current?.focus({ preventScroll: true });
  }, [phase]);

  // Cross-tab draft sync — warn user, don't auto-overwrite their in-memory state.
  useEffect(() => {
    if (typeof window === "undefined") return;
    function onStorage(e: StorageEvent) {
      if (e.key !== DRAFT_KEY) return;
      // Surface a non-blocking notice — don't clobber active typing.
      console.warn("[/book] draft updated in another tab");
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Calendly postMessage listener — strict origin + payload sanity.
  useEffect(() => {
    if (phase !== "calendly") return;
    function handler(e: MessageEvent) {
      if (e.origin !== "https://calendly.com") return;
      if (typeof e.data !== "object" || e.data == null) return;
      const event = (e.data as { event?: unknown }).event;
      if (typeof event !== "string") return;
      if (event !== "calendly.event_scheduled") return;
      // Record booking locally — survives refresh, lets us short-circuit reentry.
      try {
        const record: BookedRecord = { at: Date.now(), email: answersRef.current.email };
        window.localStorage.setItem(BOOKED_KEY, JSON.stringify(record));
        window.localStorage.removeItem(DRAFT_KEY);
      } catch {
        // ignore
      }
      setBooked(true);
    }
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [phase]);

  // Calendly inline widget init.
  useEffect(() => {
    if (phase !== "calendly") return;
    if (!calendlyUrl) return;
    if (!calendlyScriptReady) return;
    if (calendlyScriptFailed) return;
    if (!calendlyMountRef.current) return;
    if (calendlyInitialized.current) return;
    if (!window.Calendly) return;
    // Wipe any prior children before init — defensive against StrictMode re-runs.
    calendlyMountRef.current.replaceChildren();
    window.Calendly.initInlineWidget({
      url: calendlyUrl,
      parentElement: calendlyMountRef.current,
      // Only name + email passed — projectDescription + location stay in our
      // DB only, never leak into Calendly URL params (P0-22).
      prefill: {
        name: answersRef.current.name,
        email: answersRef.current.email,
      },
      locale: lang === "fr" ? "fr_FR" : "en_US",
    });
    calendlyInitialized.current = true;
  }, [phase, calendlyUrl, calendlyScriptReady, calendlyScriptFailed, lang]);

  useEffect(() => {
    if (phase !== "calendly") {
      calendlyInitialized.current = false;
    }
  }, [phase]);

  // Fallback timer — if Calendly hasn't rendered after N ms, surface "open in new tab".
  useEffect(() => {
    if (phase !== "calendly") return;
    if (!calendlyUrl) return;
    if (calendlyScriptReady) return;
    if (calendlyScriptFailed) return;
    const timer = setTimeout(() => setCalendlyFallback(true), CALENDLY_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [phase, calendlyUrl, calendlyScriptReady, calendlyScriptFailed]);

  // Cancel in-flight POST on unmount.
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  // Live validation — populates fieldErrors on blur only (not on every keystroke).
  const validateField = useCallback(
    (field: "name" | "email" | "location") => {
      setFieldErrors((prev) => {
        const next = { ...prev };
        const value = answersRef.current[field].trim();
        if (field === "name") {
          if (value.length < NAME_MIN || !hasLetterChar(value)) {
            next.name = c.errorRequired;
          } else {
            delete next.name;
          }
        } else if (field === "email") {
          if (!isValidEmail(value)) {
            next.email = c.errorEmail;
          } else {
            delete next.email;
          }
        } else if (field === "location") {
          if (value.length < LOCATION_MIN) {
            next.location = c.errorRequired;
          } else {
            delete next.location;
          }
        }
        return next;
      });
    },
    [c.errorEmail, c.errorRequired],
  );

  const isContactValid = useMemo(() => {
    return (
      hasLetterChar(answers.name.trim()) &&
      answers.name.trim().length >= NAME_MIN &&
      isValidEmail(answers.email.trim()) &&
      answers.location.trim().length >= LOCATION_MIN
    );
  }, [answers.name, answers.email, answers.location]);

  const q3Length = answers.projectDescription.trim().length;
  const isQ3Valid =
    q3Length >= PROJECT_DESCRIPTION_MIN && q3Length <= PROJECT_DESCRIPTION_MAX;

  function applyExample(text: string) {
    setAnswers((a) => ({
      ...a,
      projectDescription: a.projectDescription.length === 0 ? text : a.projectDescription,
    }));
  }

  async function submit() {
    if (inFlight.current) return;
    inFlight.current = true;
    setError(null);
    setFieldErrors({});
    setSubmitting(true);
    const longTimer = setTimeout(() => setSubmittingLong(true), 1000);

    abortRef.current = new AbortController();
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
          company_website: companyWebsite, // honeypot — server treats non-empty as bot
        }),
        signal: abortRef.current.signal,
      });
      const data = (await res.json()) as {
        ok: boolean;
        calendlyUrl?: string | null;
        error?: string;
        issues?: { field: string; message: string }[];
      };

      if (res.status === 429) {
        setError(c.errorRateLimit);
        return;
      }

      if (!res.ok || !data.ok) {
        if (data.issues && data.issues.length > 0) {
          const fe: FieldErrors = {};
          data.issues.forEach((i) => {
            if (i.field === "name") fe.name = i.message;
            else if (i.field === "email") fe.email = i.message;
            else if (i.field === "location") fe.location = i.message;
          });
          setFieldErrors(fe);
        }
        setError(data.error ?? c.errorGeneric);
        return;
      }

      setCalendlyUrl(data.calendlyUrl ?? null);
      setPhase("calendly");
      // Draft cleared only after successful Calendly booking (postMessage handler).
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") return;
      setError(c.errorGeneric);
    } finally {
      clearTimeout(longTimer);
      setSubmitting(false);
      setSubmittingLong(false);
      inFlight.current = false;
    }
  }

  const showHero = phase === "q1" && !booked;

  return (
    <main className="relative flex-1 w-full flex flex-col z-10 min-h-screen">
      <div
        className="relative mx-auto w-full max-w-xl px-6 pt-6 pb-12 flex flex-col flex-1"
        style={{ opacity: 1, animation: "qcm-fade-in 400ms ease-out forwards" }}
      >
        {/* Top bar — home link + step indicator (lang switch demoted to footer per P2-23) */}
        <div className="w-full flex items-center justify-between mb-6 md:mb-8 font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
          <Link
            href={lang === "en" ? "/?lang=en" : "/"}
            className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm px-1"
          >
            <span aria-hidden>← </span>
            {c.homeLabel}
          </Link>
          {phase !== "calendly" && (
            <span className="text-foreground/70">
              {c.step(stepIndex(phase), TOTAL_STEPS)}
            </span>
          )}
          <span aria-hidden className="w-12" />
        </div>

        {!storageAvailable && (
          <div className="mb-4 rounded-md border border-amber-500/40 bg-amber-500/5 px-4 py-2 text-xs text-amber-200">
            {c.storageDisabled}
          </div>
        )}
        {draftRestoreFailed && (
          <div className="mb-4 rounded-md border border-amber-500/40 bg-amber-500/5 px-4 py-2 text-xs text-amber-200">
            {c.draftRestoreFailed}
          </div>
        )}
        {inAppBrowser && phase === "calendly" && (
          <div className="mb-4 rounded-md border border-amber-500/40 bg-amber-500/5 px-4 py-2 text-xs text-amber-200">
            {lang === "fr"
              ? "Pour une meilleure expérience, ouvre ce lien dans ton navigateur (Safari / Chrome) plutôt que dans l'app."
              : "For the best experience, open this link in your browser (Safari / Chrome) rather than the app."}
          </div>
        )}

        {showHero && (
          <section aria-label={c.hero.outcome} className="mb-10 md:mb-14">
            <h2 className="text-balance font-bold tracking-[-0.02em] leading-tight text-[clamp(1.6rem,4.5vw,2.25rem)] mb-4">
              {c.hero.outcome}
            </h2>
            <p className="text-[0.95rem] md:text-base text-foreground/80 leading-relaxed mb-3">
              {c.hero.deliverable}
            </p>
            <p className="text-sm text-foreground/65 leading-relaxed mb-5">
              {c.hero.logistics}
            </p>
            <p className="text-sm text-primary/90 leading-relaxed mb-6">
              {c.hero.riskReversal}
            </p>

            {/* Author strip */}
            <div className="flex items-start gap-3 rounded-md border border-white/10 bg-white/[0.02] px-4 py-3 mb-5">
              <div
                aria-hidden
                className="shrink-0 mt-0.5 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-hero text-[#0a1628] font-bold text-sm"
              >
                M
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-primary mb-1">
                  {c.hero.authorName}
                </p>
                <p className="text-xs text-foreground/70 leading-relaxed">
                  {c.hero.authorCredential}
                </p>
              </div>
            </div>

            {/* Agenda */}
            <details className="rounded-md border border-white/10 bg-white/[0.02] px-4 py-2 mb-6">
              <summary className="cursor-pointer font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-colors py-1">
                {c.hero.agendaTitle}
              </summary>
              <ul className="mt-3 mb-2 flex flex-col gap-2 text-sm text-foreground/75">
                {c.hero.agendaSteps.map((step) => (
                  <li key={step} className="flex items-start gap-2">
                    <span aria-hidden className="mt-1 inline-block w-1 h-1 rounded-full bg-primary shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </details>

            <div className="hairline opacity-50" />
          </section>
        )}

        {phase === "q1" && !booked && (
          <Step
            question={c.q1Question}
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
            <p className="mt-6 text-xs text-muted-foreground">
              <Link
                href={c.hero.notReadyHref}
                className="text-primary/80 hover:text-primary underline-offset-4 hover:underline transition-colors"
              >
                {c.hero.notReadyLabel}
              </Link>
            </p>
          </Step>
        )}

        {phase === "q2" && !booked && (
          <Step
            question={c.q2Question}
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

        {phase === "q3" && !booked && (
          <Step
            question={c.q3Question}
            onBack={() => setPhase("q2")}
            backLabel={c.back}
            headingRef={headingRef}
          >
            <div className="flex flex-col gap-3">
              {/* Example pills — tap to prefill */}
              <div className="flex flex-wrap gap-2 mb-1">
                {c.q3Examples.map((ex) => (
                  <button
                    type="button"
                    key={ex}
                    onClick={() => applyExample(ex)}
                    className="text-xs px-3 py-1.5 rounded-full border border-white/15 bg-white/[0.02] text-foreground/75 hover:border-primary/50 hover:text-foreground transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
              <textarea
                value={answers.projectDescription}
                onChange={(e) =>
                  setAnswers((a) => ({ ...a, projectDescription: e.target.value }))
                }
                placeholder={c.q3Placeholder}
                rows={6}
                aria-describedby="q3-counter"
                className="w-full rounded-md border border-white/15 bg-white/[0.02] px-4 py-3 text-[0.95rem] md:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:bg-white/[0.05] transition-colors resize-y min-h-[160px]"
              />
              <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.15em] uppercase">
                <span className={cn(isQ3Valid ? "text-muted-foreground" : "text-muted-foreground/80")}>{c.q3Hint}</span>
                <span
                  id="q3-counter"
                  aria-live="polite"
                  className={cn(
                    isQ3Valid
                      ? q3Length > PROJECT_DESCRIPTION_MAX * 0.9
                        ? "text-amber-400"
                        : "text-primary"
                      : "text-muted-foreground/60",
                  )}
                >
                  {q3Length} / {PROJECT_DESCRIPTION_MAX}
                </span>
              </div>
              {q3Length > PROJECT_DESCRIPTION_MAX && (
                <p className="text-xs text-amber-400" role="alert">
                  {lang === "fr"
                    ? `Trop long — résume en ${PROJECT_DESCRIPTION_MAX} caractères max.`
                    : `Too long — trim to ${PROJECT_DESCRIPTION_MAX} characters max.`}
                </p>
              )}
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

        {phase === "contact" && !booked && (
          <Step
            question={c.contactTitle}
            onBack={() => setPhase("q3")}
            backLabel={c.back}
            headingRef={headingRef}
          >
            <p className="text-[0.95rem] text-foreground/70 mb-6 leading-relaxed">
              {c.contactBlurb}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isContactValid && !submitting) submit();
              }}
              className="flex flex-col gap-5"
              noValidate
            >
              {/* Honeypot — visually hidden, screen-reader hidden, off-tab. */}
              <input
                type="text"
                tabIndex={-1}
                aria-hidden="true"
                autoComplete="off"
                name="company_website"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden"
              />

              <Field
                id="book-name"
                label={c.nameLabel}
                value={answers.name}
                onChange={(v) => setAnswers((a) => ({ ...a, name: v }))}
                onBlur={() => validateField("name")}
                placeholder={c.namePlaceholder}
                type="text"
                autoComplete="name"
                error={fieldErrors.name}
              />
              <Field
                id="book-email"
                label={c.emailLabel}
                value={answers.email}
                onChange={(v) => setAnswers((a) => ({ ...a, email: v }))}
                onBlur={() => validateField("email")}
                placeholder={c.emailPlaceholder}
                hint={c.emailTrustHint}
                type="email"
                autoComplete="email"
                inputMode="email"
                maxLength={EMAIL_MAX}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                error={fieldErrors.email}
              />
              <Field
                id="book-location"
                label={c.locationLabel}
                value={answers.location}
                onChange={(v) => setAnswers((a) => ({ ...a, location: v }))}
                onBlur={() => validateField("location")}
                placeholder={c.locationPlaceholder}
                hint={c.locationHint}
                type="text"
                autoComplete="address-level2"
                error={fieldErrors.location}
              />

              {/* Always-mounted error region for assertive SR announce */}
              <p
                role="alert"
                aria-live="assertive"
                className={cn(
                  "text-sm text-[#ff7a7a] min-h-[1.25rem]",
                  !error && "sr-only",
                )}
              >
                {error ?? ""}
              </p>

              <button
                type="submit"
                disabled={!isContactValid || submitting}
                className={cn(
                  "mt-2 rounded-full py-4 px-6 text-[0.95rem] md:text-base font-semibold tracking-tight transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]",
                  isContactValid && !submitting
                    ? "bg-gradient-hero text-[#0a1628] shadow-glow hover:scale-[1.02]"
                    : "bg-white/[0.05] text-muted-foreground cursor-not-allowed",
                  submitting && "opacity-70",
                )}
              >
                {submitting ? (submittingLong ? c.submittingLong : c.submitting) : c.submit}
              </button>
            </form>
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

            <div className="mt-12 w-full max-w-md text-left">
              <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground mb-4">
                {c.bookedUpsellTitle}
              </p>
              <ul className="flex flex-col gap-3">
                {c.bookedUpsells.map((up) => (
                  <li key={up.href}>
                    {up.external ? (
                      <a
                        href={up.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-foreground/85 hover:text-primary transition-colors leading-snug"
                      >
                        {up.label} <span aria-hidden>→</span>
                      </a>
                    ) : (
                      <Link
                        href={up.href}
                        className="block text-sm text-foreground/85 hover:text-primary transition-colors leading-snug"
                      >
                        {up.label} <span aria-hidden>→</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {phase === "calendly" && !booked && (
          <div>
            <p className="kicker mb-4">{c.calendlyKicker}</p>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="text-balance font-bold tracking-[-0.02em] leading-tight text-[clamp(1.75rem,5vw,2.5rem)] mb-3 focus:outline-none"
            >
              {calendlyScriptFailed
                ? c.calendlyScriptFailedTitle
                : calendlyUrl
                  ? c.calendlyTitle
                  : c.calendlyMissingTitle}
            </h1>
            <p className="text-[0.95rem] text-foreground/75 mb-3 leading-relaxed">
              {calendlyScriptFailed
                ? c.calendlyScriptFailedBlurb
                : calendlyUrl
                  ? c.calendlyBlurb
                  : c.calendlyMissingBlurb}
            </p>
            {calendlyUrl && !calendlyScriptFailed && (
              <p className="text-xs text-muted-foreground mb-6">{c.calendlyTimezoneHint}</p>
            )}
            {calendlyUrl ? (
              <>
                {/* Calendly widget CSS — scoped to /book (removed from root layout
                    per audit P2-6 so it no longer render-blocks other routes). */}
                <link
                  rel="stylesheet"
                  href="https://assets.calendly.com/assets/external/widget.css"
                />
                <Script
                  src="https://assets.calendly.com/assets/external/widget.js"
                  strategy="afterInteractive"
                  onReady={() => setCalendlyScriptReady(true)}
                  onError={() => setCalendlyScriptFailed(true)}
                />
                <div className="w-full overflow-x-hidden">
                  <div
                    ref={calendlyMountRef}
                    className="w-full rounded-md overflow-hidden border border-white/10 bg-white"
                    style={{ minHeight: 600, height: "min(85vh, 820px)" }}
                  />
                </div>
                {/* Fallback link — always visible after timeout, immediately on script error */}
                {(calendlyFallback || calendlyScriptFailed) && (
                  <div className="mt-4 p-4 rounded-md border border-white/10 bg-white/[0.02]">
                    <p className="text-sm text-foreground/80 mb-3">
                      {calendlyScriptFailed
                        ? c.calendlyScriptFailedBlurb
                        : c.calendlyFallbackBlurb}
                    </p>
                    <a
                      href={calendlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors"
                    >
                      {c.calendlyOpenInNewTab} <span aria-hidden>↗</span>
                    </a>
                  </div>
                )}
              </>
            ) : null}
          </div>
        )}

        {/* Demoted lang toggle at footer — won't compete with primary CTA */}
        <div className="mt-auto pt-10 text-center">
          <Link
            href={c.langSwitchHref}
            className="inline-block font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground/60 hover:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm px-1"
          >
            <span aria-hidden>🌐 </span>
            {c.langSwitch}
          </Link>
        </div>
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
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-balance font-bold tracking-[-0.02em] leading-tight text-[clamp(1.75rem,5vw,2.5rem)] mb-8 md:mb-10 focus:outline-none"
      >
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
              aria-label={choice.label}
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
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  hint,
  error,
  type,
  autoComplete,
  inputMode,
  maxLength,
  autoCapitalize,
  autoCorrect,
  spellCheck,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder: string;
  hint?: string;
  error?: string;
  type: "text" | "email";
  autoComplete?: string;
  inputMode?: "text" | "email";
  maxLength?: number;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: "on" | "off";
  spellCheck?: boolean;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        spellCheck={spellCheck}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className={cn(
          "w-full rounded-md border bg-white/[0.02] px-4 py-3 text-[0.95rem] md:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:bg-white/[0.05] transition-colors",
          error
            ? "border-[#ff7a7a]/70 focus:border-[#ff7a7a]"
            : "border-white/15 focus:border-primary/60",
        )}
      />
      {hint && !error && (
        <span id={hintId} className="text-xs text-muted-foreground/80">
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className="text-xs text-[#ff7a7a]" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
