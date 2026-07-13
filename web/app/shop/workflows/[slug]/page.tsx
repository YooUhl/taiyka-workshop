import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getShopWorkflow, getShopWorkflows } from "@/lib/shop/workflows";
import type { Lang } from "@/lib/shop/content";
import WorkflowClient from "./workflow-client";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taiyka.com";

type RouteParams = { slug: string };
type SearchParams = { lang?: string };

function pickLang(sp: SearchParams | undefined): Lang {
  return sp?.lang === "en" ? "en" : "fr";
}

export function generateStaticParams() {
  return getShopWorkflows().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<RouteParams>;
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const lang = pickLang(sp);
  const workflow = getShopWorkflow(slug);
  if (!workflow) {
    return { title: lang === "fr" ? "Produit introuvable" : "Product not found" };
  }
  const loc = workflow[lang];
  const path = `/shop/workflows/${slug}`;
  return {
    title:
      lang === "fr"
        ? `${loc.title} — Boutique · L'Atelier`
        : `${loc.title} — Shop · The Workshop`,
    description: loc.tagline,
    alternates: {
      canonical: `${SITE}${path}`,
      languages: {
        "fr-FR": path,
        "en-US": `${path}?lang=en`,
      },
    },
    openGraph: {
      type: "website",
      url: `${SITE}${path}`,
      siteName: lang === "fr" ? "L'Atelier" : "The Workshop",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      title: loc.title,
      description: loc.tagline,
    },
  };
}

export default async function WorkflowPage({
  params,
  searchParams,
}: {
  params: Promise<RouteParams>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const lang = pickLang(sp);
  const workflow = getShopWorkflow(slug);
  if (!workflow) notFound();
  return <WorkflowClient workflow={workflow} lang={lang} />;
}
