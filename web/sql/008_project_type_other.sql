-- Add the "other" option to question 2 of /book ("C'est pour quel projet ?").
--
-- Run against the /book Supabase project (BOOK_DATABASE_URL).
--
-- Without this, any qualification submitted with project_type = 'other'
-- is rejected by the CHECK constraint and the booking fails.
-- Old keys ('personal','collab') stay allowed so existing rows remain valid.

alter table book.qualifications
  drop constraint if exists qualifications_project_type_check;

alter table book.qualifications
  add constraint qualifications_project_type_check
  check (project_type in ('business','side_project','partnership','other','personal','collab'));
