# Deferred manual steps — /book hardening (AUDIT-BOOK-V3 follow-up)

These items can't be done from code. Manu owns them. Until done, the listed audit findings remain mitigated but not closed.

---

## 1. Calendly webhook subscription (closes P0-11)

**What:** Calendly POSTs `invitee.created` and `invitee.canceled` events to our webhook so `book.bookings` becomes the source of truth (not the browser postMessage).

**Steps:**
1. Go to https://calendly.com/integrations/api_webhooks
2. Create a Personal Access Token if none exists — copy it
3. Use the token to register a webhook subscription:
   ```bash
   curl -X POST https://api.calendly.com/webhook_subscriptions \
     -H "Authorization: Bearer <YOUR_PAT>" \
     -H "Content-Type: application/json" \
     -d '{
       "url": "https://workshop.taiyka.com/api/book/calendly-webhook",
       "events": ["invitee.created", "invitee.canceled"],
       "organization": "<your org URI>",
       "scope": "organization"
     }'
   ```
4. Response contains a `signing_key` — copy it
5. Add to local `.env.local` and Vercel env:
   ```
   CALENDLY_WEBHOOK_SIGNING_KEY=<the signing key>
   ```
6. Redeploy Vercel so the env var is live
7. Test by booking a slot — verify a row lands in `book.bookings` with `status='scheduled'`

**Without this:** browser postMessage still triggers the "booked" UI; refresh after tab close before postMessage fires loses the record from our DB.

---

## 2. Cloudflare Turnstile (closes P0-6 fully — honeypot already in place)

**What:** server-side verified CAPTCHA challenge. Stops scripted floods that bypass the honeypot.

**Steps:**
1. Go to https://dash.cloudflare.com/?to=/:account/turnstile
2. Add a site — choose **Invisible** widget type
3. Copy the **Site Key** + **Secret Key**
4. Add to `.env.local` and Vercel env:
   ```
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=<site key>
   TURNSTILE_SECRET_KEY=<secret key>
   ```
5. **Code change needed:** wire Turnstile script + server-side verification in `/api/book`. Not implemented yet — current build only has the honeypot. Tell Claude to wire it once keys exist.

**Without this:** honeypot kills naive bots (~99% of script kiddies). Sophisticated bots that strip honeypot bypass undetected until Turnstile is wired.

---

## 3. Supabase CA bundle pinning (closes P1-5)

**What:** replace `ssl: { rejectUnauthorized: false }` in `web/lib/book/db.ts` with a proper Amazon RDS CA bundle.

**Steps:**
1. Go to https://supabase.com/dashboard/project/wkswgqsnnadgfqprgfxb/settings/database
2. Download the SSL certificate (PEM file)
3. Save to `web/lib/book/supabase-ca.pem` (gitignored)
4. Set env var `SUPABASE_CA_PEM_PATH` pointing to the file, OR inline the PEM content into a `SUPABASE_CA_PEM` env var
5. **Code change needed:** update `makePool()` in `db.ts` to read the PEM + set `ssl: { ca: pem, rejectUnauthorized: true }`. Tell Claude when the cert is in place.

**Without this:** MITM theoretically possible on the Vercel ↔ Supabase pooler path. Mitigated by Vercel's private network egress to AWS; the residual risk is nation-state / cloud-insider.

---

## 4. GDPR retention policy via pg_cron (closes P2-2)

**What:** automated 12-month purge of `book.qualifications` rows.

**Steps:**
1. In Supabase dashboard → SQL editor, run:
   ```sql
   create extension if not exists pg_cron;

   select cron.schedule(
     'book-qualifications-12mo-purge',
     '0 3 * * 0',  -- weekly, Sunday 03:00 UTC
     $$ delete from book.qualifications where created_at < now() - interval '12 months' $$
   );
   ```
2. Verify with `select * from cron.job;`
3. Add a privacy line under the /book contact step linking to a privacy policy page that documents the 12-month retention

**Without this:** EU residents can still request erasure manually, but the table grows unbounded.

---

## 5. Privacy policy page (closes P2-2 user-facing half)

**What:** static page at `/privacy` documenting what /book stores, why, retention period, and how to request erasure.

**Steps:**
1. Tell Claude to scaffold `/privacy` in the next session
2. Link from /book contact step ("En soumettant, tu acceptes notre [politique de confidentialité](/privacy)")

---

## 6. Vercel env vars to set (production deploy blocker)

Before next deploy, ensure these are set on the Vercel project:

| Var | Source | Required? |
|---|---|---|
| `BOOK_DATABASE_URL` | Supabase pooler URL (`wkswgqsnnadgfqprgfxb`, eu-central-1) | Yes — without it /api/book + /api/shop/waitlist return 503 |
| `NEXT_PUBLIC_CALENDLY_BOOK_URL` | `https://calendly.com/manu-uhila-taiyka/appel-de-decouverte` | Yes — without it /book shows "manual link within 24h" fallback |
| `NEXT_PUBLIC_SKOOL_COMMUNITY_URL` | Skool community URL | Optional |
| `CALENDLY_WEBHOOK_SIGNING_KEY` | From step 1 above | Yes — needed for webhook to fire |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` | From step 2 above | Optional (honeypot still in place) |

---

## 7. Calendly custom-question alignment (clarifies P2-20)

The new build **no longer** passes `customAnswers.a1/a2` to Calendly (P0-22 security fix). Manu's Calendly event no longer needs the "Project description" and "Location" questions configured for prefill — but he can still keep them if he wants the booker to answer there as additional context.

**Action:** decide whether to remove or keep those questions in the Calendly dashboard. Either is fine; the booking flow works regardless now.

---

## 8. Audit follow-through — what's still on the list

Items from AUDIT-BOOK-V3.md that this round did NOT close (intentionally deferred):

- **P0-3** Rate-limit per-instance — mitigated by sweep + Math.min but still per-instance. Move to Upstash when traffic justifies.
- **P0-6 part 2** CAPTCHA wiring (see step 2)
- **P0-11 part 2** Webhook subscription registration (see step 1)
- **P1-5** TLS CA pinning (see step 3)
- **P2-2** GDPR cron + privacy page (see steps 4-5)
- **P2-22** Location field — kept required for now (Manu uses it for prep context). Make optional in a future copy session if drop-off data justifies.

All other 80+ findings are closed in code. Run `git diff main..HEAD` to see the full surface.
