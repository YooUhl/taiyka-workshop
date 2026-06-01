-- App 2 — Calisthenics Skill Tree
-- Run once in Supabase SQL editor for project taiyka-tools.
-- Prereq: schema "calisthenics" already created in S3 + added to Exposed schemas
-- in Dashboard → Settings → API. RLS stays OFF for v1 (secret-gated at the edge).

create schema if not exists calisthenics;

create table if not exists calisthenics.skills (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  name                text not null,
  category            text not null check (category in ('push','pull','core','legs','static','dynamic')),
  tier                int  not null check (tier between 1 and 10),
  description         text not null default '',
  prerequisites       jsonb not null default '[]'::jsonb,
  mastery_conditions  jsonb not null default '[]'::jsonb,
  created_at          timestamptz not null default now()
);
create index if not exists skills_category_tier_idx on calisthenics.skills (category, tier);
create index if not exists skills_slug_idx          on calisthenics.skills (slug);

create table if not exists calisthenics.user_progress (
  id           uuid primary key default gen_random_uuid(),
  skill_id     uuid not null references calisthenics.skills(id) on delete cascade unique,
  status       text not null default 'locked' check (status in ('locked','unlocked','practicing','mastered')),
  notes        text default '',
  mastered_at  timestamptz,
  attempts     jsonb not null default '[]'::jsonb,
  updated_at   timestamptz not null default now()
);
create index if not exists user_progress_status_idx on calisthenics.user_progress (status);

create or replace function calisthenics.touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end $$ language plpgsql;

drop trigger if exists user_progress_touch on calisthenics.user_progress;
create trigger user_progress_touch before update on calisthenics.user_progress
  for each row execute procedure calisthenics.touch_updated_at();

-- Manual 3-skill seed used during build/test.
insert into calisthenics.skills (slug, name, category, tier, description, prerequisites, mastery_conditions) values
('pushup',         'Push-up',         'push',   1, 'Standard push-up.',       '[]'::jsonb,
   '[{"type":"reps","value":20,"label":"20 clean reps"}]'::jsonb),
('diamond-pushup', 'Diamond Push-up', 'push',   2, 'Hands in diamond shape.', '["pushup"]'::jsonb,
   '[{"type":"reps","value":15,"label":"15 clean reps"}]'::jsonb),
('planche-lean',   'Planche Lean',    'static', 3, 'Lean forward in plank.',  '["diamond-pushup"]'::jsonb,
   '[{"type":"hold_seconds","value":20,"label":"20s hold"}]'::jsonb)
on conflict (slug) do nothing;
