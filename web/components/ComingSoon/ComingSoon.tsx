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
    <main className="relative flex-1 w-full flex flex-col z-10 min-h-screen overflow-hidden">
      <MatrixRain />

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(10,22,40,0) 0%, rgba(10,22,40,0.65) 60%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      <div className="relative z-10 w-full flex justify-end px-6 pt-6">
        <Link
          href={copy.langSwitchHref}
          className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] rounded-sm px-1"
        >
          {copy.langSwitch}
        </Link>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-12 text-center">
        <h1
          className="font-bold tracking-[-0.03em] leading-[1.05] text-[clamp(2rem,7vw,4.25rem)] text-white text-balance"
          style={{
            textShadow:
              "0 0 28px rgba(0,166,255,0.55), 0 0 4px rgba(0,0,0,0.9)",
          }}
        >
          {copy.headline}
        </h1>

        <Link
          href={copy.backHref}
          className="mt-10 md:mt-12 inline-flex items-center justify-center rounded-full border border-white/20 bg-[#0a1628]/60 backdrop-blur-sm px-6 py-3 text-[0.9rem] font-mono tracking-[0.18em] uppercase text-foreground hover:border-primary/60 hover:bg-[#0a1628]/80 hover:scale-[1.02] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]"
        >
          {copy.backCta}
        </Link>
      </div>
    </main>
  );
}
