type Props = {
  current: number;
  total: number;
};

export default function QuizProgress({ current, total }: Props) {
  const safeTotal = Math.max(1, total);
  // Visual fill is `i < current`, so Q1 (current=1) fills 0 segments visually.
  // aria-valuenow must mirror what the user sees: count SEGMENTS filled, not
  // the question ordinal. Clamp at 0 to avoid -1 on initial mount.
  const segmentsFilled = Math.max(0, current - 1);
  // Index of the leading-edge (most-recently-filled) segment, or -1 when none.
  const leadingEdge = segmentsFilled - 1;

  return (
    <div
      role="progressbar"
      aria-label="Progression du quiz"
      aria-valuenow={segmentsFilled}
      aria-valuemin={0}
      aria-valuemax={safeTotal}
      className="w-full flex items-center gap-1.5"
    >
      {Array.from({ length: safeTotal }).map((_, i) => {
        const filled = i < segmentsFilled;
        const isLeadingEdge = i === leadingEdge;
        return (
          <span
            key={i}
            aria-hidden
            className={`h-0 flex-1 border-t border-dashed motion-safe:transition-colors duration-500 ease-out ${
              filled ? "border-primary" : "border-border/40"
            }`}
            // Only the leading-edge segment gets a glow — stacking the shadow
            // on every filled segment washed out the visual rhythm.
            style={
              isLeadingEdge
                ? { boxShadow: "0 0 6px rgba(0,166,255,0.3)" }
                : undefined
            }
          />
        );
      })}
    </div>
  );
}
