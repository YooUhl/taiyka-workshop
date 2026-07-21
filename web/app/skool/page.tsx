import type { Metadata } from "next";
import { COPY, type Lang } from "@/lib/skool/content";
import SkoolClient from "./skool-client";

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
      canonical: `${SITE}/skool`,
      languages: {
        "fr-FR": "/skool",
        "en-US": "/skool?lang=en",
      },
    },
    openGraph: {
      type: "website",
      url: `${SITE}/skool`,
      siteName: "The Workshop",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      title: c.title,
      description: c.metaDescription,
    },
  };
}

export default async function SkoolPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const sp = await searchParams;
  const lang: Lang = sp?.lang === "en" ? "en" : "fr";
  return <SkoolClient lang={lang} />;
}
