# Gumroad Listing — Smart Prospect Audit Funnel (FR)

> Source paste sheet for Gumroad's product creation form. Paste each field as-is into the matching Gumroad input. Last reviewed 2026-05-20.

---

## Field: Product name (max 60 chars)

```
Smart Prospect Audit Funnel — qualifie pendant que tu dors
```

(58 chars)

**Alternate 1 (49 chars):**
```
Smart Prospect Audit Funnel — n8n + Claude
```

**Alternate 2 (55 chars):**
```
Le funnel d'audit IA pour agences (n8n + Claude)
```

---

## Field: Tagline / Subtitle (max 130 chars)

```
Un form de 14 questions + Claude + un debrief auto dans ton inbox avant le call. Plug-and-play en 60 min. Importable n8n.
```

(125 chars)

---

## Field: Price

- **Amount:** `49`
- **Currency:** EUR
- **Pricing type:** Fixed price (no PWYW slider — keep the anchor clean)
- **Allow tips:** off

---

## Field: Cover / thumbnail

- **Cover image:** upload `delivery/cover.svg` (1080×1080 SVG, on-brand Taiyka)
- If Gumroad rejects SVG cover, export as PNG 1280×720 first using any browser screenshot of `delivery/cover.svg`
- **Thumbnail option:** same as cover

---

## Field: Description (markdown, Gumroad-flavored)

```markdown
## Qualifie tes prospects pendant que tu dors.

Le funnel d'audit IA que j'utilise chez Taiyka pour ne plus jamais perdre un call avec un curieux.

Un formulaire d'audit + un agent Claude qui génère une liste de solutions sur-mesure en 20 secondes + un debrief dans ton inbox **avant** que le prospect ne réserve son créneau.

Tu arrives en call avec tout déjà mâché. Plug-and-play, importable en 60 min.

---

### Ce que tu reçois dans le ZIP

- **`n8n-workflow.json`** — le workflow complet, 9 nodes, importable directement dans ton n8n
- **`audit-form-template.html`** — le formulaire 14 questions, Tailwind via CDN, déployable sur Vercel/Netlify en 5 min
- **`claude-prompt-template.md`** — le system prompt avec exemple input + output pour calibrer Claude
- **`setup-guide-fr.md`** + **`setup-guide-en.md`** — guide d'install pas à pas (60-90 min total)
- **`cover.svg`** — la cover du produit si tu veux la rebrander pour ton agence

---

### Comment ça marche

1. Tu mets le form en lien sur ton site / DM / bio Insta
2. Le prospect remplit les 14 questions (budget, autorité, timeline, douleur)
3. Le webhook fire → Claude lit les réponses → sort 3-5 solutions personnalisées + un score 0-100
4. Tu reçois un email structuré : résumé, score, top solutions, données brutes
5. Le prospect arrive sur ton Calendly **déjà qualifié**
6. Tu prends le call (ou pas) en sachant exactement à qui tu parles

---

### C'est pour toi si

- T'as une agence ou tu fais du freelance en AI/automation et tu reçois des leads sans savoir lesquels valent un call
- Tu utilises déjà n8n + Claude (ou t'es prêt à apprendre — 1h max si t'es débutant)
- T'as un Calendly branché à ton calendrier et tu veux arrêter de perdre 30 min par "audit gratuit" non qualifié
- Tu veux montrer tes compétences au prospect **avant** le call, pas pendant

### C'est PAS pour toi si

- Tu fais 200+ leads/mois et tu cherches du Salesforce-grade — ici on optimise pour les agences à 5-50 leads/mois
- T'as zéro autorité sur ton stack tech et tu peux pas brancher un workflow n8n toi-même
- Tu vends à des particuliers — c'est un funnel B2B

---

### Coût d'exécution

- API Anthropic (Claude Sonnet) : **~0.02€ par audit**
- API Anthropic (Claude Haiku 4.5) : **~0.004€ par audit**
- Tu peux faire tourner 100 audits/mois pour 0.40-2€ d'API

Tout le reste (n8n self-hosted ou free tier, Google Sheets gratuit, Gmail, Vercel free) : **0€**.

---

### Setup time honnête

- Si tu connais déjà n8n : **60 min**
- Si tu débutes sur n8n mais t'as déjà touché à Zapier/Make : **2h**
- Si tu pars de zéro tech : **demi-journée** + le guide est ton meilleur ami

---

### Garantie

Si après avoir suivi le guide tu ne fais pas tourner le funnel en 24h, je te rembourse + tu gardes le pack. Tu DM `@manu_ai.to` sur Instagram. C'est tout.

---

### Qui je suis

Je suis Manu (Taiyka). Je build des agents IA pour des entrepreneurs et des agences en France et dans le Pacifique. Ce funnel, c'est exactement celui que j'utilise tous les jours pour ne pas perdre mon temps sur des leads qui ne ferment jamais.

Si t'as une question avant d'acheter → DM sur [Instagram](https://instagram.com/manu_ai.to).
```

---

## Field: "What's included" / "Get instant access to" (bullet list)

```
- Workflow n8n complet (9 nodes) — importable en 5 min
- Formulaire 14 questions HTML + Tailwind responsive
- System prompt Claude calibré (avec exemple input/output)
- Guide d'installation pas à pas (FR + EN)
- Cover SVG rebrandable
- Mises à jour à vie (toute version 1.x)
- Support DM Insta si tu bloques pendant l'install
```

---

## Field: FAQ (Gumroad allows FAQ blocks — paste each Q/A pair)

**Q1 : J'ai jamais touché à n8n. Je peux le faire marcher ?**
R : Oui, mais compte 2h au lieu de 60 min. Le guide d'install est écrit pour des débutants n8n (pas pour des débutants tech). Si t'as déjà créé un Zap, t'es bon.

**Q2 : Combien ça coûte en API Anthropic par audit ?**
R : Avec `claude-sonnet-4-6` : ~0.02€ par audit. Avec `claude-haiku-4-5` : ~0.004€. Sur 100 audits/mois, t'es entre 0.40€ et 2€.

**Q3 : Je peux le revendre à mes clients ?**
R : Non. C'est une licence pour un usage personnel/interne à ton agence. Si tu veux le revendre, DM moi sur Insta pour une licence agence.

**Q4 : Ça marche avec Make ou Zapier au lieu de n8n ?**
R : Le workflow est écrit pour n8n. Tu peux le porter sur Make ou Zapier mais les codes nodes JS ne migrent pas tels quels — prévois 1h de portage.

**Q5 : Le formulaire est responsive ?**
R : Oui. Tailwind via CDN, testé sur mobile / tablet / desktop.

**Q6 : Je dois avoir Gmail ? Si j'utilise Outlook ?**
R : Le workflow utilise le node Gmail par défaut. Remplace-le par le node SMTP natif (configure ton serveur Outlook/SMTP). Compte 10 min.

**Q7 : Combien de temps avant d'avoir mon premier prospect qualifié ?**
R : Une fois le funnel installé (60-90 min), dès que tu colles le lien du form quelque part (DM, bio, site, lead magnet), le premier audit complet peut arriver le jour même.

---

## Field: Refund policy

```
Remboursement 14 jours, no questions asked. Tu DM @manu_ai.to sur Instagram avec ton email d'achat, je te rembourse dans la journée. Tu gardes le pack — ça reste à toi de faire bon usage.
```

(Gumroad already has a 30-day refund policy by default — keep theirs visible AND paste this in the description for trust.)

---

## Field: Tags (8-10 max)

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
agent ia
```

---

## Field: URL slug

```
prospect-audit-funnel
```

(Full URL: `gumroad.com/l/prospect-audit-funnel`)

---

## Field: Categories (Gumroad's taxonomy)

- Primary: **Business & Money → Sales & Marketing**
- Secondary: **Software Development → Templates**

---

## Field: Discord roles / member access (if you have a Gumroad-Discord integration)

Not applicable. Buyers get pointed to the Taiyka Skool community via the post-purchase email instead.

---

## Pre-launch checklist before going public on Gumroad

- [ ] Replace `[LIEN_ZIP]` in the post-purchase email with the actual ZIP upload URL
- [ ] Confirm `cover.svg` renders correctly as the thumbnail (or convert to PNG if not)
- [ ] Add `manu.uhila@taiyka.com` as the contact email in Gumroad seller settings
- [ ] Enable VAT collection if Gumroad asks (Taiyka SIRET 99291760900016, but TVA non applicable, art. 293 B du CGI — toggle accordingly)
- [ ] Set up the "Send to customers after purchase" email automation using the existing post-purchase template in `sales-fr.md`
- [ ] Test buy with a 100% off discount code (`TAIYKA-TEST`) before going public
- [ ] Set `gumroad.com/l/prospect-audit-funnel` as the canonical link on the Taiyka site product page
- [ ] Update the placeholder in `web/app/products/prospect-audit-funnel/page.tsx` (`GUMROAD_URL`) with the real Gumroad link
