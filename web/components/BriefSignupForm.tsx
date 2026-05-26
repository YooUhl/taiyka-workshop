"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { withLang } from "@/lib/lang-utils";

const WEBHOOK_URL = "https://n8n.srv1331551.hstgr.cloud/webhook/brief-signup";

type Status = "idle" | "loading" | "success" | "error";

type Props = {
  lang?: "fr" | "en";
};

const T = {
  fr: {
    emailLabel: "Email",
    emailPlaceholder: "ton@email.com",
    submit: "Je veux le brief de 7h",
    submitting: "Envoi...",
    note: "Premier mail demain matin 7h · Désinscription en 1 clic · Conforme RGPD",
    successKicker: "✓ Inscrit",
    successTitle: "T'es dedans. Vérifie ta boîte mail.",
    successSub: "Premier numéro demain matin, 7h.",
    waitingKicker: "En attendant",
    ctaQcm: "Fais le QCM — 2 min, voir ton profil →",
    ctaSkool: "Entrer dans la communauté Skool →",
    error: "Ça a pas pris. Réessaie, ou écris-moi : manu.uhila@taiyka.com.",
  },
  en: {
    emailLabel: "Email",
    emailPlaceholder: "you@email.com",
    submit: "Get the 7am brief",
    submitting: "Sending...",
    note: "First email tomorrow 7am · 1-click unsubscribe · No spam.",
    successKicker: "✓ Subscribed",
    successTitle: "You're in. Check your inbox.",
    successSub: "First issue tomorrow at 7am.",
    waitingKicker: "While you wait",
    ctaQcm: "Take the quiz — 2 min, see your profile →",
    ctaSkool: "Join the Skool community →",
    error: "Didn't go through. Try again, or write me: manu.uhila@taiyka.com.",
  },
} as const;

export default function BriefSignupForm({ lang = "fr" }: Props = {}) {
  const t = T[lang];
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 8000);
      const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";

      try {
        const res = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            source: "brief-landing",
            lang,
            userAgent,
          }),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } finally {
        window.clearTimeout(timeoutId);
      }
      setStatus("success");
    } catch (err) {
      console.warn("Brief signup failed:", err);
      setStatus("error");
      setErrorMsg(t.error);
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="w-full rounded-2xl border border-primary/40 bg-primary/10 p-6 md:p-8 text-center"
        style={{ animation: "qcm-fade-in 300ms ease-out forwards" }}
      >
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-primary mb-3">
          {t.successKicker}
        </p>
        <p className="text-[1.0625rem] md:text-[1.125rem] leading-[1.6] text-[#e8f0fe] mb-2">
          {t.successTitle}
        </p>
        <p className="text-sm text-muted-foreground mb-6">{t.successSub}</p>
        <div className="pt-5 border-t border-primary/20 flex flex-col gap-2 text-sm">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground mb-1">
            {t.waitingKicker}
          </p>
          <Link
            href={withLang("/qcm", lang)}
            className="text-primary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
          >
            {t.ctaQcm}
          </Link>
          <Link
            href={withLang("/skool", lang)}
            className="text-primary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
          >
            {t.ctaSkool}
          </Link>
        </div>
      </div>
    );
  }

  const isBusy = status === "loading";
  const isError = status === "error";

  return (
    <section className="w-full rounded-2xl border border-border bg-card/60 p-6 md:p-8 shadow-glow">
      <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="brief-email" className="sr-only">
            {t.emailLabel}
          </label>
          <input
            id="brief-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder={t.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isBusy}
            aria-describedby="brief-error"
            aria-invalid={isError}
            className="h-14 w-full rounded-lg border border-border bg-card/60 px-4 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-[#00a6ff] focus:outline-none focus:ring-2 focus:ring-[#00a6ff]/30"
          />
        </div>

        <button
          type="submit"
          disabled={isBusy}
          aria-busy={isBusy}
          className={cn(
            "mt-1 h-14 w-full rounded-lg bg-gradient-hero text-[#0a1628] font-bold text-base md:text-lg tracking-tight shadow-glow transition-all",
            "hover:opacity-95 hover:shadow-[0_0_60px_rgba(0,166,255,0.55)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]",
            "disabled:cursor-not-allowed disabled:opacity-60"
          )}
        >
          {isBusy ? t.submitting : t.submit}
        </button>

        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          {t.note}
        </p>

        {/*
          Always mount so aria-describedby resolves even when no error.
          Toggle visibility with hidden; role="alert" announces on appearance.
        */}
        <p
          id="brief-error"
          role="alert"
          hidden={!isError || !errorMsg}
          className="text-xs text-destructive text-center mt-1"
        >
          {errorMsg}
        </p>
      </form>
    </section>
  );
}
