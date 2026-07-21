"use client";

import { forwardRef, memo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Lang, PortfolioProject } from "@/lib/portfolio";
import { getProjectMeta } from "./PortfolioDetail";

type Tilt = "left" | "center" | "right";

type Props = {
  project: PortfolioProject;
  lang: Lang;
  isActive: boolean;
  tilt: Tilt;
  onClick: () => void;
  domId?: string;
};

const HINT = {
  fr: { tap: "▸ TOUCHER POUR OUVRIR", focus: "▸ CLIQUER POUR CENTRER" },
  en: { tap: "▸ TAP TO EXPAND", focus: "▸ CLICK TO FOCUS" },
};

// Synchronously read a media query — server-safe (returns false on SSR)
function readMediaQuery(query: string): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(query).matches;
}

const PortfolioTileImpl = forwardRef<HTMLButtonElement, Props>(function PortfolioTile(
  { project, lang, isActive, tilt, onClick, domId },
  ref
) {
  const content = project[lang];
  const meta = getProjectMeta(project.slug);
  const HeroIcon = meta.icon;
  const primary = meta.metrics[0];
  const hintMap = HINT[lang];

  const [hover, setHover] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(() => readMediaQuery("(hover: none)"));
  const [isCompact, setIsCompact] = useState(() => readMediaQuery("(max-width: 767px)"));
  const [reducedMotion, setReducedMotion] = useState(() => readMediaQuery("(prefers-reduced-motion: reduce)"));

  // Hint debounce — preserve previous hint for 150ms when isActive changes to avoid flicker
  const [displayedHint, setDisplayedHint] = useState<string>(isActive ? hintMap.tap : hintMap.focus);
  useEffect(() => {
    const next = isActive ? hintMap.tap : hintMap.focus;
    const id = window.setTimeout(() => setDisplayedHint(next), 150);
    return () => window.clearTimeout(id);
  }, [isActive, hintMap.tap, hintMap.focus]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mqHover = window.matchMedia("(hover: none)");
    const mqCompact = window.matchMedia("(max-width: 767px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onHover = (e: MediaQueryListEvent) => setIsCoarsePointer(e.matches);
    const onCompact = (e: MediaQueryListEvent) => setIsCompact(e.matches);
    const onMotion = (e: MediaQueryListEvent) => setReducedMotion(e.matches);

    mqHover.addEventListener?.("change", onHover);
    mqCompact.addEventListener?.("change", onCompact);
    mqMotion.addEventListener?.("change", onMotion);

    return () => {
      mqHover.removeEventListener?.("change", onHover);
      mqCompact.removeEventListener?.("change", onCompact);
      mqMotion.removeEventListener?.("change", onMotion);
    };
  }, []);

  const tiltAngle = isCompact ? 12 : 18;
  const tiltZ = isCompact ? -40 : -60;
  const hoverActive = hover && !isCoarsePointer;

  // Build transform — reduced motion drops 3D rotation/translateZ entirely (scale only)
  let transform: string;
  let transformOrigin = "center";
  if (isActive) {
    transform = hoverActive && !reducedMotion ? "translateY(-3px) scale(1.015)" : "scale(1)";
  } else if (tilt === "left") {
    const scale = hoverActive ? 0.88 : 0.82;
    transform = reducedMotion
      ? `scale(${scale})`
      : `translateZ(${tiltZ}px) rotateY(${tiltAngle}deg) scale(${scale})`;
    transformOrigin = "right center";
  } else if (tilt === "right") {
    const scale = hoverActive ? 0.88 : 0.82;
    transform = reducedMotion
      ? `scale(${scale})`
      : `translateZ(${tiltZ}px) rotateY(${-tiltAngle}deg) scale(${scale})`;
    transformOrigin = "left center";
  } else {
    transform = hoverActive ? "scale(0.96)" : "scale(0.92)";
  }

  // Neutral elevation — depth comes from shadow + border, not from glow
  const shadow = isActive
    ? "0 18px 44px rgba(0,0,0,0.55)"
    : hoverActive
      ? "0 10px 28px rgba(0,0,0,0.4)"
      : "0 4px 16px rgba(0,0,0,0.3)";

  return (
    <button
      ref={ref}
      id={domId}
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      aria-label={`${meta.codename} — ${content.title}`}
      aria-current={isActive ? "true" : undefined}
      className={cn(
        "group relative block shrink-0 cursor-pointer overflow-hidden text-left",
        // Site-wide box definition — see .card-line in globals.css.
        "card-line",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]",
        "motion-safe:transition-[transform,opacity] motion-safe:duration-[350ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
        isActive
          ? "z-10 card-line-accent"
          : hoverActive
            ? "opacity-90"
            : "opacity-70"
      )}
      style={{
        width: "min(72vw, 280px)",
        aspectRatio: "9 / 16",
        transform,
        transformOrigin,
        boxShadow: shadow,
      }}
    >
      {/* Accent edge — the one blue mark on the tile, strongest when active */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px transition-colors",
          isActive ? "bg-primary" : hoverActive ? "bg-primary/50" : "bg-transparent"
        )}
      />

      {/* Diagram trace — quiet blueprint texture, no gradient blob */}
      {project.diagramSvg && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.06] [&_svg]:w-full [&_svg]:h-full [&_svg]:object-cover"
            dangerouslySetInnerHTML={{ __html: project.diagramSvg }}
          />
        </div>
      )}

      {/* Card content — keep pointer-events on so the outer button receives clicks
          (Wave 2-B applied pointer-events:none here for iOS phantom-tap protection,
          but the bracket and gradient overlays already carry pointer-events-none
          individually — disabling the entire content div blocked hover affordances). */}
      <div className="relative z-10 flex h-full flex-col gap-4 p-4 md:p-5">
        {/* Top row: status + codename (dimmed/smaller per v3 hierarchy) */}
        <div className="flex items-start justify-between gap-2 font-mono-hud text-[9px] tracking-[0.18em] uppercase">
          <span
            className={cn(
              "inline-flex items-center gap-1.5",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <span
              aria-hidden
              className={cn(
                "inline-block w-1 h-1 rounded-full",
                isActive ? "bg-primary" : "bg-muted-foreground/60"
              )}
            />
            {meta.statusPill}
          </span>
          <span
            className="text-muted-foreground/70 text-right text-[8px] overflow-hidden text-ellipsis whitespace-nowrap max-w-[55%]"
            title={meta.codename}
          >
            {meta.codename}
          </span>
        </div>

        {/* Hero icon — seated on a flat arctic-navy plate, no halo */}
        <div className="grow flex items-center justify-center py-2">
          <div
            aria-hidden
            className={cn(
              "relative grid place-items-center rounded-none border w-20 h-20 md:w-24 md:h-24 transition-[border-color,background-color] duration-300",
              isActive
                ? "border-primary/50 bg-arctic-navy"
                : "border-border bg-arctic-navy/60"
            )}
          >
            <HeroIcon
              className={cn(
                "transition-colors",
                isActive ? "text-primary" : hoverActive ? "text-primary/80" : "text-glacier-blue"
              )}
              strokeWidth={1.4}
              size={48}
            />
          </div>
        </div>

        {/* Title + primary metric (metric promoted as headline) */}
        <div className="flex flex-col gap-2 text-center">
          <h3
            className={cn(
              "text-base md:text-lg font-bold tracking-tight leading-tight text-balance",
              isActive ? "text-foreground" : "text-foreground/85"
            )}
          >
            {content.title}
          </h3>
          <div className="flex flex-col items-center gap-1">
            {primary ? (
              <>
                <span
                  className={cn(
                    "text-3xl md:text-4xl font-bold leading-none tabular-nums tracking-tight",
                    isActive ? "text-primary" : "text-foreground"
                  )}
                >
                  {primary.value}
                </span>
                <span className="font-mono-hud text-[9px] tracking-[0.18em] uppercase text-muted-foreground">
                  {primary.label}
                </span>
              </>
            ) : (
              <span aria-hidden className="text-2xl text-muted-foreground/40 leading-none">
                —
              </span>
            )}
          </div>
        </div>

        {/* Bottom hint — debounced */}
        <div
          className={cn(
            "font-mono-hud text-[9px] tracking-[0.18em] uppercase text-center min-h-3 transition-colors",
            isActive ? "text-primary" : "text-muted-foreground/70"
          )}
        >
          {displayedHint}
        </div>
      </div>
    </button>
  );
});

const PortfolioTile = memo(PortfolioTileImpl);
PortfolioTile.displayName = "PortfolioTile";
export default PortfolioTile;
