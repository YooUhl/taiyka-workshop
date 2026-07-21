-- Rollback for 007_brief_hardening.sql

alter table brief.subscribers disable row level security;
alter table brief.issues      disable row level security;
alter table brief.rate_limit  disable row level security;

drop table if exists brief.rate_limit;

alter table brief.subscribers drop column if exists consent_version;

alter table brief.subscribers drop constraint if exists subscribers_status_check;
alter table brief.subscribers
  add constraint subscribers_status_check
  check (status in ('pending','active','unsubscribed'));

alter table brief.issues drop column if exists resend_ids;
alter table brief.issues drop column if exists content;
alter table brief.issues drop column if exists subject;
alter table brief.issues drop column if exists sent_urls;

drop index if exists brief.brief_issues_sent_date_uq;
