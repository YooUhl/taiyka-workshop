-- Rollback for 003_book.sql. Drops the table + schema. Run via DATABASE_URL.
drop table if exists book.qualifications;
drop schema if exists book;
