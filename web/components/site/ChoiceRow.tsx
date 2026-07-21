"use client";

import { cn } from "@/lib/utils";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]";

/**
 * An answer box: label left, arrow right, thin square border.
 *
 * Deliberately a contained box rather than a full-bleed row — it has to read
 * as something you click. The topg treatment shows up in the flat square edge
 * and the spaced mono caps, not in the width.
 */
export function ChoiceRow({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected?: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={cn(
          "group flex w-full items-center justify-between gap-4 px-5 py-4 min-h-[44px] text-left",
          // .card-line is the site-wide box definition — never restyle a box
          // locally, change it there so every box moves together.
          "card-line",
          selected && "card-line-accent",
          FOCUS_RING,
        )}
      >
        <span
          className={cn(
            "font-mono-hud text-[0.78rem] md:text-[0.85rem] tracking-[0.12em] uppercase transition-colors",
            selected ? "text-primary" : "text-foreground group-hover:text-primary",
          )}
        >
          {label}
        </span>
        <span
          aria-hidden
          className={cn(
            "shrink-0 text-sm transition-all group-hover:translate-x-0.5",
            selected ? "text-primary" : "text-glacier-blue/70 group-hover:text-primary",
          )}
        >
          →
        </span>
      </button>
    </li>
  );
}
