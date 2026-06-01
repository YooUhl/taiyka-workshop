"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { query, queryOne } from "@/lib/db";
import {
  PLATFORMS,
  FORMATS,
  STATUSES,
  PRIORITIES,
  SECTION_TYPES,
  ASSET_KINDS,
  type Platform,
  type Format,
  type Status,
  type Priority,
  type SectionType,
  type AssetKind,
} from "./types";
import { isPillar } from "./pillars";

function asPlatformArray(input: FormDataEntryValue[] | undefined): Platform[] {
  if (!input) return [];
  return input
    .map((v) => String(v))
    .filter((v): v is Platform => (PLATFORMS as readonly string[]).includes(v));
}

function asFormat(input: FormDataEntryValue | null): Format {
  const v = String(input ?? "");
  if ((FORMATS as readonly string[]).includes(v)) return v as Format;
  return "video";
}

function asStatus(input: FormDataEntryValue | null): Status {
  const v = String(input ?? "");
  if ((STATUSES as readonly string[]).includes(v)) return v as Status;
  return "draft";
}

function asPriority(input: unknown): Priority {
  const v = String(input ?? "");
  if ((PRIORITIES as readonly string[]).includes(v)) return v as Priority;
  return "medium";
}

function asSectionType(v: string): SectionType {
  if ((SECTION_TYPES as readonly string[]).includes(v)) return v as SectionType;
  return "body";
}

function asAssetKind(v: string): AssetKind {
  if ((ASSET_KINDS as readonly string[]).includes(v)) return v as AssetKind;
  return "image_idea";
}

function sanitizeTags(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of input) {
    const t = String(raw ?? "").trim();
    if (!t) continue;
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
    if (out.length >= 20) break;
  }
  return out;
}

function toIsoOrNull(local: string | null | undefined): string | null {
  if (!local) return null;
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function asUrlOrNull(input: unknown): string | null {
  const v = String(input ?? "").trim();
  if (!v) return null;
  return v.slice(0, 2048);
}

export async function createIdea(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("title is required");

  const platform = asPlatformArray(formData.getAll("platform"));
  const format = asFormat(formData.get("format"));
  const pillarRaw = String(formData.get("pillar") ?? "").trim();
  const pillar = pillarRaw && isPillar(pillarRaw) ? pillarRaw : null;
  const priority = asPriority(formData.get("priority"));
  const scheduledFor = toIsoOrNull(String(formData.get("scheduled_for") ?? ""));

  const row = await queryOne<{ id: string }>(
    `insert into content.ideas (title, platform, format, pillar, priority, scheduled_for)
     values ($1, $2, $3, $4, $5, $6)
     returning id`,
    [title, platform, format, pillar, priority, scheduledFor],
  );

  revalidatePath("/tools/content");
  if (row?.id) redirect(`/tools/content/${row.id}`);
}

export async function updateIdea(
  id: string,
  patch: {
    title?: string;
    platform?: Platform[];
    format?: Format;
    status?: Status;
    notes?: string;
    tags?: string[];
    pillar?: string | null;
    scheduled_for?: string | null;
    priority?: Priority;
    inspiration_url?: string | null;
  },
) {
  const sets: string[] = [];
  const params: unknown[] = [];

  if (patch.title !== undefined) {
    params.push(patch.title);
    sets.push(`title = $${params.length}`);
  }
  if (patch.platform !== undefined) {
    const safe = patch.platform.filter((p) =>
      (PLATFORMS as readonly string[]).includes(p),
    );
    params.push(safe);
    sets.push(`platform = $${params.length}`);
  }
  if (patch.format !== undefined) {
    params.push(patch.format);
    sets.push(`format = $${params.length}`);
  }
  if (patch.status !== undefined) {
    const safe = (STATUSES as readonly string[]).includes(patch.status)
      ? patch.status
      : "draft";
    params.push(safe);
    sets.push(`status = $${params.length}`);
  }
  if (patch.notes !== undefined) {
    params.push(patch.notes);
    sets.push(`notes = $${params.length}`);
  }
  if (patch.tags !== undefined) {
    params.push(sanitizeTags(patch.tags));
    sets.push(`tags = $${params.length}`);
  }
  if (patch.pillar !== undefined) {
    const safe =
      patch.pillar === null
        ? null
        : isPillar(patch.pillar)
          ? patch.pillar
          : null;
    params.push(safe);
    sets.push(`pillar = $${params.length}`);
  }
  if (patch.scheduled_for !== undefined) {
    params.push(toIsoOrNull(patch.scheduled_for));
    sets.push(`scheduled_for = $${params.length}`);
  }
  if (patch.priority !== undefined) {
    params.push(asPriority(patch.priority));
    sets.push(`priority = $${params.length}`);
  }
  if (patch.inspiration_url !== undefined) {
    params.push(asUrlOrNull(patch.inspiration_url));
    sets.push(`inspiration_url = $${params.length}`);
  }

  if (sets.length === 0) return;
  params.push(id);
  await query(
    `update content.ideas set ${sets.join(", ")} where id = $${params.length}`,
    params,
  );
  revalidatePath("/tools/content");
  revalidatePath(`/tools/content/${id}`);
}

export async function deleteIdea(id: string) {
  await query(`delete from content.ideas where id = $1`, [id]);
  revalidatePath("/tools/content");
  redirect("/tools/content");
}

export async function bulkCreateIdeas(
  raw: string,
  defaults: {
    platform: Platform[];
    format: Format;
    pillar?: string | null;
    priority?: Priority;
  },
): Promise<{ created: number }> {
  const lines = Array.from(
    new Set(
      String(raw ?? "")
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean),
    ),
  ).slice(0, 200);

  if (lines.length === 0) return { created: 0 };

  const safePlatform = (defaults.platform ?? []).filter((p) =>
    (PLATFORMS as readonly string[]).includes(p),
  );
  const safeFormat = (FORMATS as readonly string[]).includes(defaults.format)
    ? defaults.format
    : "video";
  const safePillar =
    defaults.pillar && isPillar(defaults.pillar) ? defaults.pillar : null;
  const safePriority = asPriority(defaults.priority);

  await query(
    `insert into content.ideas (title, platform, format, status, pillar, priority)
     select t, $2::text[], $3, 'draft', $4, $5
     from unnest($1::text[]) as t`,
    [lines, safePlatform, safeFormat, safePillar, safePriority],
  );

  revalidatePath("/tools/content");
  return { created: lines.length };
}

export async function upsertSection(input: {
  idea_id: string;
  section_type: SectionType;
  content: string;
  order_idx?: number;
  id?: string;
}) {
  const sectionType = asSectionType(input.section_type);
  const orderIdx = input.order_idx ?? 0;

  if (input.id) {
    await query(
      `update content.video_sections
       set section_type = $1, content = $2, order_idx = $3
       where id = $4 and idea_id = $5`,
      [sectionType, input.content, orderIdx, input.id, input.idea_id],
    );
  } else {
    await query(
      `insert into content.video_sections (idea_id, section_type, content, order_idx)
       values ($1, $2, $3, $4)`,
      [input.idea_id, sectionType, input.content, orderIdx],
    );
  }
  revalidatePath(`/tools/content/${input.idea_id}`);
}

export async function deleteSection(idea_id: string, id: string) {
  await query(
    `delete from content.video_sections where id = $1 and idea_id = $2`,
    [id, idea_id],
  );
  revalidatePath(`/tools/content/${idea_id}`);
}

export async function addBroll(
  idea_id: string,
  description: string,
  ref_url?: string | null,
) {
  const desc = description.trim();
  if (!desc) return;
  await query(
    `insert into content.broll_ideas (idea_id, description, ref_url)
     values ($1, $2, $3)`,
    [idea_id, desc, ref_url?.trim() || null],
  );
  revalidatePath(`/tools/content/${idea_id}`);
}

export async function removeBroll(idea_id: string, id: string) {
  await query(
    `delete from content.broll_ideas where id = $1 and idea_id = $2`,
    [id, idea_id],
  );
  revalidatePath(`/tools/content/${idea_id}`);
}

export async function addAsset(
  idea_id: string,
  kind: AssetKind,
  description: string,
) {
  const safeKind = asAssetKind(kind);
  const next = await queryOne<{ next: number }>(
    `select coalesce(max(order_idx), -1) + 1 as next
     from content.assets where idea_id = $1 and kind = $2`,
    [idea_id, safeKind],
  );
  await query(
    `insert into content.assets (idea_id, kind, description, order_idx)
     values ($1, $2, $3, $4)`,
    [idea_id, safeKind, description, next?.next ?? 0],
  );
  revalidatePath(`/tools/content/${idea_id}`);
}

export async function updateAssetDescription(
  idea_id: string,
  id: string,
  description: string,
) {
  await query(
    `update content.assets set description = $1
     where id = $2 and idea_id = $3`,
    [description, id, idea_id],
  );
  revalidatePath(`/tools/content/${idea_id}`);
}

export async function removeAsset(idea_id: string, id: string) {
  await query(`delete from content.assets where id = $1 and idea_id = $2`, [
    id,
    idea_id,
  ]);
  revalidatePath(`/tools/content/${idea_id}`);
}

export async function reorderAssets(
  idea_id: string,
  ordered_ids: string[],
) {
  for (let i = 0; i < ordered_ids.length; i++) {
    await query(
      `update content.assets set order_idx = $1
       where id = $2 and idea_id = $3`,
      [i, ordered_ids[i], idea_id],
    );
  }
  revalidatePath(`/tools/content/${idea_id}`);
}
