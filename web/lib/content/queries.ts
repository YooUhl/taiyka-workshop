import "server-only";
import { query, queryOne } from "@/lib/db";
import type {
  Idea,
  VideoSection,
  BrollIdea,
  Asset,
  IdeaFilters,
  Sort,
} from "./types";

const SELECT_COLS = `
  id, title, platform, format, status, notes,
  tags, pillar,
  scheduled_for::text as scheduled_for,
  priority, inspiration_url,
  created_at::text as created_at,
  updated_at::text as updated_at
`;

const SORT_SQL: Record<Sort, string> = {
  updated_desc: "updated_at desc",
  scheduled_asc: "scheduled_for asc nulls last, updated_at desc",
  priority_desc:
    "case priority when 'high' then 0 when 'medium' then 1 else 2 end asc, updated_at desc",
  created_desc: "created_at desc",
};

export async function listIdeas(filters: IdeaFilters = {}): Promise<Idea[]> {
  const where: string[] = [];
  const params: unknown[] = [];

  if (filters.q && filters.q.trim()) {
    params.push(`%${filters.q.trim()}%`);
    where.push(`(title ilike $${params.length} or notes ilike $${params.length})`);
  }
  if (filters.platform) {
    params.push(filters.platform);
    where.push(`$${params.length} = any(platform)`);
  }
  if (filters.format) {
    params.push(filters.format);
    where.push(`format = $${params.length}`);
  }
  if (filters.status) {
    params.push(filters.status);
    where.push(`status = $${params.length}`);
  }
  if (filters.pillar) {
    params.push(filters.pillar);
    where.push(`pillar = $${params.length}`);
  }
  if (filters.priority) {
    params.push(filters.priority);
    where.push(`priority = $${params.length}`);
  }
  if (filters.tag && filters.tag.trim()) {
    params.push(filters.tag.trim());
    where.push(`$${params.length} = any(tags)`);
  }
  if (filters.scheduledFrom) {
    params.push(filters.scheduledFrom);
    where.push(`scheduled_for >= $${params.length}::timestamptz`);
  }
  if (filters.scheduledTo) {
    params.push(filters.scheduledTo);
    where.push(`scheduled_for <= $${params.length}::timestamptz`);
  }

  const orderBy = SORT_SQL[filters.sort ?? "updated_desc"] ?? SORT_SQL.updated_desc;

  const sql = `
    select ${SELECT_COLS}
    from content.ideas
    ${where.length ? "where " + where.join(" and ") : ""}
    order by ${orderBy}
    limit 500
  `;
  return query<Idea>(sql, params);
}

export async function getIdea(id: string): Promise<Idea | null> {
  return queryOne<Idea>(
    `select ${SELECT_COLS} from content.ideas where id = $1`,
    [id],
  );
}

export async function listAllTags(): Promise<string[]> {
  const rows = await query<{ tag: string }>(
    `select distinct unnest(tags) as tag
     from content.ideas
     where coalesce(array_length(tags, 1), 0) > 0
     order by tag asc
     limit 200`,
  );
  return rows.map((r) => r.tag);
}

export async function getSections(ideaId: string): Promise<VideoSection[]> {
  return query<VideoSection>(
    `select id, idea_id, section_type, content, order_idx
     from content.video_sections
     where idea_id = $1
     order by order_idx asc, section_type asc`,
    [ideaId],
  );
}

export async function getBroll(ideaId: string): Promise<BrollIdea[]> {
  return query<BrollIdea>(
    `select id, idea_id, description, ref_url
     from content.broll_ideas
     where idea_id = $1
     order by id asc`,
    [ideaId],
  );
}

export async function getAssets(ideaId: string): Promise<Asset[]> {
  return query<Asset>(
    `select id, idea_id, kind, description, order_idx
     from content.assets
     where idea_id = $1
     order by order_idx asc`,
    [ideaId],
  );
}
