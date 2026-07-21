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
  const pct = Math.round((segmentsFilled / safeTotal) * 100);

  return (
    <div
      role="progressbar"
      aria-label="Progression du quiz"
      aria-valuenow={segmentsFilled}
      aria-valuemin={0}
      aria-valuemax={safeTotal}
      className="w-full"
    >
      <div className="h-px w-full bg-border">
        <div
          className="h-px bg-primary motion-safe:transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
