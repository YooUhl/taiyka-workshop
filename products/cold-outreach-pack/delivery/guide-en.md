# Cold Outreach Pack — Setup Guide

> The exact system I use to pull leads from Google Maps, find their email, write an icebreaker with Claude, and send it all through Gmail. No fluff, no code.
> — Manu, founder of [Taiyka](https://instagram.com/manu_ai.to)

---

## What you're holding

4 n8n workflows that form **one single pipeline**:

```
[Google Maps] → [Email Finder] → [AI Icebreaker] → [Gmail Send]
  Workflow 1      Workflow 2       Workflow 3       Workflow 4
```

You run the first, a Google Sheet fills up with leads. The next 3 enrich that same sheet until the email gets sent.

One database (your Google Sheet), 4 layers of enrichment.

---

## Prerequisites

**Accounts you need (all have free tiers):**
- **n8n** — cloud or self-hosted, doesn't matter
- **Google Cloud** — for the Google Maps API key (enable "Places API")
- **Hunter.io** — 25 free searches / month
- **Anthropic** — Claude API key (a few bucks of credit cover 1000 icebreakers)
- **Gmail** — standard Google account, connected to n8n via OAuth

**Setup time:** budget **45 minutes** the first time. After that it's 2 clicks.

**Your Google Sheet:** create one with these columns in this order:

```
id | name | websiteUri | address | phone | rating | email | email_source | email_status |
hunter_first_name | hunter_last_name | hunter_position | hunter_confidence |
icebreaker | icebreaker_status | icebreaker_model |
approved | sent_status | sent_at
```

The `id` column must be **unique** per row (a simple 1, 2, 3... sequence works). It's the key used for updates.

---

## How to import a workflow

1. Open n8n
2. **"+ Add workflow"** → menu **... → Import from File**
3. Pick the `.json`
4. Connect the requested credentials (Google Sheets, Gmail, etc.)
5. Replace the `PASTE_YOUR_X_HERE` placeholders in the **"Edit Fields"** node at the top
6. Activate and run

---

## Workflow 1 — Google Maps Scraper

**File:** `01-lead-google-maps.json`
**Difficulty:** ⭐⭐
**APIs:** Google Maps API + Google Sheets

### What it does
You give it a business type + a city (e.g. "barbershops in Toulon"), it pulls up to 100 leads with name, address, phone, website, average rating. Straight into your Google Sheet.

### Setup
1. [Create a Google Maps API key](https://console.cloud.google.com) → enable **Places API**
2. In the **"Edit Fields"** node, replace:
   - `PASTE_YOUR_GOOGLE_MAPS_API_KEY_HERE` → your key
   - `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` → your sheet ID (in the URL, the long string between `/d/` and `/edit`)
   - Tweak `query` (e.g. "dentists", "real estate agents") and `location` (e.g. "Austin, TX")
3. Connect your Google Sheets account
4. Run → leads land in the sheet

### Tip
Add a **filter node** after to keep only profiles with `rating >= 4.0` if you want businesses that are actually running.

---

## Workflow 2 — Email Finder

**File:** `02-lead-email-finder.json`
**Difficulty:** ⭐⭐
**APIs:** Hunter.io + Google Sheets

### What it does
For each lead with a website but no email yet, it:
1. **Scrapes the website first** for any email (free, silent)
2. **Falls back to Hunter.io** if nothing found — prioritizes decision makers (owner, CEO, founder)
3. **Filters out generic emails** (info@, contact@, noreply@... all auto-rejected)

You keep only real-person emails.

### Setup
1. [Create a free Hunter.io account](https://hunter.io) → copy your API key
2. In **"Edit Fields"**:
   - `PASTE_YOUR_HUNTER_API_KEY_HERE` → your Hunter key
   - `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` → same sheet as Workflow 1
3. Run → the `email` column fills up

### Tip
Hunter's 25 free searches/month go fast. Website scraping is free and covers ~40-60% of cases — so order matters: **scrape first, Hunter as backup**. Already wired that way in the code.

---

## Workflow 3 — AI Icebreaker (Claude)

**File:** `03-icebreaker-claude.json`
**Difficulty:** ⭐⭐⭐
**APIs:** Anthropic (Claude) + Google Sheets

### What it does
For each lead with an email but no icebreaker yet, the workflow:
1. Reads the row (name, role, city, niche, website)
2. Sends it to **Claude** with a calibrated prompt: max 2 sentences, human tone, no corporate flattery
3. Writes the icebreaker into the `icebreaker` column of the sheet

The system prompt is deliberately strict: **"Slightly imperfect English is fine — it signals a real human wrote it"**. That's exactly the style I use in my own cold emails.

### Setup
1. [Get your Anthropic key](https://console.anthropic.com) → generate an API key
2. In **"Edit Fields"**:
   - `PASTE_YOUR_ANTHROPIC_API_KEY_HERE` → your key
   - `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` → your sheet
   - Tweak `sender_first_name` and `sender_offer` (describe your offer in one line)
3. Run → the `icebreaker` column fills up

### Tip
Before sending, **re-read the icebreakers in the sheet**. Claude is good but not magic — some will be throwaway. Manually mark `approved = yes` on the ones you keep. That filter is already wired into Workflow 4.

### Cost
~$0.003 per icebreaker with `claude-sonnet-4-5`. 1000 leads = $3. For massive volumes, switch to `claude-haiku-4-5` in the `claude_model` field (10x cheaper).

---

## Workflow 4 — Gmail Send (with approval gate)

**File:** `04-gmail-send.json`
**Difficulty:** ⭐⭐⭐
**APIs:** Gmail (OAuth) + Google Sheets

### What it does
For each lead that's **approved** (`approved = yes`) and **not yet sent** (`sent_status ≠ sent`), it:
1. Builds the email from templates (subject + body with `{{first_name}}`, `{{icebreaker}}`, `{{signature}}`)
2. **Dry-run mode by default** — the email is sent to yourself with `[DRY RUN]` in the subject, so you can eyeball the rendering before hitting real prospects
3. When you flip `dry_run = false`, it sends for real and marks `sent_status = sent` + the date

### Setup
1. Connect your Gmail account to n8n via OAuth (n8n walks you through)
2. In **"Edit Fields"**:
   - `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` → your sheet
   - Replace `PASTE_YOUR_EMAIL_HERE@example.com` in the **Dry run** node with your own email
   - Tweak `sender_signature`, `subject_template`, `body_template` for your offer
3. **Test in dry-run first** (`dry_run = true`)
4. When everything looks clean → `dry_run = false` and re-run

### Approval workflow
In your Google Sheet, add a data validation on the `approved` column (list: `yes` / `no` / blank). You approve line by line what goes out. **Never skip this step** — one bad icebreaker sent to 100 prospects = 100 bad first impressions.

### Deliverability tips
- **Start at 20-30 sends/day max** the first 2 weeks (domain warmup)
- Send between **Tuesday and Thursday, 9-11am** local prospect time
- Leave 30-60 seconds between sends (add a **Wait** node if you want)
- Use a separate sending domain if you scale (don't torch your main inbox)

---

## Full pipeline — execution order

```
1. Run Workflow 1 → 100 leads in the sheet
2. Run Workflow 2 → ~40-60 emails found
3. Run Workflow 3 → ~40-60 icebreakers drafted
4. Review the sheet, set approved=yes on ~20-30 clean leads
5. Run Workflow 4 in dry_run=true → check the mails in your own inbox
6. Flip dry_run=false → emails fire at prospects
```

You can put each stage on a Schedule trigger (e.g. every 6h) later, but when you start **keep everything manual**. You want to see what's happening before you automate it.

---

## Troubleshooting

**"Google Sheets: column not found"**
→ Your sheet doesn't have all the expected columns. Double-check the Prerequisites column list (it's strict).

**"Hunter: quota exceeded"**
→ The 25 free searches are burned. Either upgrade (~$49/mo for 500), wait for next month, or swap to another tool (Apollo, Dropcontact, Findymail).

**"Anthropic 401"**
→ Your API key is either mispasted (invisible trailing spaces) or not active. Regenerate one.

**Gmail "Insufficient permissions"**
→ Re-authorize your Google account in n8n. OAuth scope "send email" must be checked.

**All icebreakers feel flat**
→ Edit the prompt in the **"Build prompt"** node (Workflow 3). Add 2-3 examples of icebreakers YOU'D want to receive in the `system` section. Claude follows concrete examples better than abstract rules.

**Dry run doesn't send anything**
→ Check that `dry_run = true` AND that you put your real email in `PASTE_YOUR_EMAIL_HERE@example.com` inside the Gmail Dry run node.

---

## Going further

Natural extensions of the pack:

- **Auto follow-up sequence**: add a Workflow 5 that re-reads the sheet 3 days after send and fires a bump if `replied = no`
- **Reply detection**: a Gmail trigger that flips `replied = yes` when a prospect replies → stops the sequence automatically
- **LinkedIn enrichment**: swap the Google Maps scrape for a LinkedIn Sales Navigator scrape (via Apify) if you target B2B tech
- **A/B test on the icebreaker**: generate 2 versions per prospect with 2 different prompts, send 50/50, measure reply rate

If you want all of this already wired + pro-grade prompts calibrated per niche → see below ⬇️

---

## What's next

This pack gets you from zero to first cold email sent on autopilot. Ready to level up?

- 🤖 **Build your first AI Agent end-to-end** — an agent that qualifies leads, answers their questions, books meetings for you
  → [Build Your First AI Agent ($29)](https://taiyka.com/products/ai-agent-playbook)

- 🚀 **Join the Skool community** — access to all my products, weekly lives, exclusive templates, direct Q&A with me
  → [Skool community](https://taiyka.com/skool)

---

**Manu** · [@manu_ai.to](https://instagram.com/manu_ai.to) · [taiyka.com](https://taiyka.com)

Stuck somewhere? Reply to the delivery email, I read everything.
