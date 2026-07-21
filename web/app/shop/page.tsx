import type { Metadata } from "next";
import { COPY, type Lang } from "@/lib/shop/content";
import { SITE } from "@/lib/site";
import ShopClient from "./shop-client";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const lang: Lang = sp?.lang === "en" ? "en" : "fr";
  const c = COPY[lang];

  // c.title (from lib/shop/content.ts) carries the brand suffix; the root
  // layout's title template re-appends "— L'Atelier", so strip it here.
  const pageTitle = c.title.replace(/\s*[—·]\s*(L['’]Atelier|The Workshop)\s*$/u, "");

  return {
    title: pageTitle,
    description: c.metaDescription,
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
      siteName: lang === "fr" ? "L'Atelier" : "The Workshop",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      title: c.title,
      description: c.metaDescription,
      images: [
        {
          url: "/og/products.png",
          width: 1200,
          height: 630,
          alt: c.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: c.title,
      description: c.metaDescription,
      images: ["/og/products.png"],
      creator: "@manu_ai.to",
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
