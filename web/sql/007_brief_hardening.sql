-- Le Brief — launch-hardening migration (P0/P1/P2 audit fixes)
--
-- Run against the same DEDICATED /book Supabase project as 006_brief.sql
-- (BOOK_DATABASE_URL). Additive + idempotent; safe to re-run.
--
-- Covers audit IDs: P0-4 (idempotency), P1-3/P2-3 (dedup + audit columns),
-- P1-5 (bounce/complaint statuses), P1-6 (durable rate limit), P3-5 (RLS
-- deny-all), P3-8 (consent version).

-- ---------------------------------------------------------------------------
-- P0-4 — one 'sent' issue per calendar day. Blocks a re-run / accidental
-- manual execution from writing a second 'sent' row (duplicate broadcast).
-- Partial: 'held-no-stories' and 'error' rows are still allowed to repeat.
create unique index if not exists brief_issues_sent_date_uq
  on brief.issues (issue_date)
  where status = 'sent';

-- ---------------------------------------------------------------------------
-- P1-3 / P2-3 — turn brief.issues into a real audit log + dedup source.
--   sent_urls : URLs shipped in this issue, so the next run can filter repeats
--   subject   : the exact subject line that went out
--   content   : full rendered payload (featured + quickhits) for archive
--   resend_ids: Resend message ids returned by the batch send
alter table brief.issues add column if not exists sent_urls  jsonb not null default '[]'::jsonb;
alter table brief.issues add column if not exists subject    text;
alter table brief.issues add column if not exists content    jsonb;
alter table brief.issues add column if not exists resend_ids jsonb;

-- ---------------------------------------------------------------------------
-- P1-5 — bounce / complaint suppression. Hard-bounced and spam-complaining
-- addresses must stop receiving issues (protects domain reputation). The
-- Resend webhook route flips them here; the pipeline only sends to 'active'.
alter table brief.subscribers drop constraint if exists subscribers_status_check;
alter table brief.subscribers
  add constraint subscribers_status_check
  check (status in ('pending','active','unsubscribed','bounced','complained'));

-- ---------------------------------------------------------------------------
-- P3-8 — record which consent wording the subscriber agreed to (CNIL proof).
alter table brief.subscribers add column if not exists consent_version text;

-- ---------------------------------------------------------------------------
-- P1-6 — durable, cross-instance rate limit for /api/brief/subscribe. The old
-- in-memory Map reset per Vercel serverless instance (near useless). Fixed
-- 60s window, counter per key ('brief:<ip>').
create table if not exists brief.rate_limit (
  key          text        primary key,
  window_start timestamptz not null default now(),
  count        int         not null default 0
);

-- ---------------------------------------------------------------------------
-- P3-5 — RLS deny-all as belt-and-suspenders. The server pool connects as the
-- table owner and BYPASSES RLS, so routes keep working. This only matters if
-- the `brief` schema were ever exposed to PostgREST with the (leaked) anon key:
-- with RLS on and no policies, anon/authenticated get nothing.
alter table brief.subscribers enable row level security;
alter table brief.issues      enable row level security;
alter table brief.rate_limit  enable row level security;

revoke all on brief.subscribers from anon, authenticated;
revoke all on brief.issues      from anon, authenticated;
revoke all on brief.rate_limit  from anon, authenticated;
