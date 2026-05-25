/**
 * og-to-png.ts
 *
 * Generates the full set of 1200x630 PNG OG images required for social
 * previews (Twitter, LinkedIn, Slack, iMessage, WhatsApp, Discord) — these
 * platforms do not render SVG previews so PNGs are mandatory.
 *
 * Two responsibilities:
 *   1. Rasterize the 5 hand-designed SVGs already in `web/public/og/`
 *      (brief, home, prospect-audit-funnel, qcm, skool) into PNG.
 *   2. Generate 9 additional brand-templated PNGs from scratch for pages
 *      that don't have a hand-designed SVG yet:
 *        - portfolio, products, qcm-quiz, free-n8n-pack
 *        - 5 quiz profile cards (profil-salarie / aspirant / surcharge / scale / pas-pret)
 *
 * Run with: npm run og:generate
 *     or: npx tsx scripts/og-to-png.ts
 *
 * Uses `sharp` to rasterize SVG strings. Sharp is present transitively via
 * Next 16 and works in this project without an explicit dep entry.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OG_DIR = path.resolve(__dirname, '../public/og');
const WIDTH = 1200;
const HEIGHT = 630;

// ---------------------------------------------------------------------------
// 1) Existing hand-designed SVGs we just need to rasterize.
// ---------------------------------------------------------------------------
const SVG_PAGES = [
  'brief',
  'home',
  'prospect-audit-funnel',
  'qcm',
  'skool',
] as const;

// ---------------------------------------------------------------------------
// 2) Pages that need a brand-templated card generated from scratch.
//    Title text per the spec — long titles will be auto-wrapped at the
//    first sensible break point so they fit on two lines.
// ---------------------------------------------------------------------------
type Generated = {
  name: string;
  title: string;
  /**
   * Optional kicker line at the top of the card. Defaults to "TAIYKA".
   */
  kicker?: string;
};

const GENERATED: Generated[] = [
  { name: 'portfolio', title: 'Portfolio — Workflows en prod', kicker: 'TAIYKA · PORTFOLIO' },
  { name: 'products', title: 'Kits · Systèmes · Workflows', kicker: 'TAIYKA · PRODUCTS' },
  { name: 'qcm-quiz', title: 'QCM — En cours', kicker: 'TAIYKA · QCM' },
  { name: 'free-n8n-pack', title: 'Pack n8n gratuit', kicker: 'TAIYKA · LEAD MAGNET' },
  { name: 'profil-salarie', title: "L'Employé Lucide", kicker: 'TAIYKA · QCM · PROFIL' },
  { name: 'profil-aspirant', title: "L'Aspirant", kicker: 'TAIYKA · QCM · PROFIL' },
  { name: 'profil-surcharge', title: 'Le Surchargé', kicker: 'TAIYKA · QCM · PROFIL' },
  { name: 'profil-scale', title: 'Le Builder Prêt à Scaler', kicker: 'TAIYKA · QCM · PROFIL' },
  { name: 'profil-pas-pret', title: "L'Explorateur", kicker: 'TAIYKA · QCM · PROFIL' },
];

// ---------------------------------------------------------------------------
// SVG escaping
// ---------------------------------------------------------------------------
function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Break a title onto at most 2 lines at a sensible word boundary if it's
 * too long for one line at the chosen font size.
 *
 * The empirical limit at font-size=84 / Arial-Black-ish on a 1080px-wide
 * usable column is ~22 characters. Beyond that we wrap.
 */
function wrapTitle(title: string, maxCharsPerLine = 22): string[] {
  if (title.length <= maxCharsPerLine) return [title];

  const words = title.split(' ');
  // Greedy split: find the break point closest to the middle that keeps
  // both lines under maxCharsPerLine when possible.
  let bestSplit = -1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const left = words.slice(0, i).join(' ');
    const right = words.slice(i).join(' ');
    if (left.length > maxCharsPerLine + 6 || right.length > maxCharsPerLine + 6) {
      continue;
    }
    const diff = Math.abs(left.length - right.length);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestSplit = i;
    }
  }
  if (bestSplit === -1) {
    // Fallback: split roughly in half by characters at the nearest space.
    const mid = Math.floor(title.length / 2);
    const spaceBefore = title.lastIndexOf(' ', mid);
    const spaceAfter = title.indexOf(' ', mid);
    const at = spaceBefore !== -1 ? spaceBefore : spaceAfter;
    if (at === -1) return [title];
    return [title.slice(0, at), title.slice(at + 1)];
  }
  return [words.slice(0, bestSplit).join(' '), words.slice(bestSplit).join(' ')];
}

// ---------------------------------------------------------------------------
// Build the SVG string for a brand-templated card.
// Keep the visual language consistent with the hand-designed home.svg /
// brief.svg (dark navy gradient, electric blue accent, HUD bracket corners,
// kicker + headline + footer marks).
// ---------------------------------------------------------------------------
function buildCardSvg(title: string, kicker = 'TAIYKA'): string {
  const lines = wrapTitle(title);
  const fontSize = lines.length === 1 ? 92 : 84;
  const lineHeight = lines.length === 1 ? 0 : 92;
  // Vertical center for the title block.
  const titleBlockHeight = lines.length === 1 ? fontSize : fontSize + lineHeight;
  const titleTop = Math.round((HEIGHT - titleBlockHeight) / 2 + fontSize * 0.85);

  const titleTspans = lines
    .map((line, i) => {
      const y = titleTop + i * lineHeight;
      return `<text x="80" y="${y}" fill="${i === lines.length - 1 ? 'url(#accent)' : '#FFFFFF'}" font-family="Inter, system-ui, sans-serif" font-size="${fontSize}" font-weight="800" letter-spacing="-3">${escapeXml(line)}</text>`;
    })
    .join('\n  ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0A1628"/>
      <stop offset="100%" stop-color="#000000"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#00A6FF"/>
      <stop offset="100%" stop-color="#00E5FF"/>
    </linearGradient>
    <radialGradient id="glow" cx="20%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#00A6FF" stop-opacity="0.28"/>
      <stop offset="60%" stop-color="#00A6FF" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#00A6FF" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>

  <!-- HUD bracket corners -->
  <path d="M40 40 H120 M40 40 V120" stroke="#00A6FF" stroke-width="2" fill="none"/>
  <path d="M1160 40 H1080 M1160 40 V120" stroke="#00A6FF" stroke-width="2" fill="none"/>
  <path d="M40 590 H120 M40 590 V510" stroke="#00A6FF" stroke-width="2" fill="none"/>
  <path d="M1160 590 H1080 M1160 590 V510" stroke="#00A6FF" stroke-width="2" fill="none"/>

  <!-- Top kicker -->
  <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="20" fill="#8DA2C0" letter-spacing="4">
    <circle cx="80" cy="74" r="5" fill="#00A6FF"/>
    <text x="100" y="80">§ ${escapeXml(kicker)}</text>
  </g>

  <!-- Title -->
  ${titleTspans}

  <!-- Accent line under title -->
  <rect x="80" y="${titleTop + 30}" width="120" height="3" fill="url(#accent)"/>

  <!-- Hairline -->
  <rect x="80" y="525" width="1040" height="1" fill="#8DA2C0" opacity="0.20"/>

  <!-- Footer mark -->
  <text x="80" y="585" fill="#8DA2C0" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="20" letter-spacing="3">TAIYKA · @MANU_AI.TO</text>
  <text x="1120" y="585" text-anchor="end" fill="#8DA2C0" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="20" letter-spacing="3">TAIYKA.COM</text>
</svg>`;
}

// ---------------------------------------------------------------------------
// Rasterize an SVG file on disk to a sibling PNG.
// ---------------------------------------------------------------------------
async function rasterizeFile(svgName: string): Promise<string> {
  const svgPath = path.join(OG_DIR, `${svgName}.svg`);
  const pngPath = path.join(OG_DIR, `${svgName}.png`);
  const svgBuffer = await fs.readFile(svgPath);
  await sharp(svgBuffer, { density: 144 })
    .resize(WIDTH, HEIGHT, { fit: 'fill' })
    .png({ compressionLevel: 9 })
    .toFile(pngPath);
  return pngPath;
}

// ---------------------------------------------------------------------------
// Rasterize an in-memory SVG string to a PNG on disk.
// ---------------------------------------------------------------------------
async function rasterizeString(svg: string, outName: string): Promise<string> {
  const pngPath = path.join(OG_DIR, `${outName}.png`);
  await sharp(Buffer.from(svg), { density: 144 })
    .resize(WIDTH, HEIGHT, { fit: 'fill' })
    .png({ compressionLevel: 9 })
    .toFile(pngPath);
  return pngPath;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  await fs.mkdir(OG_DIR, { recursive: true });

  const created: string[] = [];
  const failed: { name: string; error: string }[] = [];

  for (const name of SVG_PAGES) {
    try {
      const out = await rasterizeFile(name);
      created.push(path.basename(out));
      console.log(`  rasterized ${name}.svg -> ${path.basename(out)}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      failed.push({ name, error: msg });
      console.error(`  FAILED ${name}: ${msg}`);
    }
  }

  for (const item of GENERATED) {
    try {
      const svg = buildCardSvg(item.title, item.kicker);
      const out = await rasterizeString(svg, item.name);
      created.push(path.basename(out));
      console.log(`  generated ${item.name}.png`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      failed.push({ name: item.name, error: msg });
      console.error(`  FAILED ${item.name}: ${msg}`);
    }
  }

  console.log(`\nDone. ${created.length} PNGs written to ${OG_DIR}`);
  if (failed.length) {
    console.error(`\n${failed.length} failure(s):`);
    for (const f of failed) console.error(`  - ${f.name}: ${f.error}`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
