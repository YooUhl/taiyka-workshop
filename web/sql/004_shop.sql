-- /shop waitlist storage
--
-- IMPORTANT: run this against the DEDICATED /book Supabase project,
-- the one whose connection string is set in BOOK_DATABASE_URL (web/.env.local).
-- /shop reuses that physical project but lives in its own `shop` schema —
-- isolated from `book.qualifications` and from /tools/* (Outreach Machine).
--
-- RLS stays OFF. Inserts only via server-side route /api/shop/waitlist
-- using the same BOOK_DATABASE_URL pool (web/lib/shop/db.ts).

create schema if not exists shop;

create table if not exists shop.waitlist (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null    default now(),
  email       text        not null    check (char_length(email) between 1 and 320),
  lang        text        not null    check (lang in ('fr','en')),
  source      text        not null    default 'shop',
  ip          text,
  user_agent  text,
  unique (email, source)
);

create index if not exists shop_waitlist_created_at_idx on shop.waitlist (created_at desc);
create index if not exists shop_waitlist_email_idx      on shop.waitlist (email);
