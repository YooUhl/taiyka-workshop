# Gumroad Listing — Smart Prospect Audit Funnel (EN)

> Source paste sheet for Gumroad's product creation form. Paste each field as-is. Last reviewed 2026-05-20.

---

## Field: Product name (max 60 chars)

```
Smart Prospect Audit Funnel — qualify while you sleep
```

(54 chars)

**Alternate 1 (44 chars):**
```
Smart Prospect Audit Funnel — n8n + Claude
```

**Alternate 2 (53 chars):**
```
The AI audit funnel for agencies (n8n + Claude)
```

---

## Field: Tagline / Subtitle (max 130 chars)

```
14-question form + Claude + an auto debrief in your inbox before the call. Plug-and-play in 60 min. Importable n8n.
```

(118 chars)

---

## Field: Price

- **Amount:** `49`
- **Currency:** EUR (Gumroad will auto-convert to USD if needed; keep EUR as anchor)
- **Pricing type:** Fixed price
- **Allow tips:** off

---

## Field: Cover / thumbnail

- **Cover image:** upload `delivery/cover.svg`
- If SVG rejected, export as PNG 1280×720 first
- **Thumbnail:** same as cover

---

## Field: Description (markdown)

```markdown
## Qualify your prospects while you sleep.

The AI audit funnel I use at Taiyka so I never waste another call on a tire-kicker.

An audit form + a Claude agent that generates a tailored list of solutions in 20 seconds + a structured debrief in your inbox **before** the prospect books their slot.

You walk into every call already prepped. Plug-and-play, importable in 60 min.

---

### What you get in the ZIP

- **`n8n-workflow.json`** — the full workflow, 9 nodes, importable directly into your n8n
- **`audit-form-template.html`** — the 14-question form, Tailwind via CDN, deployable to Vercel/Netlify in 5 min
- **`claude-prompt-template.md`** — the system prompt with example input + output to calibrate Claude
- **`setup-guide-fr.md`** + **`setup-guide-en.md`** — step-by-step install guide (60-90 min total)
- **`cover.svg`** — the cover if you want to rebrand it for your agency

---

### How it works

1. You drop the form link on your site / DMs / Insta bio
2. The prospect fills 14 questions (budget, authority, timeline, pain)
3. Webhook fires → Claude reads the answers → outputs 3-5 tailored solutions + a 0-100 score
4. You receive a structured email: summary, score, top solutions, raw data
5. The prospect lands on your Calendly **already qualified**
6. You take the call (or not) knowing exactly who you're talking to

---

### This is for you if

- You run an AI/automation agency or freelance solo and you get leads without knowing which ones deserve a call
- You already use n8n + Claude (or you're ready to learn — 1h max if you're new)
- You have a Calendly wired to your calendar and want to stop wasting 30 min on "free audits" for tire-kickers
- You want to show your skills to the prospect **before** the call, not during

### This is NOT for you if

- You do 200+ leads/month and need Salesforce-grade tooling — this is for agencies at 5-50 leads/month
- You have zero authority on your tech stack and can't wire an n8n workflow yourself
- You sell to consumers — this is a B2B funnel

---

### Cost to run

- Anthropic API (Claude Sonnet): **~€0.02 per audit**
- Anthropic API (Claude Haiku 4.5): **~€0.004 per audit**
- 100 audits/month = €0.40 to €2 in API

Everything else (n8n self-hosted or free tier, Google Sheets, Gmail, Vercel free): **€0**.

---

### Honest setup time

- If you already know n8n: **60 min**
- If you're new to n8n but used Zapier/Make: **2h**
- If you're starting from zero on tech: **half a day** — the guide is your best friend

---

### Guarantee

If after following the guide you can't get the funnel running in 24h, I'll refund you AND you keep the pack. DM `@manu_ai.to` on Instagram. That's it.

---

### Who I am

I'm Manu (Taiyka). I build AI agents for entrepreneurs and agencies in France and the Pacific. This funnel is the exact one I use every day to stop wasting time on leads that never close.

Question before buying → DM on [Instagram](https://instagram.com/manu_ai.to).
```

---

## Field: "What's included" bullets

```
- Full n8n workflow (9 nodes) — importable in 5 min
- 14-question HTML + Tailwind form (mobile responsive)
- Calibrated Claude system prompt (with example input/output)
- Step-by-step install guide (FR + EN)
- Rebrandable cover SVG
- Lifetime updates (any 1.x version)
- DM support on Instagram if you get stuck during install
```

---

## Field: FAQ

**Q1: I've never touched n8n. Can I get this running?**
A: Yes, but plan 2h instead of 60 min. The install guide is written for n8n beginners (not tech beginners). If you've ever built a Zap, you're good.

**Q2: How much does it cost in Anthropic API per audit?**
A: With `claude-sonnet-4-6`: ~€0.02 per audit. With `claude-haiku-4-5`: ~€0.004. On 100 audits/month, you're between €0.40 and €2.

**Q3: Can I resell this to my clients?**
A: No. This is a license for personal/internal agency use. If you want to resell, DM me on Insta for an agency license.

**Q4: Does it work with Make or Zapier instead of n8n?**
A: The workflow is written for n8n. You can port it to Make or Zapier but the JS code nodes don't migrate as-is — plan 1h of porting.

**Q5: Is the form responsive?**
A: Yes. Tailwind via CDN, tested on mobile / tablet / desktop.

**Q6: Do I need Gmail? What if I use Outlook?**
A: The workflow uses the Gmail node by default. Replace it with the native n8n SMTP node and configure your Outlook/SMTP server. Plan 10 min.

**Q7: How long before I get my first qualified prospect?**
A: Once the funnel is installed (60-90 min), the moment you drop the form link anywhere (DM, bio, site, lead magnet), the first complete audit can land the same day.

---

## Field: Refund policy

```
14-day no-questions-asked refund. DM @manu_ai.to on Instagram with your purchase email and I'll refund you the same day. You keep the pack — what you do with it is on you.
```

---

## Field: Tags

```
n8n
claude
ai automation
lead generation
b2b
agency tools
prospect qualification
workflow template
sales automation
ai agent
```

---

## Field: URL slug

```
prospect-audit-funnel
```

---

## Field: Categories

- Primary: **Business & Money → Sales & Marketing**
- Secondary: **Software Development → Templates**

---

## Pre-launch checklist

- [ ] Replace `[ZIP_LINK]` in post-purchase email with actual ZIP upload URL
- [ ] Confirm `cover.svg` renders OK as thumbnail (export PNG if not)
- [ ] Set `manu.uhila@taiyka.com` as seller contact in Gumroad
- [ ] Toggle VAT collection (Taiyka SIRET 99291760900016, TVA non applicable, art. 293 B du CGI)
- [ ] Wire the post-purchase email using `sales-en.md` post-purchase template
- [ ] Test purchase with 100% discount code (`TAIYKA-TEST`) before going public
- [ ] Set `gumroad.com/l/prospect-audit-funnel` as canonical link on the Taiyka product page
- [ ] Update `GUMROAD_URL` placeholder in `web/app/products/prospect-audit-funnel/page.tsx`
