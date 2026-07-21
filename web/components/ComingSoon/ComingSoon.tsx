"use client";

import Link from "next/link";
import { MatrixRain } from "./MatrixRain";

export type Copy = {
  title: string;
  metaDescription: string;
  headline: string;
  backCta: string;
  backHref: string;
  langSwitch: string;
  langSwitchHref: string;
};

export function ComingSoon({ copy }: { copy: Copy }) {
  return (
    <main className="relative flex-1 w-full flex flex-col z-10 min-h-screen overflow-hidden bg-obsidian">
      <MatrixRain />

      <div className="relative z-10 w-full flex justify-end px-6 pt-6">
        <Link
          href={copy.langSwitchHref}
          className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] rounded-sm px-1"
        >
          {copy.langSwitch}
        </Link>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-12 text-center">
        {/* Short accent rule — the one blue mark on an otherwise quiet field */}
        <span
          aria-hidden
          className="block h-px w-12 bg-primary mb-8 md:mb-10"
        />

        <h1 className="display-xl text-balance max-w-[18ch]">
          {copy.headline}
        </h1>

        <Link
          href={copy.backHref}
          className="mt-10 md:mt-12 inline-flex items-center justify-center min-h-[44px] rounded-md bg-primary px-7 py-3 text-[0.9rem] font-mono tracking-[0.18em] uppercase text-primary-foreground font-semibold transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]"
        >
          {copy.backCta}
        </Link>
      </div>
    </main>
  );
}
