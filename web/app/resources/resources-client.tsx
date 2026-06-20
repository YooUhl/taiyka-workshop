"use client";

import { ComingSoon } from "@/components/ComingSoon/ComingSoon";
import { COPY, type Lang } from "@/lib/resources/content";

export default function ResourcesClient({ lang }: { lang: Lang }) {
  return <ComingSoon copy={COPY[lang]} />;
}
