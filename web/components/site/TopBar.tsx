import Link from "next/link";
import { cn } from "@/lib/utils";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]";

/**
 * The one top bar. Three columns: back link, page status, language switch.
 * Every public page uses this — never hand-roll a page header again.
 *
 * `status` is the centered label ("BOUTIQUE · L'ATELIER"). Omit `backHref`
 * on the home page (nothing to go back to) — the column keeps its width so
 * the status stays centered.
 */
export function TopBar({
  backHref,
  backLabel,
  status,
  langSwitchHref,
  langSwitchLabel,
  langSwitchAria,
}: {
  backHref?: string;
  backLabel?: string;
  status: string;
  langSwitchHref: string;
  langSwitchLabel: string;
  langSwitchAria: string;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 md:px-10 py-6 md:py-8">
      <div className="w-full grid grid-cols-3 items-center font-mono-hud text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
        {backHref ? (
          <Link
            href={backHref}
            className={cn(
              "justify-self-start inline-flex items-center min-h-[44px] px-1 -mx-1 hover:text-foreground transition-colors rounded-sm",
              FOCUS_RING,
            )}
          >
            <span aria-hidden>← </span>
            {backLabel}
          </Link>
        ) : (
          <span aria-hidden />
        )}
        <span className="justify-self-center inline-flex items-center gap-2 text-foreground text-center">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
          {status}
        </span>
        <Link
          href={langSwitchHref}
          className={cn(
            "justify-self-end inline-flex items-center min-h-[44px] px-1 -mx-1 hover:text-foreground transition-colors rounded-sm",
            FOCUS_RING,
          )}
          aria-label={langSwitchAria}
        >
          {langSwitchLabel} <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
