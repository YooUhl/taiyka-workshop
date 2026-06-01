# AI NEWS Daily Brief — n8n operator notes

Workflow: `ai-news-daily.json`
Status: **v1 (manual gate)** — every morning at 06:30 Europe/Paris, n8n drafts an issue and emails it to Manu only. Manu reviews on phone, forwards manually to the list (or skips that day) until quality is locked. Then we flip to v2 (auto-send to subscribers).

---

## What it does

1. **06:30 Europe/Paris** — Cron fires.
2. **Fetch sources in parallel** — RSS feeds (TechCrunch, The Verge, MIT Tech Review, Anthropic blog, OpenAI blog, Hacker News AI-filtered, Reddit AI subs) + Apify Twitter scraper for 8 watched handles.
3. **Filter + dedupe** — last 24h only, dedupe by URL, cap at 80 items.
4. **Claude Sonnet 4.6** — picks the 3-5 stories that moved the needle, writes FR headline + 2-sentence take + source for each.
5. **Render HTML email** — same visual as `SampleIssuePreview` on `/brief`.
6. **Log to Google Sheets** — `briefs` tab (date, issue#, status=draft, html_body).
7. **Send `[DRAFT]` email** — to `manu.uhila@taiyka.com` only.

---

## One-time setup

### 1. Create the briefs sheet
- New Google Sheet → name it "AI NEWS Briefs"
- Add tab `briefs` with columns: `date_iso`, `issue_number`, `subject`, `status`, `stories_json`, `html_body`
- Copy the sheet ID from the URL, paste into `ai-news-daily.json` node `Log Draft to Sheets` field `documentId` (replaces `PASTE_YOUR_BRIEFS_SHEET_ID_HERE`).

### 2. Set n8n credentials
Inside n8n UI, after import:
- `Log Draft to Sheets` → bind existing Google Sheets OAuth2 cred (same one used by lead-magnet workflow).
- `Send Draft to Manu (v1 gate)` → bind existing Gmail OAuth2 cred.

### 3. Env vars on the n8n host
Confirm these env vars are set on `n8n.srv1331551.hstgr.cloud`:
- `ANTHROPIC_API_KEY` — for Claude curation
- `APIFY_API_KEY` — for Twitter scraping
- `GENERIC_TIMEZONE=Europe/Paris` — so cron fires at the right hour

### 4. Import
- n8n UI → Workflows → Import from File → pick `ai-news-daily.json`
- Hit **Execute Workflow** once manually. Confirm:
  - Code node "Fetch RSS + Reddit Sources" returns ≥ 30 items
  - Apify node returns tweets (or fails gracefully — flagged with `continueRegularOutput`)
  - Claude returns valid JSON with 3-5 stories
  - Sheet row appears with `status=draft`
  - Email lands in Manu's inbox with `[DRAFT]` prefix

If Claude step throws "Claude returned non-JSON", check the raw reply in n8n execution output — adjust the system prompt or `max_tokens` and re-run.

### 5. Activate the schedule
Once 3 consecutive manual runs produce good drafts, toggle the workflow **Active** in n8n.

---

## v2 — flip to auto-send

When quality is locked (give it ~2 weeks of v1), replace the `Send Draft to Manu (v1 gate)` node with a 4-node chain:

```
Sheets Read (leads tab, filter source IN brief-landing,qcm-result,landing-free-n8n-pack AND status=active)
  → Loop Over Items (batch 50)
  → Gmail Send (to={{ $json.email }}, subject={{ $('Render Email HTML').first().json.subject.replace('[DRAFT] ', '') }}, message replace {{EMAIL}} with current email)
  → Sheets Append (deliveries tab — log issue#, email, sent_at)
```

The HTML already contains `{{EMAIL}}` placeholder for the unsubscribe link — the v2 Gmail node must replace it per-recipient.

---

## Source list (edit by hand in the Code node)

In `Fetch RSS + Reddit Sources` Code node, the array `RSS_FEEDS` lists every feed. Add or remove a line to change scope:

```js
{ url: 'https://...', source: 'pretty-domain.com' }
```

For Twitter handles, edit `searchTerms` in the `Apify — Twitter (last 24h)` HTTP node. Format: `from:handle`.

---

## Cost per issue

- Apify Twitter scrape: ~$0.005 (40 tweets)
- Claude Sonnet 4.6 input ~10k tokens + output ~1k tokens: ~$0.04
- Gmail send (Workspace): free up to 500/day
- **Total: ~$0.05/day** in v1, ~$0.05 + ($0 Gmail) in v2 until list grows past 400.

---

## Deliverability warning

Gmail OAuth2 send has a hard daily limit of ~500 recipients on personal Workspace accounts. Fine for the first 6 months. **At ~400 subscribers**, migrate the v2 send chain to a real ESP (Resend / Buttondown / MailerLite). The HTML template stays — only the send step changes.

Also: `taiyka.com` needs SPF + DKIM + DMARC records set up before bulk sends or Gmail starts spam-foldering us. Separate task — flag it when sub count hits ~50.

---

## Sources currently watched

**RSS:**
- techcrunch.com (AI category)
- theverge.com (AI category)
- technologyreview.com (AI topic)
- anthropic.com (news)
- openai.com (blog)
- news.ycombinator.com (front page filtered for AI/LLM/Claude/GPT)

**Reddit:**
- r/LocalLLaMA
- r/MachineLearning
- r/singularity (top of day)

**X / Twitter (via Apify):**
- @sama, @karpathy, @AnthropicAI, @OpenAI, @GoogleDeepMind, @miramurati, @swyx, @hwchase17

---

## Failure modes + recovery

| Symptom | Cause | Fix |
|---|---|---|
| Code node "Fetch RSS" returns 0 items | Single feed is down, breaks the for-loop | The try/catch inside `fetchFeed` returns `[]` per feed, so a single failure doesn't kill the run. Check n8n console.warn logs to spot which feed died. |
| Apify node 401 | `APIFY_API_KEY` not set in n8n env | Set it on the host and restart n8n. |
| Apify node timeout | Twitter actor saturated | Switch URL to `kaitoeasyapi~twitter-x-data-tweet-scraper-pay-per-result-cheapest` (paid, more reliable). |
| Claude returns non-JSON | Hallucinated a markdown fence | The Render node strips ```` ```json ```` fences. If still failing, lower temperature in the messages payload (add `"temperature": 0.3`). |
| No email arrives | Gmail cred expired | Re-auth Gmail OAuth in n8n credentials panel. |

---

## Related workflows

- `lead-magnet-delivery.json` — sister workflow that captures the email at signup (POST `/webhook/brief-signup`) and writes to the same Google Sheets `leads` tab the v2 send chain will read from.
- `brief-unsubscribe.json` — handles the unsubscribe link in the footer of every sent email.
