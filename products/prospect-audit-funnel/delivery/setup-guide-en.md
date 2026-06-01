# Setup guide — Smart Prospect Audit Funnel (EN)

> Written for an agency owner who can wire up an n8n workflow and deploy a static page. Expect 60 to 90 minutes to get the funnel into production, customization included.

---

## Required accounts

- **n8n** — cloud (n8n.io) or self-hosted, either works. Native nodes only, no external dependencies.
- **Anthropic** — API key from [console.anthropic.com](https://console.anthropic.com). Plan for 5€ of test credit minimum.
- **Google Workspace** — a Google account with Sheets + Gmail access. A dedicated agency account is recommended.
- **Calendly** — one event type configured (30 min, qualification call). You'll need the public URL of the event type.
- **A static host** for the form — Vercel, Netlify, Cloudflare Pages, or your own WordPress with an HTML plugin.

---

## Step 1 — Import the n8n workflow (5 min)

1. Open your n8n instance.
2. Create a new empty workflow: **+ Add workflow**.
3. Click the menu (three dots top right) → **Import from File**.
4. Select `source/n8n-workflow.json`.
5. You should see 9 nodes branching into three paths after "Parse + format" (Sheets / Gmail / Respond to form).

If the import fails: check that your n8n version is at least 1.50.

---

## Step 2 — Configure credentials (15 min)

You have **5 things to wire**. Open each node and replace the `PASTE_YOUR_*_HERE` placeholders.

### 2.1 — "Config" node

| Field | Replace with |
|---|---|
| `anthropic_api_key` | Your Anthropic API key (`sk-ant-...`) |
| `claude_model` | Leave `claude-sonnet-4-6`, or switch to `claude-haiku-4-5` to save cost |
| `agency_name` | Your agency name |
| `agency_vertical` | The vertical you serve |
| `calendly_url` | The public URL of your Calendly event type |
| `notification_email` | Where you want the prospect debrief |
| `google_sheet_id` | Your spreadsheet ID |

### 2.2 — Google Sheets credential

1. Create a Google Sheet with a tab named exactly **`prospects`**.
2. Paste this header row into row 1:
   ```
   submitted_at | full_name | contact_email | contact_phone | company_name | company_size | industry | bottleneck | hours_wasted_weekly | tech_stack | ai_familiarity | budget_monthly | decision_authority | timeline | slot_intent | qualification_score | qualification_reason | summary | top_solutions_json
   ```
3. In n8n: Settings → Credentials → New → Google Sheets OAuth2.
4. Wire the credential to the "Log to Google Sheets" node.

### 2.3 — Gmail credential

1. In n8n: Settings → Credentials → New → Gmail OAuth2.
2. Wire the credential to the "Email debrief" node.

---

## Step 3 — Customize the Claude prompt for your vertical (15 min)

1. Open the **"Build Claude prompt"** node (code node).
2. Find the `system` constant.
3. Edit:
   - `# IDENTITY` — already templated, tweak the tone if needed.
   - `# CONSTRAINTS` — add 2-3 rules specific to your vertical.
   - **(Optional)** Add a `# QUALIFICATION RUBRIC` section with your own budget thresholds.
4. Save.

Tip: run the workflow once with a fake prospect first (step 7) to see how Claude replies with the default prompt.

---

## Step 4 — Customize the form (10 min)

Open `source/audit-form-template.html` in a text editor.

**Minimum:** title tag, h1, optional questions.
**Brand:** search for `bg-[#0A1628]` and replace with your hex codes.

If you add custom questions, also update the `Normalize answers` node and the Claude prompt accordingly.

---

## Step 5 — Connect Calendly (5 min)

Copy your event URL → paste into the `calendly_url` field in the "Config" node.

---

## Step 6 — Deploy the form (15 min)

### Vercel (recommended)
1. Create `audit-funnel/index.html` with your customized HTML.
2. Run `npx vercel`, follow prompts.
3. Map to your own domain.

### Netlify Drop
[app.netlify.com/drop](https://app.netlify.com/drop) → drag and drop.

### WordPress / Webflow
Use a "Custom HTML" block. Make sure your theme doesn't strip the `<script>` at the bottom.

**In all cases:** replace `WEBHOOK_URL` constant with your n8n production webhook URL.

---

## Step 7 — End-to-end test (10 min)

1. Activate the workflow.
2. Fill the form with realistic data.
3. Verify all 4 outcomes:
   - Loading animation 15-30 sec
   - Reply with solutions + Calendly button
   - Debrief email in your inbox
   - New row in Google Sheet

If any of the 4 is missing, check the execution logs in n8n.

---

## Step 8 — Go live (5 min)

1. Confirm Production URL (not Test).
2. Disable webhook test mode.
3. Add the form URL to your Instagram bio, email signatures, lead magnets.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Form stuck on "Analyzing…" | Webhook not active/public | Activate the workflow, check Production URL |
| Debrief email never received | Gmail credential misconfigured | Reconnect the credential |
| "qualification_score: 0" everywhere | Claude returns Markdown instead of JSON | Confirm system prompt forces STRICT JSON |
| Google Sheets not updating | Wrong sheet_id, wrong tab name, missing headers | Check ID + exact spelling of `prospects` tab |
| HTTP 529 from Anthropic | Plan saturated | Add retry on "Call Claude" node or upgrade |
| Claude always replies in English | Auto-detection insufficient | Add to system prompt: `Reply ONLY in French.` |

---

## Going further

- Wire **Slack** node after "Parse + format" to ping sales rep on prospects scoring >80/100.
- Wire **HubSpot/Pipedrive** to auto-create qualified deals.
- If >50 audits/month, switch model to `claude-haiku-4-5` (5x cheaper, quality stays decent on structured use cases).

Stuck? Reply to the Gumroad delivery email.
