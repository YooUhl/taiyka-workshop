# 5 n8n Workflows for AI Entrepreneurs

> The starter pack I wish I had when I first started automating my business.
> — Manu, founder of [Taiyka](https://instagram.com/manu_ai.to)

---

## Before you start

**You'll need:**
- An **n8n** account (cloud or self-hosted — the free cloud plan is enough to get started)
- A few API keys (varies per workflow — each one tells you which)
- 30 minutes to import everything and test

**How to import a workflow:**
1. Open n8n
2. Click **"+ Add workflow"** → menu **... → Import from File**
3. Select the corresponding `.json`
4. Connect the requested credentials (Gmail, Apify, Hunter, etc.)
5. Activate the workflow

That's it. No code to write.

---

## Workflow 1 — AI News Digest 📰

**File:** `01-ai-news-digest.json`
**Difficulty:** ⭐ Beginner
**APIs required:** Gmail only (standard Google account)

### What it does
Every morning at 5am UTC, the workflow pulls AI news from major tech outlets (TechCrunch, VentureBeat, Reuters, MIT Tech Review, CNBC...), merges them, generates a PDF, and emails it to you.

No more scrolling Twitter for 30 min to stay current.

### Setup
1. Import the workflow
2. Connect your Gmail account (n8n walks you through OAuth)
3. Replace `PASTE_YOUR_EMAIL_HERE@example.com` with your email
4. Activate → first digest hits your inbox tomorrow morning

### Going further
- Add/remove RSS sources in the "RSS Feed Read" nodes
- Change the time slot in "Schedule Trigger"
- Tweak the email HTML template in "Format Email HTML"

---

## Workflow 2 — Lead Machine: Email Finder 🎯

**File:** `02-lead-email-finder.json`
**Difficulty:** ⭐⭐ Intermediate
**APIs required:** Hunter.io (free up to 25 searches/mo) + Google Sheets

### What it does
Given a list of companies in a Google Sheet, this workflow finds the founder or decision-maker email for each one. It scrapes the company website first, then falls back to Hunter.io if needed.

Perfect for prepping a cold outreach campaign without paying for a $99/mo tool.

### Setup
1. Create a free account on [hunter.io](https://hunter.io) → grab your API key
2. Create a Google Sheet with a `domain` column (e.g. `acme.com`, `stripe.com`, ...)
3. Import the workflow
4. In the "Edit Fields" node, replace:
   - `PASTE_YOUR_HUNTER_API_KEY_HERE` → your Hunter key
   - `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` → your Google Sheet ID (visible in the URL)
5. Connect your Google Sheets account
6. Run the workflow → emails appear in your sheet

### Going further
- Pipe it into Apollo, Lemlist, or Instantly to automate the sequence
- Add a Claude node to generate a personalized icebreaker per contact

---

## Workflow 3 — Lead Machine: Google Maps 🗺️

**File:** `03-lead-google-maps.json`
**Difficulty:** ⭐⭐ Intermediate
**APIs required:** Google Maps API + Google Sheets

### What it does
Give it a business type + a city (e.g. "barbershops in Toulon"), and the workflow scrapes Google Maps for **name, address, phone, website, average rating** of every result. Outputs straight to a Google Sheet.

Ideal for local prospecting (digital agencies, freelancers, location-based offers).

### Setup
1. Create a Google Maps API key ([console.cloud.google.com](https://console.cloud.google.com)) — you need to enable "Places API"
2. Import the workflow
3. In "Edit Fields", replace:
   - `PASTE_YOUR_GOOGLE_MAPS_API_KEY_HERE` → your key
   - `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` → your sheet
   - Adapt `query` (business type) and `location` (city)
4. Connect your Google Sheets account
5. Run → leads land in your sheet

### Going further
- Combine with Workflow 2 to enrich with the owner's email
- Add a filter on average rating (`>= 4.0`) to target only quality businesses

---

## Workflow 4 — Amazon Rankings Scraper 🛒

**File:** `04-amazon-rankings.json`
**Difficulty:** ⭐⭐⭐ Advanced
**APIs required:** Apify (free account with $5 in credits)

### What it does
The workflow scrapes **Amazon bestsellers across 10 marketplaces** (US, UK, FR, DE, JP, etc.) and extracts the top 100 brands per market. Output to Google Sheets.

If you're in e-commerce or watching a competitive market, this is gold.

### Setup
1. Create a free account on [apify.com](https://apify.com) → grab your API token
2. Define the env variable `APIFY_TOKEN` in n8n (Settings → Variables)
3. Import the workflow
4. Adapt the `spreadsheet_id` in the Google Sheets API code node
5. Run → ~5-10 min for all 10 markets

### Going further
- Schedule it weekly via a Schedule Trigger
- Add a Claude node to summarize monthly trends

---

## Workflow 5 — Instagram Daily Collector 📸

**File:** `05-instagram-monitor.json`
**Difficulty:** ⭐⭐⭐⭐ Expert
**APIs required:** Apify + Supabase

### What it does
Every day at 6am UTC, the workflow scrapes your competitors' Instagram accounts (followers, posts, engagement) and stores the history in Supabase for competitive intelligence.

This is the pro version of the system. If you just want to test, save this one for later and play with the first 4.

### Setup
Setup requires Supabase (tables `competitor_handles` + `channel_metrics`) — I recommend getting comfortable with n8n first before tackling this one.

Full doc inside the **[Competitor Intelligence System](https://taiyka.com/products/competitor-intel)** (premium product).

---

## What's next?

Want:

- 📩 **A real automated cold outreach sequence** (LinkedIn → email → follow-up)?
  → [n8n Pack: Cold Outreach (€19)](https://taiyka.com/products/cold-outreach-pack)

- 🤖 **To learn how to build your first AI agent end-to-end**?
  → [Build Your First AI Agent (€29)](https://taiyka.com/products/ai-agent-playbook)

- 🚀 **To join a community of AI Solopreneurs + access to all my new products**?
  → [The Skool community](https://taiyka.com/skool)

---

**Manu** · [@manu_ai.to](https://instagram.com/manu_ai.to) · [taiyka.com](https://taiyka.com)
