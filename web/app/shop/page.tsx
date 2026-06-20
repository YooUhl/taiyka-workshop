import type { Metadata } from "next";
import { COPY, type Lang } from "@/lib/shop/content";
import ShopClient from "./shop-client";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taiyka.com";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const lang: Lang = sp?.lang === "en" ? "en" : "fr";
  const c = COPY[lang];

  return {
    title: c.title,
    description: c.metaDescription,
    robots: { index: false, follow: false },
    alternates: {
      canonical: `${SITE}/shop`,
      languages: {
        "fr-FR": "/shop",
        "en-US": "/shop?lang=en",
      },
    },
    openGraph: {
      type: "website",
      url: `${SITE}/shop`,
      siteName: "My Workshop",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      title: c.title,
      description: c.metaDescription,
    },
  };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const sp = await searchParams;
  const lang: Lang = sp?.lang === "en" ? "en" : "fr";
  return <ShopClient lang={lang} />;
}
