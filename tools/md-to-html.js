#!/usr/bin/env node
/**
 * md-to-html.js — Taiyka digital products
 *
 * Walks products/<slug>/delivery/ and products/<slug>/copy/ for .md files
 * and writes a sibling .html file styled with the Taiyka brand.
 * Print-friendly (Cmd/Ctrl+P → Save as PDF gives a polished PDF).
 *
 * Run from project root:  node tools/md-to-html.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PRODUCTS = path.join(ROOT, 'products');

// ---------- Minimal Markdown → HTML ---------- //
// Handles: H1-H4, bold, italic, inline code, fenced code blocks,
// ordered/unordered lists, blockquotes, links, images, tables, hr.
function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g, '&quot;');
}

function inline(md) {
  // Protect inline code first
  const codes = [];
  md = md.replace(/`([^`]+)`/g, (_, c) => {
    codes.push(c);
    return `\u0000CODE${codes.length - 1}\u0000`;
  });

  md = escapeHtml(md);

  // Images ![alt](src)
  md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) =>
    `<img alt="${escapeAttr(alt)}" src="${escapeAttr(src)}">`);
  // Links [text](url)
  md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) =>
    `<a href="${escapeAttr(url)}">${text}</a>`);
  // Bold **x** or __x__
  md = md.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  md = md.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  // Italic *x* or _x_
  md = md.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  md = md.replace(/(^|[^_])_([^_\n]+)_/g, '$1<em>$2</em>');

  // Restore inline code
  md = md.replace(/\u0000CODE(\d+)\u0000/g, (_, i) =>
    `<code>${escapeHtml(codes[+i])}</code>`);

  return md;
}

function mdToHtml(src) {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;

  const flushParagraph = (buf) => {
    if (buf.length) {
      out.push(`<p>${inline(buf.join(' '))}</p>`);
      buf.length = 0;
    }
  };

  let para = [];

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      flushParagraph(para);
      const lang = fence[1] || '';
      const codeLines = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      out.push(`<pre><code class="lang-${escapeAttr(lang)}">${escapeHtml(codeLines.join('\n'))}</code></pre>`);
      continue;
    }

    // Horizontal rule
    if (/^\s*(---|\*\*\*|___)\s*$/.test(line)) {
      flushParagraph(para);
      out.push('<hr>');
      i++;
      continue;
    }

    // Headings
    const h = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (h) {
      flushParagraph(para);
      const level = h[1].length;
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    // Blockquote (possibly multi-line)
    if (/^>\s?/.test(line)) {
      flushParagraph(para);
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      out.push(`<blockquote>${inline(buf.join(' '))}</blockquote>`);
      continue;
    }

    // Table: header line followed by separator line with ---
    if (/\|/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/.test(lines[i + 1])) {
      flushParagraph(para);
      const parseRow = (row) =>
        row.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim());
      const header = parseRow(line);
      i += 2; // skip header + separator
      const rows = [];
      while (i < lines.length && /\|/.test(lines[i]) && lines[i].trim() !== '') {
        rows.push(parseRow(lines[i]));
        i++;
      }
      let table = '<table><thead><tr>';
      for (const h of header) table += `<th>${inline(h)}</th>`;
      table += '</tr></thead><tbody>';
      for (const r of rows) {
        table += '<tr>';
        for (const c of r) table += `<td>${inline(c)}</td>`;
        table += '</tr>';
      }
      table += '</tbody></table>';
      out.push(table);
      continue;
    }

    // Lists (unordered or ordered). Handles simple nesting by indentation (2 spaces = 1 level).
    const ulMatch = line.match(/^(\s*)[-*+]\s+(.*)$/);
    const olMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
    if (ulMatch || olMatch) {
      flushParagraph(para);
      const items = [];
      const ordered = !!olMatch;
      while (i < lines.length) {
        const l = lines[i];
        const um = l.match(/^(\s*)[-*+]\s+(.*)$/);
        const om = l.match(/^(\s*)\d+\.\s+(.*)$/);
        if (!um && !om) {
          // continuation line indented — append to last item
          if (items.length && /^\s{2,}\S/.test(l)) {
            items[items.length - 1].text += ' ' + l.trim();
            i++;
            continue;
          }
          break;
        }
        const m = um || om;
        items.push({ indent: m[1].length, text: m[2] });
        i++;
      }
      const render = (arr) => {
        let html = '';
        const tag = ordered ? 'ol' : 'ul';
        html += `<${tag}>`;
        for (const it of arr) html += `<li>${inline(it.text)}</li>`;
        html += `</${tag}>`;
        return html;
      };
      out.push(render(items));
      continue;
    }

    // Blank line → paragraph boundary
    if (line.trim() === '') {
      flushParagraph(para);
      i++;
      continue;
    }

    para.push(line);
    i++;
  }
  flushParagraph(para);
  return out.join('\n');
}

// ---------- HTML template ---------- //
const CSS = `
:root {
  --navy: #0A1628;
  --blue: #00A6FF;
  --cyan: #00E5FF;
  --white: #FFFFFF;
  --text: #E8F0FE;
  --muted: #8FA1BD;
  --panel: #11223d;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  background: var(--navy);
  color: var(--text);
  line-height: 1.7;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
}
header.brand {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 40px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 166, 255, 0.25);
}
header.brand .logo {
  font-weight: 800;
  font-size: 20px;
  letter-spacing: 0.12em;
  background: linear-gradient(90deg, var(--blue), var(--cyan));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
header.brand .handle {
  color: var(--muted);
  font-size: 13px;
  letter-spacing: 0.05em;
}
main {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 40px 64px;
}
footer {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 40px 48px;
  text-align: center;
  color: var(--muted);
  font-size: 13px;
  border-top: 1px solid rgba(0, 166, 255, 0.15);
}
h1, h2, h3, h4, h5, h6 {
  color: var(--white);
  line-height: 1.25;
  margin: 1.8em 0 0.6em;
  font-weight: 700;
}
h1 {
  font-size: 2.1em;
  background: linear-gradient(90deg, var(--blue), var(--cyan));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  padding-bottom: 0.3em;
  border-bottom: 2px solid rgba(0, 166, 255, 0.35);
}
h2 { font-size: 1.55em; color: var(--cyan); }
h3 { font-size: 1.25em; color: var(--blue); }
h4 { font-size: 1.05em; color: var(--white); }
p { margin: 0.9em 0; }
a { color: var(--cyan); text-decoration: underline; text-underline-offset: 2px; }
a:hover { color: var(--blue); }
strong { color: var(--white); }
em { color: var(--text); }
hr {
  border: none;
  border-top: 1px solid rgba(0, 166, 255, 0.25);
  margin: 2em 0;
}
ul, ol { padding-left: 1.4em; margin: 0.9em 0; }
li { margin: 0.3em 0; }
blockquote {
  margin: 1.2em 0;
  padding: 0.6em 1.1em;
  border-left: 3px solid var(--blue);
  background: rgba(0, 166, 255, 0.08);
  color: var(--text);
  border-radius: 0 6px 6px 0;
}
code {
  font-family: 'SF Mono', Consolas, 'Liberation Mono', monospace;
  font-size: 0.92em;
  background: var(--panel);
  color: var(--cyan);
  padding: 0.12em 0.4em;
  border-radius: 4px;
}
pre {
  background: var(--panel);
  border: 1px solid rgba(0, 166, 255, 0.2);
  border-radius: 8px;
  padding: 16px 18px;
  overflow-x: auto;
  margin: 1.2em 0;
  line-height: 1.5;
}
pre code {
  background: transparent;
  color: var(--text);
  padding: 0;
  font-size: 0.88em;
}
img { max-width: 100%; border-radius: 6px; }
table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.2em 0;
  font-size: 0.95em;
}
th, td {
  border: 1px solid rgba(0, 166, 255, 0.25);
  padding: 10px 12px;
  text-align: left;
  vertical-align: top;
}
th { background: rgba(0, 166, 255, 0.12); color: var(--white); font-weight: 600; }
tbody tr:nth-child(even) td { background: rgba(255, 255, 255, 0.02); }

/* Print mode — polished light PDF */
@media print {
  @page { margin: 18mm 16mm; }
  html, body {
    background: #ffffff !important;
    color: #111 !important;
    font-size: 11.5pt;
  }
  header.brand {
    border-bottom: 1px solid #00A6FF;
    padding: 0 0 10px;
    margin-bottom: 16px;
  }
  header.brand .logo {
    -webkit-text-fill-color: initial;
    color: #00A6FF;
    background: none;
  }
  header.brand .handle { color: #555; }
  main, footer { padding: 0; max-width: none; }
  footer { border-top: 1px solid #ccc; color: #555; margin-top: 24px; padding-top: 10px; }
  h1, h2, h3, h4 { color: #0A1628 !important; }
  h1 {
    -webkit-text-fill-color: initial;
    color: #00A6FF !important;
    background: none;
    border-bottom: 2px solid #00A6FF;
    page-break-before: always;
  }
  h1:first-of-type { page-break-before: avoid; }
  h2 { color: #0078c8 !important; page-break-after: avoid; }
  h3, h4 { page-break-after: avoid; }
  h2, h3, h4 { page-break-inside: avoid; }
  a { color: #0078c8; }
  strong { color: #000; }
  code {
    background: #f2f6fb;
    color: #0a4f8a;
    border: 1px solid #dde5f0;
  }
  pre {
    background: #f7f9fc;
    border: 1px solid #dde5f0;
    color: #111;
    page-break-inside: avoid;
  }
  pre code { color: #111; }
  blockquote {
    background: #f2f8ff;
    color: #222;
    border-left: 3px solid #00A6FF;
    page-break-inside: avoid;
  }
  table, tr, td, th { page-break-inside: avoid; }
  th { background: #eaf4ff; color: #0A1628; }
  tbody tr:nth-child(even) td { background: #fafcff; }
  img { page-break-inside: avoid; }
}
`;

function detectLang(relPath, content) {
  const base = path.basename(relPath).toLowerCase();
  if (/-fr\.md$/.test(base)) return 'fr';
  if (/-en\.md$/.test(base)) return 'en';
  // Fallback: heuristic
  const frHits = (content.match(/\b(le |la |les |une |des |vous |votre |pour |avec )/gi) || []).length;
  const enHits = (content.match(/\b(the |and |you |your |with |for |this )/gi) || []).length;
  return frHits > enHits ? 'fr' : 'en';
}

function deriveTitle(content, fallback) {
  const m = content.match(/^#\s+(.+?)\s*$/m);
  return m ? m[1].replace(/[*_`]/g, '').trim() : fallback;
}

function wrap(title, lang, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="${escapeAttr(lang)}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} — Taiyka</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
  <header class="brand">
    <div class="logo">TAIYKA</div>
    <div class="handle">@manu_ai.to</div>
  </header>
  <main>
${bodyHtml}
  </main>
  <footer><p>© Taiyka — manu_ai.to</p></footer>
</body>
</html>
`;
}

// ---------- Walker ---------- //
function listProductSlugs() {
  if (!fs.existsSync(PRODUCTS)) return [];
  return fs
    .readdirSync(PRODUCTS, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function collectMdFiles() {
  const files = [];
  for (const slug of listProductSlugs()) {
    for (const sub of ['delivery', 'copy']) {
      const dir = path.join(PRODUCTS, slug, sub);
      if (!fs.existsSync(dir)) continue;
      for (const name of fs.readdirSync(dir)) {
        if (!name.endsWith('.md')) continue;
        if (name.toLowerCase() === 'readme.md') continue;
        files.push(path.join(dir, name));
      }
    }
  }
  return files;
}

function processFile(absMd) {
  const content = fs.readFileSync(absMd, 'utf8');
  const rel = path.relative(ROOT, absMd).replace(/\\/g, '/');
  const fallback = path.basename(absMd, '.md');
  const title = deriveTitle(content, fallback);
  const lang = detectLang(rel, content);
  const bodyHtml = mdToHtml(content);
  const outPath = absMd.replace(/\.md$/, '.html');
  fs.writeFileSync(outPath, wrap(title, lang, bodyHtml), 'utf8');
  const outRel = path.relative(ROOT, outPath).replace(/\\/g, '/');
  return { rel, outRel };
}

function main() {
  const files = collectMdFiles();
  let ok = 0;
  const failed = [];
  for (const f of files) {
    try {
      const { rel, outRel } = processFile(f);
      console.log(`Processed: ${rel} → ${outRel}`);
      ok++;
    } catch (err) {
      failed.push({ file: f, error: err.message });
      console.error(`FAILED:   ${f} — ${err.message}`);
    }
  }
  console.log('');
  console.log(`Done. ${ok}/${files.length} files converted.${failed.length ? ` ${failed.length} failed.` : ''}`);
}

main();
