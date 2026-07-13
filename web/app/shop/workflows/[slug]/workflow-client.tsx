"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { withLang } from "@/lib/lang-utils";
import { type Lang } from "@/lib/shop/content";
import { tierBadge, type Workflow } from "@/lib/shop/workflows";
import { resolveIcon } from "@/lib/shop/icon-map";

const SKOOL_EXTERNAL_URL = process.env.NEXT_PUBLIC_SKOOL_COMMUNITY_URL;

export default function WorkflowClient({
  workflow,
  lang,
}: {
  workflow: Workflow;
  lang: Lang;
}) {
  const loc = workflow[lang];
  const Icon = resolveIcon(workflow.icon);
  const body = lang === "fr" ? workflow.frBody : workflow.enBody;
  const cost = lang === "fr" ? workflow.costEstimate.fr : workflow.costEstimate.en;
  const valueProps =
    lang === "fr" ? workflow.valueProps.fr : workflow.valueProps.en;

  const backHref = withLang("/shop", lang);
  const langSwitchHref =
    lang === "fr"
      ? `/shop/workflows/${workflow.slug}?lang=en`
      : `/shop/workflows/${workflow.slug}`;

  const externalSkool = SKOOL_EXTERNAL_URL && SKOOL_EXTERNAL_URL.length > 0;
  const skoolHref = externalSkool ? SKOOL_EXTERNAL_URL : withLang("/skool", lang);

  const t = {
    fr: {
      topStatus: "PRODUIT · BOUTIQUE",
      backLabel: "Retour boutique",
      langSwitch: "EN",
      ctaComingSoon: "Bientôt disponible",
      kickerDescription: "Description",
      kickerNodes: "Construction du workflow",
      kickerVariables: "Variables à renseigner",
      kickerCost: "Coût d'exécution",
      kickerValue: "Ce que tu en tires",
      skoolKicker: "Communauté",
      skoolTitle: "Pionniers",
      skoolBlurb:
        "L'accès permanent au playbook et à la communauté autour de l'automatisation IA.",
      skoolCta: "Rejoindre Pionniers",
      footerNote: "Tous les contenus sont produits par Manu.",
    },
    en: {
      topStatus: "PRODUCT · SHOP",
      backLabel: "Back to shop",
      langSwitch: "FR",
      ctaComingSoon: "Coming soon",
      kickerDescription: "Description",
      kickerNodes: "Workflow build",
      kickerVariables: "Variables to fill",
      kickerCost: "Running cost",
      kickerValue: "What you get",
      skoolKicker: "Community",
      skoolTitle: "Pioneers",
      skoolBlurb:
        "Permanent access to the playbook and the community around AI automation.",
      skoolCta: "Join Pioneers",
      footerNote: "All content built by Manu.",
    },
  }[lang];

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
        {/* Top bar */}
        <div className="w-full grid grid-cols-3 items-center font-mono text-[11px] tracking-[0.22em] uppercase">
          <Link
            href={backHref}
            className="justify-self-start text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm px-1"
          >
            <span aria-hidden>← </span>
            {t.backLabel}
          </Link>
          <span
            className="justify-self-center inline-flex items-center gap-2 text-foreground/80"
            style={{ textShadow: "0 0 8px rgba(10,22,40,0.9)" }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {t.topStatus}
          </span>
          <Link
            href={langSwitchHref}
            className="justify-self-end text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm px-1"
            aria-label={lang === "fr" ? "Switch to English" : "Passer en français"}
          >
            {t.langSwitch} <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Hero — two-column at lg+ */}
        <section className="mt-12 md:mt-16 mb-14 md:mb-20 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-8 md:gap-10 items-start">
          {/* Cover */}
          <div className="group relative aspect-square w-full overflow-hidden rounded-md border border-border/70 bg-card/40">
            <CornerBrackets />
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
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon
                aria-hidden
                className="w-32 h-32 md:w-40 md:h-40 text-primary/90"
                strokeWidth={1.1}
                style={{ filter: "drop-shadow(0 0 40px rgba(0,166,255,0.55))" }}
              />
            </div>
            <span className="absolute top-3 left-3 inline-flex items-center px-2 py-1 rounded-sm bg-[#0A1628]/80 backdrop-blur-sm border border-primary/50 font-mono text-[9px] tracking-[0.22em] uppercase text-primary">
              {tierBadge(workflow.tier, lang)}
            </span>
          </div>

          {/* Title + price + CTA */}
          <div className="flex flex-col h-full">
            <p className="kicker mb-4">
              01 · Workflows · {workflow.slug.replace(/-/g, " ")}
            </p>
            <h1 className="text-balance font-bold tracking-[-0.02em] leading-[1.05] text-[clamp(2rem,5.5vw,3.25rem)] mb-4">
              <span className="text-gradient-hero">{loc.title}</span>
            </h1>
            <p className="text-[1rem] md:text-[1.0625rem] text-foreground/75 leading-relaxed mb-8 max-w-xl">
              {loc.tagline}
            </p>

            <div className="mt-auto flex flex-wrap items-center gap-4">
              <span className="font-mono text-[1.75rem] md:text-[2rem] font-bold text-primary tracking-tight">
                {workflow.price}
              </span>
              <span
                aria-disabled="true"
                className="inline-flex items-center gap-2 rounded-md px-5 py-3 font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground/80 bg-white/[0.04] border border-white/15 cursor-not-allowed"
              >
                {t.ctaComingSoon}
              </span>
            </div>
          </div>
        </section>

        {/* Description */}
        <DetailSection kicker={t.kickerDescription}>
          <div className="prose-shop">
            {body
              .replace(/^#\s+.+$/m, "")
              .trim()
              .split(/\n\s*\n/)
              .map((para, i) => (
                <p
                  key={i}
                  className="text-[0.95rem] md:text-[1rem] text-foreground/75 leading-relaxed mb-4 last:mb-0"
                >
                  {para}
                </p>
              ))}
          </div>
        </DetailSection>

        {/* Node structure */}
        {workflow.nodes.length > 0 && (
          <DetailSection kicker={t.kickerNodes}>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {workflow.nodes.map((node, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-md border border-border/60 bg-card/30 px-4 py-3"
                >
                  <span
                    aria-hidden
                    className="mt-1 inline-block w-1.5 h-1.5 shrink-0 rounded-full bg-primary"
                    style={{ boxShadow: "0 0 8px rgba(0,166,255,0.6)" }}
                  />
                  <span className="text-[0.9rem] md:text-[0.95rem] text-foreground/85 leading-snug">
                    {node}
                  </span>
                </li>
              ))}
            </ul>
          </DetailSection>
        )}

        {/* Variables */}
        {workflow.variables.length > 0 && (
          <DetailSection kicker={t.kickerVariables}>
            <ul className="flex flex-col gap-3">
              {workflow.variables.map((v) => (
                <li
                  key={v.name}
                  className="rounded-md border border-border/60 bg-card/30 px-4 py-3"
                >
                  <code className="font-mono text-[0.875rem] text-primary tracking-tight">
                    {v.name}
                  </code>
                  <p className="mt-1 text-[0.875rem] text-foreground/70 leading-snug">
                    {v.description}
                  </p>
                </li>
              ))}
            </ul>
          </DetailSection>
        )}

        {/* Cost */}
        {cost && (
          <DetailSection kicker={t.kickerCost}>
            <p className="text-[0.95rem] md:text-[1rem] text-foreground/75 leading-relaxed">
              {cost}
            </p>
          </DetailSection>
        )}

        {/* Value props */}
        {valueProps.length > 0 && (
          <DetailSection kicker={t.kickerValue}>
            <ul className="flex flex-col gap-2.5">
              {valueProps.map((vp, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-[0.95rem] md:text-[1rem] text-foreground/80 leading-snug"
                >
                  <span
                    aria-hidden
                    className="mt-2 inline-block w-1.5 h-1.5 shrink-0 rounded-full bg-primary"
                    style={{ boxShadow: "0 0 8px rgba(0,166,255,0.6)" }}
                  />
                  <span>{vp}</span>
                </li>
              ))}
            </ul>
          </DetailSection>
        )}

        {/* Footer CTA repeat */}
        <section className="mb-12 md:mb-16 rounded-md border border-primary/40 bg-primary/[0.04] p-6 md:p-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
          <div className="flex-1">
            <h2 className="text-balance font-bold tracking-[-0.02em] leading-tight text-[clamp(1.25rem,3vw,1.75rem)] mb-2">
              {loc.title}
            </h2>
            <p className="text-[0.9rem] text-foreground/65">{loc.hoverDescription}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[1.25rem] font-bold text-primary tracking-tight">
              {workflow.price}
            </span>
            <span
              aria-disabled="true"
              className={cn(
                "inline-flex items-center gap-2 rounded-md px-5 py-3 font-mono text-[11px] tracking-[0.22em] uppercase",
                "text-muted-foreground/80 bg-white/[0.04] border border-white/15 cursor-not-allowed",
              )}
            >
              {t.ctaComingSoon}
            </span>
          </div>
        </section>

        {/* Skool CTA */}
        <section className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="kicker">{t.skoolKicker}</span>
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
              {t.skoolTitle}
            </h2>
            <p className="text-[0.95rem] text-foreground/70 mb-5 leading-relaxed max-w-xl">
              {t.skoolBlurb}
            </p>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase text-primary">
              {t.skoolCta}
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        </section>

        <div className="hairline mb-6 opacity-50" />
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground/60 text-center pb-8">
          {t.footerNote}
        </p>
      </div>
    </main>
  );
}

function DetailSection({
  kicker,
  children,
}: {
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12 md:mb-14">
      <div className="flex items-center gap-4 mb-5">
        <span className="kicker">{kicker}</span>
        <span className="hairline flex-1" />
      </div>
      {children}
    </section>
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
