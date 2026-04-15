# Competitor Intelligence System

**Tier:** 2 (premium)
**Price:** 49€
**Status:** 🟢 ready
**Languages:** FR (primary), EN

## What it is
A complete competitor monitoring system: scrape competitors daily across Instagram, TikTok, YouTube, LinkedIn with Apify + YouTube API, store history in Supabase, and get a strategic weekly report written by Claude delivered via Gmail every Monday morning.

Productised (sanitized) version of a real production pipeline running for a B2B client.

## What's in this folder

```
competitor-intel/
├── README.md                          ← this file
├── delivery/
│   ├── workflows/
│   │   ├── 01-instagram-collector.json
│   │   ├── 02-tiktok-collector.json
│   │   ├── 03-youtube-collector.json
│   │   ├── 04-linkedin-collector.json
│   │   └── 05-weekly-report-generator.json
│   ├── supabase-schema.sql            ← 3 tables (competitors, competitor_handles, channel_metrics)
│   ├── playbook-fr.md                 ← full manual (FR)
│   ├── playbook-en.md                 ← full manual (EN)
│   ├── guide-fr.md                    ← 2h quick-start (FR)
│   ├── guide-en.md                    ← 2h quick-start (EN)
│   └── cover.svg                      ← 1200×1200 Taiyka cover
├── copy/
│   ├── sales-fr.md                    ← landing + post-purchase email (FR)
│   └── sales-en.md                    ← landing + post-purchase email (EN)
└── source/                            ← (unused — all deliverables sanitized from internal source)
```

## Stack
- **n8n** — orchestrator (5 workflows, daily crons + Monday report)
- **Apify** — Instagram, TikTok, LinkedIn scrapers
- **YouTube Data API v3** — official stats (free)
- **Supabase** — Postgres history (free tier OK for 2+ years)
- **Anthropic Claude** — weekly analysis (claude-sonnet-4-5)
- **Gmail (n8n native node)** — report delivery

## Next-tier CTA
Inside playbook + post-purchase email → **Skool community** (advanced pipeline, real-time alerting, calibrated prompts) + cross-sell to Cold Outreach Pack (19€) and AI Agent Playbook (29€).

## Sanitization checklist (done)
All workflows and docs are stripped of: real Supabase project refs, real Apify tokens, real Anthropic keys, real YouTube keys, real competitor names/handles, real emails. Placeholders follow `PASTE_YOUR_*_HERE` convention.
