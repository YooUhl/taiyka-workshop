"use client";

import dynamic from "next/dynamic";
import type { Lang, PortfolioProject } from "@/lib/portfolio";

// Client-side wrapper for the heavy carousel. Next.js 16 forbids `next/dynamic`
// in Server Components when paired with a `loading` prop — the placeholder
// never hydrates because Server Components don't run React Suspense the same
// way Client Components do (see node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md).
const PortfolioCarousel = dynamic(() => import("@/components/PortfolioCarousel"), {
  loading: () => <PortfolioPlaceholder />,
});

type Props = {
  projects: PortfolioProject[];
  lang: Lang;
};

function PortfolioPlaceholder() {
  // Skeleton-only fallback shown for ~one frame while the carousel chunk loads.
  // Intentionally minimal: no real anchors here — the page's static SSR already
  // renders the catalog above (hero + JSON-LD ItemList) so bots see content.
  return (
    <div
      className="w-full py-12 md:py-20 flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
        Loading…
      </div>
    </div>
  );
}

export default function PortfolioClient({ projects, lang }: Props) {
  return <PortfolioCarousel projects={projects} lang={lang} />;
}
