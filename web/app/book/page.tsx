import type { Metadata } from "next";
import { COPY, type Lang } from "@/lib/book/content";
import { SITE } from "@/lib/site";
import BookClient from "./book-client";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const lang: Lang = sp?.lang === "en" ? "en" : "fr";
  const c = COPY[lang];

  // c.title (from lib/book/content.ts) carries the brand suffix; the root
  // layout's title template re-appends "— L'Atelier", so strip it here.
  const pageTitle = c.title.replace(/\s*[—·]\s*(L['’]Atelier|The Workshop)\s*$/u, "");

  return {
    title: pageTitle,
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
      siteName: c.ogSiteName,
      locale: lang === "fr" ? "fr_FR" : "en_US",
      title: c.title,
      description: c.metaDescription,
      images: [
        {
          url: "/og/book.png",
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
      images: ["/og/book.png"],
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
