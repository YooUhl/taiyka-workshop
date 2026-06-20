-- IMPORTANT: run against DATABASE_URL (web/.env.local), NOT the MCP server's
-- default connection. The MCP default may point at a different Supabase project.
-- Use mcp__supabase__pg_execute_sql with explicit connectionString=$DATABASE_URL.
-- /book qualification + booking flow
-- Run once via mcp__supabase__pg_execute_sql or pgAdmin against the same project as /tools/*.
-- Schema isolation: keeps these rows out of `calisthenics` and `content` schemas.
-- RLS stays OFF — inserts only via server-side route /api/book using DATABASE_URL pool.

create schema if not exists book;

create table if not exists book.qualifications (
  id                   uuid        primary key default gen_random_uuid(),
  created_at           timestamptz not null    default now(),
  lang                 text        not null    check (lang in ('fr','en')),
  role                 text        not null    check (role in ('business_owner','employee','student','other')),
  project_type         text        not null    check (project_type in ('business','personal','collab')),
  project_description  text        not null    check (char_length(project_description) between 1 and 2000),
  name                 text        not null    check (char_length(name) between 1 and 120),
  email                text        not null    check (char_length(email) between 1 and 320),
  location             text        not null    check (char_length(location) between 1 and 200),
  user_agent           text,
  source               text                    default 'home-book-button'
);

create index if not exists qualifications_created_at_idx on book.qualifications (created_at desc);
create index if not exists qualifications_email_idx      on book.qualifications (email);

alter table book.qualifications
  add constraint qualifications_email_source_unique unique (email, source);
