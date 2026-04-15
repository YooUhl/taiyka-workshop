"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

type Props = {
  lang: "fr" | "en";
  source: string;
  productSlug: string;
};

type Status = "idle" | "loading" | "success" | "error";

const T = {
  fr: {
    emailLabel: "Email",
    emailPlaceholder: "ton@email.com",
    nameLabel: "Prénom (optionnel)",
    namePlaceholder: "Manu",
    submit: "Récupère le pack",
    submitting: "Envoi...",
    success: "Vérifie ta boîte mail d'ici 2 min",
    errorGeneric: "Oups, une erreur est survenue. Réessaie.",
    notConnectedDev:
      "Form not yet connected — set NEXT_PUBLIC_LEADMAGNET_WEBHOOK_URL in .env.local",
    notConnectedProd: "Almost ready, check back soon",
  },
  en: {
    emailLabel: "Email",
    emailPlaceholder: "you@email.com",
    nameLabel: "First name (optional)",
    namePlaceholder: "Manu",
    submit: "Get the pack",
    submitting: "Sending...",
    success: "Check your inbox in 2 min",
    errorGeneric: "Oops, something went wrong. Try again.",
    notConnectedDev:
      "Form not yet connected — set NEXT_PUBLIC_LEADMAGNET_WEBHOOK_URL in .env.local",
    notConnectedProd: "Almost ready, check back soon",
  },
} as const;

export default function EmailCaptureForm({ lang, source, productSlug }: Props) {
  const t = T[lang];
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
      const isDev = process.env.NODE_ENV !== "production";
      setStatus("error");
      setErrorMsg(isDev ? t.notConnectedDev : t.notConnectedProd);
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
      <div className="w-full rounded-xl border border-[#00a6ff]/40 bg-[#00a6ff]/10 px-5 py-6 text-center">
        <p className="text-base font-semibold text-white">
          {lang === "fr" ? "Merci !" : "Thanks!"}
        </p>
        <p className="mt-1 text-sm text-[#e8f0fe]/80">{t.success}</p>
      </div>
    );
  }

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
          placeholder={t.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          className="h-11 w-full rounded-lg border border-border bg-card/60 px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-[#00a6ff] focus:outline-none focus:ring-2 focus:ring-[#00a6ff]/30"
        />
      </div>

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
          disabled={status === "loading"}
          className="h-11 w-full rounded-lg border border-border bg-card/60 px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-[#00a6ff] focus:outline-none focus:ring-2 focus:ring-[#00a6ff]/30"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className={cn(
          "mt-1 h-12 w-full rounded-lg bg-gradient-hero text-base font-semibold text-[#0a1628] shadow-glow transition-all",
          "hover:opacity-95 hover:shadow-[0_0_60px_rgba(0,166,255,0.45)]",
          "disabled:cursor-not-allowed disabled:opacity-60"
        )}
      >
        {status === "loading" ? t.submitting : t.submit}
      </button>

      {status === "error" && errorMsg && (
        <p className="text-xs text-destructive text-center mt-1">{errorMsg}</p>
      )}
    </form>
  );
}
