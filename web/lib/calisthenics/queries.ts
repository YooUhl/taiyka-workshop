import "server-only";
import { query, queryOne } from "@/lib/db";
import { buildMasteredSlugs, deriveStatus } from "./unlock";
import type {
  Progress,
  Skill,
  SkillWithProgress,
} from "./types";

const SKILL_COLS =
  "id, slug, name, category, tier, description, prerequisites, mastery_conditions, created_at";
const PROGRESS_COLS =
  "id, skill_id, status, notes, mastered_at, attempts, updated_at";

export async function listSkillsWithProgress(): Promise<SkillWithProgress[]> {
  const [skills, progresses] = await Promise.all([
    query<Skill>(
      `SELECT ${SKILL_COLS} FROM calisthenics.skills ORDER BY category ASC, tier ASC, name ASC`,
    ),
    query<Progress>(`SELECT ${PROGRESS_COLS} FROM calisthenics.user_progress`),
  ]);

  const progressBySkillId = new Map<string, Progress>(
    progresses.map((p) => [p.skill_id, p]),
  );
  const masteredSlugs = buildMasteredSlugs(skills, progresses);

  return skills.map((s) => {
    const p = progressBySkillId.get(s.id) ?? null;
    return {
      ...s,
      progress: p,
      effective_status: deriveStatus(s, p, masteredSlugs),
    };
  });
}

export async function getSkillBySlug(
  slug: string,
): Promise<SkillWithProgress | null> {
  const skill = await queryOne<Skill>(
    `SELECT ${SKILL_COLS} FROM calisthenics.skills WHERE slug = $1`,
    [slug],
  );
  if (!skill) return null;

  const [progress, masteredSlugRows] = await Promise.all([
    queryOne<Progress>(
      `SELECT ${PROGRESS_COLS} FROM calisthenics.user_progress WHERE skill_id = $1`,
      [skill.id],
    ),
    query<{ slug: string }>(
      `SELECT s.slug FROM calisthenics.user_progress p
       JOIN calisthenics.skills s ON s.id = p.skill_id
       WHERE p.status = 'mastered'`,
    ),
  ]);

  const masteredSlugs = new Set(masteredSlugRows.map((r) => r.slug));
  return {
    ...skill,
    progress: progress ?? null,
    effective_status: deriveStatus(skill, progress, masteredSlugs),
  };
}

export async function getSkillNamesBySlugs(
  slugs: string[],
): Promise<Array<{ slug: string; name: string }>> {
  if (slugs.length === 0) return [];
  return query<{ slug: string; name: string }>(
    `SELECT slug, name FROM calisthenics.skills WHERE slug = ANY($1::text[])`,
    [slugs],
  );
}
