// Reads ../portfolio/<slug>/{README.md,diagram.svg} from the repo and emits
// web/lib/portfolio-data.generated.json. The JSON file is imported by
// lib/portfolio.ts at module-evaluation time, so Next.js / Turbopack bundle it
// into the serverless function output automatically.
//
// Runs as `prebuild` hook before `next build`.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB = resolve(__dirname, "..");
const REPO = resolve(WEB, "..");
const SOURCE = resolve(REPO, "portfolio");
const OUT_DIR = resolve(WEB, "lib");
const OUT = resolve(OUT_DIR, "portfolio-data.generated.json");

const SLUGS = ["polymaker", "ufc-gym", "content-system", "lead-pipeline"];

function readFileSafe(p) {
  try {
    return readFileSync(p, "utf-8");
  } catch {
    return null;
  }
}

const data = SLUGS.map((slug) => {
  const dir = join(SOURCE, slug);
  const md = readFileSafe(join(dir, "README.md"));
  const svg = readFileSafe(join(dir, "diagram.svg"));
  if (!md) {
    console.warn(`[build-portfolio-data] skip ${slug}: no README at ${dir}`);
    return null;
  }
  return { slug, md, svg: svg ?? "" };
}).filter(Boolean);

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

if (data.length === 0) {
  // Source data not accessible (e.g. Vercel build container only has web/).
  // If a JSON already exists from a prior local build, keep it.
  if (existsSync(OUT)) {
    console.warn(
      `[build-portfolio-data] no source data found; preserving existing ${OUT}`
    );
    process.exit(0);
  }
  console.warn(
    `[build-portfolio-data] no source data and no existing JSON; writing empty array to ${OUT}`
  );
}

writeFileSync(OUT, JSON.stringify(data, null, 2));
console.log(`[build-portfolio-data] wrote ${data.length} entries to ${OUT}`);
