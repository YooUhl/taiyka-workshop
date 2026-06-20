"use client";

import { ComingSoon } from "@/components/ComingSoon/ComingSoon";
import { COPY, type Lang } from "@/lib/skool/content";

export default function SkoolClient({ lang }: { lang: Lang }) {
  return <ComingSoon copy={COPY[lang]} />;
}
