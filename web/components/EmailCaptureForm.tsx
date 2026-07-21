"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

type Props = {
  lang?: "fr" | "en";
  source?: string;
  productSlug?: string;
  /**
   * When true, hides the optional name field (email-only).
   * Default false to preserve current behavior.
   */
  compact?: boolean;
  /**
   * Optional per-page override for the submit button label.
   * Useful for non-pack flows (e.g. waitlist: "Préviens-moi" / "Notify me").
   * Falls back to the localized default ("Récupérer le pack" / "Get the pack").
   */
  submitLabel?: { fr: string; en: string };
};

type Status = "idle" | "loading" | "success" | "error";

const T = {
  fr: {
    emailLabel: "Email",
    emailPlaceholder: "ton@email.com",
    nameLabel: "Prénom (optionnel)",
    namePlaceholder: "Manu",
    submit: "Récupérer le pack",
    submitting: "Envoi...",
    successTitle: "Merci !",
    success: "Vérifie ta boîte mail d'ici 2 min",
    errorGeneric:
      "Ça a pas pris. Réessaie, ou écris-moi : manu.uhila@taiyka.com.",
    notConnected: "Presque prêt — reviens bientôt.",
  },
  en: {
    emailLabel: "Email",
    emailPlaceholder: "you@email.com",
    nameLabel: "First name (optional)",
    namePlaceholder: "Manu",
    submit: "Get the pack",
    submitting: "Sending...",
    successTitle: "Thanks!",
    success: "Check your inbox in 2 min",
    errorGeneric:
      "Didn't go through. Try again, or write me: manu.uhila@taiyka.com.",
    notConnected: "Almost ready, check back soon.",
  },
} as const;

export default function EmailCaptureForm({
  lang = "fr",
  source = "generic",
  productSlug,
  compact = false,
  submitLabel,
}: Props) {
  const t = T[lang];
  const submitText = submitLabel?.[lang] ?? t.submit;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const webhookUrl = process.env.NEXT_PUBLIC_LEADMAGNET_WEBHOOK_URL;

    if (!webhookUrl) {
      // Graceful, on-brand message in both dev and prod — no env leak.
      setStatus("error");
      setErrorMsg(t.notConnected);
      return;
    }

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          lang,
          source,
          productSlug,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg(t.errorGeneric);
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="card-line card-line-accent w-full px-5 py-6 text-center"
      >
        <p className="text-base font-semibold text-foreground">{t.successTitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t.success}</p>
      </div>
    );
  }

  const isBusy = status === "loading";
  const isError = status === "error";

  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs text-muted-foreground">
          {t.emailLabel}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder={t.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isBusy}
          aria-describedby="email-error"
          aria-invalid={isError}
          className="h-14 w-full rounded-md border border-input bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/35"
        />
      </div>

      {!compact && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs text-muted-foreground">
            {t.nameLabel}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="given-name"
            placeholder={t.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isBusy}
            className="h-14 w-full rounded-md border border-input bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/35"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isBusy}
        aria-busy={isBusy}
        className={cn(
          "mt-1 h-14 w-full rounded-md bg-primary text-base font-semibold text-primary-foreground transition-colors",
          "hover:bg-primary/90",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]",
          "disabled:cursor-not-allowed disabled:opacity-60"
        )}
      >
        {isBusy ? t.submitting : submitText}
      </button>

      {/*
        Always mount the error <p> so that aria-describedby="email-error"
        resolves to a real node even when there's no error. We toggle
        visibility via the `hidden` attribute. role="alert" announces it
        to screen readers when it becomes visible.
      */}
      <p
        id="email-error"
        role="alert"
        hidden={!isError || !errorMsg}
        className="text-xs text-destructive text-center mt-1"
      >
        {errorMsg}
      </p>
    </form>
  );
}
