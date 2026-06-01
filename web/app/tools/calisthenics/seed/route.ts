import { query } from "@/lib/db";
import { CATEGORIES } from "@/lib/calisthenics/types";

type SkillRow = {
  slug: string;
  name: string;
  category: string;
  tier: number;
  description: string;
  prerequisites: string[];
  mastery_conditions: unknown[];
};

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function validate(rows: unknown): { ok: true; rows: SkillRow[] } | { ok: false; reason: string } {
  if (!Array.isArray(rows)) return { ok: false, reason: "Body must be an array of skills." };
  const cats = new Set<string>(CATEGORIES);
  const out: SkillRow[] = [];
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i] as Partial<SkillRow>;
    if (!r || typeof r !== "object") return { ok: false, reason: `Row ${i} is not an object.` };
    if (typeof r.slug !== "string" || !r.slug) return { ok: false, reason: `Row ${i} missing slug.` };
    if (typeof r.name !== "string" || !r.name) return { ok: false, reason: `Row ${i} missing name.` };
    if (typeof r.category !== "string" || !cats.has(r.category)) {
      return { ok: false, reason: `Row ${i} bad category: ${String(r.category)}` };
    }
    if (typeof r.tier !== "number" || !Number.isInteger(r.tier) || r.tier < 1 || r.tier > 10) {
      return { ok: false, reason: `Row ${i} tier must be int 1..10.` };
    }
    if (r.prerequisites && !Array.isArray(r.prerequisites)) {
      return { ok: false, reason: `Row ${i} prerequisites must be array of slugs.` };
    }
    if (r.mastery_conditions && !Array.isArray(r.mastery_conditions)) {
      return { ok: false, reason: `Row ${i} mastery_conditions must be array.` };
    }
    out.push({
      slug: r.slug,
      name: r.name,
      category: r.category,
      tier: r.tier,
      description: r.description ?? "",
      prerequisites: r.prerequisites ?? [],
      mastery_conditions: (r.mastery_conditions ?? []) as unknown[],
    });
  }
  return { ok: true, rows: out };
}

export async function POST(req: Request) {
  const expected = process.env.CALISTHENICS_SEED_TOKEN;
  if (!expected) return jsonResponse({ error: "Seed token not configured" }, 500);
  const token = req.headers.get("x-seed-token");
  if (token !== expected) return jsonResponse({ error: "forbidden" }, 403);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }
  const v = validate(body);
  if (!v.ok) return jsonResponse({ error: v.reason }, 400);

  try {
    let written = 0;
    for (const r of v.rows) {
      await query(
        `INSERT INTO calisthenics.skills
           (slug, name, category, tier, description, prerequisites, mastery_conditions)
         VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb)
         ON CONFLICT (slug) DO UPDATE SET
           name = EXCLUDED.name,
           category = EXCLUDED.category,
           tier = EXCLUDED.tier,
           description = EXCLUDED.description,
           prerequisites = EXCLUDED.prerequisites,
           mastery_conditions = EXCLUDED.mastery_conditions`,
        [
          r.slug,
          r.name,
          r.category,
          r.tier,
          r.description,
          JSON.stringify(r.prerequisites),
          JSON.stringify(r.mastery_conditions),
        ],
      );
      written++;
    }
    return jsonResponse({ total: v.rows.length, written }, 200);
  } catch (e) {
    return jsonResponse({ error: (e as Error).message }, 500);
  }
}
