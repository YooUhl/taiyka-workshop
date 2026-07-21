/**
 * Step progress as a filled bar rather than a text counter. The label stays
 * for screen readers and for anyone who wants the exact number.
 */
export function ProgressBar({
  current,
  total,
  label,
}: {
  current: number;
  total: number;
  label: string;
}) {
  const pct = Math.round((current / total) * 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={label}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-2.5">
        <span className="font-mono-hud text-[10px] tracking-[0.18em] uppercase text-primary">
          {label}
        </span>
        <span className="font-mono-hud text-[10px] tracking-[0.18em] uppercase text-muted-foreground/70">
          {pct}%
        </span>
      </div>
      <div className="h-px w-full bg-border">
        <div
          className="h-px bg-primary transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
