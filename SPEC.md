# SPEC: Le Brief — automated daily French AI-news digest (lead magnet)

> Drafted: 2026-07-11 via spec-interview skill. Implementation should happen in a separate session — open a new Claude Code session pointed at this file and execute. This is a **complete rework from scratch**: both existing "Le Brief" code trees get burned down first (see Burn-down).

## Feature

An automated **daily French** AI-news newsletter, "Le Brief". Every morning a pipeline pulls AI news, keeps only stories inside a fixed set of Manu-chosen themes, and sends a short "minimal-links" digest to subscribers. Pitch to the audience: *"Want access to the AI info I find relevant? Subscribe."* It is a **lead magnet** for the Taiyka funnel, feeding the Skool community.

## Why

Personal Taiyka / @manu_ai.to product — top-of-funnel lead magnet. Not client work. Quality bar = public-facing brand asset, but "done is better than perfect" — ship it, then improve.

## Decisions locked in the interview (do NOT relitigate)

- **Cadence:** daily, ~06:30 Europe/Paris.
- **Curation engine (LLM):** self-hosted **Ollama (Qwen2.5 7B, Q4)** on Manu's Hostinger KVM VPS, shared with n8n. Cost $0, self-owned, reusable across tools. Manu rejected paid Claude and hosted free-tier APIs.
- **Sender:** **Resend** (free tier: 100 emails/day, 3,000/month). No Beehiiv (lock-in + can't auto-send custom n8n-rendered HTML). No SES for V1 (Resend is the easier managed API; SES is the scale migration target).
- **List store:** **Supabase**.
- **Orchestrator:** **n8n** (daily cron → curate → render → loop subscribers → send → log).
- **Send mode:** **fully automated, zero human review.** Manu does not want to approve anything before send. Soft safety net only (see below).
- **Personalization:** NONE. One broadcast digest, everyone gets the same issue. No per-user topic choice. (This was considered and explicitly dropped.)
- **Language:** **French only for V1.** English edition deferred to V2.
- **Opt-in:** **double opt-in** (GDPR — Manu is in France).
- **Format:** **minimal links** — 5-8 headlines, one line + link each, ~60-second scan. Chosen partly to minimize writing load on the local 7B model (lowest quality risk).
- **Home repo:** **Digital Products Project** (`web/` Next.js site + `funnel/` n8n). Promo Reel stays in content-creator.

## Amendments (2026-07-12)

These reverse/refine locked decisions above — they win where they conflict:

- **Cadence:** daily → **every 2 days**, still ~06:30 Europe/Paris. Ingest lookback widens 24h → **48h**. Cron stays daily with a **parity guard** (send on even days, hold on odd) to avoid month-boundary drift.
- **Format:** minimal-links → **hybrid (format C)**: 3-4 "À la une" featured stories (2-3 FR lines each) + an "En bref" quick-hits list of 6-8 one-liners. Raises the Phase 0 bar — the FR quality test must run on the featured 2-3-line format. Fallback if 7B wobbles: Ollama drafts + Claude polishes only the featured lines (~€0.01/run).
- **Sender:** **Resend free tier locked for launch** (100/day). Migrate to SES only when list nears ~100 active subs. Self-hosted SMTP rejected (deliverability/blocklist/port-25 trap).

## Themes (the curation filter)

Ollama keeps only stories that fall inside these 7 themes; everything else is dropped:

1. AI automation & agents (n8n, agent frameworks, workflow automation)
2. New AI tools & launches
3. Model releases (Claude, GPT, Gemini, open models)
4. AI for entrepreneurs / solopreneurs (business use, monetization)
5. Practical how-tos (prompts, workflows readers can copy)
6. Big industry moves (funding, acquisitions, strategy shifts)
7. AI coding & dev tools

> Removed from the starter list: "Open-source & self-hosted AI" (Manu dropped it).

## Inputs

- **Scheduled trigger:** daily cron, 06:30 Europe/Paris (the pipeline run).
- **Signup form submissions:** from the `/brief` landing page on the Next.js site.
- **Confirmation clicks:** double-opt-in confirmation link.
- **Unsubscribe clicks:** unsubscribe link in every email.

## Outputs

- **A daily French email digest** sent via Resend to all active subscribers (BCC Manu for the first ~2 weeks — see safety net).
- **Subscriber rows** written/updated in Supabase (signup → pending → active → unsubscribed).
- **A confirmation email** on signup; an unsubscribe status flip on unsubscribe.
- **A send log** row per issue in Supabase (date, story count, recipients, status).

## Data shape

Persistence = **Supabase**. Reuse the existing Digital Products Supabase project if one is already wired for `/book`; add new tables namespaced for the brief. **Confirm which Supabase project during implementation.**

Suggested tables (implementer may refine):

```
brief_subscribers
  id            uuid pk
  email         text unique not null
  status        text  -- 'pending' | 'active' | 'unsubscribed'
  lang          text default 'fr'          -- future-proofing for V2 EN
  confirm_token text                        -- for double opt-in link
  source        text                        -- 'brief-landing' | 'qcm-result' | ...
  created_at    timestamptz default now()
  confirmed_at  timestamptz
  unsubscribed_at timestamptz

brief_issues            -- send log, one row per daily issue
  id           uuid pk
  issue_date   date
  story_count  int
  sent_count   int
  status       text  -- 'sent' | 'held-no-stories' | 'error'
  created_at   timestamptz default now()
```

Sample signup input (from landing form POST):
```json
{ "email": "someone@example.com", "source": "brief-landing" }
```

Sample rendered issue (minimal-links, French):
```
LE BRIEF — 11 juillet 2026

• Anthropic sort Claude Opus 4.8 — contexte 1M tokens, moins cher. → lien
• n8n 1.6 : nouveau node agent natif. → lien
• OpenAI rachète une startup d'agents pour 2 Md$. → lien
• Nouveau prompt qui automatise ta veille concurrentielle. → lien
• Mistral lance un modèle open 24B qui bat GPT-4o-mini. → lien

Se désabonner : lien
```

## Happy path

1. Cron fires at 06:30 Europe/Paris in n8n.
2. **Ingest:** pull AI news — RSS (TechCrunch, The Verge, MIT Tech Review, Anthropic, OpenAI, HN AI-filtered) + Reddit RSS (r/LocalLLaMA, r/MachineLearning, r/singularity) + Apify Twitter (`apidojo/twitter-scraper-lite`, ~8 handles: @sama, @karpathy, @AnthropicAI, @OpenAI, @GoogleDeepMind, @miramurati, @swyx, @hwchase17). Dedupe to last 24h, cap ~80 items. (Reuse the source list from the old `ai-news-daily.json` — it was solid.)
3. **Curate (Ollama):** n8n HTTP Request node → `http://localhost:11434` → Qwen2.5 7B. Filter to the 7 themes, rank, pick the best 5-8 stories, write a one-line French summary + keep the link for each.
4. **Render:** build the minimal-links French HTML email.
5. **Fetch recipients:** query Supabase for `status = 'active' AND lang = 'fr'`.
6. **Send:** Resend API sends the issue to the list. BCC Manu for the first ~2 weeks.
7. **Log:** write a `brief_issues` row (date, story count, sent count, status).

Signup sub-flow: form POST → upsert `brief_subscribers` as `pending` with a `confirm_token` → send confirmation email → subscriber clicks → status flips to `active`, `confirmed_at` set. Unsubscribe sub-flow: click link → status flips to `unsubscribed`.

## Failure modes

| Failure | Desired behaviour |
|---|---|
| Fewer than ~3 stories pass the theme filter | **Hold** — do NOT send a thin/empty issue. Log `held-no-stories`, alert Manu. |
| Ollama down / OOM under n8n load | Retry once; if still failing, fall back to `qwen2.5:3b`; if that fails, skip the day + alert Manu. Use `OLLAMA_KEEP_ALIVE=0` so the model unloads after the job. |
| Resend API error / daily 100 cap hit | Retry transient errors; log failed recipients; alert Manu. Hitting the cap = migration trigger (see Constraints). |
| A news source (Apify / an RSS feed) is down | Proceed with whatever sources returned; never block the whole issue on one dead source. |
| Duplicate signup (email already exists) | Upsert — never create a duplicate row. If already `active`, no-op. If `unsubscribed`, treat re-signup as re-subscribe (new confirm cycle). |
| Bad/garbage LLM output ships unseen | Soft net only (no gate, per Manu): BCC Manu on every send for ~2 weeks so he sees output. If quality is poor → hybrid fallback (Ollama bulk + Claude final lines) or KVM4 upgrade. |

## Constraints

- **Cost near-$0:** Ollama free; Resend free (≤100/day); Apify ~pennies/day. Target: no monthly fee at launch.
- **Resend free ceiling = 100 emails/day** → ~100 daily subscribers max. **Migration trigger:** at ~100 active subs, upgrade to Resend Pro ($20/mo, 50k/month) or migrate send to Amazon SES + n8n (cheaper at scale, no daily cap). Documented, not built.
- **French only** for V1.
- **Runs on existing infra:** Hostinger KVM VPS (Ollama + n8n co-resident, ~8 GB RAM — 7B Q4 fits tightly at ~4.7 GB; stagger the cron so the LLM job doesn't spike RAM against other n8n workflows).
- **GDPR:** double opt-in mandatory; unsubscribe link in every email; store data in Supabase (prefer EU region).
- **Credentials:** `C:/Users/yoanu/.config/global.env` (Apify, Anthropic if hybrid fallback, n8n). Add Resend API key + Supabase brief creds.
- **Voice:** load `content-creator/style-guide.md` before writing any copy (landing page, confirmation email, issue tone).
- **Site conventions:** debranded "L'Atelier" naming (no "Taiyka" as display/SEO label), existing shadcn/Tailwind stack in `web/`, `?lang=` param pattern.

## Verification

Non-negotiable — prove each phase before moving on.

- **Phase 0 (gating, before any pipeline code):**
  - **Ollama:** Manu SSHes the VPS → install Ollama → `ollama pull qwen2.5:7b` → run a French curation/summarization test prompt. Confirm (a) it fits RAM alongside n8n, (b) FR one-line summaries are acceptable quality. If OOM → `qwen2.5:3b`. If quality too low → flag hybrid fallback or KVM4 upgrade. **This is the hard gate.**
  - **Resend:** verify a sending domain/subdomain on `taiyka.com` (SPF/DKIM/DMARC via Resend's guided flow) → send ONE custom-HTML test email to Manu → confirms the send path works.
- **Phase 2 (pipeline):** run the n8n workflow manually once → a real French minimal-links digest lands in Manu's inbox with 5-8 themed stories, all links valid, unsubscribe link present.
- **Phase 3 (funnel surface):** `cd web && ./node_modules/.bin/next dev -p 3001` → submit the `/brief` signup form → `pending` row appears in Supabase → confirmation email fires → click → row flips to `active`. Unsubscribe link flips status to `unsubscribed`. `./node_modules/.bin/next build` clean.
- **End-to-end:** a second real address signs up → double-opt-in confirms → receives the next daily issue → unsubscribe works and stops future sends.

## Out of scope

- No per-user personalization or topic-choice (explicitly dropped).
- No English edition (V2).
- No public web archive of past issues.
- No paid tier / monetization / sponsorships.
- No human review/approval gate — fully automated send.
- No "Open-source & self-hosted AI" theme in the content.
- No mobile app.

## Burn-down (Phase 1 — delete BOTH old trees first, per-step confirmation, deletes are irreversible)

Two drifted "Le Brief" code trees exist and must be collapsed into this one clean build. Toggle any live n8n triggers **Active → off** before deleting.

- **Digital Products Project:**
  - `funnel/n8n-workflows/ai-news-daily.json`, `brief-unsubscribe.json`, `lead-magnet-delivery.json`, `README-ai-news.md`, `send_test_brief.py`, `preview.html`, `__pycache__/`
  - `web/app/brief/page.tsx`, `web/app/brief/unsubscribe/page.tsx` + `UnsubscribeClient.tsx`
  - `web/components/BriefSignupForm.tsx`, `web/components/SampleIssuePreview.tsx`
  - The "AI NEWS" tile on `web/app/page.tsx` (hub)
- **content-creator:**
  - `tools/ai-news-digest/ai-news-digest.workflow.json`, `push_workflow.py`
  - **Keep** `scripts/le-brief-introduction.md` + `captions/le-brief-intro-caption.md` — the intro Reel is ready-to-film promo content, reuse at launch.
- Mark stale memory files for cleanup: `reference_ai_news_pipeline.md`, `reference_brief_webhook.md` (they describe the dead system).

## Reuse (don't rebuild from zero)

- **Source list + dedupe + render design** from the old `ai-news-daily.json` — proven, re-implement clean.
- **Intro Reel + caption** already written (content-creator) — launch content is ready.
- **`content-creator/style-guide.md`** — load before writing any copy.
- **Existing `web/` Next.js stack** — shadcn/Tailwind, debranded L'Atelier naming, `?lang=` pattern.

## Open questions

- **Ollama 7B French quality is unproven** — Phase 0 decides. Fallbacks: hybrid (Ollama bulk + Claude writes the final lines, ~$0.01/day) or KVM4/16GB upgrade (Qwen 14B). Not built now.
- **Which Supabase project** — reuse the Digital Products / `/book` instance with new `brief_*` tables, or a fresh project? Confirm at implementation.
- **Exact RSS + Twitter handle list** — start from the old `ai-news-daily.json` list; refine with Manu.
- **Keep BCC-to-Manu monitor beyond 2 weeks?** — decide after seeing quality.
- **Send time 06:30** — keep unless Manu changes it.
- **Skool CTA placement** — footer of every issue + confirmation page (funnel loop) — confirm wording.

## Stack hints (from CLAUDE.md scan)

- Next.js + TypeScript + Tailwind + shadcn/ui, hosted on Vercel.
- n8n for automation (self-hosted on Hostinger KVM VPS, co-resident with Ollama).
- Supabase for persistence.
- Bilingual convention: `-fr` / `-en` file suffixes, `?lang=en` URL param, FR default.
- Credentials in `C:/Users/yoanu/.config/global.env`; add Resend + Supabase-brief keys.
- Debranded site: page name "L'Atelier" (FR) / "The Workshop" (EN); never reintroduce "Taiyka" as a display/SEO label — functional refs (domain, email, keys) only.
- Voice: `content-creator/style-guide.md`.

## Vault bookkeeping (after build)

- Promote "Le Brief" from a wiki entity to a proper `wiki/projects/le-brief/_project.md` (or a clear sub-page under digital-products) so it stops living as scattered references.
- File a decision page for the final stack choice (Ollama + Resend + Supabase + n8n, fully-auto, no personalization, FR-only V1).
