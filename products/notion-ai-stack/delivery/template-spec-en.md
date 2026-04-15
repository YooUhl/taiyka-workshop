# Notion AI Stack — Complete template spec

> The Notion dashboard I built for my own business.
> You rebuild it in 30 minutes from this spec.
> — Manu, [Taiyka](https://instagram.com/manu_ai.to)

---

## ⚠️ Read this first

This file is **not** a one-click Notion template — it's the **exhaustive build blueprint** so you can build the dashboard yourself (30 min) **or** hand it off to someone.

Why? Because a truly good Notion setup lives with you — your databases, properties, and views must reflect **your** business, not mine. Follow this spec to the letter and you get the same result as a premium template, but you'll know exactly what's inside and why.

---

## Dashboard overview

```
┌────────────────────────────────────────────────────────────┐
│              🚀 AI STACK — SOLOPRENEUR DASHBOARD            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│   📊 COMMAND CENTER (home page)                            │
│   ├─ This week (auto-filtered tasks)                       │
│   ├─ Automation backlog (top 3)                            │
│   ├─ Monthly revenue (quick manual entry)                  │
│   └─ Shortcuts (links to the 5 databases)                  │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│   DATABASES                                                │
│   ├─ 🧠 AI Tools (your stack)                               │
│   ├─ ⚡ Automation Backlog (workflows to build)             │
│   ├─ 📚 Prompt Library (linked to Prompt Pack 50)          │
│   ├─ 🧑‍💼 Clients (light CRM)                              │
│   └─ 📦 Projects (deliverables, deadlines)                 │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│   📅 RITUALS                                                │
│   ├─ Monday — weekly planning                              │
│   ├─ Friday — retro                                        │
│   └─ 1st of month — stack review                           │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick build instructions (30 min)

1. **(5 min)** Create a blank Notion page → title "AI Stack Dashboard"
2. **(15 min)** Create the 5 databases in order below (each as "Full page database")
3. **(5 min)** On the dashboard page, add 4 "Linked view of database" to show the right views in the right place
4. **(5 min)** Add static content blocks (rituals, shortcuts, notes)

Sections below give you **every property and every view** for each database.

---

# Database 1 — 🧠 AI Tools

**Database name:** `AI Tools`
**Icon:** 🧠
**Role:** track every AI tool in your stack (paid/free, cost, usage)

## Properties

| Name | Type | Options / Format |
|---|---|---|
| `Name` | Title | — |
| `Category` | Select | LLM · Automation · Scraping · Content · Analytics · Voice · Image · Video · Other |
| `Status` | Select | 🟢 Active · 🟡 Testing · 🔴 Churned · ⚪ Watching |
| `Monthly cost` | Number | Format: Dollar ($) or Euro (€) |
| `Plan` | Select | Free · Starter · Pro · Enterprise · One-time |
| `Use case` | Text | 1 line — what you do with it |
| `Used by workflow` | Relation → `Automation Backlog` | Many-to-many |
| `Used on project` | Relation → `Projects` | Many-to-many |
| `Login URL` | URL | — |
| `API docs` | URL | — |
| `Added on` | Date | — |
| `Last reviewed` | Date | — |
| `Notes` | Text | Long comments |

## Views

### 1. 🟢 Active stack (default)
- **Type:** Table
- **Filter:** `Status = 🟢 Active`
- **Sort:** `Monthly cost` descending
- **Shown properties:** Name, Category, Monthly cost, Plan, Use case

### 2. 💰 Cost by category
- **Type:** Board
- **Group by:** `Category`
- **Filter:** `Status ≠ 🔴 Churned`
- **Shown properties:** Name, Monthly cost

### 3. 🧪 Testing
- **Type:** Gallery
- **Filter:** `Status = 🟡 Testing`
- **Shown properties:** Name, Use case, Added on

### 4. 📅 Review queue (re-evaluate monthly)
- **Type:** Table
- **Filter:** `Last reviewed < 30 days ago` OR empty
- **Sort:** `Last reviewed` ascending
- **Shown properties:** Name, Status, Monthly cost, Last reviewed

---

# Database 2 — ⚡ Automation Backlog

**Database name:** `Automation Backlog`
**Icon:** ⚡
**Role:** list workflows to build, prioritize them, track state

## Properties

| Name | Type | Options / Format |
|---|---|---|
| `Name` | Title | — |
| `Status` | Select | 💡 Idea · 📋 Planned · 🛠️ Building · 🧪 Testing · ✅ Live · 💀 Killed |
| `Priority` | Select | 🔥 High · 🟡 Medium · 🟢 Low |
| `Impact` | Select | ⚡⚡⚡ High · ⚡⚡ Medium · ⚡ Low |
| `Effort` | Select | S (1-2h) · M (half day) · L (1-3 days) · XL (1 week+) |
| `Platform` | Multi-select | n8n · Make · Zapier · Python · Custom · Claude Skill |
| `Problem` | Text | What problem it solves in 1 line |
| `Solution` | Text | How it works in 1 paragraph |
| `Tools used` | Relation → `AI Tools` | Many-to-many |
| `For project` | Relation → `Projects` | One-to-many |
| `ROI estimate` | Text | E.g. "saves 2h/week" / "$1000/month" |
| `Started on` | Date | — |
| `Live since` | Date | — |
| `Runtime URL` | URL | Link to n8n, Make, etc. |
| `Notes` | Text | — |

## Views

### 1. 🔥 Top priorities (default)
- **Type:** Table
- **Filter:** `Status ≠ ✅ Live` AND `Status ≠ 💀 Killed`
- **Sort:** `Priority` then `Impact` descending
- **Shown properties:** Name, Status, Priority, Impact, Effort, Platform

### 2. 🛠️ In progress
- **Type:** Board
- **Group by:** `Status`
- **Filter:** `Status = 🛠️ Building` OR `Status = 🧪 Testing`
- **Shown properties:** Name, Effort, Platform

### 3. ✅ Live
- **Type:** Table
- **Filter:** `Status = ✅ Live`
- **Sort:** `Live since` descending
- **Shown properties:** Name, Platform, ROI estimate, Runtime URL

### 4. 💡 Ideas to triage
- **Type:** Gallery
- **Filter:** `Status = 💡 Idea`
- **Shown properties:** Name, Problem, Impact

### 5. 🎯 Impact × Effort matrix
- **Type:** Board
- **Group by:** `Impact`
- **Sub-group by:** `Effort`
- **Filter:** `Status = 💡 Idea` OR `Status = 📋 Planned`

---

# Database 3 — 📚 Prompt Library

**Database name:** `Prompt Library`
**Icon:** 📚
**Role:** prompt library (can be populated via Prompt Pack 50)

## Properties

| Name | Type | Options / Format |
|---|---|---|
| `Title` | Title | — |
| `Category` | Select | Content · Sales · Operations · Research · Customer Support · Internal |
| `Use case` | Text | 1 line |
| `Prompt` | Text | Full prompt |
| `Language` | Select | FR · EN · Both |
| `Favorite` | Checkbox | — |
| `Remixed` | Checkbox | Check if you modified it for your own use |
| `Model best for` | Multi-select | Claude · GPT · Gemini · Local · n8n node |
| `Used by workflow` | Relation → `Automation Backlog` | Many-to-many |
| `Last used` | Date | — |
| `Notes / variants` | Text | — |

## Views

### 1. 📋 By category (default)
- **Type:** Gallery
- **Group by:** `Category`
- **Shown properties:** Title, Use case, Favorite

### 2. 🔥 Favorites
- **Type:** Table
- **Filter:** `Favorite = true`
- **Sort:** `Last used` descending
- **Shown properties:** Title, Category, Language, Last used

### 3. 🧪 Remixed prompts (my gold)
- **Type:** Gallery
- **Filter:** `Remixed = true`
- **Shown properties:** Title, Category, Use case

### 4. 🌍 By language
- **Type:** Board
- **Group by:** `Language`

---

# Database 4 — 🧑‍💼 Clients

**Database name:** `Clients`
**Icon:** 🧑‍💼
**Role:** light CRM to keep context on each client

## Properties

| Name | Type | Options / Format |
|---|---|---|
| `Name` | Title | Client or company |
| `Status` | Select | 👀 Prospect · 💬 In talks · ✍️ Proposal sent · 🟢 Active · ⏸️ Paused · 🔵 Past |
| `Industry` | Select | SaaS · E-commerce · Agency · Local biz · Creator · Other |
| `Primary contact` | Text | First + last name |
| `Email` | Email | — |
| `Language` | Select | FR · EN · Other |
| `Source` | Select | Referral · Inbound · Outbound · Social · Event · Other |
| `Projects` | Relation → `Projects` | One-to-many |
| `Total invoiced` | Rollup → `Projects.Price` | Sum |
| `First contact` | Date | — |
| `Last touch` | Date | — |
| `Next action` | Text | E.g. "Follow up on the 15th" |
| `Notes` | Text | Context, preferences, watchouts |

## Views

### 1. 🟢 Active (default)
- **Type:** Table
- **Filter:** `Status = 🟢 Active`
- **Sort:** `Last touch` ascending
- **Shown properties:** Name, Industry, Primary contact, Last touch, Next action

### 2. 🔥 Pipeline
- **Type:** Board
- **Group by:** `Status`
- **Filter:** `Status = 👀 Prospect` OR `Status = 💬 In talks` OR `Status = ✍️ Proposal sent`
- **Shown properties:** Name, Industry, Next action

### 3. 📅 To re-engage
- **Type:** Table
- **Filter:** `Last touch < 14 days ago` AND `Status ≠ 🔵 Past`
- **Sort:** `Last touch` ascending

### 4. 💰 Top clients
- **Type:** Table
- **Sort:** `Total invoiced` descending
- **Shown properties:** Name, Status, Total invoiced

---

# Database 5 — 📦 Projects

**Database name:** `Projects`
**Icon:** 📦
**Role:** deliverables, deadlines, prices per project

## Properties

| Name | Type | Options / Format |
|---|---|---|
| `Name` | Title | — |
| `Client` | Relation → `Clients` | One-to-one |
| `Status` | Select | 📝 Scoping · 🛠️ In progress · 🧪 Review · ✅ Delivered · 💤 Paused · ❌ Cancelled |
| `Type` | Select | Automation · Consulting · Content · Build · Retainer · Training |
| `Price` | Number | Format: $ or € |
| `Invoiced` | Checkbox | — |
| `Paid` | Checkbox | — |
| `Start date` | Date | — |
| `Deadline` | Date | — |
| `Tools used` | Relation → `AI Tools` | Many-to-many |
| `Workflows built` | Relation → `Automation Backlog` | Many-to-many |
| `Deliverables` | Text | Bulleted list of key deliverables |
| `Post-mortem notes` | Text | What worked / what to never do again |

## Views

### 1. 🛠️ In progress (default)
- **Type:** Board
- **Group by:** `Status`
- **Filter:** `Status ≠ ✅ Delivered` AND `Status ≠ ❌ Cancelled`
- **Shown properties:** Name, Client, Price, Deadline

### 2. 📅 Timeline
- **Type:** Timeline
- **Start:** `Start date`
- **End:** `Deadline`
- **Filter:** `Status ≠ ❌ Cancelled`

### 3. 💰 Billing
- **Type:** Table
- **Filter:** `Invoiced = false` OR `Paid = false`
- **Sort:** `Deadline` ascending
- **Shown properties:** Name, Client, Price, Invoiced, Paid

### 4. 🏁 Delivered this quarter
- **Type:** Table
- **Filter:** `Status = ✅ Delivered` AND `Deadline` this quarter
- **Sort:** `Deadline` descending

---

# 📊 Command Center (home page)

The main page contains, vertically:

## Block 1 — Header
- **Callout** 🚀 with your quarterly mission (e.g. "Q2: reach $10k/mo recurring")

## Block 2 — This week
- **Linked view of `Projects`** — "Timeline" view filtered on current week
- Full page width

## Block 3 — 2 columns side by side

**Left column:**
- Title: `⚡ Automations — top 3`
- **Linked view of `Automation Backlog`** — custom view:
  - Filter: `Priority = 🔥 High` AND `Status ≠ ✅ Live`
  - Limit: 3 items

**Right column:**
- Title: `🧑‍💼 Clients to re-engage`
- **Linked view of `Clients`** — "To re-engage" view
  - Limit: 5 items

## Block 4 — 2 columns side by side

**Left column:**
- Title: `🧠 Active stack`
- **Linked view of `AI Tools`** — "🟢 Active stack" view
  - Compact mode

**Right column:**
- Title: `📚 Favorite prompts`
- **Linked view of `Prompt Library`** — "🔥 Favorites" view
  - Limit: 5 items

## Block 5 — Rituals
- **Toggle list** with 3 entries:
  - `📅 Monday — weekly planning (15 min)` → embedded checklist
  - `📅 Friday — retro (20 min)` → embedded checklist
  - `📅 1st of month — stack review (30 min)` → embedded checklist

Checklist contents: see **Rituals** section below.

## Block 6 — Shortcuts
- **5 columns** with 5 clickable cards linking to each database:
  `🧠 AI Tools` · `⚡ Backlog` · `📚 Prompts` · `🧑‍💼 Clients` · `📦 Projects`

---

# 📅 Rituals — checklist contents

## Monday (15 min) — weekly planning
- [ ] Open `Projects → Timeline` and identify this week's 3 deadlines
- [ ] Open `Clients → To re-engage` and list the 3 priority messages
- [ ] Open `Automation Backlog → Top priorities` and pick 1 workflow to push this week
- [ ] Block time slots in Google Calendar

## Friday (20 min) — retro
- [ ] Mark delivered projects as ✅ Delivered
- [ ] Mark paid projects as `Paid = true`
- [ ] Add a short post-mortem on each delivered project (3 lines max)
- [ ] Log in `Prompt Library → Notes / variants` the prompts you actually used this week

## 1st of month (30 min) — stack review
- [ ] Open `AI Tools → Review queue` and process each row: `Last reviewed = today`
- [ ] Identify 1 tool to churn (if `Status = 🟡 Testing` and rarely used)
- [ ] Compute total cost of active stack → compare to last month
- [ ] Publish 1 piece of content about your current stack (transparency = easy content)

---

# 🎯 Usage tips

- **Don't multiply databases.** 5 is the right number. Beyond that it becomes a graveyard.
- **Filtered views > extra databases.** Instead of a "Leads" db, filter `Clients` by `Status = 👀 Prospect`.
- **Rollups are your friend.** `Total invoiced` per client auto-calculates. Zero double entry.
- **Bidirectional relations:** verify each relation also appears in the target db (e.g. `Projects → Tools used` must show up from `AI Tools → Used on project`).
- **Mobile capture:** on each db, create a "Quick capture" view with only `Name + Status + Notes` to add items in 5 seconds from your phone.

---

# 🔌 Possible integrations (for later)

- **n8n → Notion**: create a client from a Tally form → Notion creates the row automatically
- **Stripe → Notion**: when payment lands, `Paid = true` automatically
- **Claude → Notion**: an agent that reads your Automation Backlog and proposes the top 3 priorities every Monday morning

All of these are buildable with n8n + Notion API. That's exactly what we cover in Tier 2.

---

## What's next?

- 🤖 **Plug your dashboard into n8n so it fills itself?**
  → [Build Your First AI Agent ($29)](https://taiyka.com/products/ai-agent-playbook)

- 📊 **See how other solopreneurs use this dashboard + share your own setups?**
  → [The Skool community](https://taiyka.com/skool)

---

**Manu** · [@manu_ai.to](https://instagram.com/manu_ai.to) · [taiyka.com](https://taiyka.com)
