"use client";

import Link from "next/link";
import { MatrixRain } from "./MatrixRain";
import { Ticker } from "@/components/site/Ticker";
import { TopBar } from "@/components/site/TopBar";

export type Copy = {
  title: string;
  metaDescription: string;
  headline: string;
  backCta: string;
  backHref: string;
  langSwitch: string;
  langSwitchHref: string;
  langSwitchAria: string;
  topStatus: string;
  homeHref: string;
  homeLabel: string;
  ticker: string[];
};

export function ComingSoon({ copy }: { copy: Copy }) {
  return (
    <main className="relative flex-1 w-full flex flex-col z-10 min-h-screen overflow-hidden bg-obsidian">
      {/* Ticker + top bar sit above the fixed backdrop */}
      <div className="relative z-10">
        <Ticker items={copy.ticker} />
      </div>

      <MatrixRain />

      <div className="relative z-10">
        <TopBar
          backHref={copy.homeHref}
          backLabel={copy.homeLabel}
          status={copy.topStatus}
          langSwitchHref={copy.langSwitchHref}
          langSwitchLabel={copy.langSwitch}
          langSwitchAria={copy.langSwitchAria}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-12 text-center">
        {/* Short accent rule — the one blue mark on an otherwise quiet field */}
        <span
          aria-hidden
          className="block h-px w-12 bg-primary mb-8 md:mb-10"
        />

        <h1 className="display-xl display-caps text-balance max-w-[18ch]">
          {copy.headline}
        </h1>

        <Link
          href={copy.backHref}
          className="cta mt-10 md:mt-12 inline-flex h-14 items-center justify-center gap-3 px-7 text-[0.95rem] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]"
        >
          {copy.backCta}
        </Link>
      </div>
    </main>
  );
}
