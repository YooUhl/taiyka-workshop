"use client";

import { ComingSoon } from "@/components/ComingSoon/ComingSoon";
import { COPY, type Lang } from "@/lib/shop/content";

export default function ShopClient({ lang }: { lang: Lang }) {
  return <ComingSoon copy={COPY[lang]} />;
}
