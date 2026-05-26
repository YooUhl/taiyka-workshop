"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ProfileSlug } from "@/lib/quiz-questions";
import type { AnswersMap, Scores } from "@/lib/quiz-scoring";

type Props = {
  profile: ProfileSlug;
  scores: Scores;
  answers: AnswersMap;
  lang?: "fr" | "en";
  onSkip?: () => void;
  onComplete?: () => void;
};

type Status = "idle" | "loading" | "analyzing" | "success" | "error";

const ANALYZING_LINES_FR = [
  "Analyse de tes 9 réponses...",
  "Compilation de ton profil...",
  "Préparation de ta prochaine étape...",
];

const ANALYZING_LINES_EN = [
  "Analyzing your 9 answers...",
  "Compiling your profile...",
  "Preparing your next step...",
];

const COPY = {
  fr: {
    statusLabel: "TAIYKA · QCM",
    progress: "9 / 9 · Complété",
    kicker: "RÉSULTAT PRÊT",
    headlineLine1: "Ton profil",
    headlineLine2: "est prêt.",
    blockquoteMain:
      "Tu fais partie d'un type d'entrepreneur très précis — et ce qui va vraiment te faire bouger, c'est sûrement pas ce que tu crois.",
    blockquoteSub:
      "Entre ton email. Tu reçois ton profil + la prochaine étape concrète pour toi.",
    emailLabel: "Email",
    emailPlaceholder: "ton@email.com",
    submitIdle: "Débloquer mon profil →",
    submitLoading: "Envoi...",
    reassurance: "Pas de spam. Tu te désabonnes en un clic. Promis.",
    skipLink: "Pas envie de donner ton email ? Voir mon profil sans tips →",
    errorMsg:
      "Ça a pas pris. Réessaie, ou écris-moi : manu.uhila@taiyka.com.",
    privacyFooter:
      "Tes réponses restent privées. Servent uniquement à personnaliser ton résultat.",
  },
  en: {
    statusLabel: "TAIYKA · QUIZ",
    progress: "9 / 9 · Complete",
    kicker: "RESULT READY",
    headlineLine1: "Your profile is ready.",
    headlineLine2: "Drop your email.",
    blockquoteMain:
      "You're a very specific type of entrepreneur — and what's really going to move the needle for you probably isn't what you think.",
    blockquoteSub:
      "Drop your email. You get your profile + the concrete next step for you.",
    emailLabel: "Email",
    emailPlaceholder: "your@email.com",
    submitIdle: "Unlock my profile →",
    submitLoading: "Sending...",
    reassurance: "No spam. One-click unsubscribe. I promise.",
    skipLink: "Skip the email — show me my profile →",
    errorMsg:
      "Didn't go through. Try again, or write me: manu.uhila@taiyka.com.",
    privacyFooter:
      "Your answers stay private. Used only to personalize your result.",
  },
} as const;

export default function QuizEmailGate({
  profile,
  scores,
  answers,
  lang = "fr",
  onSkip,
  onComplete,
}: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analyzingIndex, setAnalyzingIndex] = useState(0);

  const t = COPY[lang];
  const analyzingLines = lang === "en" ? ANALYZING_LINES_EN : ANALYZING_LINES_FR;

  useEffect(() => {
    if (status !== "analyzing") return;
    const timer = window.setTimeout(() => {
      if (analyzingIndex < analyzingLines.length - 1) {
        setAnalyzingIndex(analyzingIndex + 1);
      } else {
        const params = new URLSearchParams();
        params.set("from", "quiz-gate");
        if (lang === "en") params.set("lang", "en");
        router.push(`/qcm/resultat/${profile}?${params.toString()}`);
      }
    }, 800);
    return () => window.clearTimeout(timer);
  }, [status, analyzingIndex, profile, router, analyzingLines.length, lang]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);

    const webhookUrl = process.env.NEXT_PUBLIC_LEADMAGNET_WEBHOOK_URL;

    try {
      if (!webhookUrl) {
        throw new Error("Webhook URL is not configured.");
      }

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 8000);

      try {
        const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name: "",
            lang,
            source: "qcm",
            productSlug: "qcm-profil",
            profile,
            scores,
            answers,
            userAgent,
          }),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } finally {
        window.clearTimeout(timeoutId);
      }
    } catch (err) {
      console.warn("Lead-capture webhook failed.", err);
      setErrorMsg(t.errorMsg);
      setStatus("error");
      return;
    }

    onComplete?.();
    setAnalyzingIndex(0);
    setStatus("analyzing");
  }

  function handleSkip() {
    if (!onSkip) return;
    onSkip();
  }

  const isBusy = status === "loading" || status === "analyzing";

  return (
    <div
      className="w-full"
      style={{ animation: "qcm-fade-slide 400ms ease-out" }}
    >
      <div className="w-full flex items-center justify-between mb-10 font-mono text-[11px] tracking-[0.22em] uppercase">
        <span className="inline-flex items-center gap-2 text-muted-foreground">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {t.statusLabel}
        </span>
        <span className="inline-flex items-center gap-2 text-primary">
          {t.progress}
        </span>
      </div>

      <span className="kicker">{t.kicker}</span>

      <h2 className="mt-5 mb-8 text-balance font-bold tracking-[-0.04em] leading-[0.98] text-[clamp(2.25rem,7vw,4rem)]">
        {t.headlineLine1}
        <br />
        <span className="text-gradient-hero">{t.headlineLine2}</span>
      </h2>

      <blockquote className="relative pl-6 border-l border-[rgba(141,162,192,0.36)] mb-10">
        <span aria-hidden className="absolute -left-px top-0 h-12 w-px bg-primary" />
        <p className="text-[1.0625rem] md:text-[1.125rem] leading-[1.65] text-[#e8f0fe] text-balance">
          {t.blockquoteMain}
        </p>
        <p className="mt-3 text-[0.9375rem] md:text-[1rem] leading-[1.65] text-muted-foreground italic">
          {t.blockquoteSub}
        </p>
      </blockquote>

      <section className="w-full rounded-2xl border border-border bg-card/40 p-6 md:p-8">
        {status === "analyzing" ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
            </div>
            <p
              key={analyzingIndex}
              className="font-mono text-xs tracking-[0.18em] uppercase text-muted-foreground text-center"
              style={{ animation: "qcm-fade-in 300ms ease-out forwards" }}
            >
              {analyzingLines[analyzingIndex]}
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="qcm-email" className="text-xs text-muted-foreground">
                {t.emailLabel}
              </label>
              <input
                id="qcm-email"
                name="email"
                type="email"
                required
                autoFocus
                autoComplete="email"
                inputMode="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isBusy}
                aria-describedby="qcm-email-error"
                aria-invalid={status === "error"}
                className="h-14 w-full rounded-lg border border-border bg-card/60 px-4 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-[#00a6ff] focus:outline-none focus:ring-2 focus:ring-[#00a6ff]/30"
              />
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className={cn(
                "mt-1 h-14 w-full rounded-lg bg-gradient-hero text-[#0a1628] font-bold text-base md:text-lg tracking-tight shadow-glow transition-all",
                "hover:opacity-95 hover:shadow-[0_0_60px_rgba(0,166,255,0.55)]",
                "disabled:cursor-not-allowed disabled:opacity-60"
              )}
            >
              {status === "loading" ? t.submitLoading : t.submitIdle}
            </button>

            {status === "error" && errorMsg && (
              <p
                id="qcm-email-error"
                role="alert"
                className="text-sm text-destructive text-center mt-1"
              >
                {errorMsg}
              </p>
            )}

            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              {t.reassurance}
            </p>

            {onSkip && (
              <button
                type="button"
                onClick={handleSkip}
                disabled={isBusy}
                className="mt-1 text-center text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t.skipLink}
              </button>
            )}
          </form>
        )}
      </section>

      <div className="hairline mt-12 mb-6" />
      <p className="text-center text-xs text-muted-foreground">
        {t.privacyFooter}
      </p>
    </div>
  );
}
