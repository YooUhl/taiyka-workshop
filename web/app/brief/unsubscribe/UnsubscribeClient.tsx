"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { withLang } from "@/lib/lang-utils";

const WEBHOOK_URL = "https://n8n.srv1331551.hstgr.cloud/webhook/brief-unsubscribe";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]";

type Status = "idle" | "loading" | "success" | "error";

type Props = {
  initialEmail: string;
  lang: "fr" | "en";
  t: {
    intro: string;
    missing: string;
    button: string;
    submitting: string;
    successKicker: string;
    successTitle: string;
    successSub: string;
    ctaHome: string;
    ctaBrief: string;
    error: string;
  };
};

export default function UnsubscribeClient({ initialEmail, lang, t }: Props) {
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 8000);
      try {
        const res = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, lang }),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } finally {
        window.clearTimeout(timeoutId);
      }
      setStatus("success");
    } catch (err) {
      console.warn("Unsubscribe failed:", err);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="card-line card-line-accent w-full p-6 md:p-8 text-center"
        style={{ animation: "qcm-fade-in 300ms ease-out forwards" }}
      >
        <p className="kicker kicker-accent kicker-bare justify-center mb-3">
          {t.successKicker}
        </p>
        <p className="text-[1.0625rem] md:text-[1.125rem] leading-[1.6] text-foreground mb-2">
          {t.successTitle}
        </p>
        <p className="text-sm text-muted-foreground mb-6">{t.successSub}</p>
        <div className="pt-5 border-t border-border flex flex-col gap-2 text-sm">
          <Link
            href={withLang("/", lang)}
            className={cn(
              "text-primary hover:text-foreground transition-colors rounded-sm",
              FOCUS_RING,
            )}
          >
            {t.ctaHome}
          </Link>
          <Link
            href={withLang("/brief", lang)}
            className={cn(
              "text-primary hover:text-foreground transition-colors rounded-sm",
              FOCUS_RING,
            )}
          >
            {t.ctaBrief}
          </Link>
        </div>
      </div>
    );
  }

  const isBusy = status === "loading";
  const isError = status === "error";

  return (
    <section className="card-line w-full p-6 md:p-8">
      <p className="mb-4 text-[0.95rem] leading-[1.55] text-muted-foreground">
        {initialEmail ? t.intro : t.missing}
      </p>
      <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
        <label htmlFor="unsub-email" className="sr-only">
          email
        </label>
        <input
          id="unsub-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isBusy}
          className="h-14 w-full rounded-none border border-input bg-card px-4 text-base text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          type="submit"
          disabled={isBusy || !email}
          aria-busy={isBusy}
          className={cn(
            "mt-1 h-14 w-full rounded-none bg-primary text-[#06131f] font-bold text-base md:text-lg tracking-tight transition-colors",
            "hover:bg-[#33b8ff]",
            FOCUS_RING,
            "disabled:cursor-not-allowed disabled:opacity-60"
          )}
        >
          {isBusy ? t.submitting : t.button}
        </button>
        {isError && (
          <p role="alert" className="text-xs text-destructive text-center mt-1">
            {t.error}
          </p>
        )}
      </form>
    </section>
  );
}
