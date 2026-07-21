"use client";

/**
 * Quiet backdrop for the ComingSoon screens.
 *
 * Previously an animated "matrix rain" canvas. Replaced with a still,
 * ruled paper field so the page reads as a considered placeholder rather
 * than a screensaver. Export name and (empty) props are unchanged so
 * /resources and /skool keep working without edits.
 */
export function MatrixRain() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      {/* Faint blue ruled field */}
      <div className="absolute inset-0 paper-grid" />
      {/* Single hairline horizon — one deliberate mark instead of motion */}
      <div className="absolute inset-x-0 top-1/2 hairline opacity-60" />
    </div>
  );
}
