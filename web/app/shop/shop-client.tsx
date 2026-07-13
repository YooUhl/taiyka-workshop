"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { withLang } from "@/lib/lang-utils";
import { COPY, isValidEmail, type Lang } from "@/lib/shop/content";
import { getShopWorkflows, tierBadge, type Workflow } from "@/lib/shop/workflows";
import { resolveIcon } from "@/lib/shop/icon-map";

type FormStatus = "idle" | "submitting" | "success" | "already" | "error";

const SKOOL_EXTERNAL_URL = process.env.NEXT_PUBLIC_SKOOL_COMMUNITY_URL;

export default function ShopClient({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const workflows = getShopWorkflows();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");

  const externalSkool = SKOOL_EXTERNAL_URL && SKOOL_EXTERNAL_URL.length > 0;
  const skoolHref = externalSkool ? SKOOL_EXTERNAL_URL : withLang("/skool", lang);

  const backHref = lang === "en" ? "/?lang=en" : "/";
  const emailLooksValid = isValidEmail(email.trim());

  async function submit() {
    const value = email.trim();
    if (!emailLooksValid) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/shop/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: value, lang }),
      });
      const data = (await res.json()) as { ok: boolean; status?: string };
      if (!res.ok || !data.ok) {
        setStatus("error");
        return;
      }
      setStatus(data.status === "already_subscribed" ? "already" : "success");
    } catch {
      setStatus("error");
    }
  }

  const messageForStatus =
    status === "success"
      ? c.waitlistSuccess
      : status === "already"
        ? c.waitlistAlready
        : status === "error"
          ? c.waitlistError
          : null;
  const messageTone: "ok" | "err" | null =
    status === "success" || status === "already"
      ? "ok"
      : status === "error"
        ? "err"
        : null;

  const submitted = status === "success" || status === "already";

  return (
    <main className="relative flex-1 w-full flex flex-col z-10 min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[60vh] bg-gradient-glow opacity-50 blur-2xl"
      />

      <div
        className="relative mx-auto w-full max-w-5xl px-6 md:px-10 py-6 md:py-8 flex flex-col flex-1"
        style={{ opacity: 0, animation: "qcm-fade-in 400ms ease-out forwards" }}
      >
        {/* Top bar — back home + status pulse + lang toggle */}
        <div className="w-full grid grid-cols-3 items-center font-mono text-[11px] tracking-[0.22em] uppercase">
          <Link
            href={backHref}
            className="justify-self-start text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm px-1"
          >
            <span aria-hidden>← </span>
            {c.backLabel}
          </Link>
          <span
            className="justify-self-center inline-flex items-center gap-2 text-foreground/80"
            style={{ textShadow: "0 0 8px rgba(10,22,40,0.9)" }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {c.topStatus}
          </span>
          <Link
            href={c.langSwitchHref}
            className="justify-self-end text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm px-1"
            aria-label={lang === "fr" ? "Switch to English" : "Passer en français"}
          >
            {c.langSwitch} <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Hero */}
        <section className="mt-16 md:mt-20 mb-10 md:mb-14">
          <p className="kicker mb-5">{c.heroKicker}</p>
          <h1 className="text-balance font-bold tracking-[-0.03em] leading-[0.96] text-[clamp(2.25rem,7vw,3.75rem)] uppercase">
            <span className="text-gradient-hero">{c.heroTitle}</span>
          </h1>
          <p className="mt-6 max-w-xl text-[0.95rem] md:text-base text-foreground/75 leading-relaxed">
            {c.heroSubtitle}
          </p>
        </section>

        {/* Preview banner */}
        <div className="mb-12 md:mb-16 rounded-md border border-dashed border-primary/30 bg-primary/[0.03] px-4 py-3 font-mono text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-primary/80">
          <span aria-hidden className="mr-2">◆</span>
          {c.previewBanner}
        </div>

        {/* Workflows — the only live catalog */}
        <section className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-3">
            <span className="kicker">
              {c.workflowsCategory.index} · {c.workflowsCategory.label}
            </span>
            <span className="hairline flex-1" />
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-primary whitespace-nowrap">
              {workflows.length} {lang === "fr" ? "produits" : "products"}
            </span>
          </div>
          <p className="text-[0.95rem] md:text-base text-foreground/70 leading-relaxed max-w-2xl mb-8">
            {c.workflowsCategory.description}
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {workflows.map((w) => (
              <li key={w.slug}>
                <WorkflowCard workflow={w} lang={lang} hoverHint={c.hoverHint} />
              </li>
            ))}
          </ul>
        </section>

        {/* Collapsed categories — Skills / Agents / DFY */}
        <section className="mb-16 md:mb-20 flex flex-col gap-7 md:gap-8">
          {c.collapsedCategories.map((cat) => (
            <div key={cat.key}>
              <div className="flex items-center gap-4 mb-2">
                <span className="kicker">
                  {cat.index} · {cat.label}
                </span>
                <span className="hairline flex-1" />
                <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground/80 whitespace-nowrap">
                  {cat.comingSoon}
                </span>
              </div>
              <p className="text-[0.9rem] md:text-[0.95rem] text-foreground/55 leading-relaxed max-w-2xl">
                {cat.teaser}
              </p>
            </div>
          ))}
        </section>

        {/* Waitlist */}
        <section className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="kicker">{c.waitlistKicker}</span>
            <span className="hairline flex-1" />
          </div>
          <div className="rounded-md border border-primary/40 bg-primary/[0.04] p-6 md:p-8">
            <h2 className="text-balance font-bold tracking-[-0.02em] leading-tight text-[clamp(1.5rem,4vw,2rem)] mb-3">
              {c.waitlistTitle}
            </h2>
            <p className="text-[0.95rem] text-foreground/70 mb-6 leading-relaxed max-w-xl">
              {c.waitlistBlurb}
            </p>

            {!submitted && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void submit();
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-xl"
                noValidate
              >
                <label className="sr-only" htmlFor="shop-waitlist-email">
                  {c.waitlistEmailLabel}
                </label>
                <input
                  id="shop-waitlist-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder={c.waitlistEmailPlaceholder}
                  className="flex-1 rounded-md border border-white/15 bg-white/[0.02] px-4 py-3 text-[0.95rem] md:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:bg-white/[0.05] transition-colors"
                  aria-invalid={status === "error"}
                  required
                />
                <button
                  type="submit"
                  disabled={!emailLooksValid || status === "submitting"}
                  className={cn(
                    "rounded-md py-3 px-6 text-[0.95rem] md:text-base font-semibold tracking-tight transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]",
                    emailLooksValid && status !== "submitting"
                      ? "bg-gradient-hero text-[#0a1628] shadow-glow hover:scale-[1.02]"
                      : "bg-white/[0.05] text-muted-foreground cursor-not-allowed",
                  )}
                >
                  {status === "submitting" ? c.waitlistSubmitting : c.waitlistSubmit}
                </button>
              </form>
            )}

            {messageForStatus && (
              <p
                role={messageTone === "err" ? "alert" : "status"}
                aria-live="polite"
                className={cn(
                  "mt-4 text-sm",
                  messageTone === "err" ? "text-[#ff7a7a]" : "text-primary",
                )}
              >
                {messageForStatus}
              </p>
            )}
          </div>
        </section>

        {/* Skool CTA */}
        <section className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="kicker">{c.skoolKicker}</span>
            <span className="hairline flex-1" />
          </div>
          <Link
            href={skoolHref}
            {...(externalSkool
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="group relative block rounded-md border border-border/70 bg-card/40 hover:border-primary/60 hover:bg-card/70 hover:shadow-[0_0_24px_rgba(0,166,255,0.18)] transition-all duration-300 ease-out p-6 md:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]"
          >
            <CornerBrackets />
            <h2 className="text-balance font-bold tracking-[-0.02em] leading-tight text-[clamp(1.5rem,4vw,2rem)] mb-3 group-hover:text-primary transition-colors">
              {c.skoolTitle}
            </h2>
            <p className="text-[0.95rem] text-foreground/70 mb-5 leading-relaxed max-w-xl">
              {c.skoolBlurb}
            </p>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase text-primary">
              {c.skoolCta}
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        </section>

        <div className="hairline mb-6 opacity-50" />
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground/60 text-center pb-8">
          {c.footerNote}
        </p>
      </div>
    </main>
  );
}

function WorkflowCard({
  workflow,
  lang,
  hoverHint,
}: {
  workflow: Workflow;
  lang: Lang;
  hoverHint: string;
}) {
  const loc = workflow[lang];
  const Icon = resolveIcon(workflow.icon);
  const href = withLang(`/shop/workflows/${workflow.slug}`, lang);

  return (
    <Link
      href={href}
      className="group relative flex flex-col h-full rounded-md border border-border/70 bg-card/40 overflow-hidden transition-all duration-300 ease-out hover:border-primary/60 hover:bg-card/70 hover:shadow-[0_0_28px_rgba(0,166,255,0.20)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]"
    >
      <CornerBrackets />

      {/* Cover area — square, brand gradient, lucide icon + hover overlay */}
      <div className="relative aspect-square w-full overflow-hidden border-b border-border/40">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-[#0A1628] to-black"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(circle at 30% 25%, rgba(0,166,255,0.55) 0%, rgba(10,22,40,0) 60%), radial-gradient(circle at 75% 80%, rgba(0,229,255,0.35) 0%, rgba(10,22,40,0) 55%)",
          }}
        />

        {/* Lucide icon center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon
            aria-hidden
            className="w-16 h-16 md:w-20 md:h-20 text-primary/90"
            strokeWidth={1.25}
            style={{ filter: "drop-shadow(0 0 24px rgba(0,166,255,0.45))" }}
          />
        </div>

        {/* Tier badge */}
        <span className="absolute top-3 left-3 inline-flex items-center px-2 py-1 rounded-sm bg-[#0A1628]/80 backdrop-blur-sm border border-primary/50 font-mono text-[9px] tracking-[0.22em] uppercase text-primary">
          {tierBadge(workflow.tier, lang)}
        </span>

        {/* Hover overlay — desktop only via @media (hover: hover) */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center px-5 bg-[#0A1628]/85 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 pointer-events-none"
        >
          <p className="text-center text-[0.875rem] md:text-[0.9rem] text-foreground/90 leading-snug">
            {loc.hoverDescription}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-[1.05rem] md:text-[1.125rem] font-semibold tracking-tight leading-snug text-foreground group-hover:text-primary transition-colors mb-2">
          {loc.title}
        </h3>
        <p className="text-[0.85rem] md:text-[0.9rem] text-foreground/60 leading-snug mb-5">
          {loc.tagline}
        </p>

        {/* Footer — price + see details */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-border/40">
          <span className="font-mono text-[1.1rem] md:text-[1.25rem] font-bold text-primary tracking-tight">
            {workflow.price}
          </span>
          <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground group-hover:text-primary transition-colors">
            {hoverHint}
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

function CornerBrackets() {
  const base =
    "pointer-events-none absolute h-2.5 w-2.5 z-10 border-[var(--hud-bracket-dim)] group-hover:border-[var(--hud-bracket)] transition-colors";
  return (
    <>
      <span aria-hidden className={cn(base, "left-1.5 top-1.5 border-l border-t")} />
      <span aria-hidden className={cn(base, "right-1.5 top-1.5 border-r border-t")} />
      <span aria-hidden className={cn(base, "left-1.5 bottom-1.5 border-l border-b")} />
      <span aria-hidden className={cn(base, "right-1.5 bottom-1.5 border-r border-b")} />
    </>
  );
}
