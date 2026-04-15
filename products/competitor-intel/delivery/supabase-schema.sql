-- Competitor Intelligence System — Supabase Schema
-- Run this in the Supabase SQL editor (Database → SQL → New query).
-- All workflows in the pack assume these three tables exist.

-- =========================================================
-- 1. competitors
-- One row per brand / company / person you track.
-- =========================================================
create table if not exists public.competitors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  notes text,
  created_at timestamptz not null default now()
);

-- =========================================================
-- 2. competitor_handles
-- One row per (competitor, platform) pair.
-- A competitor can have multiple handles (IG + TikTok + YouTube + LinkedIn).
-- Workflows filter by status='approved' so you can stage handles before tracking.
-- =========================================================
create table if not exists public.competitor_handles (
  id uuid primary key default gen_random_uuid(),
  competitor_id uuid not null references public.competitors(id) on delete cascade,
  platform text not null check (platform in ('instagram', 'tiktok', 'youtube', 'linkedin', 'facebook', 'twitter')),
  handle text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'paused', 'rejected')),
  metadata jsonb default '{}'::jsonb, -- e.g. { "channel_id": "UCxxx" } for YouTube, { "url": "https://..." } for LinkedIn
  created_at timestamptz not null default now(),
  unique (competitor_id, platform, handle)
);

create index if not exists idx_competitor_handles_platform_status
  on public.competitor_handles (platform, status);

-- =========================================================
-- 3. channel_metrics
-- One row per (handle, day). Upserted by the daily collector workflows.
-- The weekly report reads the last 14 days from here.
-- =========================================================
create table if not exists public.channel_metrics (
  id bigserial primary key,
  handle_id uuid not null references public.competitor_handles(id) on delete cascade,
  competitor_id uuid not null references public.competitors(id) on delete cascade,
  platform text not null,
  date date not null,
  followers bigint,
  total_posts bigint,
  total_views bigint,
  employee_count bigint, -- LinkedIn only; null for other platforms
  source text not null,  -- e.g. 'apify_instagram', 'youtube_api'
  created_at timestamptz not null default now(),
  unique (handle_id, date)
);

create index if not exists idx_channel_metrics_date on public.channel_metrics (date desc);
create index if not exists idx_channel_metrics_handle_date on public.channel_metrics (handle_id, date desc);

-- =========================================================
-- Seed example — replace with your own competitors and handles.
-- =========================================================
-- insert into public.competitors (name) values ('Example Brand A'), ('Example Brand B');
-- insert into public.competitor_handles (competitor_id, platform, handle, status, metadata)
--   select id, 'instagram', 'example_brand_a', 'approved', '{}'::jsonb from public.competitors where name = 'Example Brand A'
--   union all
--   select id, 'youtube', 'ExampleBrandA', 'approved', '{"channel_id":"UCxxxxxxxxxxxxxxxxxxxxxx"}'::jsonb from public.competitors where name = 'Example Brand A';
