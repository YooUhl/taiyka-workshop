"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lang, PortfolioProject } from "@/lib/portfolio";
import PortfolioTile from "./PortfolioTile";
import PortfolioModal from "./PortfolioModal";

type Props = {
  projects: PortfolioProject[];
  lang: Lang;
};

const NAV_LABEL = {
  fr: {
    next: "Suivant",
    tablist: "Navigation projets",
    carousel: "Portfolio projets",
    instructions:
      "Utilisez la flèche droite ou le bouton Suivant pour naviguer. Appuyez sur Entrée pour ouvrir un projet.",
  },
  en: {
    next: "Next",
    tablist: "Project navigation",
    carousel: "Portfolio projects",
    instructions:
      "Use right arrow or the Next button to navigate. Press Enter to open a project.",
  },
};

const CHEVRON_PULSE_MS = 4000;

export default function PortfolioCarousel({ projects, lang }: Props) {
  const loop = projects.length;
  const loopProjects = [...projects, ...projects, ...projects];
  const centerStart = loop;

  const scrollRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<Array<HTMLButtonElement | null>>([]);
  const rebaseTimeoutRef = useRef<number | null>(null);
  const rafIdRef = useRef<number>(0);

  const [actualIndex, setActualIndex] = useState(centerStart);
  const [openLogicalIndex, setOpenLogicalIndex] = useState<number | null>(null);
  const lastFocusedIndex = useRef<number>(centerStart);
  const [chevronPulsing, setChevronPulsing] = useState(true);

  const displayIndex = ((actualIndex % loop) + loop) % loop;

  // First-visit chevron affordance: pulse for ~4s after mount
  useEffect(() => {
    const id = window.setTimeout(() => setChevronPulsing(false), CHEVRON_PULSE_MS);
    return () => window.clearTimeout(id);
  }, []);

  const centerOffsetFor = useCallback((i: number): number | null => {
    const container = scrollRef.current;
    const tile = tilesRef.current[i];
    if (!container || !tile) return null;
    return tile.offsetLeft + tile.clientWidth / 2 - container.clientWidth / 2;
  }, []);

  const computeClosestIndex = useCallback((): number => {
    const container = scrollRef.current;
    if (!container) return actualIndex;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    tilesRef.current.forEach((el, i) => {
      if (!el) return;
      const tileCenter = el.offsetLeft + el.clientWidth / 2;
      const dist = Math.abs(tileCenter - containerCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    return closest;
  }, [actualIndex]);

  // Initial mount: snap to center copy's first tile
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const id = requestAnimationFrame(() => {
      const left = centerOffsetFor(centerStart);
      if (left !== null) {
        container.scrollTo({ left, behavior: "auto" });
      }
      setActualIndex(centerStart);
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Silent rebase into the center copy
  const rebaseIfNeeded = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const idx = computeClosestIndex();
    if (idx >= centerStart && idx < centerStart + loop) {
      setActualIndex(idx);
      return;
    }
    const mirror = centerStart + (((idx % loop) + loop) % loop);
    const mirrorOffset = centerOffsetFor(mirror);
    if (mirrorOffset === null) return;
    const prev = container.style.scrollBehavior;
    container.style.scrollBehavior = "auto";
    container.scrollLeft = mirrorOffset;
    container.style.scrollBehavior = prev;
    setActualIndex(mirror);
  }, [centerOffsetFor, computeClosestIndex, centerStart, loop]);

  // rAF-throttled scroll handler + debounced rebase
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const onScroll = () => {
      if (rafIdRef.current) return;
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = 0;
        const idx = computeClosestIndex();
        setActualIndex((prev) => (prev === idx ? prev : idx));
      });
      if (rebaseTimeoutRef.current !== null) {
        window.clearTimeout(rebaseTimeoutRef.current);
      }
      rebaseTimeoutRef.current = window.setTimeout(() => {
        rebaseTimeoutRef.current = null;
        rebaseIfNeeded();
      }, 140);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", onScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (rebaseTimeoutRef.current !== null) {
        window.clearTimeout(rebaseTimeoutRef.current);
      }
    };
  }, [computeClosestIndex, rebaseIfNeeded]);

  // ResizeObserver — keep active tile centered on viewport resize
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      const left = centerOffsetFor(actualIndex);
      if (left === null) return;
      const prev = container.style.scrollBehavior;
      container.style.scrollBehavior = "auto";
      container.scrollLeft = left;
      container.style.scrollBehavior = prev;
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [actualIndex, centerOffsetFor]);

  // Forward-only navigation: ArrowRight advances; ArrowLeft also advances
  // (forward-only is a locked design decision — left mirrors right so it doesn't feel broken).
  // Listener attached to the scroll container, which is focusable via tabIndex={0}.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const onKey = (e: KeyboardEvent) => {
      if (openLogicalIndex !== null) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        scrollToActual(actualIndex + 1);
      }
    };
    container.addEventListener("keydown", onKey);
    return () => container.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualIndex, openLogicalIndex]);

  function scrollToActual(i: number) {
    const tile = tilesRef.current[i];
    if (!tile) return;
    tile.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  // Stable callbacks for each tile — prevents memoized tile re-renders
  const tileClickRefs = useRef<Array<() => void>>([]);
  if (tileClickRefs.current.length !== loopProjects.length) {
    tileClickRefs.current = loopProjects.map((_, i) => () => onTileClick(loopProjects[i].slug, i));
  }
  function onTileClick(slug: string, i: number) {
    if (i === actualIndex) {
      lastFocusedIndex.current = i;
      const logical = ((i % loop) + loop) % loop;
      setOpenLogicalIndex(logical);
    } else {
      scrollToActual(i);
    }
  }

  function onDotClick(logicalIdx: number) {
    const target = centerStart + logicalIdx;
    scrollToActual(target);
  }

  function onModalClose() {
    setOpenLogicalIndex(null);
    requestAnimationFrame(() => {
      tilesRef.current[lastFocusedIndex.current]?.focus();
    });
  }

  function onModalPrev() {
    setOpenLogicalIndex((prev) => (prev === null ? prev : (prev - 1 + loop) % loop));
  }

  function onModalNext() {
    setOpenLogicalIndex((prev) => (prev === null ? prev : (prev + 1) % loop));
  }

  const tiltOf = (i: number): "left" | "center" | "right" => {
    if (i < actualIndex) return "left";
    if (i > actualIndex) return "right";
    return "center";
  };

  const openProject = openLogicalIndex !== null ? projects[openLogicalIndex] : null;
  const labels = NAV_LABEL[lang];

  return (
    <div
      className="relative w-full"
      aria-roledescription="carousel"
      aria-label={labels.carousel}
    >
      <p className="sr-only">{labels.instructions}</p>
      <div
        ref={scrollRef}
        tabIndex={0}
        role="region"
        aria-label={labels.carousel}
        className={cn(
          "w-full overflow-x-auto overflow-y-visible snap-x snap-mandatory scroll-smooth",
          "py-12 md:py-20",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "[perspective:1500px]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-md"
        )}
      >
        <ul
          role="list"
          className="cv-auto flex items-center gap-4 md:gap-6"
          style={{
            paddingInline: "calc(50% - min(36vw, 140px))",
          }}
        >
          {loopProjects.map((p, i) => {
            // i < loop = first duplicate copy (left of center) — hide from a11y tree
            // i >= centerStart + loop = third duplicate copy (right of center) — hide
            // Only the center copy [centerStart, centerStart + loop) is exposed to AT
            const isCenterCopy = i >= centerStart && i < centerStart + loop;
            const ariaHidden = !isCenterCopy;
            return (
              <li
                key={`${p.slug}-${i}`}
                role="listitem"
                className="snap-center shrink-0"
                aria-hidden={ariaHidden || undefined}
              >
                <PortfolioTile
                  ref={(el) => {
                    tilesRef.current[i] = el;
                  }}
                  domId={`portfolio-tile-${i}`}
                  project={p}
                  lang={lang}
                  isActive={i === actualIndex}
                  tilt={tiltOf(i)}
                  onClick={tileClickRefs.current[i]}
                />
              </li>
            );
          })}
        </ul>
      </div>

      {/* Forward-only Next button — desktop only, pulses for first 4s as affordance */}
      <div className="pointer-events-none hidden md:flex absolute inset-y-0 left-0 right-0 items-center justify-end px-2 lg:px-4">
        <button
          type="button"
          onClick={() => scrollToActual(actualIndex + 1)}
          aria-label={labels.next}
          className={cn(
            "pointer-events-auto grid h-11 w-11 place-items-center rounded-md border bg-card/70 backdrop-blur-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]",
            chevronPulsing
              ? "border-primary text-primary animate-hud-bracket-pulse"
              : "border-primary/40 text-primary/70 hover:border-primary hover:text-primary"
          )}
        >
          <ChevronRight size={18} strokeWidth={1.5} aria-hidden />
        </button>
      </div>

      {/* Position dots — proper tablist structure + bigger active dot with glow */}
      <div className="mt-4 flex items-center justify-center gap-2 font-mono-hud text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
        <span>
          {String(displayIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </span>
        <span aria-hidden className="text-muted-foreground/40">·</span>
        <div role="tablist" aria-label={labels.tablist} className="flex items-center">
          {projects.map((p, i) => {
            const isActiveDot = i === displayIndex;
            return (
              <button
                key={p.slug}
                type="button"
                role="tab"
                aria-selected={isActiveDot}
                aria-controls={`portfolio-tile-${centerStart + i}`}
                aria-label={`${i + 1} / ${projects.length}`}
                onClick={() => onDotClick(i)}
                className={cn(
                  "p-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "block h-1.5 rounded-full transition-all duration-300",
                    isActiveDot
                      ? "w-8 bg-primary"
                      : "w-1 bg-muted-foreground/40 group-hover:bg-muted-foreground/70"
                  )}
                  style={
                    isActiveDot
                      ? { boxShadow: "0 0 12px rgba(0,166,255,0.45)" }
                      : undefined
                  }
                />
              </button>
            );
          })}
        </div>
      </div>

      {openProject && (
        <PortfolioModal
          project={openProject}
          lang={lang}
          onClose={onModalClose}
          onPrev={onModalPrev}
          onNext={onModalNext}
        />
      )}
    </div>
  );
}
