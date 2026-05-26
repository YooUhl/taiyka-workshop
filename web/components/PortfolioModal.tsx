"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { withLang } from "@/lib/lang-utils";
import type { Lang, PortfolioProject } from "@/lib/portfolio";
import PortfolioDetail, { getProjectMeta } from "./PortfolioDetail";

type Props = {
  project: PortfolioProject;
  lang: Lang;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

type ModalState = "entering" | "open" | "closing";

const LABELS = {
  fr: {
    close: "Fermer",
    prev: "Projet précédent",
    next: "Projet suivant",
    cta: "Discutons un projet similaire",
    secondaryDefault: "Voir mes systèmes packagés → /products",
    secondaryIntel: "Système packagé → /products",
  },
  en: {
    close: "Close",
    prev: "Previous project",
    next: "Next project",
    cta: "Let's discuss a similar project",
    secondaryDefault: "See my packaged systems → /products",
    secondaryIntel: "Packaged system → /products",
  },
};

const ANIM_MS = 200;

const FOCUSABLE_SELECTOR =
  '[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function PortfolioModal({
  project,
  lang,
  onClose,
  onPrev,
  onNext,
}: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const [state, setState] = useState<ModalState>("entering");
  const labels = LABELS[lang];
  const meta = getProjectMeta(project.slug);

  const ctaHref = `mailto:manu.uhila@taiyka.com?subject=${encodeURIComponent(
    `Projet similaire — ${meta.codename}`
  )}`;

  // Contextual secondary CTA → /products, mapped from project slug.
  // Anchor (#competitor-intel) resolves once ProductCard renders id={slug} (Wave 3-B6).
  // withLang preserves the ?lang=en query when applicable, keeping the hash fragment intact.
  const slugLower = project.slug.toLowerCase();
  const isIntel = slugLower.includes("polymaker") || slugLower.includes("intel");
  const secondaryHref = withLang(isIntel ? "/products#competitor-intel" : "/products", lang);
  const secondaryLabel = isIntel ? labels.secondaryIntel : labels.secondaryDefault;

  // Mount → open after first paint
  useEffect(() => {
    const id = requestAnimationFrame(() => setState("open"));
    return () => cancelAnimationFrame(id);
  }, []);

  // When project changes (prev/next inside modal), refocus the title for narration continuity.
  // Fallback focuses the FIRST focusable in DOM order (typically the prev button) so
  // Shift+Tab from the entry point cycles to the last focusable, not back to itself.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const titleEl = document.getElementById("portfolio-detail-title");
      if (titleEl instanceof HTMLElement) {
        titleEl.focus();
        return;
      }
      // Fallback: focus first focusable inside the dialog (DOM order = prev → next → close).
      if (dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter(
          (el) =>
            !el.hasAttribute("disabled") &&
            el.getAttribute("aria-hidden") !== "true" &&
            (el.offsetParent !== null || el === document.activeElement)
        );
        if (focusables.length > 0) {
          focusables[0].focus();
          return;
        }
      }
      // Last-resort fallback if dialog has no focusables (shouldn't happen)
      closeBtnRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [project.slug]);

  const requestClose = useCallback(() => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    // Respect reduced-motion: skip the close animation and exit immediately.
    if (prefersReducedMotion()) {
      onClose();
      return;
    }
    setState((prev) => (prev === "closing" ? prev : "closing"));
    closeTimeoutRef.current = window.setTimeout(() => {
      closeTimeoutRef.current = null;
      onClose();
    }, ANIM_MS);
  }, [onClose]);

  // Body scroll lock + Escape + Arrow keys for prev/next + basic focus trap
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key === "ArrowLeft" && onPrev) {
        e.preventDefault();
        onPrev();
        return;
      }
      if (e.key === "ArrowRight" && onNext) {
        e.preventDefault();
        onNext();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        // Real focus trap: cycle Tab/Shift+Tab within the dialog.
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter(
          (el) =>
            !el.hasAttribute("disabled") &&
            el.getAttribute("aria-hidden") !== "true" &&
            // Skip elements that are not actually visible / focusable
            (el.offsetParent !== null || el === document.activeElement)
        );
        if (focusables.length === 0) {
          e.preventDefault();
          closeBtnRef.current?.focus();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        // If focus escaped the dialog entirely, pull it back to first focusable.
        if (!dialogRef.current.contains(active)) {
          e.preventDefault();
          first.focus();
          return;
        }
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [requestClose, onPrev, onNext]);

  const visible = state === "open";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolio-detail-title"
      ref={dialogRef}
      className={cn(
        "fixed inset-0 z-50 flex items-start md:items-center justify-center overflow-y-auto",
        "bg-background/85 backdrop-blur-md",
        "motion-safe:transition-opacity motion-safe:duration-200 motion-safe:ease-out",
        visible ? "opacity-100" : "opacity-0"
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <div
        className={cn(
          "relative w-full max-w-2xl px-4 md:px-6 py-12 md:py-16",
          "motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out",
          visible ? "scale-100" : "scale-95"
        )}
      >
        {/* Top control row: prev / next / close — h-11 w-11 meets 44px touch-target minimum */}
        <div className="absolute right-4 top-4 z-10 flex items-center gap-3">
          {onPrev && (
            <button
              type="button"
              onClick={onPrev}
              aria-label={labels.prev}
              className={cn(
                "grid h-11 w-11 place-items-center rounded-md border border-border/60 bg-card/70 text-muted-foreground",
                "hover:border-primary hover:text-primary transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]"
              )}
            >
              <ChevronLeft size={16} strokeWidth={1.5} aria-hidden />
            </button>
          )}
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              aria-label={labels.next}
              className={cn(
                "grid h-11 w-11 place-items-center rounded-md border border-border/60 bg-card/70 text-muted-foreground",
                "hover:border-primary hover:text-primary transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]"
              )}
            >
              <ChevronRight size={16} strokeWidth={1.5} aria-hidden />
            </button>
          )}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={requestClose}
            aria-label={labels.close}
            className={cn(
              "grid h-11 w-11 place-items-center rounded-md border border-border/60 bg-card/70 text-muted-foreground",
              "hover:border-primary hover:text-primary transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]"
            )}
          >
            <X size={16} strokeWidth={1.5} aria-hidden />
          </button>
        </div>

        {/* Detail body — keyed by slug to force clean remount between projects */}
        <div key={project.slug}>
          <PortfolioDetail project={project} lang={lang} />
        </div>

        {/* In-modal CTA */}
        <div className="mt-5 flex flex-col items-center gap-2">
          <a
            href={ctaHref}
            className={cn(
              "hover-grow group inline-flex items-center justify-center gap-3 min-h-12 py-2.5 px-5 rounded-md",
              "bg-gradient-hero text-[#0a1628] font-bold text-[0.875rem] md:text-[0.9375rem] tracking-tight",
              "shadow-glow hover:shadow-[0_0_60px_rgba(0,166,255,0.55)] transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]"
            )}
          >
            {labels.cta}
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <p className="font-mono-hud text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
            manu.uhila@taiyka.com
          </p>
          <a
            href={secondaryHref}
            className={cn(
              "mt-1 inline-flex items-center justify-center text-[0.8125rem] md:text-[0.875rem]",
              "text-muted-foreground hover:text-primary transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm"
            )}
          >
            {secondaryLabel}
          </a>
        </div>
      </div>
    </div>
  );
}
