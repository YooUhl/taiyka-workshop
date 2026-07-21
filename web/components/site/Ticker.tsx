/**
 * Announcement ticker — the strip that runs across the top of every page.
 *
 * The track carries the list twice and the keyframe travels exactly half its
 * width, so the loop has no visible seam. The duplicate run is hidden from
 * screen readers. Global prefers-reduced-motion parks the animation.
 */
export function Ticker({ items }: { items: string[] }) {
  if (items.length === 0) return null;
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
