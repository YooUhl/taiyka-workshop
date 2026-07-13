-- Le Brief — daily AI-news newsletter storage
--
-- IMPORTANT: run this against the DEDICATED /book Supabase project,
-- the one whose connection string is set in BOOK_DATABASE_URL (web/.env.local).
-- Le Brief reuses that physical project but lives in its own `brief` schema —
-- isolated from `book.qualifications`, `shop.waitlist`, and /tools/*.
--
-- RLS stays OFF. All writes go through server-side routes under /api/brief/*
-- using the BOOK_DATABASE_URL pool (web/lib/brief/db.ts). The n8n daily pipeline
-- reads brief.subscribers (status='active') and logs to brief.issues over the
-- same Postgres connection.

create schema if not exists brief;

-- Subscribers. Double-opt-in: signup writes status='pending' + a secret token,
-- the confirm link flips it to 'active', the unsubscribe link flips it to
-- 'unsubscribed'. The single `token` (uuid) is the secret for BOTH the confirm
-- and unsubscribe links so neither is guessable from the email alone.
create table if not exists brief.subscribers (
  id              uuid        primary key default gen_random_uuid(),
  created_at      timestamptz not null    default now(),
  email           text        not null    unique check (char_length(email) between 1 and 320),
  status          text        not null    default 'pending' check (status in ('pending','active','unsubscribed')),
  lang            text        not null    default 'fr'      check (lang in ('fr','en')),
  token           uuid        not null    default gen_random_uuid(),
  source          text        not null    default 'brief-landing',
  ip              text,
  user_agent      text,
  confirmed_at    timestamptz,
  unsubscribed_at timestamptz
);

create index if not exists brief_subscribers_status_idx on brief.subscribers (status);
create index if not exists brief_subscribers_token_idx  on brief.subscribers (token);

-- One row per daily issue the pipeline attempts. `status` records whether the
-- issue actually went out ('sent'), was held because too few stories passed the
-- theme filter ('held-no-stories'), or errored ('error').
create table if not exists brief.issues (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz not null    default now(),
  issue_date   date        not null,
  story_count  int         not null    default 0,
  sent_count   int         not null    default 0,
  status       text        not null    default 'sent' check (status in ('sent','held-no-stories','error')),
  note         text
);

create index if not exists brief_issues_date_idx on brief.issues (issue_date desc);
