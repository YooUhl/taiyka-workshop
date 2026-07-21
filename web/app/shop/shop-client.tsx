"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { withLang } from "@/lib/lang-utils";
import {
  COPY,
  isValidEmail,
  type CategoryKey,
  type Lang,
} from "@/lib/shop/content";
import { getShopWorkflows, type Workflow } from "@/lib/shop/workflows";
import { resolveIcon } from "@/lib/shop/icon-map";

type FormStatus = "idle" | "submitting" | "success" | "already" | "error";

const SKOOL_EXTERNAL_URL = process.env.NEXT_PUBLIC_SKOOL_COMMUNITY_URL;

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]";

// Every section shares one gutter so the full-bleed rail is the only thing
// that breaks the grid.
const SHELL = "mx-auto w-full max-w-6xl px-6 md:px-10";

export default function ShopClient({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const workflows = getShopWorkflows();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [activeTab, setActiveTab] = useState<CategoryKey>("workflows");

  const externalSkool = SKOOL_EXTERNAL_URL && SKOOL_EXTERNAL_URL.length > 0;
  const skoolHref = externalSkool ? SKOOL_EXTERNAL_URL : withLang("/skool", lang);

  const backHref = lang === "en" ? "/?lang=en" : "/";
  const emailLooksValid = isValidEmail(email.trim());

  const activeCategory =
    c.categories.find((cat) => cat.key === activeTab) ?? c.categories[0];

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
    <main
      className="relative flex-1 w-full flex flex-col min-h-screen"
      style={{ opacity: 0, animation: "qcm-fade-in 400ms ease-out forwards" }}
    >
      <Ticker items={c.ticker} />

      {/* Top bar — back home + label + lang toggle */}
      <div className={cn(SHELL, "py-6 md:py-8")}>
        <div className="w-full grid grid-cols-3 items-center font-mono-hud text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
          <Link
            href={backHref}
            className={cn(
              "justify-self-start hover:text-foreground transition-colors rounded-sm px-1 py-2",
              FOCUS_RING,
            )}
          >
            <span aria-hidden>← </span>
            {c.backLabel}
          </Link>
          <span className="justify-self-center inline-flex items-center gap-2 text-foreground">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,166,255,0.8)]" />
            {c.topStatus}
          </span>
          <Link
            href={c.langSwitchHref}
            className={cn(
              "justify-self-end hover:text-foreground transition-colors rounded-sm px-1 py-2",
              FOCUS_RING,
            )}
            aria-label={lang === "fr" ? "Switch to English" : "Passer en français"}
          >
            {c.langSwitch} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      {/* Hero — split: pitch left, panel right */}
      <section className={cn(SHELL, "mt-8 md:mt-14 mb-16 md:mb-24")}>
        <div className="grid gap-10 lg:gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="kicker kicker-accent mb-6">{c.heroProof}</p>
            <h1 className="display-lg xl:display-xl text-balance">
              {c.heroTitleLead}{" "}
              <span className="text-primary">{c.heroTitleAccent}</span>
            </h1>
            <p className="mt-6 max-w-xl text-[0.95rem] md:text-base text-muted-foreground leading-relaxed">
              {c.heroSubtitle}
            </p>

            <a
              href="#catalogue"
              className={cn(
                "mt-9 inline-flex items-center gap-3 rounded-md bg-primary px-7 py-4 text-[0.95rem] md:text-base font-semibold tracking-tight text-[#06131f] transition-colors hover:bg-[#33b8ff]",
                FOCUS_RING,
              )}
            >
              {c.heroCta}
              <span aria-hidden>→</span>
            </a>

            <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3 font-mono-hud text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
              {c.heroTrust.map((item) => (
                <li key={item} className="inline-flex items-center gap-2">
                  <span aria-hidden className="h-px w-4 bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Panel — stands in for topg's hero image */}
          <div className="card-line relative overflow-hidden p-8 md:p-10 min-h-[18rem] flex flex-col justify-end">
            <div className="absolute inset-0 paper-grid" aria-hidden />
            <div className="relative">
              <p className="kicker kicker-accent mb-4">{c.heroPanelKicker}</p>
              <p className="display-lg mb-4">{c.heroPanelTitle}</p>
              <p className="text-[0.9rem] text-muted-foreground leading-relaxed max-w-sm">
                {c.heroPanelNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalogue — tabs, heading, full-bleed rail */}
      <section id="catalogue" className="mb-16 md:mb-24 scroll-mt-8">
        <div className={SHELL}>
          <div
            role="tablist"
            aria-label={c.tabsAriaLabel}
            className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 mb-10 md:mb-12"
          >
            {c.categories.map((cat, i) => (
              <div key={cat.key} className="flex items-center">
                {i > 0 && (
                  <span aria-hidden className="mx-3 h-3 w-px bg-border" />
                )}
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === cat.key}
                  onClick={() => setActiveTab(cat.key)}
                  className={cn(
                    "rounded-sm px-2 py-2 font-mono-hud text-[11px] tracking-[0.18em] uppercase transition-colors",
                    FOCUS_RING,
                    activeTab === cat.key
                      ? "text-foreground"
                      : "text-muted-foreground/70 hover:text-muted-foreground",
                  )}
                >
                  {cat.label}
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-end justify-between gap-6 mb-7">
            <h2 className="display-lg">{activeCategory.heading}</h2>
            <span className="font-mono-hud text-[10px] tracking-[0.18em] uppercase text-primary whitespace-nowrap pb-2">
              {activeCategory.live
                ? `${workflows.length} ${lang === "fr" ? "produits" : "products"}`
                : activeCategory.status}
            </span>
          </div>
        </div>

        {activeCategory.live ? (
          <ProductRail lang={lang} workflows={workflows} />
        ) : (
          <div className={SHELL}>
            <div className="card-line p-8 md:p-12">
              <p className="text-[0.95rem] md:text-base text-muted-foreground leading-relaxed max-w-2xl">
                {activeCategory.emptyState}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Category tiles — big type, topg's "CATEGORIES" strip */}
      <section className={cn(SHELL, "mb-16 md:mb-24")}>
        <p className="kicker kicker-accent mb-6">{c.tilesKicker}</p>
        <ul className="grid gap-px bg-border border border-border rounded-md overflow-hidden sm:grid-cols-3">
          {c.tiles.map((tile) => (
            <li key={tile.key} className="bg-background">
              <div className="relative flex h-40 md:h-52 items-center justify-center overflow-hidden bg-arctic-navy">
                <div className="absolute inset-0 paper-grid" aria-hidden />
                <span
                  aria-hidden
                  className="relative display-lg whitespace-nowrap text-foreground/25"
                >
                  {tile.display}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <span className="text-[0.95rem] font-semibold tracking-tight text-foreground">
                    {tile.label}
                  </span>
                  <span className="font-mono-hud text-[9px] tracking-[0.18em] uppercase text-muted-foreground/70 whitespace-nowrap">
                    {tile.status}
                  </span>
                </div>
                <p className="text-[0.85rem] text-muted-foreground leading-snug">
                  {tile.blurb}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Feature banner — topg's full-width product push */}
      <section className={cn(SHELL, "mb-16 md:mb-24")}>
        <div className="card-line card-line-accent relative overflow-hidden">
          <div className="absolute inset-0 paper-grid" aria-hidden />
          <div className="relative grid gap-8 p-8 md:p-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="kicker kicker-accent mb-5">{c.featureKicker}</p>
              <h2 className="display-lg mb-4">{c.featureTitle}</h2>
              <p className="text-[0.95rem] md:text-base text-muted-foreground leading-relaxed max-w-xl mb-8">
                {c.featureBlurb}
              </p>
              <Link
                href={withLang(`/shop/workflows/${c.featureSlug}`, lang)}
                className={cn(
                  "inline-flex items-center gap-3 rounded-md bg-primary px-7 py-4 text-[0.95rem] font-semibold tracking-tight text-[#06131f] transition-colors hover:bg-[#33b8ff]",
                  FOCUS_RING,
                )}
              >
                {c.featureCta}
                <span aria-hidden>→</span>
              </Link>
            </div>
            <FeatureMark slug={c.featureSlug} workflows={workflows} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={cn(SHELL, "mb-16 md:mb-24")}>
        <p className="kicker kicker-accent mb-6">{c.faqKicker}</p>
        <h2 className="display-lg mb-8">{c.faqTitle}</h2>
        <ul className="border-t border-border">
          {c.faq.map((item) => (
            <li key={item.q} className="border-b border-border">
              <details className="group">
                <summary
                  className={cn(
                    "flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[0.95rem] md:text-base font-medium text-foreground transition-colors hover:text-primary",
                    FOCUS_RING,
                  )}
                >
                  {item.q}
                  <Plus
                    aria-hidden
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45 group-hover:text-primary"
                  />
                </summary>
                <p className="pb-6 pr-10 text-[0.9rem] md:text-[0.95rem] text-muted-foreground leading-relaxed max-w-3xl">
                  {item.a}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </section>

      {/* Trust strip */}
      <section className={cn(SHELL, "mb-16 md:mb-24")}>
        <ul className="grid gap-px bg-border border border-border rounded-md overflow-hidden sm:grid-cols-3">
          {c.trust.map((item) => (
            <li key={item.label} className="bg-background px-6 py-7 text-center">
              <p className="font-mono-hud text-[11px] tracking-[0.18em] uppercase text-primary mb-2">
                {item.label}
              </p>
              <p className="text-[0.85rem] text-muted-foreground leading-snug">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Waitlist */}
      <section className={cn(SHELL, "mb-16 md:mb-24")}>
        <p className="kicker kicker-accent mb-5">{c.waitlistKicker}</p>
        <div className="card-line card-line-accent p-6 md:p-10">
          <h2 className="display-md mb-3">{c.waitlistTitle}</h2>
          <p className="text-[0.95rem] text-muted-foreground mb-7 leading-relaxed max-w-xl">
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
                className="flex-1 rounded-md border border-input bg-card px-4 py-3 text-[0.95rem] md:text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary transition-colors"
                aria-invalid={status === "error"}
                required
              />
              <button
                type="submit"
                disabled={!emailLooksValid || status === "submitting"}
                className={cn(
                  "rounded-md py-3 px-6 text-[0.95rem] md:text-base font-semibold tracking-tight transition-colors",
                  FOCUS_RING,
                  emailLooksValid && status !== "submitting"
                    ? "bg-primary text-[#06131f] hover:bg-[#33b8ff]"
                    : "bg-muted text-muted-foreground cursor-not-allowed",
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
                messageTone === "err" ? "text-destructive" : "text-primary",
              )}
            >
              {messageForStatus}
            </p>
          )}
        </div>
      </section>

      {/* Skool CTA */}
      <section className={cn(SHELL, "mb-16 md:mb-24")}>
        <p className="kicker mb-5">{c.skoolKicker}</p>
        <Link
          href={skoolHref}
          {...(externalSkool
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className={cn("group card-line block p-6 md:p-10", FOCUS_RING)}
        >
          <h2 className="display-md mb-3 group-hover:text-primary transition-colors">
            {c.skoolTitle}
          </h2>
          <p className="text-[0.95rem] text-muted-foreground mb-6 leading-relaxed max-w-xl">
            {c.skoolBlurb}
          </p>
          <span className="inline-flex items-center gap-2 font-mono-hud text-[11px] tracking-[0.18em] uppercase text-primary">
            {c.skoolCta}
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </Link>
      </section>

      <div className={SHELL}>
        <div className="hairline mb-6" />
        <p className="font-mono-hud text-[10px] tracking-[0.18em] uppercase text-muted-foreground/70 text-center pb-8">
          {c.footerNote}
        </p>
      </div>
    </main>
  );
}

/**
 * Announcement ticker. The track carries the list twice; the keyframe travels
 * exactly half its width so the seam never shows.
 */
function Ticker({ items }: { items: string[] }) {
  const run = [...items, ...items];
  return (
    <div className="w-full overflow-hidden border-b border-border bg-arctic-navy/60 py-2.5">
      <div
        className="flex w-max"
        style={{ animation: "ticker-scroll 38s linear infinite" }}
      >
        {run.map((item, i) => (
          <span
            key={`${item}-${i}`}
            aria-hidden={i >= items.length}
            className="inline-flex items-center whitespace-nowrap font-mono-hud text-[10px] tracking-[0.18em] uppercase text-muted-foreground"
          >
            {item}
            <span className="mx-5 text-primary" aria-hidden>
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Full-bleed product rail. Cards sit flush against each other with a single
 * hairline between them and the last one runs off the right edge, which is
 * what tells you there's more to scroll.
 */
function ProductRail({
  lang,
  workflows,
}: {
  lang: Lang;
  workflows: Workflow[];
}) {
  const scroller = useRef<HTMLUListElement>(null);

  function nudge(direction: -1 | 1) {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: direction * (el.clientWidth * 0.8), behavior: "smooth" });
  }

  const prevLabel = lang === "fr" ? "Produits précédents" : "Previous products";
  const nextLabel = lang === "fr" ? "Produits suivants" : "Next products";

  return (
    <div className="relative">
      <ul
        ref={scroller}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth border-y border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {workflows.map((w) => (
          <li
            key={w.slug}
            // grow fills the rail when the catalog is small; shrink-0 + basis
            // means a bigger catalog overflows into a scroll instead of squashing.
            className="snap-start grow shrink-0 basis-[64vw] sm:basis-[19rem] border-r border-border last:border-r-0"
          >
            <ProductCard workflow={w} lang={lang} />
          </li>
        ))}
      </ul>

      {/* Arrows — pointer devices only; touch just swipes */}
      <div className="hidden md:flex justify-end gap-2 pt-4 mx-auto w-full max-w-6xl px-6 md:px-10">
        <button
          type="button"
          onClick={() => nudge(-1)}
          aria-label={prevLabel}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary",
            FOCUS_RING,
          )}
        >
          <ChevronLeft aria-hidden className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => nudge(1)}
          aria-label={nextLabel}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary",
            FOCUS_RING,
          )}
        >
          <ChevronRight aria-hidden className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/** Image plate, name, price. Nothing else — the topg treatment. */
function ProductCard({ workflow, lang }: { workflow: Workflow; lang: Lang }) {
  const loc = workflow[lang];
  const Icon = resolveIcon(workflow.icon);
  const href = withLang(`/shop/workflows/${workflow.slug}`, lang);

  return (
    <Link href={href} className={cn("group block h-full", FOCUS_RING)}>
      <div className="relative aspect-square w-full overflow-hidden bg-arctic-navy">
        <div className="absolute inset-0 paper-grid" aria-hidden />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon
            aria-hidden
            className="w-14 h-14 md:w-16 md:h-16 text-primary transition-transform duration-300 group-hover:scale-105"
            strokeWidth={1.25}
          />
        </div>
      </div>

      <div className="px-4 py-6 text-center">
        <h3 className="font-mono-hud text-[11px] tracking-[0.18em] uppercase text-muted-foreground transition-colors group-hover:text-primary">
          {loc.title}
        </h3>
        <p className="mt-3 text-[1.125rem] font-bold tracking-tight text-foreground">
          {workflow.price}
        </p>
      </div>
    </Link>
  );
}

/** Icon plate for the feature banner, pulled from the featured product. */
function FeatureMark({
  slug,
  workflows,
}: {
  slug: string;
  workflows: Workflow[];
}) {
  const featured = workflows.find((w) => w.slug === slug);
  if (!featured) return null;
  const Icon = resolveIcon(featured.icon);

  return (
    <div className="relative hidden lg:flex aspect-square items-center justify-center overflow-hidden rounded-md border border-border bg-arctic-navy">
      <div className="absolute inset-0 paper-grid" aria-hidden />
      <Icon
        aria-hidden
        className="relative w-24 h-24 text-primary"
        strokeWidth={1}
      />
    </div>
  );
}
