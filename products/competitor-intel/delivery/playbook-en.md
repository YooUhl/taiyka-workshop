# Competitor Intelligence System — The Playbook

> The complete system to spy on your competitors across Instagram, TikTok, YouTube and LinkedIn — and get a strategic report delivered to your inbox every Monday morning. Without lifting a finger.
> — Manu, founder of [Taiyka](https://instagram.com/manu_ai.to)

---

## Before you start

**This playbook is not a theory course.** It's a building site. By the end you'll have:

1. An n8n pipeline that scrapes 4 platforms daily
2. A Supabase database that stores the full history of your competitors
3. A Claude-written report that lands in your inbox every Monday

**Prerequisites:**
- An n8n account (cloud or self-hosted)
- A Supabase account (free tier is enough to start)
- An Apify account with ~€20 of credit (covers several months)
- An Anthropic API key (€5 of credit is largely enough)
- A YouTube Data API v3 key (free)
- 2-3h for first-time setup

---

## 1. What the system does

```
Apify scrapers ──┐
YouTube API   ───┼──► n8n collectors ──► Supabase (channel_metrics)
                 │                              │
                 │                              ▼
                 │                    n8n weekly report ──► Claude ──► Gmail
                 │                                            │
                 │                                            ▼
                 │                                   Strategic report
```

**Every day:**
- 06:00 UTC — Instagram Collector runs on every approved competitor handle
- 06:15 UTC — TikTok Collector
- 06:30 UTC — YouTube Collector
- 07:30 UTC — LinkedIn Collector

**Every Monday 08:00 UTC:**
- The Weekly Report Generator reads the last 14 days of data
- Computes deltas (this week vs last)
- Sends the whole thing to Claude with a calibrated prompt
- You receive a ~500-word report by email

---

## 2. Architecture

Four bricks. Each does one thing well.

### n8n — the orchestrator
The conductor. All 5 workflows in the pack run here.

### Apify — the scrapers
A service that runs pre-built scrapers ("actors") on demand:
- `apify/instagram-profile-scraper` (~$0.003/profile)
- `clockworks/tiktok-profile-scraper` (~$0.004/profile)
- `harvestapi/linkedin-company` (~$0.008/profile)

**Real cost:** tracking 20 competitors × 3 Apify platforms × 30 days → ~€7/month.

### YouTube Data API v3
Free (10,000 units/day, largely enough). We use `channels.list?part=statistics`.

### Supabase — the memory
Managed Postgres. Three tables: `competitors`, `competitor_handles`, `channel_metrics`. Free tier is enough (500 MB holds 2+ years of data).

### Claude API — the brain
The model that reads the numbers and writes the report. `claude-sonnet-4-5` by default. Cost: ~€0.01 per weekly report.

### Gmail — delivery
The report lands in your inbox. Forward it to your team, print it, whatever works.

---

## 3. Setup — 6 steps

### Step 1 — Create the Supabase database

1. Go to [supabase.com](https://supabase.com) → create a project
2. Note the project URL (format `https://xxxxx.supabase.co`) and the **Service Role Key** (Settings → API)
3. Open the SQL Editor → paste the contents of `delivery/supabase-schema.sql` → Run
4. You now have 3 tables ready

### Step 2 — Seed your competitors

In the SQL Editor:

```sql
insert into competitors (name) values
  ('Competitor A'),
  ('Competitor B'),
  ('Competitor C');

insert into competitor_handles (competitor_id, platform, handle, status)
  select id, 'instagram', 'competitor_a_ig', 'approved' from competitors where name = 'Competitor A';
-- repeat for each (competitor, platform)
```

**For YouTube**, store the `channel_id` in `metadata`:

```sql
update competitor_handles
  set metadata = '{"channel_id":"UCxxxxxxxxxxxxxxxxxxxxxx"}'::jsonb
  where handle = 'CompetitorA' and platform = 'youtube';
```

The channel_id can be found via [commentpicker.com/youtube-channel-id.php](https://commentpicker.com/youtube-channel-id.php).

### Step 3 — Get your API keys

| Service | Where to find it |
|---|---|
| Supabase URL + Service Role Key | Supabase → Settings → API |
| Apify API token | Apify Console → Settings → Integrations |
| YouTube Data API key | [console.cloud.google.com](https://console.cloud.google.com) → API Library → YouTube Data API v3 |
| Anthropic API key | [console.anthropic.com](https://console.anthropic.com) → API Keys |

### Step 4 — Import the n8n workflows

1. Open your n8n
2. **+ Add workflow → ... → Import from File**
3. Import each file: `01-instagram-collector.json`, `02-tiktok-collector.json`, `03-youtube-collector.json`, `04-linkedin-collector.json`, `05-weekly-report-generator.json`
4. In each workflow, replace all `PASTE_YOUR_*_HERE` placeholders with your real keys

### Step 5 — Set up Gmail credentials (workflow 05)

Workflow 05 uses n8n's native Gmail node. Create a Gmail OAuth2 credential:

1. Credentials → New → Gmail OAuth2 API
2. Follow the 2-min flow
3. Select this credential inside the "Send via Gmail" node
4. Replace `PASTE_YOUR_RECIPIENT_EMAIL_HERE` with your own email

### Step 6 — Test

For each collector:
1. Click **Manual Trigger** → **Execute Workflow**
2. Check every node turns green
3. Open Supabase → `channel_metrics` table → you should see the rows

For the report:
1. Wait 2-3 days for data to accumulate (otherwise deltas are zero)
2. Run workflow 05 manually
3. Check your inbox

Once validated, **activate** all 5 workflows (top-right toggle).

---

## 4. Per platform — what to know

### Instagram (workflow 01)
- Public accounts only
- Stored metrics: `followers`, `total_posts`
- Apify actor: `apify/instagram-profile-scraper`

### TikTok (workflow 02)
- All profiles are public → no friction
- Stored metrics: `followers` (fans), `total_posts` (videos)
- Apify actor: `clockworks/tiktok-profile-scraper`

### YouTube (workflow 03)
- Uses the official API (free + stable)
- Requires the `channel_id` (not just the handle)
- Stored metrics: `followers` (subs), `total_posts` (videos), `total_views`

### LinkedIn (workflow 04)
- **Company Pages only** (not personal profiles)
- Stored metrics: `followers`, `employee_count`
- Slowest (~90s/profile) and most expensive Apify actor (~$0.008)

---

## 5. The Claude prompt — how it works

Workflow 05 builds a two-part prompt:

**System prompt (analyst identity):**
```
You are a senior competitive intelligence analyst. Your client tracks
competitors across social platforms and relies on you to surface what
matters each week. Be sharp, concise, and actionable. Never invent numbers.
Base every claim on the data provided. Write in the same language as the
user's request.
```

**User prompt (data + instructions):**
- The computed deltas (followers, posts, views, week N vs N-1)
- A forced report structure: Executive summary → Top movers → Content cadence → Platform insights → Recommendations

Customise the 5 sections inside the "Build Claude Prompt" node. Example: add "Focus on LinkedIn if B2B client, Instagram if B2C client".

---

## 6. Example report

```markdown
# Competitor Intel — Week ending 2026-04-14

## Executive summary
- Competitor A gained +8.2k IG followers this week (+3.1% vs monthly average)
- Competitor B is slowing on TikTok — only 2 posts in 7 days
- Competitor C clearly launched a LinkedIn campaign (+1.4k followers, +8 posts)

## Top movers
**Winners:**
- Competitor A (Instagram): +8,200 followers
- Competitor C (LinkedIn): +1,400 followers
- Competitor A (TikTok): +2,100 fans

**Losers:**
- Competitor B (TikTok): -120 fans (unfollow wave after a controversial post)

## Content cadence signal
Competitor A is holding pace (5 IG posts this week). Competitor B is on pause
on TikTok (2 posts vs 7 last week). Competitor C is going on the offensive
on LinkedIn — likely a commercial campaign is running.

## Platform-by-platform
**Instagram:** Competitor A is dominating. Gains likely driven by a viral reel.
Worth investigating.
**TikTok:** Quiet market, apart from Competitor B's drop.
**LinkedIn:** Clear push from Competitor C. Check their feed.

## Recommendations
1. Post an Instagram Reel this week — feed is active
2. Audit Competitor C's last 3 LinkedIn posts (campaign in progress)
3. Don't change anything on TikTok — sector is flat
```

---

## 7. Customisation

### Change the frequency
- **Daily** (default) → cron values `0 6 * * *`, `15 6 * * *`, etc.
- **Weekly** → `0 6 * * 1` (Monday 06:00)
- **Monthly** → `0 6 1 * *` (1st of the month)

Report deltas are computed over 7 days. If you switch to monthly, also change `86400000 * 7` → `86400000 * 30` inside the "Compute Weekly Deltas" node.

### Add a platform
The pattern is always: Schedule → Fetch handles → Loop → Apify/API → Build row → Upsert. Duplicate an existing collector, swap the Apify actor and the extraction. 30-45 min.

Popular Apify actors:
- Facebook: `apify/facebook-pages-scraper`
- Twitter/X: `apify/twitter-scraper`
- Twitch: `pocesar/twitch-scraper`

### Change the analysis criteria
Everything lives inside the "Build Claude Prompt" node (workflow 05). You can:
- Add sections (e.g. "Prices displayed this week")
- Change the tone ("formal" vs "casual")
- Force a language (by default the analyst replies in the language of the prompt)

### Send the report somewhere else
Swap the final Gmail node for:
- A **Slack** node (channel #competitive-intel)
- A **Notion** node (append a row to a "Weekly Reports" database)
- A **Google Sheets** node (archive of all reports)

---

## 8. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| "No approved handles found" | Nothing in `status='approved'` | `update competitor_handles set status='approved' where ...` |
| Apify scraper times out | Handle in error or private | Set the handle to `status='paused'` |
| Report is empty | < 7 days of data | Wait a week before the first real report |
| Claude returns 401 | API key mis-pasted | Check all `PASTE_YOUR_ANTHROPIC_API_KEY_HERE` were replaced |
| YouTube: quota exceeded | More than 10k calls/day | Stagger crons or request a quota bump |
| Gmail "Invalid credentials" | OAuth expired in n8n | Reconnect the credential (Credentials → Gmail → Update) |

---

## 9. Going further

You have the system running. Here's how to level up:

- 🚀 **The [Taiyka Skool community](https://taiyka.com/skool)** — access to advanced pipeline versions (per-post content analysis, automatic campaign detection, real-time alerting), weekly Q&A lives, reviews of your reports, all my calibrated prompts.

- 📩 **The [Cold Outreach Pack](https://taiyka.com/products/cold-outreach-pack) (€19)** — to turn intel into targeted outbound (identify your competitors' clients, offer them something better).

- 🤖 **The [AI Agent Playbook](https://taiyka.com/products/ai-agent-playbook) (€29)** — to plug in a Claude agent that answers "what did Competitor A do this week" live in Slack / DM.

---

**Manu** · [@manu_ai.to](https://instagram.com/manu_ai.to) · [taiyka.com](https://taiyka.com)

Your system is running? DM me, I love seeing reports in production.
