import { cn } from "@/lib/utils";

/**
 * The repeating section rhythm: centered mono eyebrow, then a heavy uppercase
 * heading on the left with an optional status on the right.
 *
 * `as` lets a page pick the right heading level without changing the look —
 * a page has one h1, everything below it is an h2.
 */
export function SectionHead({
  eyebrow,
  title,
  meta,
  as: Heading = "h2",
  size = "lg",
  className,
}: {
  eyebrow?: string;
  title: string;
  meta?: string;
  as?: "h1" | "h2";
  size?: "xl" | "lg" | "md";
  className?: string;
}) {
  return (
    <div className={className}>
      {eyebrow && (
        <p className="flex justify-center mb-8 md:mb-10">
          <span className="kicker kicker-accent">{eyebrow}</span>
        </p>
      )}
      <div className="flex items-end justify-between gap-6">
        <Heading
          className={cn(
            "display-caps text-balance",
            size === "xl" && "display-xl",
            size === "lg" && "display-lg",
            size === "md" && "display-md",
          )}
        >
          {title}
        </Heading>
        {meta && (
          <span className="font-mono-hud text-[10px] tracking-[0.18em] uppercase text-primary whitespace-nowrap pb-2">
            {meta}
          </span>
        )}
      </div>
    </div>
  );
}
