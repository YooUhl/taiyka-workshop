# Digital Products Project — Taiyka

Project-specific instructions. Inherits all global rules from `C:/Users/yoanu/.claude/CLAUDE.md`.

---

## What This Project Is

A digital products ecosystem for **Taiyka / @manu_ai.to** that funnels social audience (IG + FB + LinkedIn) → free lead magnets → paid products → **Skool community** (recurring).

**Niche:** AI automation hub — n8n workflows, Claude skills, AI agent systems, automation playbooks.
**Audience:** Bilingual, **FR primary**, EN secondary. French-speaking entrepreneurs interested in AI/automation.
**Approved plan:** `C:/Users/yoanu/.claude/plans/quiet-stirring-goose.md` — read this for full strategy and sprint breakdown.

---

## Funnel Architecture

```
Social → Linktree-style hub → Free lead magnet → 10-25€ product → 25-50€ product → Skool community
```

- **Free** = email capture only
- **10-25€** = entry product, builds buyer trust
- **25-50€** = premium product, qualified buyer
- **Skool** = recurring monthly subscription, end goal

Every product must include a CTA toward the next tier.

---

## Product Catalog

### Tier 0 — Free (lead magnets)
- `free-n8n-pack/` — "5 n8n Workflows pour Entrepreneurs IA" (PDF + .json) — FR + EN
- `free-claude-starter/` — "Claude Code Starter Pack" (skill bundle .md)

### Tier 1 — Entry (10-25€, prices placeholder, refine later)
- `cold-outreach-pack/` — n8n workflow pack (~19€)
- `notion-ai-stack/` — Notion dashboard for solopreneurs (~15€)
- `prompt-pack-50/` — 50 automation prompts (~12€)

### Tier 2 — Premium (25-50€, prices placeholder, refine later)
- `competitor-intel/` — Competitor Intelligence System (~49€)
- `client-acquisition-bundle/` — Contracts + Proposals + Invoices FR/EN (~39€)
- `ai-agent-playbook/` — "Build Your First AI Agent" (~29€)

### Tier 3 — Skool (recurring)
- Pricing TBD (29-49€/mo range under consideration)

---

## File Conventions

```
Digital Products Project/
├── CLAUDE.md                  ← this file
├── README.md                  ← product index + status (draft / live / archived)
├── products/                  ← one folder per product
│   └── <product-slug>/
│       ├── source/            ← raw deliverables (.json, .md, .pdf source, etc.)
│       ├── delivery/          ← final shippable bundle
│       ├── copy/
│       │   ├── sales-fr.md    ← FR sales page copy
│       │   └── sales-en.md    ← EN sales page copy
│       └── README.md          ← product spec, price, status
├── web/                       ← Next.js site (hub + /products + /portfolio)
├── brand/                     ← logo, color tokens, fonts
└── funnel/                    ← n8n workflows for email delivery + sequences
```

**Naming:** kebab-case folders, slugs match Gumroad product URLs.
**Bilingual:** every customer-facing asset must exist in both `-fr` and `-en` versions. FR is default.

---

## Reusable Assets — Use, Don't Rebuild

These exist already. Always check before creating new.

| Need | Use |
|---|---|
| Brand voice / sales copy tone | `c:/Users/yoanu/Documents/Claude code/content-creator/style-guide.md` |
| Buyer persona | `c:/Users/yoanu/Documents/Claude code/content-creator/audience-persona.md` |
| Portfolio diagrams | `Main-house/skills/excalidrawer.md` (Excalidraw skill) |
| Sales/social copy generation | `Main-house/skills/content-creator.md` |
| Contract / proposal / invoice product source | `Scripts and Skills/scripts/{contract,proposal,invoice}-builder/` |
| Cold outreach product source | `Outreach Machine/` (n8n workflows + prompts) |
| Competitor intel product source | `Polymaker-project/` (sanitize before shipping) |
| Free Claude skills bundle source | `Main-house/skills/` (content-creator, morning-planner, excalidrawer) |
| Credentials (Anthropic, Apify, n8n, Gmail) | `C:/Users/yoanu/.config/global.env` |

---

## Web Stack

- **Frontend:** Next.js + TypeScript + Tailwind + shadcn/ui
- **Hosting:** Vercel
- **Checkout:** Gumroad (Tier 1/2 fulfillment) — embed buy buttons, don't build payment ourselves
- **Community:** Skool (handles its own subscription)
- **Email/automation:** n8n (use existing global.env credentials)

**Three routes in one Next.js app:**
- `/` — linktree-style hub (mobile-first, dark Taiyka brand, used as social bio link)
- `/products` — mini landing with 3-tier product grid + Skool CTA
- `/portfolio` — visual portfolio cards (Polymaker, UFC, content system, lead-gen)

---

## Brand Rules

- **Colors:** Electric Blue `#00A6FF` / Cyan `#00E5FF` / Navy `#0A1628` / White `#FFFFFF`
- **Logo:** electric blue glowing gear on near-black background (existing brand identity)
- **Voice:** confident, direct, slightly provocative, grounded in real outcomes — "done is better than perfect" (per `content-creator/style-guide.md`)
- **Emoji:** functional only, max 1-2 per surface
- **Portfolio:** sanitize all client data before publishing — cross-check NDAs (Polymaker especially)

---

## Working Rules for This Project

- Every product is a **package of existing work**, not built from scratch — always check the reusable assets table above first
- Sales copy must follow Manu's documented voice — load `content-creator/style-guide.md` before writing
- Bilingual is non-negotiable: no product ships without FR + EN versions
- Don't invent prices — stick to the agreed brackets (free / 10-25€ / max 50€). Specific prices to refine with Manu
- Before scaffolding the Next.js app or any major work, confirm scope with Manu (per global rule: show plan first)

---

## Status

- **Phase:** All 8 products built (🟢 ready). Next.js site scaffolded + content-wired (hub + products + portfolio + free-n8n-pack landing). Email capture form + funnel n8n delivery workflow ready. Print-ready HTML versions of every guide. ZIP bundles per product.
- **Next:** Manu's manual steps — see [MORNING-CHECKLIST.md](MORNING-CHECKLIST.md). Top blockers: rotate leaked credentials, host ZIPs publicly, set up Gumroad + Skool, deploy to Vercel.
- **Approved plan:** `C:/Users/yoanu/.claude/plans/quiet-stirring-goose.md`

## Conventions established during build
- Bilingual files use `-fr` / `-en` suffix (e.g. `guide-fr.md`, `sales-en.md`). FR is the default.
- Sanitization placeholder pattern: `PASTE_YOUR_X_HERE` (e.g. `PASTE_YOUR_HUNTER_API_KEY_HERE`)
- Cover SVGs are 1200×1200 with brand gradient `#0A1628 → #000000` background and `#00A6FF → #00E5FF` accent
- Per-product folder layout: `delivery/` (shippable assets + ZIP) + `copy/` (sales copy) + `README.md` (internal)
- Site reads product/portfolio metadata at request time from sibling Markdown files via Node `fs.readFileSync` in `web/lib/products.ts` and `web/lib/portfolio.ts`
- Lang toggle: `?lang=en` URL search param (server component reads from `searchParams`)
- HTML guides: regenerate any time via `node tools/md-to-html.js` from project root
