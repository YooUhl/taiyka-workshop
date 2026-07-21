/**
 * og-to-png.ts
 *
 * Generates the full set of 1200x630 PNG OG images required for social
 * previews (Twitter, LinkedIn, Slack, iMessage, WhatsApp, Discord) — these
 * platforms do not render SVG previews so PNGs are mandatory.
 *
 * Two responsibilities:
 *   1. Rasterize the 6 hand-designed SVGs already in `web/public/og/`
 *      (book, brief, home, prospect-audit-funnel, qcm, skool) into PNG.
 *   2. Generate additional brand-templated PNGs from scratch for pages
 *      that don't have a hand-designed SVG yet:
 *        - portfolio, products, qcm-quiz, free-n8n-pack
 *        - 5 quiz profile cards (profil-salarie / aspirant / surcharge / scale / pas-pret)
 *        - product cards referenced by the /products JSON-LD
 *
 * All cards follow the Arctic brand: obsidian #0B0F14, ice white #F5F8FA,
 * arctic navy border #1E2A39, muted #A8C0D4, electric blue #00A6FF accent.
 * Flat and square — no glows, no gradients, no rounded corners.
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
  'book',
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
   * Optional kicker line at the top of the card. Defaults to "L'ATELIER".
   * Rendered mono uppercase with a "›" prefix.
   */
  kicker?: string;
  /**
   * Optional one-line sub in muted arctic blue under the title.
   */
  sub?: string;
};

const GENERATED: Generated[] = [
  { name: 'portfolio', title: 'Livré', kicker: "L'ATELIER · PORTFOLIO", sub: 'Systèmes en production' },
  // products.png is shared by /products, /shop and the shop workflow pages.
  { name: 'products', title: 'La Boutique', kicker: "L'ATELIER", sub: 'Kits · Systèmes · Workflows' },
  { name: 'qcm-quiz', title: 'QCM — En cours', kicker: "L'ATELIER · QCM", sub: '9 questions · 2 min' },
  { name: 'free-n8n-pack', title: 'Pack n8n gratuit', kicker: "L'ATELIER · GRATUIT", sub: '5 workflows pour entrepreneurs IA' },
  { name: 'profil-salarie', title: "L'Employé Lucide", kicker: "L'ATELIER · QCM · PROFIL", sub: 'Ton profil entrepreneur IA' },
  { name: 'profil-aspirant', title: "L'Aspirant", kicker: "L'ATELIER · QCM · PROFIL", sub: 'Ton profil entrepreneur IA' },
  { name: 'profil-surcharge', title: 'Le Surchargé', kicker: "L'ATELIER · QCM · PROFIL", sub: 'Ton profil entrepreneur IA' },
  { name: 'profil-scale', title: 'Le Builder Prêt à Scaler', kicker: "L'ATELIER · QCM · PROFIL", sub: 'Ton profil entrepreneur IA' },
  { name: 'profil-pas-pret', title: "L'Explorateur", kicker: "L'ATELIER · QCM · PROFIL", sub: 'Ton profil entrepreneur IA' },
  // Product cards — referenced by /products page ItemList JSON-LD as /og/<slug>.png
  { name: 'free-claude-starter', title: 'Claude Code Starter Pack', kicker: "L'ATELIER · GRATUIT" },
  { name: 'cold-outreach-pack', title: 'Cold Outreach Pack', kicker: "L'ATELIER · PRODUIT · 10-25€" },
  { name: 'notion-ai-stack', title: 'Notion AI Stack', kicker: "L'ATELIER · PRODUIT · 10-25€", sub: 'Solopreneur dashboard' },
  { name: 'prompt-pack-50', title: '50 Prompts pour Automatiser', kicker: "L'ATELIER · PRODUIT · 10-25€" },
  { name: 'competitor-intel', title: 'Competitor Intel System', kicker: "L'ATELIER · PRODUIT · 25-50€" },
  { name: 'client-acquisition-bundle', title: 'Client Acquisition Bundle', kicker: "L'ATELIER · PRODUIT · 25-50€" },
  { name: 'ai-agent-playbook', title: 'Build Your First AI Agent', kicker: "L'ATELIER · PRODUIT · 25-50€" },
  { name: 'email-triage-agent', title: 'Email Triage Agent', kicker: "L'ATELIER · PRODUIT · 25-50€" },
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
 * Titles render UPPERCASE (Arctic display style), which is wider — the
 * empirical one-line limit on the 1008px usable column is ~16 characters.
 * Beyond that we wrap; the font size then adapts to the longest line.
 */
function wrapTitle(title: string, maxCharsPerLine = 16): string[] {
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
// Build the SVG string for a brand-templated card — Arctic design.
// Matches the hand-designed SVGs in public/og/: obsidian field #0B0F14,
// 1px inset border #1E2A39, mono uppercase "›" kicker in #00A6FF, heavy
// uppercase title in ice white #F5F8FA, one-line sub in #A8C0D4, and a
// small blue square accent mark. Flat and square — no glows, no gradients,
// no rounded corners.
// ---------------------------------------------------------------------------
const FONT_DISPLAY = 'Inter, Arial, system-ui, sans-serif';
const FONT_MONO = 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

function buildCardSvg(title: string, kicker = "L'ATELIER", sub?: string): string {
  const lines = wrapTitle(title.toUpperCase());
  // Fit the longest line on the 1008px usable column (x=96 .. x=1104).
  // Uppercase heavy sans runs ~0.72em per character.
  const maxLen = Math.max(...lines.map(l => l.length));
  const fontSize = Math.max(48, Math.min(100, Math.floor(1008 / (0.72 * maxLen))));
  const lineHeight = Math.round(fontSize * 1.1);
  const firstBaseline = lines.length === 1 ? 350 : 300;

  const titleTexts = lines
    .map((line, i) => {
      const y = firstBaseline + i * lineHeight;
      return `<text x="96" y="${y}" fill="#F5F8FA" font-family="${FONT_DISPLAY}" font-size="${fontSize}" font-weight="900" letter-spacing="-1">${escapeXml(line)}</text>`;
    })
    .join('\n  ');

  const lastBaseline = firstBaseline + (lines.length - 1) * lineHeight;
  const subText = sub
    ? `<text x="96" y="${lastBaseline + 68}" fill="#A8C0D4" font-family="${FONT_DISPLAY}" font-size="28" font-weight="500">${escapeXml(sub)}</text>`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#0B0F14"/>
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" fill="none" stroke="#1E2A39" stroke-width="1"/>

  <!-- Kicker -->
  <text x="96" y="150" font-family="${FONT_MONO}" font-size="22" letter-spacing="6" fill="#00A6FF">› ${escapeXml(kicker.toUpperCase())}</text>

  <!-- Title -->
  ${titleTexts}

  <!-- Sub -->
  ${subText}

  <!-- Accent mark + footer -->
  <rect x="96" y="516" width="18" height="18" fill="#00A6FF"/>
  <text x="1104" y="531" text-anchor="end" font-family="${FONT_MONO}" font-size="18" letter-spacing="4" fill="#A8C0D4">TAIYKA.COM</text>
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
// Square raster logo for JSON-LD / Article schema (Google requires min 112×112
// PNG/JPG — SVG is not accepted). Output: web/public/logo-512.png at 512×512.
// Visual: dark navy background, HUD bracket frame, centered "TAIYKA" wordmark
// in electric-blue gradient with a small accent gear glyph above.
// ---------------------------------------------------------------------------
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const LOGO_SIZE = 512;

function buildLogoSvg(): string {
  const S = LOGO_SIZE;
  // Gear: 8 teeth around a central hub, rendered as a stroked circle with
  // short radial spokes. Simple, recognizable, brand-consistent.
  const cx = S / 2;
  const cy = 200;
  const gearR = 70;
  const teeth = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI * 2) / 8 - Math.PI / 2;
    const x1 = cx + Math.cos(a) * gearR;
    const y1 = cy + Math.sin(a) * gearR;
    const x2 = cx + Math.cos(a) * (gearR + 18);
    const y2 = cy + Math.sin(a) * (gearR + 18);
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="url(#logoAccent)" stroke-width="10" stroke-linecap="round"/>`;
  }).join('\n  ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}">
  <defs>
    <linearGradient id="logoBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0A1628"/>
      <stop offset="100%" stop-color="#000000"/>
    </linearGradient>
    <linearGradient id="logoAccent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#00A6FF"/>
      <stop offset="100%" stop-color="#00E5FF"/>
    </linearGradient>
    <radialGradient id="logoGlow" cx="50%" cy="38%" r="55%">
      <stop offset="0%" stop-color="#00A6FF" stop-opacity="0.35"/>
      <stop offset="70%" stop-color="#00A6FF" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#00A6FF" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${S}" height="${S}" fill="url(#logoBg)"/>
  <rect width="${S}" height="${S}" fill="url(#logoGlow)"/>

  <!-- HUD bracket frame -->
  <path d="M32 32 H96 M32 32 V96" stroke="#00A6FF" stroke-width="3" fill="none"/>
  <path d="M${S - 32} 32 H${S - 96} M${S - 32} 32 V96" stroke="#00A6FF" stroke-width="3" fill="none"/>
  <path d="M32 ${S - 32} H96 M32 ${S - 32} V${S - 96}" stroke="#00A6FF" stroke-width="3" fill="none"/>
  <path d="M${S - 32} ${S - 32} H${S - 96} M${S - 32} ${S - 32} V${S - 96}" stroke="#00A6FF" stroke-width="3" fill="none"/>

  <!-- Gear icon -->
  ${teeth}
  <circle cx="${cx}" cy="${cy}" r="${gearR}" fill="none" stroke="url(#logoAccent)" stroke-width="10"/>
  <circle cx="${cx}" cy="${cy}" r="22" fill="url(#logoAccent)"/>

  <!-- Wordmark -->
  <text x="${S / 2}" y="360" text-anchor="middle" fill="url(#logoAccent)" font-family="Inter, system-ui, sans-serif" font-size="76" font-weight="900" letter-spacing="8">TAIYKA</text>

  <!-- Accent line -->
  <rect x="${S / 2 - 60}" y="385" width="120" height="4" fill="url(#logoAccent)"/>

  <!-- Tagline -->
  <text x="${S / 2}" y="440" text-anchor="middle" fill="#8DA2C0" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="20" letter-spacing="4">AI · AUTOMATION</text>
</svg>`;
}

async function rasterizeLogo(): Promise<string> {
  const pngPath = path.join(PUBLIC_DIR, 'logo-512.png');
  const svg = buildLogoSvg();
  await sharp(Buffer.from(svg), { density: 144 })
    .resize(LOGO_SIZE, LOGO_SIZE, { fit: 'fill' })
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
      const svg = buildCardSvg(item.title, item.kicker, item.sub);
      const out = await rasterizeString(svg, item.name);
      created.push(path.basename(out));
      console.log(`  generated ${item.name}.png`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      failed.push({ name: item.name, error: msg });
      console.error(`  FAILED ${item.name}: ${msg}`);
    }
  }

  // Square raster logo for JSON-LD Article schema (Google requires PNG/JPG)
  try {
    const out = await rasterizeLogo();
    created.push(path.basename(out));
    console.log(`  generated ${path.basename(out)} (${LOGO_SIZE}x${LOGO_SIZE})`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    failed.push({ name: 'logo-512', error: msg });
    console.error(`  FAILED logo-512: ${msg}`);
  }

  console.log(`\nDone. ${created.length} PNGs written.`);
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
