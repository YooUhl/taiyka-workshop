"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { withLang } from "@/lib/lang-utils";
import { COPY, type Lang } from "@/lib/shop/content";
import { tierBadge, type Workflow } from "@/lib/shop/workflows";
import { resolveIcon } from "@/lib/shop/icon-map";
import { Ticker } from "@/components/site/Ticker";
import { TopBar } from "@/components/site/TopBar";

const SKOOL_EXTERNAL_URL = process.env.NEXT_PUBLIC_SKOOL_COMMUNITY_URL;

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]";

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

  // Skool block copy comes from the shop's content file — one source of
  // truth shared with /shop, so the two blurbs can't drift apart.
  const shopCopy = COPY[lang];

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
      footerNote: "All content built by Manu.",
    },
  }[lang];

  return (
    <main className="relative flex-1 w-full flex flex-col min-h-screen">
      <Ticker items={shopCopy.ticker} />

      {/* Top bar — shared 3-col component */}
      <TopBar
        backHref={backHref}
        backLabel={t.backLabel}
        status={t.topStatus}
        langSwitchHref={langSwitchHref}
        langSwitchLabel={t.langSwitch}
        langSwitchAria={lang === "fr" ? "Switch to English" : "Passer en français"}
      />

      <div
        className="relative mx-auto w-full max-w-5xl px-6 md:px-10 pb-6 md:pb-8 flex flex-col flex-1"
        style={{ opacity: 0, animation: "qcm-fade-in 400ms ease-out forwards" }}
      >
        {/* Hero — two-column at lg+ */}
        <section className="mt-12 md:mt-16 mb-14 md:mb-20 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-8 md:gap-10 items-start">
          {/* Cover — flat arctic-navy plate, single blue icon */}
          <div className="relative aspect-square w-full overflow-hidden rounded-none border border-border bg-arctic-navy">
            <div className="absolute inset-0 paper-grid" aria-hidden />
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon
                aria-hidden
                className="w-32 h-32 md:w-40 md:h-40 text-primary"
                strokeWidth={1.1}
              />
            </div>
            <span className="absolute top-3 left-3 inline-flex items-center px-2 py-1 rounded-none bg-obsidian/80 border border-border font-mono-hud text-[9px] tracking-[0.18em] uppercase text-glacier-blue">
              {tierBadge(workflow.tier, lang)}
            </span>
          </div>

          {/* Title + price + CTA */}
          <div className="flex flex-col h-full">
            <p className="kicker mb-4">
              01 · Workflows · {workflow.slug.replace(/-/g, " ")}
            </p>
            <h1 className="display-lg display-caps mb-4">{loc.title}</h1>
            <p className="text-[1rem] md:text-[1.0625rem] text-muted-foreground leading-relaxed mb-8 max-w-xl">
              {loc.tagline}
            </p>

            <div className="mt-auto flex flex-wrap items-center gap-4">
              <span className="text-[1.75rem] md:text-[2rem] font-bold text-foreground tracking-tight">
                {workflow.price}
              </span>
              <span
                aria-disabled="true"
                className="cta-disabled inline-flex h-14 items-center justify-center gap-3 px-7 text-[0.95rem] font-semibold"
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
                  className="text-[0.95rem] md:text-[1rem] text-muted-foreground leading-relaxed mb-4 last:mb-0"
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
                  className="card-line flex items-start gap-3 px-4 py-3"
                >
                  <span
                    aria-hidden
                    className="mt-1.5 inline-block w-1.5 h-1.5 shrink-0 rounded-full bg-primary"
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
                  className="card-line px-4 py-3"
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
                  />
                  <span>{vp}</span>
                </li>
              ))}
            </ul>
          </DetailSection>
        )}

        {/* Footer CTA repeat */}
        <section className="card-line card-line-accent mb-12 md:mb-16 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
          <div className="flex-1">
            <h2 className="display-md display-caps mb-2">{loc.title}</h2>
            <p className="text-[0.9rem] text-muted-foreground">
              {loc.hoverDescription}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[1.25rem] font-bold text-foreground tracking-tight">
              {workflow.price}
            </span>
            <span
              aria-disabled="true"
              className="cta-disabled inline-flex h-14 items-center justify-center gap-3 px-7 text-[0.95rem] font-semibold"
            >
              {t.ctaComingSoon}
            </span>
          </div>
        </section>

        {/* Skool CTA — copy shared with /shop via lib/shop/content */}
        <section className="mb-16 md:mb-20">
          <p className="kicker mb-5">{shopCopy.skoolKicker}</p>
          <Link
            href={skoolHref}
            {...(externalSkool
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className={cn("group card-line block p-6 md:p-8", FOCUS_RING)}
          >
            <h2 className="display-md display-caps mb-3 group-hover:text-primary transition-colors">
              {shopCopy.skoolTitle}
            </h2>
            <p className="text-[0.95rem] text-muted-foreground mb-5 leading-relaxed max-w-xl">
              {shopCopy.skoolBlurb}
            </p>
            <span className="inline-flex items-center gap-2 font-mono-hud text-[11px] tracking-[0.18em] uppercase text-primary">
              {shopCopy.skoolCta}
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        </section>

        <div className="hairline mb-6" />
        <p className="font-mono-hud text-[10px] tracking-[0.18em] uppercase text-muted-foreground/70 text-center pb-8">
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
