# Sales copy — Smart Prospect Audit Funnel (EN)

> Landing page (`/products/prospect-audit-funnel`) + social CTAs. Price: **€49**.

---

## H1 (hero)
**Qualify your prospects while you sleep.**
The AI audit funnel I use at Taiyka so I never waste another call on a tire-kicker. Yours for €49.

## Sub-hero
An audit form + a Claude agent that generates a tailored list of solutions in 20 seconds + a PDF-style debrief in your inbox before the prospect even books their slot. You walk into the call already prepped. Plug-and-play, importable in 60 min.

## Value bullets (4)
- 🎯 **14 questions that filter real prospects from tire-kickers** — budget, decision authority, timeline, operational pain. No more calls with people who "just want to understand AI".
- ⚡ **1 importable n8n workflow** — webhook → Claude → Google Sheets → Gmail debrief → success page with your Calendly link. Everything wired.
- 🤖 **An AI agent that writes the solutions list for you** — Claude reads the answers, outputs 3 to 5 tailored solutions + a 0-100 qualification score. You see at a glance who deserves your time.
- 📥 **The automatic pre-call debrief** — when a prospect fills the form, you receive a structured email: summary, score, top solutions, raw data. You walk into the call already prepared.

## Primary CTA
**Get the funnel — €49 →** *(Gumroad button)*

## Secondary CTA
*Secure Gumroad checkout. You get the ZIP with the workflow + the form + the prompts + the setup guide in 30 seconds.*

---

## "Who it's for" section

**This is for you if:**
- You run an AI/automation agency (or are a solo freelancer) and you get leads without knowing which ones deserve a call
- You already use n8n and Claude (or you're ready to learn — 1h max if you're starting fresh)
- You have a Calendly wired to your calendar and you want to stop wasting 30 min on "free audits" for unqualified prospects
- You want a system that shows your skills to the prospect BEFORE the call (not during)

**This is NOT for you if:**
- You do 200+ leads/month and need Salesforce-grade tooling — this is optimized for agencies at 5-50 leads/month
- You have zero authority on your tech stack and can't wire an n8n workflow yourself
- You sell to consumers on Etsy — this is a B2B funnel, not e-commerce

---

## What's in the pack

- `n8n-workflow.json` — full workflow, 9 nodes, importable directly
- `audit-form-template.html` — the 14-question form, Tailwind via CDN, deployable to Vercel/Netlify in 5 min
- `claude-prompt-template.md` — the system prompt with example input + output to calibrate
- `setup-guide-fr.md` + `setup-guide-en.md` — step-by-step install guide (60-90 min total)
- Cover SVG if you want to rebrand it for your agency

---

## Short variants (stories / posts / DMs)

### Variant 1 — Specificity
> The exact system I use at Taiyka to qualify prospects before a call. Form + Claude + auto debrief. €49. Link in bio.

### Variant 2 — Curiosity gap / Result
> Stopped wasting 30 min on "free audits" with tire-kickers. Here's the funnel that filters. €49. Link in bio.

### Variant 3 — Challenge
> Still doing qualification calls where you ask the same 10 questions every time? Here's what you can automate. €49.

### Variant 4 — Transparency
> n8n workflow + Claude prompt + HTML form. Everything you need for a prospect to land on your Calendly already qualified. €49. No upsell.

### Variant 5 — Problem hook
> "How many hours/week are you wasting?" — the question 80% of my prospects had never thought about. My funnel forces them to answer before the call. €49.

---

## FAQ

**Q: I've never touched n8n. Can I get this running?**
A: Yes, but plan 2h instead of 60 min. The setup guide is written for n8n beginners (not tech beginners). If you've ever built a Zap, you're good.

**Q: How much does it cost in Anthropic API per audit?**
A: With `claude-sonnet-4-6`: ~€0.02 per audit. With `claude-haiku-4-5`: ~€0.004. On 100 audits/month, you're between €0.40 and €2.

**Q: Can I resell this to my clients?**
A: No. This is a license for personal/internal agency use. If you want to resell, DM me on Insta for an agency license.

**Q: Does it work with Make or Zapier instead of n8n?**
A: The workflow is written for n8n. You can port it to Make or Zapier but the JS code nodes don't migrate as-is — plan 1h of porting.

**Q: Is the form responsive?**
A: Yes. Tailwind via CDN, tested on mobile / tablet / desktop.

**Q: Do I need Gmail? What if I use Outlook?**
A: The workflow uses the Gmail node by default. Replace it with the native n8n SMTP node and configure your Outlook/SMTP server. Plan 10 min.

---

## Final CTA

**Stop the unqualified calls. Get the funnel — €49 →** *(Gumroad button)*

---

## Post-purchase email

**Subject:** ✅ Your Prospect Audit Funnel is ready — first qualified lead in 60 min

**Body:**

Hey,

Thanks for buying 🙏

Download the pack here → [ZIP_LINK]

Inside:
- **`n8n-workflow.json`** — the full workflow, ready to import into your n8n
- **`audit-form-template.html`** — the 14-question form, deployable to Vercel/Netlify
- **`claude-prompt-template.md`** — the full prompt + example input/output to calibrate
- **`setup-guide-fr.md`** + **`setup-guide-en.md`** — step-by-step install guides
- **`cover.svg`** — the product cover if you want to rebrand it

**My advice to get started:**

1. Read `setup-guide-en.md` fully before touching anything. 15 min.
2. Follow the 8 steps in order. Don't skip step 3 (prompt customization) — that's what turns a generic funnel into one that closes deals.
3. Test with your own company first. Fill out the form as if you were a prospect. If Claude returns a solution list that resonates, you're ready. If not, go back to step 3.
4. **Important:** don't put it in your Insta bio until you've completed the end-to-end test. A broken funnel in your bio is worse than no funnel at all.

When your first prospect fills out the form in prod, **DM me on Insta** ([@manu_ai.to](https://instagram.com/manu_ai.to)) — I love seeing what people build.

Stuck somewhere? Reply to this email. I read everything.

Now go ship 🚀

— Manu

PS: the **[Skool community](https://taiyka.com/skool)** publishes one new lead-gen system per month (full funnel, prompts, workflows all wired), live reviews of your funnel by me, and a shared "qualified prospects" channel. If you want to accelerate after this funnel, that's the place.
