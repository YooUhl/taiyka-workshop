import type { ProgressStatus, Skill, Progress } from "./types";

/**
 * Pure function — no Supabase import.
 * Derives the effective status of a skill given its raw progress and a map
 * of mastered skill slugs. A skill is "locked" until all prereqs are mastered.
 *
 * Rules:
 *   - no prereqs           → at minimum "unlocked"
 *   - all prereqs mastered → at minimum "unlocked"
 *   - any prereq missing   → "locked" (even if user set status manually)
 *   - if user set a status > unlocked AND unlock condition met → keep user status
 */
export function deriveStatus(
  skill: Pick<Skill, "prerequisites">,
  progress: Pick<Progress, "status"> | null,
  masteredSlugs: ReadonlySet<string>,
): ProgressStatus {
  const allPrereqsMastered =
    skill.prerequisites.length === 0 ||
    skill.prerequisites.every((slug) => masteredSlugs.has(slug));

  if (!allPrereqsMastered) return "locked";

  const userStatus = progress?.status ?? "locked";
  if (userStatus === "locked") return "unlocked";
  return userStatus;
}

/**
 * Build the set of mastered slugs from a list of skills + progresses.
 * Helper used by queries so deriveStatus can stay pure + cheap.
 */
export function buildMasteredSlugs(
  skills: Array<Pick<Skill, "slug" | "id">>,
  progresses: Array<Pick<Progress, "skill_id" | "status">>,
): Set<string> {
  const slugById = new Map(skills.map((s) => [s.id, s.slug]));
  const out = new Set<string>();
  for (const p of progresses) {
    if (p.status === "mastered") {
      const slug = slugById.get(p.skill_id);
      if (slug) out.add(slug);
    }
  }
  return out;
}
