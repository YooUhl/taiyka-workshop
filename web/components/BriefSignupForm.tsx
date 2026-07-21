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
    privacy: "Politique de confidentialité",
    pendingKicker: "✓ Presque",
    pendingTitle: "Vérifie ta boîte mail.",
    pendingSub:
      "Clique le lien de confirmation qu'on vient de t'envoyer. (Regarde dans les spams si tu ne vois rien.)",
    alreadyKicker: "✓ Déjà inscrit",
    alreadyTitle: "Tu reçois déjà Le Brief.",
    alreadySub: "Rien à faire — prochain numéro d'ici deux jours.",
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
    privacy: "Privacy policy",
    pendingKicker: "✓ Almost",
    pendingTitle: "Check your inbox.",
    pendingSub:
      "Click the confirmation link we just sent. (Check spam if you don't see it.)",
    alreadyKicker: "✓ Already in",
    alreadyTitle: "You already get Le Brief.",
    alreadySub: "Nothing to do — next issue within two days.",
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
  // Honeypot — must stay empty; bots that fill it get silently dropped (P1-6).
  const [companyWebsite, setCompanyWebsite] = useState("");
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
          body: JSON.stringify({
            email,
            lang,
            source: "brief-landing",
            company_website: companyWebsite,
          }),
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
        className="card-line card-line-accent w-full p-6 md:p-8"
        style={{ animation: "qcm-fade-in 300ms ease-out forwards" }}
      >
        <p className="kicker kicker-accent kicker-bare mb-4">{kicker}</p>
        <p className="display-md text-foreground mb-3">{title}</p>
        <p className="text-[0.95rem] leading-[1.6] text-muted-foreground mb-7">
          {sub}
        </p>
        <div className="pt-6 border-t border-border flex flex-col items-start gap-1">
          <p className="kicker kicker-bare mb-2">{t.waitingKicker}</p>
          <Link
            href={withLang("/qcm", lang)}
            className="inline-flex items-center min-h-[44px] text-[0.95rem] text-primary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
          >
            {t.ctaQcm}
          </Link>
          <Link
            href={withLang("/skool", lang)}
            className="inline-flex items-center min-h-[44px] text-[0.95rem] text-primary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
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
    <section className="card-line card-line-accent w-full p-6 md:p-8">
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
            className="h-14 w-full rounded-md border border-input bg-obsidian px-4 text-base text-foreground placeholder:text-glacier-blue/80 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
          />
        </div>

        {/* Honeypot — real users never see or fill this (P1-6). */}
        <input
          type="text"
          name="company_website"
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
          value={companyWebsite}
          onChange={(e) => setCompanyWebsite(e.target.value)}
          className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
        />

        <button
          type="submit"
          disabled={isBusy}
          aria-busy={isBusy}
          className={cn(
            "mt-1 h-14 w-full rounded-md bg-primary text-primary-foreground font-bold text-base md:text-lg tracking-tight transition-colors",
            "hover:bg-[#33b8ff]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]",
            "disabled:cursor-not-allowed disabled:opacity-60"
          )}
        >
          {isBusy ? t.submitting : t.submit}
        </button>

        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          {t.note}
          {" · "}
          <Link
            href={withLang("/privacy", lang)}
            className="underline underline-offset-2 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm"
          >
            {t.privacy}
          </Link>
        </p>

        <p
          id="brief-error"
          role="alert"
          hidden={!isError || !errorMsg}
          className="text-xs text-destructive mt-1"
        >
          {errorMsg}
        </p>
      </form>
    </section>
  );
}
