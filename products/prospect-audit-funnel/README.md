# Smart Prospect Audit Funnel

**Tier:** 2 (premium)
**Target price:** 49€
**Status:** 🟢 ready
**Languages:** FR (primary), EN

## What it is
A complete B2B prospect qualification funnel for AI/automation agency owners. Prospect fills a 14-question audit form → n8n + Claude generate a tailored list of automation solutions on the spot → CTA pushes them to your Calendly → you get a PDF-style email debrief in your inbox before the call. Sold as a plug-and-play template: import the workflow, wire 5 credentials, customize the prompt to your vertical, ship.

## Source material
- Manu's internal Taiyka lead-qualification flow (sanitized)
- `Outreach Machine/` — Claude-driven HTTP pattern reused for the qualification step
- `Polymaker-project/` — Google Sheets logging pattern reused for the prospect ledger

## Bundled assets
- 1 n8n workflow (`prospect-audit-funnel.json`) — webhook → normalize → Claude → Sheets log → Gmail debrief → response
- 1 Claude system prompt template (vertical-agnostic, customizable in 5 min)
- 1 standalone HTML audit form (14 questions, Tailwind via CDN)
- Setup guide FR + EN — agency-owner-to-agency-owner docs
- Sales copy FR + EN
- Cover SVG (1200×1200)

## Deliverables
- [x] Full n8n workflow — `source/n8n-workflow.json`
- [x] Claude prompt template + example I/O — `source/claude-prompt-template.md`
- [x] Audit form (HTML) — `source/audit-form-template.html`
- [x] Setup guide FR — `delivery/setup-guide-fr.md`
- [x] Setup guide EN — `delivery/setup-guide-en.md`
- [x] Sales copy FR — `copy/sales-fr.md`
- [x] Sales copy EN — `copy/sales-en.md`
- [x] Cover SVG (1200×1200) — `delivery/cover.svg`
- [ ] Demo Loom video (manual step)
- [ ] Gumroad listing (manual step)

## Next-tier CTA
End of setup guide + post-purchase email → "Get a new lead-gen system every month + live reviews of your funnel" → Skool community
