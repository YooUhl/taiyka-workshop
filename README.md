# Taiyka Digital Products

Funnel: **Social → Hub → Free → 10-25€ → 25-50€ → Skool**

See [CLAUDE.md](CLAUDE.md) for full project rules and reusable assets index.
See [MORNING-CHECKLIST.md](MORNING-CHECKLIST.md) for the next steps you (Manu) need to do manually.
Approved plan: `C:/Users/yoanu/.claude/plans/quiet-stirring-goose.md`

---

## Status snapshot

**🟢 All 8 products built. Site compiles. Print-ready HTML guides + ZIP bundles ready.**

| Tier | Product | Slug | Price | Status | ZIP |
|---|---|---|---|---|---|
| 0 | 5 n8n Workflows pour Entrepreneurs IA | [free-n8n-pack](products/free-n8n-pack/) | Free | 🟢 ready | ✅ |
| 0 | Claude Code Starter Pack | [free-claude-starter](products/free-claude-starter/) | Free | 🟢 ready | ✅ |
| 1 | n8n Pack: Cold Outreach | [cold-outreach-pack](products/cold-outreach-pack/) | 19€ | 🟢 ready | ✅ |
| 1 | Notion: Solopreneur AI Stack (spec) | [notion-ai-stack](products/notion-ai-stack/) | 15€ | 🟢 ready | ✅ |
| 1 | 50 Prompts pour Automatiser ton Business | [prompt-pack-50](products/prompt-pack-50/) | 12€ | 🟢 ready | ✅ |
| 2 | Competitor Intelligence System | [competitor-intel](products/competitor-intel/) | 49€ | 🟢 ready | ✅ |
| 2 | Client Acquisition Bundle | [client-acquisition-bundle](products/client-acquisition-bundle/) | 39€ | 🟢 ready | ✅ |
| 2 | Build Your First AI Agent | [ai-agent-playbook](products/ai-agent-playbook/) | 29€ | 🟢 ready | ✅ |
| 3 | Skool community | — | TBD | 🟡 to launch | — |

Each product folder contains:
- `delivery/` — workflows (`.json`), guides (`.md` source + `.html` print-ready), cover SVG, all bundled assets
- `delivery/<slug>.zip` — packaged buyer bundle
- `copy/sales-{fr,en}.md` + `.html` — landing page hero, bullets, social variants, post-purchase email
- `README.md` — internal product spec

---

## Web

[`web/`](web/) — Next.js 16 + Tailwind v4 + shadcn/ui (App Router, React 19, TypeScript)

Routes:
- `/` — linktree-style hub
- `/products` — 3-tier product grid + Skool CTA
- `/portfolio` — 4 portfolio cards with embedded SVG diagrams
- `/free-n8n-pack` — lead magnet landing with email capture form

Run locally: `cd web && npm run dev` → http://localhost:3000

Lang toggle: append `?lang=en` to any route (default FR).

Email form requires `NEXT_PUBLIC_LEADMAGNET_WEBHOOK_URL` env var. See [`web/.env.local.example`](web/.env.local.example).

---

## Folders

- [products/](products/) — 8 product packages
- [web/](web/) — Next.js site
- [brand/](brand/) — logo placeholder, color/typography tokens (`tokens.json`)
- [funnel/](funnel/) — n8n workflows for email delivery automation
- [portfolio/](portfolio/) — 4 portfolio project READMEs + SVG diagrams (consumed by `web/app/portfolio/`)
- [tools/](tools/) — helper scripts (`md-to-html.js` regenerates all HTML guides)

---

## Sanitization audit

✅ All `delivery/` and `copy/` files swept clean: no real API keys, JWT tokens, Apify tokens, Google Maps keys, real emails, real Spreadsheet IDs, real client names, or Manu's SIRET/personal address. All placeholders use `PASTE_YOUR_X_HERE` convention.

`source/` folders contain originals (kept locally for reference) — these are NEVER shipped.
