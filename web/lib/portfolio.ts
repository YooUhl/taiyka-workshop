import fs from "node:fs";
import path from "node:path";

export type Lang = "fr" | "en";

export type LocalizedContent = {
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  stack: string[];
  outcome: string[];
  status: string;
};

export type PortfolioProject = {
  slug: string;
  fr: LocalizedContent;
  en: LocalizedContent;
  diagramSvg: string;
};

const SLUGS = ["polymaker", "ufc-gym", "content-system", "lead-pipeline"] as const;

// Section header patterns. Each language has its own headers.
const SECTION_HEADERS = {
  fr: {
    problem: "Le problème",
    solution: "La solution",
    stack: "Stack",
    outcome: "Résultats",
    status: "Statut",
  },
  en: {
    problem: "The problem",
    solution: "The solution",
    stack: "Stack",
    outcome: "Outcome",
    status: "Status",
  },
};

/**
 * Splits a markdown document into FR and EN halves around the `---` separator.
 * The README convention is FR first, then `---`, then EN.
 */
function splitLanguages(md: string): { fr: string; en: string } {
  // Use a horizontal rule on its own line as the divider
  const parts = md.split(/\n---\n/);
  if (parts.length < 2) {
    // Fallback: same content for both
    return { fr: md, en: md };
  }
  return { fr: parts[0], en: parts.slice(1).join("\n---\n") };
}

/**
 * Pull the H1 title and the blockquote tagline that follows it.
 */
function parseHeader(section: string): { title: string; tagline: string } {
  const titleMatch = section.match(/^#\s+(.+?)\s*$/m);
  const taglineMatch = section.match(/^>\s+(.+?)\s*$/m);
  return {
    title: titleMatch?.[1].trim() ?? "",
    tagline: taglineMatch?.[1].trim() ?? "",
  };
}

/**
 * Extract the body of a `## <header>` section up until the next `## ` header
 * (or end of section).
 */
function extractSection(section: string, header: string): string {
  // Escape regex special chars in the header
  const escaped = header.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`##\\s+${escaped}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+|$)`, "i");
  const match = section.match(re);
  return match?.[1].trim() ?? "";
}

/**
 * Parse the `Stack` line: split on the · separator and strip backticks.
 */
function parseStack(raw: string): string[] {
  return raw
    .split("·")
    .map((s) => s.replace(/`/g, "").trim())
    .filter(Boolean);
}

/**
 * Parse a bulleted list (lines starting with `- `).
 */
function parseBullets(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());
}

function parseLocalized(section: string, lang: Lang): LocalizedContent {
  const headers = SECTION_HEADERS[lang];
  const { title, tagline } = parseHeader(section);
  return {
    title,
    tagline,
    problem: extractSection(section, headers.problem),
    solution: extractSection(section, headers.solution),
    stack: parseStack(extractSection(section, headers.stack)),
    outcome: parseBullets(extractSection(section, headers.outcome)),
    status: extractSection(section, headers.status),
  };
}

/**
 * Resolve the portfolio root. The Next app lives in `web/`, the portfolio
 * folder lives at `../portfolio/`. process.cwd() is the `web/` directory at
 * build/runtime.
 */
function portfolioRoot(): string {
  return path.resolve(process.cwd(), "..", "portfolio");
}

let cached: PortfolioProject[] | null = null;

export function getPortfolioProjects(): PortfolioProject[] {
  if (cached) return cached;

  const root = portfolioRoot();
  cached = SLUGS.map((slug) => {
    const dir = path.join(root, slug);
    const md = fs.readFileSync(path.join(dir, "README.md"), "utf-8");
    const svg = fs.readFileSync(path.join(dir, "diagram.svg"), "utf-8");
    const { fr, en } = splitLanguages(md);
    return {
      slug,
      fr: parseLocalized(fr, "fr"),
      en: parseLocalized(en, "en"),
      diagramSvg: svg,
    };
  });

  return cached;
}
