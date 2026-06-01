"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
  feedbackLabel?: string;
};

const GUARD_MS = 1000;

export default function MailtoButton({
  href,
  className,
  children,
  feedbackLabel,
}: Props) {
  const [opening, setOpening] = useState(false);

  return (
    <span className="flex flex-col items-center gap-2">
      <a
        href={href}
        onClick={(e) => {
          if (opening) {
            e.preventDefault();
            return;
          }
          setOpening(true);
          window.setTimeout(() => setOpening(false), GUARD_MS);
        }}
        aria-disabled={opening}
        className={cn(
          className,
          opening && "pointer-events-none opacity-80"
        )}
      >
        {children}
      </a>
      {opening && feedbackLabel && (
        <p
          aria-live="polite"
          className="font-mono-hud text-[10px] tracking-[0.22em] uppercase text-muted-foreground"
        >
          {feedbackLabel}
        </p>
      )}
    </span>
  );
}
