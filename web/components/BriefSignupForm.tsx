"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { withLang } from "@/lib/lang-utils";

// New flow: post to our own API route (double-opt-in via Supabase + Resend),
// not straight to an n8n webhook. The route creates a pending row and emails a
// confirmation link; the user is only added to the list after they click it.
const SUBSCRIBE_URL = "/api/brief/subscribe";

type Status = "idle" | "loading" | "pending" | "already" | "error";

type Props = {
  lang?: "fr" | "en";
};

const T = {
  fr: {
    emailLabel: "Email",
    emailPlaceholder: "ton@email.com",
    submit: "Je veux Le Brief",
    submitting: "Envoi...",
    note: "Confirme ton email en 1 clic · Désinscription en 1 clic · Conforme RGPD",
    pendingKicker: "✓ Presque",
    pendingTitle: "Vérifie ta boîte mail.",
    pendingSub:
      "Clique le lien de confirmation qu'on vient de t'envoyer. (Regarde dans les spams si tu ne vois rien.)",
    alreadyKicker: "✓ Déjà inscrit",
    alreadyTitle: "Tu reçois déjà Le Brief.",
    alreadySub: "Rien à faire — à demain matin, 7h.",
    waitingKicker: "En attendant",
    ctaQcm: "Fais le QCM — 2 min, voir ton profil →",
    ctaSkool: "Entrer dans la communauté Skool →",
    errInvalid: "Email invalide. Vérifie et réessaie.",
    errRate: "Trop de tentatives. Attends une minute et réessaie.",
    errGeneric:
      "Ça a pas pris. Réessaie, ou écris-moi : manu.uhila@taiyka.com.",
  },
  en: {
    emailLabel: "Email",
    emailPlaceholder: "you@email.com",
    submit: "Get Le Brief",
    submitting: "Sending...",
    note: "Confirm your email in 1 click · 1-click unsubscribe · GDPR compliant",
    pendingKicker: "✓ Almost",
    pendingTitle: "Check your inbox.",
    pendingSub:
      "Click the confirmation link we just sent. (Check spam if you don't see it.)",
    alreadyKicker: "✓ Already in",
    alreadyTitle: "You already get Le Brief.",
    alreadySub: "Nothing to do — see you tomorrow at 7am.",
    waitingKicker: "While you wait",
    ctaQcm: "Take the quiz — 2 min, see your profile →",
    ctaSkool: "Join the Skool community →",
    errInvalid: "Invalid email. Check and try again.",
    errRate: "Too many tries. Wait a minute and retry.",
    errGeneric: "Didn't go through. Try again, or write me: manu.uhila@taiyka.com.",
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
      const timeoutId = window.setTimeout(() => controller.abort(), 10000);

      let res: Response;
      try {
        res = await fetch(SUBSCRIBE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, lang, source: "brief-landing" }),
          signal: controller.signal,
        });
      } finally {
        window.clearTimeout(timeoutId);
      }

      const data = (await res.json().catch(() => ({}))) as {
        status?: string;
      };

      if (res.ok && data.status === "pending_confirmation") {
        setStatus("pending");
        return;
      }
      if (res.ok && data.status === "already_subscribed") {
        setStatus("already");
        return;
      }
      if (res.status === 429) {
        setStatus("error");
        setErrorMsg(t.errRate);
        return;
      }
      if (data.status === "invalid_email") {
        setStatus("error");
        setErrorMsg(t.errInvalid);
        return;
      }
      throw new Error(data.status ?? `HTTP ${res.status}`);
    } catch (err) {
      console.warn("Brief signup failed:", err);
      setStatus("error");
      setErrorMsg(t.errGeneric);
    }
  }

  if (status === "pending" || status === "already") {
    const kicker = status === "pending" ? t.pendingKicker : t.alreadyKicker;
    const title = status === "pending" ? t.pendingTitle : t.alreadyTitle;
    const sub = status === "pending" ? t.pendingSub : t.alreadySub;
    return (
      <div
        role="status"
        aria-live="polite"
        className="w-full rounded-2xl border border-primary/40 bg-primary/10 p-6 md:p-8 text-center"
        style={{ animation: "qcm-fade-in 300ms ease-out forwards" }}
      >
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-primary mb-3">
          {kicker}
        </p>
        <p className="text-[1.0625rem] md:text-[1.125rem] leading-[1.6] text-[#e8f0fe] mb-2">
          {title}
        </p>
        <p className="text-sm text-muted-foreground mb-6">{sub}</p>
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
