# How to use — Notion AI Stack

> The dashboard I use to keep my business in control without Google Sheets everywhere.
> — Manu, [Taiyka](https://instagram.com/manu_ai.to)

---

## What's in the pack

- **`template-spec-en.md`** — full spec to build the dashboard (30 min)
- **`template-spec-fr.md`** — French version
- **`databases-schema.md`** — JSON schema for each database (quick reference)
- **This guide** — onboarding + rituals + integration ideas

> ⚠️ **Important:** this product is a **spec + guide**, not a one-click duplicatable Notion template. The reason is explained in `template-spec-en.md`. A duplicatable Notion link will be added when v1 is live — you'll get it free as an update (keep your order email).

---

## Once the dashboard is built: where to start

### Week 1 — populate the databases

**Day 1 — AI Tools (15 min)**
List the 10 to 20 tools you actually use. One row per tool. Real monthly cost (not the sticker price if you have a deal).

**Day 2 — Clients + Projects (20 min)**
All your active clients, recent past ones, and current prospects. For each client, list associated projects (even past ones).

**Day 3 — Automation Backlog (20 min)**
Brain dump: everything you want to automate, even fuzzy ideas. Tag `Status = 💡 Idea` + `Impact` + `Effort`. You'll sort later.

**Day 4 — Prompt Library (optional, 15 min)**
If you bought the **Prompt Pack 50**, import the CSV directly into this database. Otherwise, add your 5 most-used prompts.

**Day 5 — Review + Command Center (10 min)**
Open the dashboard, check all views render correctly, adjust filters if needed.

---

## The 3 rituals that make the dashboard alive

This dashboard is useless if you open it once a month. The rituals below take **less than 1h per week** and make all the difference.

### 🗓️ Monday morning (15 min) — weekly planning
Open the Command Center and answer 3 questions:
1. What are the 3 deadlines this week? (`Projects → Timeline`)
2. Who do I need to re-engage? (`Clients → To re-engage`)
3. Which automation am I pushing this week? (`Automation Backlog → Top priorities`)

Block these items in Google Calendar. You just won the week.

### 🗓️ Friday evening (20 min) — retro
Goal: clean closure.
- Mark delivered projects `Status = ✅ Delivered`
- Check `Paid = true` on what's been invoiced and received
- Write 3 post-mortem lines on each delivered project (what worked, what to change)
- Log in `Prompt Library → Notes / variants` the prompts you remixed this week

### 🗓️ 1st of month (30 min) — stack review
This is when you stop wasting $200/mo on tools you never open.
- Open `AI Tools → Review queue`
- For each row: does it actually serve me? Keep, downgrade, or churn?
- Compute the total active stack cost
- Compare to last month
- Bonus: publish a "here's my stack this month" post — super easy content that works well

---

## Integration ideas (step 2)

Once you're comfortable with the manual dashboard, you can plug in automations so **Notion fills itself**. 3 tested ideas:

### 1. Prospect form → Clients (easy)
- Tally or Typeform with fields: name, email, industry, need
- n8n triggers on new submit → creates a row in `Clients` with `Status = 👀 Prospect`
- Win: zero manual entry, context ready in Notion when you prep the call

### 2. Stripe payment → Projects (intermediate)
- Stripe webhook on `payment.succeeded`
- n8n matches customer email with a client → toggles `Paid = true` on the matching project
- Win: your billing database is always up to date

### 3. Claude agent reads your backlog (advanced)
- Every Monday 7am, an n8n workflow reads `Priority = 🔥 High` items from `Automation Backlog`
- Claude generates a mini attack plan for the top one (broken into concrete tasks)
- The output lands in a Notion block or directly in Telegram
- Win: you start the week with a plan, not a blank page

---

## Mistakes to avoid

❌ **Creating a 6th database.** You think "I need a separate Leads db" — no, filter `Clients` by Status.

❌ **Over-customizing statuses.** The suggested selects cover 95% of cases. If you add "🟠 Waiting feedback", "🟣 Review v2", etc., in 3 months you won't know what to pick. Stay simple.

❌ **Filling for the sake of filling.** If a property is empty on 80% of rows, delete it. A healthy database has 80% fill rate on its key properties.

❌ **Skipping the rituals.** The dashboard loses its value in 2 weeks without discipline. Block the 3 rituals in your calendar **now**, not later.

---

## What's next?

- 🤖 **Automate the dashboard so it fills itself** (Stripe, Gmail, n8n → Notion)?
  → [Build Your First AI Agent ($29)](https://taiyka.com/products/ai-agent-playbook)

- 📊 **See how other solopreneurs use this dashboard + swap setups?**
  → [The Skool community](https://taiyka.com/skool)

---

**Manu** · [@manu_ai.to](https://instagram.com/manu_ai.to) · [taiyka.com](https://taiyka.com)
