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

  // Hero icon halo — always present, brighter when active, slight tint always (fixes flicker)
  const iconShadow = isActive
    ? "0 0 32px rgba(0,166,255,0.32)"
    : hoverActive
      ? "0 0 18px rgba(0,166,255,0.22)"
      : "0 0 12px rgba(0,166,255,0.10)";

  const shadow = isActive
    ? hoverActive
      ? "0 0 60px rgba(0,166,255,0.5)"
      : "0 0 44px rgba(0,166,255,0.35)"
    : hoverActive
      ? "0 0 24px rgba(0,166,255,0.18)"
      : "none";

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
        "group relative block shrink-0 cursor-pointer rounded-xl border bg-card/40 text-left",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]",
        "motion-safe:transition-[transform,opacity,box-shadow,border-color] motion-safe:duration-[350ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
        isActive
          ? "z-10 border-primary/70"
          : hoverActive
            ? "border-primary/50 opacity-85"
            : "border-border/40 opacity-65"
      )}
      style={{
        width: "min(72vw, 280px)",
        aspectRatio: "9 / 16",
        transform,
        transformOrigin,
        boxShadow: shadow,
        WebkitBoxReflect: "below 8px linear-gradient(transparent 40%, rgba(0,166,255,0.18))",
      }}
    >
      {/* HUD corner brackets */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t transition-colors",
          isActive
            ? "border-primary animate-hud-bracket-pulse"
            : hoverActive
              ? "border-[var(--hud-bracket)]"
              : "border-[var(--hud-bracket-dim)]"
        )}
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t transition-colors",
          isActive
            ? "border-primary animate-hud-bracket-pulse"
            : hoverActive
              ? "border-[var(--hud-bracket)]"
              : "border-[var(--hud-bracket-dim)]"
        )}
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-2 bottom-2 h-3 w-3 border-l border-b transition-colors",
          isActive
            ? "border-primary animate-hud-bracket-pulse"
            : hoverActive
              ? "border-[var(--hud-bracket)]"
              : "border-[var(--hud-bracket-dim)]"
        )}
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute right-2 bottom-2 h-3 w-3 border-r border-b transition-colors",
          isActive
            ? "border-primary animate-hud-bracket-pulse"
            : hoverActive
              ? "border-[var(--hud-bracket)]"
              : "border-[var(--hud-bracket-dim)]"
        )}
      />

      {/* Ambient gradient + diagram trace */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
        <div
          className="absolute inset-0 opacity-[0.55]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 35%, rgba(0,166,255,0.18), transparent 60%), linear-gradient(180deg, rgba(15,26,46,0.6) 0%, rgba(10,22,40,0.85) 100%)",
          }}
        />
        {project.diagramSvg && (
          <div
            className="absolute inset-0 opacity-[0.05] [&_svg]:w-full [&_svg]:h-full [&_svg]:object-cover"
            style={{
              maskImage:
                "radial-gradient(ellipse at center 40%, #000 30%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center 40%, #000 30%, transparent 75%)",
            }}
            dangerouslySetInnerHTML={{ __html: project.diagramSvg }}
          />
        )}
      </div>

      {/* Card content — pointer-events disabled on tilted side tiles so the 3D-rotated
          surface doesn't extend its hit area (notably on iOS Safari with perspective:1500px).
          The outer <button> remains clickable and still routes through scrollToActual. */}
      <div
        className={cn(
          "relative z-10 flex h-full flex-col gap-4 p-4 md:p-5",
          !isActive && "pointer-events-none"
        )}
      >
        {/* Top row: status + codename (dimmed/smaller per v3 hierarchy) */}
        <div className="flex items-start justify-between gap-2 font-mono-hud text-[9px] tracking-[0.22em] uppercase">
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
                isActive
                  ? "bg-primary animate-hud-bracket-pulse"
                  : "bg-muted-foreground/60"
              )}
            />
            {meta.statusPill}
          </span>
          <span
            className="text-muted-foreground/60 text-right text-[8px] overflow-hidden text-ellipsis whitespace-nowrap max-w-[55%]"
            title={meta.codename}
          >
            {meta.codename}
          </span>
        </div>

        {/* Hero icon — halo always present, brighter on active/hover */}
        <div className="grow flex items-center justify-center py-2">
          <div
            aria-hidden
            className={cn(
              "relative grid place-items-center rounded-md border w-20 h-20 md:w-24 md:h-24 transition-[border-color,background-color,box-shadow] duration-300",
              isActive
                ? "border-primary/60 bg-primary/[0.08]"
                : hoverActive
                  ? "border-primary/40 bg-primary/[0.04]"
                  : "border-border/40 bg-card/30"
            )}
            style={{ boxShadow: iconShadow }}
          >
            <HeroIcon
              className={cn(
                "transition-colors",
                isActive ? "text-primary" : hoverActive ? "text-primary/90" : "text-primary/70"
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
              "text-sm md:text-base font-bold uppercase tracking-tight leading-tight text-balance",
              isActive ? "text-foreground" : "text-foreground/85"
            )}
          >
            {content.title}
          </h3>
          <div className="flex flex-col items-center gap-0.5">
            {primary ? (
              <>
                <span
                  className={cn(
                    "font-display-hud text-3xl md:text-4xl leading-none text-primary tabular-nums",
                    isActive && "animate-hud-bracket-pulse"
                  )}
                  style={{
                    textShadow: isActive
                      ? "0 0 22px rgba(0,166,255,0.6)"
                      : hoverActive
                        ? "0 0 14px rgba(0,166,255,0.35)"
                        : "0 0 8px rgba(0,166,255,0.2)",
                  }}
                >
                  {primary.value}
                </span>
                <span className="font-mono-hud text-[9px] tracking-[0.22em] uppercase text-muted-foreground/80">
                  {primary.label}
                </span>
              </>
            ) : (
              <span
                aria-hidden
                className="font-display-hud text-2xl text-muted-foreground/40 leading-none"
              >
                —
              </span>
            )}
          </div>
        </div>

        {/* Bottom hint — debounced */}
        <div className="font-mono-hud text-[9px] tracking-[0.22em] uppercase text-center text-muted-foreground/70 min-h-3">
          {displayedHint}
        </div>
      </div>
    </button>
  );
});

const PortfolioTile = memo(PortfolioTileImpl);
PortfolioTile.displayName = "PortfolioTile";
export default PortfolioTile;
