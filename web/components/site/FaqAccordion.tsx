import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type FaqItem = {
  q: string;
  a: string;
};

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]";

/**
 * Native <details> accordion — works without JavaScript, and the browser
 * handles open/close state and keyboard access for free.
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="border-t border-border">
      {items.map((item) => (
        <li key={item.q} className="border-b border-border">
          <details className="group">
            <summary
              className={cn(
                "flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[0.95rem] md:text-base font-medium text-foreground transition-colors hover:text-primary",
                FOCUS_RING,
              )}
            >
              {item.q}
              <Plus
                aria-hidden
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45 group-hover:text-primary"
              />
            </summary>
            <p className="pb-6 pr-10 text-[0.9rem] md:text-[0.95rem] text-muted-foreground leading-relaxed max-w-3xl">
              {item.a}
            </p>
          </details>
        </li>
      ))}
    </ul>
  );
}
