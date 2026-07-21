# Le Brief — Launch Runbook

Manual steps only you can do (credentials, DNS, external dashboards, production
activation). The code/SQL hardening is already done and verified — see the
"Already done" section at the bottom. Do these **in order**. Do not send to any
real subscriber until step 8 (warmup) — the domain is fresh.

---

## 1. Rotate the 3 leaked credentials  (HIGH — do first)

The keys were scrubbed from files but are still valid in the dashboards. Rotate,
then update everywhere they live.

| Credential | Where to rotate | Then update |
|---|---|---|
| Supabase `service_role` JWT (project `ylvkvlzqgzzxglxfrczd`) | Supabase → Settings → API → **Reset** | `C:/Users/yoanu/.config/global.env`, `/docker/n8n/.env` |
| Apify API token | Apify → Settings → Integrations → **Regenerate** | `global.env` (`APIFY_*`), `/docker/n8n/.env` |
| Google Maps API key | console.cloud.google.com → APIs & Services → Credentials → **Regenerate** | `global.env` |

After editing `/docker/n8n/.env`: `cd /docker/n8n && docker compose up -d` (recreates n8n with new env).

> SSH: `ssh -4 -i ~/.ssh/id_ed25519_vps root@185.97.146.17`

---

## 2. Set the new environment variables

**Vercel** (Project → Settings → Environment Variables), then redeploy:
- `NEXT_PUBLIC_SITE_URL = https://taiyka.com` (or the real deploy domain) — **required**; without it email links warn + fall back to VERCEL_URL.
- `RESEND_WEBHOOK_SECRET = whsec_...` — the Resend webhook signing secret from step 5.
- `BRIEF_DB_CA_CERT` *(optional, recommended)* — the Supabase project CA cert (Supabase → Settings → Database → SSL, download the cert, paste the full PEM). Enables verify-full TLS on the DB connection. Leave unset = encrypted-but-unverified (current behaviour).
- Turnstile *(optional, step 6)*: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`.

---

## 3. DMARC record + mailboxes

**Cloudflare DNS** — add (SPF + DKIM already live):
```
Type:  TXT
Name:  _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@taiyka.com; ruf=mailto:dmarc@taiyka.com; fo=1; adkim=r; aspf=r; pct=100; sp=none
TTL:   Auto
```
`p=none` = monitor only (safe start, satisfies Gmail/Yahoo bulk-sender rules). After ~3 weeks of clean reports, tighten to `p=quarantine` then `p=reject`.

**Mailboxes that must actually exist and be read** (Google Workspace):
- `dmarc@taiyka.com` — receives DMARC aggregate reports.
- `unsubscribe@taiyka.com` — the emails advertise a `mailto:` unsubscribe (P1-7). Either create + monitor it weekly, or remove the `mailto:` entry from the `unsubHeaders` in `funnel/n8n-workflows/le-brief-every2days.json` (Build Resend Batch node) and keep HTTPS-only.

---

## 4. Deploy the web app to Vercel

From `web/`: `npx vercel --prod`. Confirm `/privacy`, `/brief`, `/brief/confirmed`, `/brief/unsubscribe` all load, and that the confirm/unsubscribe links now require a **button click** (scanner-safe).

---

## 5. Resend bounce/complaint webhook

Resend dashboard → Webhooks → Add endpoint:
- URL: `https://taiyka.com/api/brief/resend-webhook`
- Events: `email.bounced`, `email.complained`
- Copy the **signing secret** (`whsec_...`) → set as `RESEND_WEBHOOK_SECRET` in Vercel (step 2), redeploy.
- Test: Resend → send a test event → confirm the subscriber flips to `bounced`/`complained` in Supabase.

---

## 6. Deliverability checks (before any real send)

- **Turnstile** *(optional, hardens signup)*: create a Cloudflare Turnstile widget, set the two env vars (step 2). The form already has a honeypot; Turnstile is the belt-and-suspenders. (Wiring the widget into `BriefSignupForm` is a small follow-up — ask me when you have the keys.)
- **Google Postmaster**: postmaster.google.com → add `taiyka.com` → verify TXT. Keep complaint rate < 0.3% (ideally < 0.1%).
- **mail-tester.com**: send a real dry-run issue (step 7) to the address it gives → target **≥ 9/10**. Fix whatever it flags.

---

## 7. Deploy + activate the n8n workflows

**✅ Already deployed to the instance (INACTIVE)** — done this session via the REST API, no container restart, other workflows untouched. Workflow IDs:
- `Sl86jpQxJ1e2F7q7` — Le Brief — Every 2 Days (27 nodes)
- `c5sEV7sY6gPKTdll` — Le Brief — Error Handler
- `BpZzrIpdnMRpV3EG` — Le Brief — Dead-man Switch
- `EVEqe5Rs0ReZsGrP` — Le Brief — Maintenance

The error-handler is already wired as the **Error Workflow** on the other three (P0-1 alerting live). The old `Taiyka — Le Brief Signup` / `Daily 7h` workflows are inactive and can be deleted.

**What's left for you (the launch actions that touch shared prod):**
1. **Point the DB credential at the new project.** n8n → Credentials → `Supabase — Le Brief` (`5IARxYGmdsAM5Adm`) → edit: host `aws-0-eu-west-1.pooler.supabase.com`, port `6543`, database `postgres`, user `postgres.pginqwvxgzztuvgxnyal`, password (from `web/.env.new`). Keep **SSL off / allowUnauthorizedCerts** (the pooler cert reads as self-signed). This one credential is reused by all Le Brief workflows.
2. Confirm `/docker/n8n/docker-compose.override.yml` still injects `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `APIFY_API_KEY`, `BRIEF_FROM_EMAIL`, `BRIEF_SITE_URL`. (Ollama vars no longer needed — Ollama is disabled.)
3. Activate all 4 workflows.
4. **`docker restart n8n-n8n-1`** — REST/UI activation alone does NOT register schedule triggers; the restart does. First clear any execution stuck at `finished:false` (it blocks new scheduled fires).

**Live dry-run test** (proves the whole chain without spamming the list):
- Add a temporary Webhook node → activate → from the VPS run `curl http://127.0.0.1:5678/webhook/<path>` (external DNS fails from your machine).
- A manual run is a **dry-run**: it sends the issue to `manu.uhila@taiyka.com` only, and does **not** write a `sent` row (so it won't consume the day's idempotency slot).
- Confirm the monitor email arrives, then remove the webhook node.

---

## 8. Warmup ramp (never send full list cold)

| Phase | Days | Volume/day | Send to |
|---|---|---|---|
| Seed | 1–3 | 5–20 | Your own inboxes (Gmail, Outlook, Yahoo, iCloud). Open, reply, drag to Primary, mark "Not spam", add sender to contacts. |
| Friends | 4–7 | 20–50 | Colleagues/friends who'll actually open |
| Engaged | Week 2 | 50–150 | Most engaged real subscribers |
| Ramp | Weeks 3–4 | ~2× every 2–3 days | Expand outward |
| Full | Week 5+ | Full list | Everyone; keep pruning non-openers |

Rule: never more than ~2× the previous send. After the first send, verify in Gmail → Show original → `SPF: PASS`, `DKIM: PASS`, `DMARC: PASS`.

---

## Database migration (decouple from Polymaker's Supabase)

The `book`/`shop`/`brief` schemas were moved off the Polymaker-owned Supabase
project onto a **new project you own** (`pginqwvxgzztuvgxnyal`, EU-West-1).
Schemas + data (4 subscribers, 1 issue) copied and verified.

- The new `BOOK_DATABASE_URL` (transaction pooler) is in `web/.env.new` (gitignored — has the password). `web/.env.local` already uses it.
- **When you do step 4 (Vercel):** set `BOOK_DATABASE_URL` = the new pooler string from `web/.env.new`.
- **When you do step 7 (n8n):** update the `Supabase — Le Brief` credential → host `aws-0-eu-west-1.pooler.supabase.com`, port `6543`, db `postgres`, user `postgres.pginqwvxgzztuvgxnyal`, password (from `web/.env.new`), SSL off.
- **Final cleanup (after everything verified live):** drop `book`/`shop`/`brief` from the OLD Polymaker DB. Ask me for the SQL — I have the old connection backed up.

---

## Already done (code/SQL — verified this session)

- ✅ SQL migration `007_brief_hardening.sql` **applied** to the Supabase project (idempotency unique index, dedup/audit columns, bounce statuses, durable rate-limit table, RLS deny-all, consent version). Verified live.
- ✅ Web layer hardened + `next build` clean: scanner-safe confirm/unsubscribe (button POST), one-click RFC 8058 unsubscribe, bounce/complaint webhook route, honeypot + durable Postgres rate limit, enumeration fix, GDPR `/privacy` page + consent version, email privacy/address footer, SSL-verify-full support, fail-loud site URL, every-2-days copy fixes.
- ✅ n8n pipeline reworked + 3 companion workflows, **deployed to the instance INACTIVE** (via REST API, no restart): error workflow + retries + dead-man + maintenance, Resend batch chunking ≤100, double-send/idempotency guard, dry-run manual sends, cross-issue dedup, API-error routing, partial-send logging, URL-escaped hrefs, held-notify resilience, missed-send catch-up, feed-failure alerting, node renamed to Claude, old daily workflow archived. Error-handler wired on all three others.
- ✅ Ollama **disabled** on the VPS (`systemctl disable --now ollama`) — freed the RAM-bomb risk; n8n unaffected.
- ✅ **Database migrated** off the Polymaker Supabase to your own new project (`pginqwvxgzztuvgxnyal`, EU-West-1) — schemas + data copied and verified.
- ✅ **End-to-end tested** the full hardened web flow against the new DB (12/12: signup + consent, honeypot drop, enumeration parity, scanner-safe confirm, GET-no-mutate / POST unsubscribe).
