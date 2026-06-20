import type { Metadata } from "next";
import { COPY, type Lang } from "@/lib/book/content";
import BookClient from "./book-client";

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
    alternates: {
      canonical: `${SITE}/book`,
      languages: {
        "fr-FR": "/book",
        "en-US": "/book?lang=en",
      },
    },
    openGraph: {
      type: "website",
      url: `${SITE}/book`,
      siteName: "My Workshop",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      title: c.title,
      description: c.metaDescription,
    },
    twitter: {
      card: "summary",
      title: c.title,
      description: c.metaDescription,
      creator: "@manu_ai.to",
    },
  };
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const sp = await searchParams;
  const lang: Lang = sp?.lang === "en" ? "en" : "fr";

  return <BookClient lang={lang} />;
}
