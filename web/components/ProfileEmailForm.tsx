"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

const WEBHOOK_URL = "https://n8n.srv1331551.hstgr.cloud/webhook/brief-signup";

type Status = "idle" | "loading" | "success" | "error";

type Props = {
  profile: string;
  lang?: "fr" | "en";
};

const T = {
  fr: {
    emailLabel: "Email",
    emailPlaceholder: "ton@email.com",
    submit: "Ce que je ferais à ta place",
    submitting: "...",
    success: "✓ Enregistré. À très vite dans ta boîte mail.",
    error: "Ça a pas pris. Réessaie, ou écris-moi : manu.uhila@taiyka.com.",
  },
  en: {
    emailLabel: "Email",
    emailPlaceholder: "you@email.com",
    submit: "What I'd do in your spot",
    submitting: "...",
    success: "✓ Saved. See you in your inbox.",
    error: "Didn't go through. Try again, or write me: manu.uhila@taiyka.com.",
  },
} as const;

export default function ProfileEmailForm({ profile, lang = "fr" }: Props) {
  const t = T[lang];
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
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
            source: "quiz-profile",
            productSlug: "qcm",
            profile,
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
      console.warn("Profile email signup failed:", err);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p
        role="status"
        aria-live="polite"
        className="text-center font-mono text-[11px] tracking-[0.22em] uppercase text-primary"
      >
        {t.success}
      </p>
    );
  }

  const isBusy = status === "loading";
  const isError = status === "error";

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col sm:flex-row gap-2 w-full max-w-md mx-auto"
    >
      <label htmlFor="profile-email" className="sr-only">
        {t.emailLabel}
      </label>
      <input
        id="profile-email"
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        placeholder={t.emailPlaceholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isBusy}
        aria-describedby="profile-email-error"
        aria-invalid={isError}
        className="flex-1 h-14 rounded-none border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={isBusy}
        aria-busy={isBusy}
        className={cn(
          "h-14 px-5 rounded-none bg-primary text-[#06131f] text-sm font-bold transition-colors",
          "hover:bg-[#33b8ff]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]",
          "disabled:cursor-not-allowed disabled:opacity-60"
        )}
      >
        {isBusy ? t.submitting : t.submit}
      </button>
      {/*
        Always mount so aria-describedby resolves even when no error.
        Toggle visibility with hidden; role="alert" announces on appearance.
      */}
      <p
        id="profile-email-error"
        role="alert"
        hidden={!isError}
        className="sm:ml-3 text-xs text-destructive"
      >
        {t.error}
      </p>
    </form>
  );
}
