# n8n Pack: Cold Outreach

**Tier:** 1 (entry)
**Target price:** 19€
**Status:** 🟢 ready
**Languages:** FR (primary), EN

## What it is
Complete Google Maps → email finder → AI-drafted icebreaker → Gmail send pipeline as 4 importable n8n workflows + bilingual setup guide.

## Source material
- `Outreach Machine/` (project context + voice reference)
- `Main-house/n8n-workflows/` (Lead Machine workflows — reused + sanitized)
- `free-n8n-pack/` (sanitized base for Workflows 1 & 2)

## Deliverables
- [x] n8n `.json` workflows (sanitized, 4 files)
- [x] Setup guide FR + EN — prerequisites, per-workflow setup, troubleshooting, going further
- [x] Sales copy FR + EN (hero, bullets, variants, post-purchase email)
- [x] Cover SVG (Taiyka-branded, 1200×1200)
- [ ] Demo Loom video
- [ ] Gumroad listing

## Pipeline
```
Workflow 1 (Google Maps) → Workflow 2 (Email Finder) → Workflow 3 (Claude Icebreaker) → Workflow 4 (Gmail Send with dry-run + approval gate)
```

All 4 workflows read/write the same Google Sheet (single source of truth).

## Next-tier CTA
Inside guide → Tier 2 (Build Your First AI Agent, 29€) + Skool community.
