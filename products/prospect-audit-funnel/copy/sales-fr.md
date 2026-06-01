# Sales copy — Smart Prospect Audit Funnel (FR)

> Landing page (`/products/prospect-audit-funnel`) + CTAs social. Prix : **49€**.

---

## H1 (hero)
**Qualifie tes prospects pendant que tu dors.**
Le funnel d'audit IA que j'utilise chez Taiyka pour ne plus jamais perdre un call avec un curieux. À toi pour 49€.

## Sub-hero
Un formulaire d'audit + un agent Claude qui génère une liste de solutions sur-mesure en 20 secondes + un debrief PDF dans ton inbox avant que le prospect ne réserve son créneau. Tu arrives en call avec tout déjà mâché. Plug-and-play, importable en 60 min.

## Bullets de valeur (4)
- 🎯 **14 questions qui filtrent les vrais prospects des curieux** — budget, autorité de décision, timeline, douleur opérationnelle. Tu ne perds plus tes calls avec des gens qui "veulent juste comprendre l'IA".
- ⚡ **1 workflow n8n importable en 5 min** — webhook → Claude → Google Sheets → Gmail debrief → page de succès avec ton lien Calendly. Tout est câblé.
- 🤖 **Un agent IA qui produit la liste de solutions à ta place** — Claude lit les réponses, sort 3 à 5 propositions personnalisées + un score de qualification 0-100. Tu vois en un coup d'œil qui mérite ton temps.
- 📥 **Le debrief automatique avant le call** — quand un prospect remplit le form, tu reçois un email structuré : résumé, score, top solutions, données brutes. Tu arrives en call déjà préparé.

## CTA principal
**Récupère le funnel — 49€ →** *(bouton Gumroad)*

## CTA secondaire
*Paiement sécurisé Gumroad. Tu reçois le ZIP avec le workflow + le form + les prompts + le guide d'install en 30 secondes.*

---

## Section "c'est pour qui"

**C'est pour toi si :**
- T'as une agence (ou freelance solo) en AI/automation et tu reçois des leads sans savoir lesquels valent un call
- Tu utilises déjà n8n et Claude (ou t'es prêt à apprendre — 1h max si t'es débutant)
- T'as un Calendly branché à ton calendrier et tu veux arrêter de perdre 30 min par "audit gratuit" non qualifié
- Tu veux un système qui montre tes compétences au prospect AVANT le call (pas pendant)

**C'est PAS pour toi si :**
- Tu fais 200+ leads/mois et tu cherches du Salesforce-grade — ici on optimise pour les agences à 5-50 leads/mois
- T'as zéro autorité sur ton stack tech et tu peux pas brancher un workflow n8n toi-même
- Tu vends à des particuliers sur Etsy — c'est un funnel B2B, pas e-commerce

---

## Ce qu'il y a dans le pack

- `n8n-workflow.json` — le workflow complet, 9 nodes, importable directement
- `audit-form-template.html` — le formulaire 14 questions, Tailwind via CDN, déployable sur Vercel/Netlify en 5 min
- `claude-prompt-template.md` — le system prompt avec exemple input + output pour calibrer
- `setup-guide-fr.md` + `setup-guide-en.md` — guide d'install pas à pas (60-90 min total)
- Cover SVG si tu veux le rebrander pour ton agence

---

## Variantes courtes (stories / posts / DM)

### Variante 1 — Specificity
> Le système exact que j'utilise chez Taiyka pour qualifier mes prospects avant un call. Form + Claude + debrief auto. 49€. Lien bio.

### Variante 2 — Curiosity gap / Result
> J'ai arrêté de perdre 30 min par "audit gratuit" avec des curieux. Voici le funnel qui filtre. 49€. Lien bio.

### Variante 3 — Challenge
> Tu fais encore des calls de qualification où tu poses les mêmes 10 questions à chaque fois ? Voilà ce que tu peux automatiser. 49€.

### Variante 4 — Transparence
> Workflow n8n + prompt Claude + form HTML. Tout ce qu'il faut pour qu'un prospect arrive sur ton Calendly déjà qualifié. 49€. Aucun upsell.

### Variante 5 — Hook problème
> "T'as combien d'heures perdues par semaine ?" — la question à laquelle 80% de mes prospects n'ont jamais réfléchi. Mon funnel les force à y répondre avant le call. 49€.

---

## FAQ

**Q : J'ai jamais touché à n8n. Je peux le faire marcher ?**
R : Oui, mais compte 2h au lieu de 60 min. Le guide d'install est écrit pour des débutants n8n (pas pour des débutants tech). Si t'as déjà créé un Zap, t'es bon.

**Q : Combien ça coûte en API Anthropic par audit ?**
R : Avec `claude-sonnet-4-6` : ~0.02€ par audit. Avec `claude-haiku-4-5` : ~0.004€. Sur 100 audits/mois, t'es entre 0.40€ et 2€.

**Q : Je peux le revendre à mes clients ?**
R : Non. C'est une licence pour un usage personnel/interne à ton agence. Si tu veux le revendre, contacte-moi sur Insta pour une licence agence.

**Q : Ça marche avec Make ou Zapier au lieu de n8n ?**
R : Le workflow est écrit pour n8n. Tu peux le porter sur Make ou Zapier mais les codes nodes JS ne migrent pas tels quels — prévois 1h de portage.

**Q : Le formulaire est responsive ?**
R : Oui. Tailwind via CDN, testé sur mobile / tablet / desktop.

**Q : Je dois avoir Gmail ? Si j'utilise Outlook ?**
R : Le workflow utilise le node Gmail par défaut. Remplace-le par le node SMTP (natif n8n) et configure ton serveur Outlook/SMTP. Compte 10 min.

---

## CTA final

**Stoppe les calls non qualifiés. Récupère le funnel — 49€ →** *(bouton Gumroad)*

---

## Email post-achat

**Subject :** ✅ Ton Prospect Audit Funnel est prêt — premier prospect qualifié en 60 min

**Body :**

Salut,

Merci pour l'achat 🙏

Tu télécharges le pack ici → [LIEN_ZIP]

Dedans :
- **`n8n-workflow.json`** — le workflow complet, à importer dans ton n8n
- **`audit-form-template.html`** — le formulaire 14 questions, à déployer sur Vercel/Netlify
- **`claude-prompt-template.md`** — le prompt complet + exemple input/output pour calibrer
- **`setup-guide-fr.md`** + **`setup-guide-en.md`** — guides d'install pas à pas
- **`cover.svg`** — la cover du produit si tu veux la rebrander

**Mon conseil pour démarrer :**

1. Lis le `setup-guide-fr.md` en entier avant de toucher à quoi que ce soit. 15 min.
2. Suis les 8 étapes dans l'ordre. Ne saute pas l'étape 3 (customisation du prompt) — c'est ce qui transforme un funnel générique en un funnel qui ferme des deals.
3. Test avec ta propre boîte d'abord. Remplis le form comme si tu étais un prospect. Si Claude te sort une liste de solutions qui te parle, t'es prêt. Sinon, retourne à l'étape 3.
4. **Important :** ne le mets en bio Insta qu'après le test end-to-end complet. Un funnel cassé en bio = pire qu'un funnel absent.

Quand ton premier prospect remplit le form en prod, **DM-moi sur Insta** ([@manu_ai.to](https://instagram.com/manu_ai.to)) — j'aime voir ce que les gens construisent.

Si tu bloques quelque part, réponds à ce mail. Je lis tout.

À toi de jouer 🚀

— Manu

PS : la **[communauté Skool](https://taiyka.com/skool)** publie un nouveau système de lead-gen par mois (funnel complet, prompts, workflows déjà câblés), des reviews live de ton funnel par moi, et un canal "prospects qualifiés" partagé. Si tu veux accélérer après ce funnel, c'est par là.
