-- Rollback for 006_brief.sql. Drops the whole brief schema.
-- Irreversible: deletes the subscriber list. Only run intentionally.
drop schema if exists brief cascade;
