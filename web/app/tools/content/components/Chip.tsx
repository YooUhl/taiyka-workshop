"use client";

import { cn } from "@/lib/utils";

export default function Chip({
  active,
  children,
  onClick,
  title,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "rounded-md border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide transition-colors",
        active
          ? "border-[#00a6ff] bg-[#00a6ff]/15 text-[#00a6ff]"
          : "border-white/10 bg-transparent text-[#8da2c0] hover:text-[#e8f0fe]",
      )}
    >
      {children}
    </button>
  );
}
