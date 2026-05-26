"use client";

import dynamic from "next/dynamic";
import type { Lang, PortfolioProject } from "@/lib/portfolio";

// Client-side wrapper for the heavy carousel. Next.js 16 forbids `next/dynamic`
// in Server Components when paired with a `loading` prop — the placeholder
// never hydrates because Server Components don't run React Suspense the same
// way Client Components do (see node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md).
//
// The `loading` callback can't receive arbitrary props, so we read the active
// lang from a module-level variable set by PortfolioClient on each render.
// Single-tab scope, no concurrency concerns.
let activeLang: Lang = "fr";

const PLACEHOLDER_COPY: Record<Lang, { text: string; ariaLabel: string }> = {
  fr: { text: "Chargement…", ariaLabel: "Chargement du portfolio" },
  en: { text: "Loading…", ariaLabel: "Loading portfolio" },
};

const PortfolioCarousel = dynamic(() => import("@/components/PortfolioCarousel"), {
  loading: () => <PortfolioPlaceholder lang={activeLang} />,
});

type Props = {
  projects: PortfolioProject[];
  lang: Lang;
};

function PortfolioPlaceholder({ lang }: { lang: Lang }) {
  // Skeleton-only fallback shown for ~one frame while the carousel chunk loads.
  // Intentionally minimal: no real anchors here — the page's static SSR already
  // renders the catalog above (hero + JSON-LD ItemList) so bots see content.
  // min-h matches the carousel's rendered footprint so the chunk swap doesn't
  // shift layout (CLS).
  const copy = PLACEHOLDER_COPY[lang];
  return (
    <div
      className="w-full min-h-[420px] md:min-h-[600px] py-12 md:py-20 flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label={copy.ariaLabel}
    >
      <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
        {copy.text}
      </div>
    </div>
  );
}

export default function PortfolioClient({ projects, lang }: Props) {
  activeLang = lang;
  return <PortfolioCarousel projects={projects} lang={lang} />;
}
