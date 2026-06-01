// Copies ../portfolio/ and ../products/ into web/.data/ so they're inside the
// Vercel deployment root and get bundled into serverless function output.
// Runs as `prebuild` hook before next build.
import { existsSync, mkdirSync, cpSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB = resolve(__dirname, "..");
const REPO = resolve(WEB, "..");
const TARGET = resolve(WEB, ".data");

const SOURCES = [
  { name: "portfolio", from: resolve(REPO, "portfolio") },
  { name: "products", from: resolve(REPO, "products") },
];

if (existsSync(TARGET)) rmSync(TARGET, { recursive: true, force: true });
mkdirSync(TARGET, { recursive: true });

for (const src of SOURCES) {
  if (!existsSync(src.from)) {
    console.warn(`[copy-data] skip: ${src.from} does not exist`);
    continue;
  }
  const dest = resolve(TARGET, src.name);
  cpSync(src.from, dest, { recursive: true });
  console.log(`[copy-data] ${src.from} -> ${dest}`);
}
