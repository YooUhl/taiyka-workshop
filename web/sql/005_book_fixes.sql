-- AUDIT-BOOK-V3 follow-up migration.
--
-- Run against the dedicated /book Supabase project (BOOK_DATABASE_URL).
--
-- Changes:
--   * Tighten project_description CHECK to match route validation (20-2000)
--   * Drop UNIQUE(email,source) — app-level idempotency now handles repeat
--     submissions, and the constraint blocked legitimate returning users.
--   * Add lower(email) index so case-insensitive lookup is cheap.
--   * Add book.bookings table (Calendly webhook source-of-truth).

-- 1. Tighten project_description CHECK
alter table book.qualifications
  drop constraint if exists qualifications_project_description_check;

alter table book.qualifications
  add constraint qualifications_project_description_check
  check (char_length(project_description) between 20 and 2000);

-- 1b. Relax role + project_type CHECK to accept new audience-tightened keys
--     (old rows keep their original keys; new rows use the new set)
alter table book.qualifications
  drop constraint if exists qualifications_role_check;
alter table book.qualifications
  add constraint qualifications_role_check
  check (role in ('founder','freelance','early','other','business_owner','employee','student'));

alter table book.qualifications
  drop constraint if exists qualifications_project_type_check;
alter table book.qualifications
  add constraint qualifications_project_type_check
  check (project_type in ('business','side_project','partnership','personal','collab'));

-- 1c. Tighten name + location CHECK to match new validator (NAME_MIN=2, LOCATION_MIN=3)
alter table book.qualifications
  drop constraint if exists qualifications_name_check;
alter table book.qualifications
  add constraint qualifications_name_check
  check (char_length(name) between 2 and 120);

alter table book.qualifications
  drop constraint if exists qualifications_location_check;
alter table book.qualifications
  add constraint qualifications_location_check
  check (char_length(location) between 3 and 200);

-- 1d. Tighten email CHECK to match new validator (EMAIL_MIN=5)
alter table book.qualifications
  drop constraint if exists qualifications_email_check;
alter table book.qualifications
  add constraint qualifications_email_check
  check (char_length(email) between 5 and 320);

-- 2. Drop the brittle uniqueness constraint
alter table book.qualifications
  drop constraint if exists qualifications_email_source_unique;

-- 3. Case-insensitive email index
create index if not exists qualifications_email_lower_idx
  on book.qualifications ((lower(email)));

-- 4. Calendly webhook target — bookings live here
create table if not exists book.bookings (
  event_uri        text         primary key,
  invitee_uri      text,
  invitee_email    text         not null,
  invitee_name     text,
  status           text         not null  check (status in ('scheduled','canceled','rescheduled')),
  scheduled_at     timestamptz,
  canceled_at      timestamptz,
  reschedule_uri   text,
  raw_payload      jsonb        not null,
  qualification_id uuid         references book.qualifications(id) on delete set null,
  created_at       timestamptz  not null default now(),
  updated_at       timestamptz  not null default now()
);

create index if not exists bookings_invitee_email_idx
  on book.bookings ((lower(invitee_email)));
create index if not exists bookings_scheduled_at_idx
  on book.bookings (scheduled_at);

-- 5. Touch updated_at on UPSERT for bookings
create or replace function book.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists bookings_touch_updated_at on book.bookings;
create trigger bookings_touch_updated_at
  before update on book.bookings
  for each row execute function book.touch_updated_at();
