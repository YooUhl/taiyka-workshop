import Link from "next/link";
import PortfolioCard from "@/components/PortfolioCard";
import { getPortfolioProjects, type Lang } from "@/lib/portfolio";

type SearchParams = Promise<{ lang?: string }>;

const COPY = {
  fr: {
    tagline: "Sélection de systèmes AI + automation livrés pour des clients réels.",
    toggleLabel: "EN",
    ctaTitle: "Envie de bosser ensemble ?",
    ctaBody:
      "Je prends un nombre limité de projets en automation, AI agents et systèmes de contenu.",
    ctaButton: "Me contacter",
  },
  en: {
    tagline: "A selection of AI + automation systems shipped for real clients.",
    toggleLabel: "FR",
    ctaTitle: "Want to work together?",
    ctaBody:
      "I take on a limited number of projects in automation, AI agents and content systems.",
    ctaButton: "Get in touch",
  },
};

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const lang: Lang = params.lang === "en" ? "en" : "fr";
  const otherLang: Lang = lang === "fr" ? "en" : "fr";
  const copy = COPY[lang];
  const projects = getPortfolioProjects();

  return (
    <main className="flex-1 w-full px-6 py-16 max-w-6xl mx-auto">
      <header className="mb-12 text-center relative">
        <div className="absolute right-0 top-0">
          <Link
            href={`/portfolio?lang=${otherLang}`}
            className="inline-flex items-center rounded-md border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-card transition"
          >
            {copy.toggleLabel}
          </Link>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          <span className="text-gradient-hero">Portfolio</span>
        </h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          {copy.tagline}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <PortfolioCard
            key={project.slug}
            project={project}
            lang={lang}
          />
        ))}
      </div>

      <footer className="mt-20 text-center rounded-2xl border border-border bg-card/40 p-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          <span className="text-gradient-hero">{copy.ctaTitle}</span>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          {copy.ctaBody}
        </p>
        <a
          href="mailto:manu.uhila@taiyka.com"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow-glow transition"
        >
          {copy.ctaButton}
        </a>
      </footer>
    </main>
  );
}
