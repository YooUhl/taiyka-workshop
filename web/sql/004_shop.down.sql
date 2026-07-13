-- Rollback for 004_shop.sql. Drops the table + schema. Run via BOOK_DATABASE_URL.
drop table if exists shop.waitlist;
drop schema if exists shop;
