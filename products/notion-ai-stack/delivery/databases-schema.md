# Notion AI Stack — Databases Schema (quick reference)

> JSON-ish reference for all 5 databases. Copy from here when building in Notion.

---

## ai_tools

```json
{
  "database": "AI Tools",
  "icon": "🧠",
  "properties": {
    "Name": { "type": "title" },
    "Category": { "type": "select", "options": ["LLM", "Automation", "Scraping", "Content", "Analytics", "Voice", "Image", "Video", "Other"] },
    "Status": { "type": "select", "options": ["🟢 Active", "🟡 Testing", "🔴 Churned", "⚪ Watching"] },
    "Monthly cost": { "type": "number", "format": "euro" },
    "Plan": { "type": "select", "options": ["Free", "Starter", "Pro", "Enterprise", "One-time"] },
    "Use case": { "type": "rich_text" },
    "Used by workflow": { "type": "relation", "target": "Automation Backlog" },
    "Used on project": { "type": "relation", "target": "Projects" },
    "Login URL": { "type": "url" },
    "API docs": { "type": "url" },
    "Added on": { "type": "date" },
    "Last reviewed": { "type": "date" },
    "Notes": { "type": "rich_text" }
  },
  "default_views": ["Active stack (Table)", "Cost by category (Board)", "Testing (Gallery)", "Review queue (Table)"]
}
```

---

## automation_backlog

```json
{
  "database": "Automation Backlog",
  "icon": "⚡",
  "properties": {
    "Name": { "type": "title" },
    "Status": { "type": "select", "options": ["💡 Idea", "📋 Planned", "🛠️ Building", "🧪 Testing", "✅ Live", "💀 Killed"] },
    "Priority": { "type": "select", "options": ["🔥 High", "🟡 Medium", "🟢 Low"] },
    "Impact": { "type": "select", "options": ["⚡⚡⚡ High", "⚡⚡ Medium", "⚡ Low"] },
    "Effort": { "type": "select", "options": ["S (1-2h)", "M (half day)", "L (1-3 days)", "XL (1 week+)"] },
    "Platform": { "type": "multi_select", "options": ["n8n", "Make", "Zapier", "Python", "Custom", "Claude Skill"] },
    "Problem": { "type": "rich_text" },
    "Solution": { "type": "rich_text" },
    "Tools used": { "type": "relation", "target": "AI Tools" },
    "For project": { "type": "relation", "target": "Projects" },
    "ROI estimate": { "type": "rich_text" },
    "Started on": { "type": "date" },
    "Live since": { "type": "date" },
    "Runtime URL": { "type": "url" },
    "Notes": { "type": "rich_text" }
  },
  "default_views": ["Top priorities (Table)", "In progress (Board)", "Live (Table)", "Ideas (Gallery)", "Impact × Effort (Board)"]
}
```

---

## prompt_library

```json
{
  "database": "Prompt Library",
  "icon": "📚",
  "properties": {
    "Title": { "type": "title" },
    "Category": { "type": "select", "options": ["Content", "Sales", "Operations", "Research", "Customer Support", "Internal"] },
    "Use case": { "type": "rich_text" },
    "Prompt": { "type": "rich_text" },
    "Language": { "type": "select", "options": ["FR", "EN", "Both"] },
    "Favorite": { "type": "checkbox" },
    "Remixed": { "type": "checkbox" },
    "Model best for": { "type": "multi_select", "options": ["Claude", "GPT", "Gemini", "Local", "n8n node"] },
    "Used by workflow": { "type": "relation", "target": "Automation Backlog" },
    "Last used": { "type": "date" },
    "Notes / variants": { "type": "rich_text" }
  },
  "default_views": ["By category (Gallery)", "Favorites (Table)", "Remixed (Gallery)", "By language (Board)"],
  "tip": "Import the Prompt Pack 50 CSV directly to populate this database."
}
```

---

## clients

```json
{
  "database": "Clients",
  "icon": "🧑‍💼",
  "properties": {
    "Name": { "type": "title" },
    "Status": { "type": "select", "options": ["👀 Prospect", "💬 In talks", "✍️ Proposal sent", "🟢 Active", "⏸️ Paused", "🔵 Past"] },
    "Industry": { "type": "select", "options": ["SaaS", "E-commerce", "Agency", "Local biz", "Creator", "Other"] },
    "Primary contact": { "type": "rich_text" },
    "Email": { "type": "email" },
    "Language": { "type": "select", "options": ["FR", "EN", "Other"] },
    "Source": { "type": "select", "options": ["Referral", "Inbound", "Outbound", "Social", "Event", "Other"] },
    "Projects": { "type": "relation", "target": "Projects" },
    "Total invoiced": { "type": "rollup", "source": "Projects", "property": "Price", "function": "sum" },
    "First contact": { "type": "date" },
    "Last touch": { "type": "date" },
    "Next action": { "type": "rich_text" },
    "Notes": { "type": "rich_text" }
  },
  "default_views": ["Active (Table)", "Pipeline (Board)", "To re-engage (Table)", "Top clients (Table)"]
}
```

---

## projects

```json
{
  "database": "Projects",
  "icon": "📦",
  "properties": {
    "Name": { "type": "title" },
    "Client": { "type": "relation", "target": "Clients" },
    "Status": { "type": "select", "options": ["📝 Scoping", "🛠️ In progress", "🧪 Review", "✅ Delivered", "💤 Paused", "❌ Cancelled"] },
    "Type": { "type": "select", "options": ["Automation", "Consulting", "Content", "Build", "Retainer", "Training"] },
    "Price": { "type": "number", "format": "euro" },
    "Invoiced": { "type": "checkbox" },
    "Paid": { "type": "checkbox" },
    "Start date": { "type": "date" },
    "Deadline": { "type": "date" },
    "Tools used": { "type": "relation", "target": "AI Tools" },
    "Workflows built": { "type": "relation", "target": "Automation Backlog" },
    "Deliverables": { "type": "rich_text" },
    "Post-mortem notes": { "type": "rich_text" }
  },
  "default_views": ["In progress (Board)", "Timeline", "Billing (Table)", "Delivered this quarter (Table)"]
}
```

---

## Relation graph (summary)

```
Clients 1─────* Projects
                 │
                 *
                 │ Tools used (*──*)
                 ├─────────────── AI Tools
                 │                   │
                 │ Workflows built   │ Used by workflow (*──*)
                 *───────────────────┼──────────────── Automation Backlog
                                     │
                                     │ Used by workflow (*──*)
                                     └──────────────── Prompt Library
```

All relations are many-to-many except `Projects → Client` (one project = one client).
