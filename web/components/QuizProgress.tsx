type Props = {
  current: number;
  total: number;
};

export default function QuizProgress({ current, total }: Props) {
  const safeTotal = Math.max(1, total);
  return (
    <div
      role="progressbar"
      aria-label="Progression du quiz"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={safeTotal}
      className="w-full flex items-center gap-1"
    >
      {Array.from({ length: safeTotal }).map((_, i) => {
        const filled = i < current;
        return (
          <span
            key={i}
            aria-hidden
            className={`h-0.5 flex-1 transition-colors duration-500 ease-out ${
              filled ? "bg-primary" : "bg-border/40"
            }`}
            style={
              filled
                ? { boxShadow: "0 0 12px rgba(0,166,255,0.6)" }
                : undefined
            }
          />
        );
      })}
    </div>
  );
}
