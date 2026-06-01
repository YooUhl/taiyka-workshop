-- 002_content_upgrades.sql
-- Adds metadata + production-tracking columns to content.ideas.
-- Idempotent. Run once in Supabase SQL editor.

alter table content.ideas
  add column if not exists tags            text[]      not null default '{}',
  add column if not exists pillar          text,
  add column if not exists scheduled_for   timestamptz,
  add column if not exists priority        text        not null default 'medium',
  add column if not exists inspiration_url text;

-- Defensive: any pre-existing NULLs from older rows pre-default.
update content.ideas set tags = '{}'     where tags is null;
update content.ideas set priority = 'medium' where priority is null;

-- Indexes for new filterable / sortable fields.
create index if not exists ideas_scheduled_for_idx on content.ideas (scheduled_for);
create index if not exists ideas_priority_idx      on content.ideas (priority);
create index if not exists ideas_pillar_idx        on content.ideas (pillar);
create index if not exists ideas_tags_gin_idx      on content.ideas using gin (tags);
