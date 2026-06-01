#!/usr/bin/env node
/**
 * Bulk-seed the calisthenics.skills table.
 * Usage:
 *   node scripts/seed-calisthenics.mjs ./skills.json [--url http://localhost:3000]
 *
 * Requires env vars (load via dotenv-cli, or export before running):
 *   CALISTHENICS_SEED_TOKEN  → matches the /tools/calisthenics/seed handler
 *   TOOLS_ACCESS_SECRET      → cookie value to satisfy proxy.ts
 */
import fs from "node:fs";
import path from "node:path";

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  return fallback;
}

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/seed-calisthenics.mjs <skills.json> [--url http://localhost:3000]");
  process.exit(1);
}
const resolved = path.resolve(file);
if (!fs.existsSync(resolved)) {
  console.error(`File not found: ${resolved}`);
  process.exit(1);
}

const seedToken = process.env.CALISTHENICS_SEED_TOKEN;
const cookieSecret = process.env.TOOLS_ACCESS_SECRET;
if (!seedToken || !cookieSecret) {
  console.error("Missing env: CALISTHENICS_SEED_TOKEN and TOOLS_ACCESS_SECRET must both be set.");
  process.exit(1);
}

const base = arg("--url", "http://localhost:3000");
const url = `${base.replace(/\/$/, "")}/tools/calisthenics/seed`;
const body = fs.readFileSync(resolved, "utf8");

try {
  JSON.parse(body); // validate locally before round-trip
} catch (e) {
  console.error(`Invalid JSON in ${resolved}: ${e.message}`);
  process.exit(1);
}

const res = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Seed-Token": seedToken,
    Cookie: `tools_access=${cookieSecret}`,
  },
  body,
});

const text = await res.text();
console.log(`HTTP ${res.status}`);
console.log(text);
if (!res.ok) process.exit(1);
