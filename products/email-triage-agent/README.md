# Email Triage Agent

**Tier:** 0 (free — Skool community welcome gift)
**Target price:** Free (Skool member exclusive)
**Status:** 🟢 ready
**Languages:** FR (primary), EN

## What it is
A ready-to-import n8n workflow that runs every morning at 8h, scans the user's Gmail inbox over the last 24h, asks Claude to classify each email into one of 4 categories (`client`, `prospect`, `admin`, `junk`) with a priority score 1-3, and sends a clean HTML digest back to the user's own inbox. Member just imports the JSON, plugs in two credentials, and it runs daily on autopilot.

It's the exact first agent Manu sold in freelance — 250€/mo recurring per client. Same workflow, free, dropped on day 1 in the Skool to set the bar: this is the level we build at.

## Source material
- Manu's personal Gmail triage habit (own inbox, French + EN mix)
- Reference launch post: `_build/skool-launch-kit/launch-posts.md` (post #7 — "Cadeau de bienvenue")
- Architecture pattern: `products/prospect-audit-funnel/source/n8n-workflow.json` (same sanitization + node naming style)

## Bundled assets
1. **n8n-workflow.json** — full importable workflow with sanitized credentials
2. **setup-guide.md** — FR step-by-step install (15-30 min, zero n8n experience required)

## Workflow architecture
```
Schedule (8h daily) → Config → Gmail search (newer_than:1d) → Normalize emails
→ Build Claude batch prompt → Call Claude (claude-haiku-4-5) → Parse + group
→ Format HTML digest → Gmail send (to self)
```

## Deliverables
- [x] n8n workflow JSON (`n8n-workflow.json`)
- [x] Setup guide FR (`setup-guide.md`)
- [ ] Setup guide EN (translation pending — FR ships first as default per project convention)
- [ ] Cover SVG (1200×1200, brand gradient — optional, not blocking for free drop)
- [ ] Loom demo (Manu records once, links in setup guide)

## Cost to the member
- n8n: free tier sufficient (1 run/day, ~7 nodes per execution)
- Anthropic API: ~$0.0005 per email triaged using `claude-haiku-4-5` (batched 25/call) → $5 credit covers ~10,000 emails ≈ several months of daily use for a normal inbox
- Gmail: free

## Next-tier CTA
End of setup guide → *"Want more agents like this? Skool members get one new workflow per month, a private build channel, and weekly live troubleshooting calls. Join the community →"* (links to Skool community / pricing page)
