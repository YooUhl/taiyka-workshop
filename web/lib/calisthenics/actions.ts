"use server";

import { revalidatePath } from "next/cache";
import { query, queryOne } from "@/lib/db";
import type { Attempt, ProgressStatus } from "./types";

function revalidateAll(slug?: string) {
  revalidatePath("/tools/calisthenics");
  if (slug) revalidatePath(`/tools/calisthenics/${slug}`);
}

type Ok = { ok: true };
type Err = { ok: false; error: string };

export async function updateStatus(
  skillId: string,
  slug: string,
  status: ProgressStatus,
): Promise<Ok | Err> {
  if (!skillId || !slug) return { ok: false, error: "Missing skillId/slug." };
  try {
    const masteredAt =
      status === "mastered" ? new Date().toISOString() : null;
    await query(
      `INSERT INTO calisthenics.user_progress (skill_id, status, mastered_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (skill_id) DO UPDATE
         SET status = EXCLUDED.status,
             mastered_at = EXCLUDED.mastered_at`,
      [skillId, status, masteredAt],
    );
    revalidateAll(slug);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function updateNotes(
  skillId: string,
  slug: string,
  notes: string,
): Promise<Ok | Err> {
  try {
    await query(
      `INSERT INTO calisthenics.user_progress (skill_id, notes)
       VALUES ($1, $2)
       ON CONFLICT (skill_id) DO UPDATE SET notes = EXCLUDED.notes`,
      [skillId, notes],
    );
    revalidateAll(slug);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

async function readAttempts(skillId: string): Promise<Attempt[]> {
  const row = await queryOne<{ attempts: Attempt[] | null }>(
    `SELECT attempts FROM calisthenics.user_progress WHERE skill_id = $1`,
    [skillId],
  );
  return (row?.attempts ?? []) as Attempt[];
}

export async function addAttempt(
  skillId: string,
  slug: string,
  attempt: Attempt,
): Promise<Ok | Err> {
  try {
    const current = await readAttempts(skillId);
    const next = [...current, attempt];
    await query(
      `INSERT INTO calisthenics.user_progress (skill_id, attempts)
       VALUES ($1, $2::jsonb)
       ON CONFLICT (skill_id) DO UPDATE SET attempts = EXCLUDED.attempts`,
      [skillId, JSON.stringify(next)],
    );
    revalidateAll(slug);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function removeAttempt(
  skillId: string,
  slug: string,
  index: number,
): Promise<Ok | Err> {
  try {
    const current = await readAttempts(skillId);
    if (index < 0 || index >= current.length) {
      return { ok: false, error: "Index out of range." };
    }
    const next = current.filter((_, i) => i !== index);
    await query(
      `INSERT INTO calisthenics.user_progress (skill_id, attempts)
       VALUES ($1, $2::jsonb)
       ON CONFLICT (skill_id) DO UPDATE SET attempts = EXCLUDED.attempts`,
      [skillId, JSON.stringify(next)],
    );
    revalidateAll(slug);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function markMastered(
  skillId: string,
  slug: string,
): Promise<Ok | Err> {
  try {
    await query(
      `INSERT INTO calisthenics.user_progress (skill_id, status, mastered_at)
       VALUES ($1, 'mastered', now())
       ON CONFLICT (skill_id) DO UPDATE
         SET status = 'mastered',
             mastered_at = now()`,
      [skillId],
    );
    revalidateAll(slug);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
