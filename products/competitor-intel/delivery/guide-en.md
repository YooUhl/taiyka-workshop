# Quick-start — If you only have 2 hours

> For those who want to see the system running before reading the full playbook. Follow these 7 steps and your first strategic report lands in 2h.

---

## What you need

- An n8n account (cloud or self-hosted)
- A Supabase account (free tier)
- An Apify account (~€20 of credit covers months)
- An Anthropic API key (€5 is enough)
- A YouTube Data API v3 key (free)

---

## 1. Supabase — create the database (10 min)

1. Create a project at [supabase.com](https://supabase.com)
2. Grab **Project URL** + **Service Role Key** (Settings → API)
3. SQL Editor → paste `delivery/supabase-schema.sql` → Run

---

## 2. Seed your competitors (15 min)

In the SQL Editor:

```sql
insert into competitors (name) values ('Competitor A'), ('Competitor B');

insert into competitor_handles (competitor_id, platform, handle, status)
  select id, 'instagram', 'competitor_a', 'approved' from competitors where name = 'Competitor A';
```

Repeat for Instagram, TikTok, YouTube, LinkedIn.

For YouTube, also add `channel_id` in `metadata` (get it from [commentpicker.com/youtube-channel-id.php](https://commentpicker.com/youtube-channel-id.php)).

---

## 3. API keys (15 min)

Collect your 4 keys:
- Supabase → Settings → API
- Apify → Settings → Integrations
- YouTube → [console.cloud.google.com](https://console.cloud.google.com) → enable YouTube Data API v3
- Anthropic → [console.anthropic.com](https://console.anthropic.com)

---

## 4. Import the 5 workflows (20 min)

In n8n, **+ Add workflow → Import from File** for each of:
- `01-instagram-collector.json`
- `02-tiktok-collector.json`
- `03-youtube-collector.json`
- `04-linkedin-collector.json`
- `05-weekly-report-generator.json`

Ctrl+F inside each workflow → replace every `PASTE_YOUR_*_HERE` with your real keys.

---

## 5. Gmail credential (10 min)

In n8n: Credentials → New → Gmail OAuth2 API. Follow the OAuth flow. Inside workflow 05, select this credential on "Send via Gmail" and replace `PASTE_YOUR_RECIPIENT_EMAIL_HERE` with your own email.

---

## 6. Test every workflow (30 min)

For each collector (01 to 04):
1. **Manual Trigger** → **Execute Workflow**
2. Check every node is green
3. Go to Supabase → `channel_metrics` → rows should appear

If a workflow fails, inspect the red node → fix the key or handle involved.

---

## 7. Activate and wait (5 min + a few days)

Activate all 5 workflows (top-right toggle).

Wait 2-3 days for data to accumulate. Run workflow 05 manually to generate the first report. From the following Monday, everything runs on auto.

---

## Want to go further?

- Read the **full playbook** (`playbook-en.md`) to customise analysis, add platforms, change frequency
- Join the **[Taiyka Skool community](https://taiyka.com/skool)** — advanced pipeline, weekly lives, all my calibrated prompts

---

**Manu** · [@manu_ai.to](https://instagram.com/manu_ai.to)

Stuck? Reply to the delivery email.
