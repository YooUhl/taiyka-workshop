// Reads web/data/shop/workflows/<slug>/product.md, parses the YAML-ish
// frontmatter + Markdown body, and emits web/lib/shop/workflows-data.generated.json
// for runtime import by lib/shop/workflows.ts.
//
// Runs as part of the predev / prebuild chain.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB = resolve(__dirname, "..");
const SOURCE = resolve(WEB, "data", "shop", "workflows");
const OUT_DIR = resolve(WEB, "lib", "shop");
const OUT = resolve(OUT_DIR, "workflows-data.generated.json");

// Frontmatter parser — handles the limited shape we use:
//   key: value             (string scalar)
//   key: "quoted value"    (quoted scalar)
//   key:                   (nested object follows, indented 2 spaces)
//     subkey: value
//   key:                   (list of scalars follows, "- " prefix)
//     - "value"
//     - value
//   key:                   (list of objects follows)
//     - name: x
//       description: y
function parseFrontmatter(text) {
  const lines = text.split(/\r?\n/);
  const root = {};
  // Parse a block at a given indent level. Returns [value, nextLineIndex].
  function parseBlock(startIdx, indent) {
    const result = {};
    let listMode = null; // null | "scalars" | "objects"
    const list = [];
    let i = startIdx;
    while (i < lines.length) {
      const raw = lines[i];
      if (raw.trim() === "") {
        i++;
        continue;
      }
      const lineIndent = raw.match(/^ */)[0].length;
      if (lineIndent < indent) break;
      if (lineIndent > indent) {
        // shouldn't reach here directly — handled inside the nested calls
        i++;
        continue;
      }
      const line = raw.slice(indent);
      // List item
      if (line.startsWith("- ")) {
        const rest = line.slice(2);
        // A list entry that starts with a quote is a quoted scalar even if it
        // contains a colon. Only treat as object when the entry is bare and the
        // colon clearly separates a key from a value.
        const isQuoted = rest.startsWith('"') || rest.startsWith("'");
        if (!isQuoted && rest.includes(":")) {
          // Object list item — first key/value, possibly followed by more keys indented +2
          listMode = "objects";
          const obj = {};
          const [k, ...vparts] = rest.split(":");
          obj[k.trim()] = unquote(vparts.join(":").trim());
          i++;
          // Continue reading keys at the same column as the second char of "- "
          const objIndent = indent + 2;
          while (i < lines.length) {
            const r = lines[i];
            if (r.trim() === "") {
              i++;
              continue;
            }
            const li = r.match(/^ */)[0].length;
            if (li < objIndent) break;
            if (li > objIndent) {
              i++;
              continue;
            }
            const sub = r.slice(objIndent);
            if (sub.startsWith("- ")) break;
            const cidx = sub.indexOf(":");
            if (cidx === -1) {
              i++;
              continue;
            }
            const key = sub.slice(0, cidx).trim();
            const val = unquote(sub.slice(cidx + 1).trim());
            obj[key] = val;
            i++;
          }
          list.push(obj);
        } else {
          listMode = "scalars";
          list.push(unquote(rest));
          i++;
        }
        continue;
      }
      // Key/value
      const cidx = line.indexOf(":");
      if (cidx === -1) {
        i++;
        continue;
      }
      const key = line.slice(0, cidx).trim();
      const valueRaw = line.slice(cidx + 1).trim();
      if (valueRaw === "") {
        // Nested object or list — peek next non-empty line
        let j = i + 1;
        while (j < lines.length && lines[j].trim() === "") j++;
        if (j < lines.length) {
          const peek = lines[j];
          const peekIndent = peek.match(/^ */)[0].length;
          if (peekIndent > indent) {
            // Nested block
            const [nested, next] = parseBlock(i + 1, peekIndent);
            result[key] = nested;
            i = next;
            continue;
          }
        }
        result[key] = null;
        i++;
        continue;
      }
      result[key] = unquote(valueRaw);
      i++;
    }
    if (listMode) {
      return [list, i];
    }
    return [result, i];
  }
  function unquote(s) {
    if (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) {
      return s.slice(1, -1);
    }
    if (s.length >= 2 && s.startsWith("'") && s.endsWith("'")) {
      return s.slice(1, -1);
    }
    return s;
  }
  const [parsed] = parseBlock(0, 0);
  return parsed;
}

// Split the file at the leading "---" frontmatter delimiters.
// Returns { frontmatter: string, body: string }.
function splitFrontmatter(raw) {
  const lines = raw.split(/\r?\n/);
  if (lines[0] !== "---") {
    return { frontmatter: "", body: raw };
  }
  let endIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "---") {
      endIdx = i;
      break;
    }
  }
  if (endIdx === -1) {
    return { frontmatter: "", body: raw };
  }
  const frontmatter = lines.slice(1, endIdx).join("\n");
  const body = lines.slice(endIdx + 1).join("\n");
  return { frontmatter, body };
}

// Split body into FR / EN halves on a `\n---\n` line.
function splitLangBodies(body) {
  const parts = body.split(/\n---\n/);
  if (parts.length < 2) {
    return { fr: body.trim(), en: body.trim() };
  }
  return { fr: parts[0].trim(), en: parts.slice(1).join("\n---\n").trim() };
}

if (!existsSync(SOURCE)) {
  console.warn(`[build-shop-workflows] source folder missing: ${SOURCE} — writing empty array`);
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT, JSON.stringify([], null, 2));
  process.exit(0);
}

const slugs = readdirSync(SOURCE).filter((name) => {
  const full = join(SOURCE, name);
  try {
    return statSync(full).isDirectory();
  } catch {
    return false;
  }
});

const data = [];
for (const slug of slugs) {
  const productPath = join(SOURCE, slug, "product.md");
  if (!existsSync(productPath)) {
    console.warn(`[build-shop-workflows] skip ${slug}: no product.md`);
    continue;
  }
  const raw = readFileSync(productPath, "utf-8");
  const { frontmatter, body } = splitFrontmatter(raw);
  if (!frontmatter) {
    console.warn(`[build-shop-workflows] skip ${slug}: no frontmatter`);
    continue;
  }
  const meta = parseFrontmatter(frontmatter);
  const { fr: frBody, en: enBody } = splitLangBodies(body);
  data.push({
    slug: meta.slug ?? slug,
    icon: meta.icon ?? "Package",
    tier: meta.tier ?? "entry",
    price: meta.price ?? "",
    priceNumeric: meta.priceNumeric ? Number(meta.priceNumeric) : null,
    status: meta.status ?? "coming-soon",
    fr: meta.fr ?? {},
    en: meta.en ?? {},
    nodes: meta.nodes ?? [],
    variables: meta.variables ?? [],
    costEstimate: meta.costEstimate ?? { fr: "", en: "" },
    valueProps: meta.valueProps ?? { fr: [], en: [] },
    frBody,
    enBody,
  });
}

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT, JSON.stringify(data, null, 2));
console.log(`[build-shop-workflows] wrote ${data.length} entries to ${OUT}`);
