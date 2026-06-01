# 🌅 Morning Checklist — Manu

Bonjour 👋 Mise à jour : encore plus de choses sont faites depuis la dernière version. Voilà ce qu'il reste vraiment.

Total estimé restant : **~2-3 heures** (essentiellement des comptes tiers + Loom).

---

## 🟢 Ce qui est fait (rien à faire)

### Du sprint nocturne (round 1)
- ✅ 8 produits complets — guides FR/EN, sales copy FR/EN, covers SVG, ZIPs prêts à uploader
- ✅ Site Next.js avec hub + /products + /portfolio + /free-n8n-pack (toggle FR/EN partout)
- ✅ Formulaire de capture email branché sur webhook n8n
- ✅ Workflow n8n de livraison du lead magnet (FR/EN selon la langue choisie)
- ✅ Versions HTML print-ready de TOUS les guides
- ✅ Diagrammes Excalidraw-style pour les 4 projets du portfolio
- ✅ Sanitisation : zéro credential, email, ou nom client réel dans les fichiers shippés
- ✅ Build du site vérifié

### Du round 2 (autonomous cleanup, après le sprint)
- ✅ **Scrub des credentials leakés** (700 remplacements dans 108 fichiers, incl. Polymaker-project + Digital Products Project — sweep grep validé)
- ✅ **Backup de sécurité** de Polymaker créé avant le scrub : `Polymaker-project.backup-20260415-114309/` (à supprimer quand tu as confirmé que tout va bien)
- ✅ **Git initialisé** — premier commit fait sur la branche `main` (commit `d93fc71`). `.gitignore` couvre `node_modules/`, `.next/`, `.env.local`, `source/`, `*.zip`
- ✅ **42 PDFs générés** via Chrome headless (`tools/html-to-pdf.sh`) — un PDF par fichier `.html` dans `delivery/` et `copy/`
- ✅ **8 ZIPs régénérés** avec les PDFs inclus
- ✅ **Site polish** : favicon SVG, sitemap.ts, robots.ts, métadonnées Open Graph + Twitter Card, OG image 1200×630, build vérifié

---

## 🔴 PRIORITÉ HAUTE — À faire en premier (sécurité)

### 1. Faire tourner les credentials qui ont leaké
**Pourquoi :** Les credentials ont été nettoyés des fichiers locaux, MAIS les clés elles-mêmes restent valides dans tes dashboards. Tant qu'elles ne sont pas rotated, elles peuvent être abusées si quelqu'un a vu un de tes anciens fichiers (email, backup, ancien commit ailleurs, etc.).

À rotate :
- **Supabase service_role JWT** du projet `ylvkvlzq...(full ref in your dashboard)` → Dashboard Supabase → Settings → API → Reset
- **Apify API token** `apify_api_dLHV...(full token in Apify settings)` → Dashboard Apify → Settings → Integrations → Regenerate
- **Google Maps API key** `AIzaSyABYl...(full key in Google Cloud console)` → [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials → Regenerate

Après rotation, mets les nouvelles clés dans `C:/Users/yoanu/.config/global.env` et dans tes workflows n8n productifs.

---

## 🟡 PRIORITÉ MOYENNE — Lancer la machine

### 2. Héberger les ZIPs publiquement (token gws expiré, pas pu le faire)
J'ai essayé via `gws` mais le token a renvoyé HTTP 401. Voir `drive-upload-failed.log` à la racine.

**Pour relancer :**
1. Régénère ton token : `python "C:/Users/yoanu/Documents/Claude code/Polymaker-project/get_gws_token.py"`
2. Soit relance une session Claude et demande "upload les 8 ZIPs sur Drive", soit fais-le manuellement :
   - Crée un dossier "Taiyka Products" sur Drive
   - Upload chaque `products/<slug>/delivery/<slug>.zip` (8 fichiers, ~7 Mo total)
   - Sharing : "Anyone with the link → Viewer"
   - Note les liens dans `links.txt` à la racine

### 3. Configurer le webhook n8n du lead magnet
1. Ouvre n8n
2. Importe `funnel/n8n-workflows/lead-magnet-delivery.json`
3. Crée un Google Sheet "Taiyka Leads" avec colonnes : `captured_at, email, name, lang, source, product`
4. Remplace dans le workflow :
   - `PASTE_YOUR_LEADS_SHEET_ID_HERE` → ton Sheet ID
   - `PASTE_YOUR_FR_ZIP_LINK_HERE` → le lien Drive du ZIP FR (après étape 2)
   - `PASTE_YOUR_EN_ZIP_LINK_HERE` → le lien Drive du ZIP EN
5. Connecte tes credentials Gmail + Sheets dans n8n
6. Active le workflow → copie l'URL du webhook
7. Crée `web/.env.local` à partir de `web/.env.local.example` :
   ```
   NEXT_PUBLIC_LEADMAGNET_WEBHOOK_URL=https://n8n.your-domain.com/webhook/leadmagnet-n8n-pack
   ```
8. Redémarre `npm run dev` → teste le formulaire

### 4. Créer le compte Skool + décider du pricing
- Crée la communauté sur [skool.com](https://skool.com)
- Décision pricing : 29€/mo, 49€/mo, ou 19€/mo + 99€ trimestre ?
- Récupère le lien public + remplace `PASTE_YOUR_SKOOL_LINK` dans `web/app/page.tsx`

### 5. Créer les listings Gumroad
- Crée un compte sur [gumroad.com](https://gumroad.com) si pas déjà fait
- Pour chaque produit Tier 1 et Tier 2 (6 produits payants) :
  1. Nouveau produit
  2. Hero image : utilise le `delivery/cover.svg` (convertir en PNG via le navigateur si besoin)
  3. Title + tagline + description : copie depuis `copy/sales-fr.md` ou `sales-fr.pdf`
  4. Price : voir tableau dans `README.md`
  5. File : upload le `delivery/<slug>.zip`
- Récupère les liens Gumroad
- Remplace `https://gumroad.com/PASTE_YOUR_GUMROAD_LINK` dans `web/lib/products.ts` (8 produits → 8 liens)

---

## 🟢 PRIORITÉ BASSE — Polish & growth

### 6. Logo final
Le hub utilise actuellement le mot "TAIYKA" en gradient comme logo placeholder. Si tu as un logo SVG/PNG :
- Drop dans `brand/logo/`
- Update `web/app/page.tsx` pour utiliser ton logo au lieu du wordmark gradient
- Note : un favicon SVG (gear électrique sur fond navy) a déjà été créé dans `web/public/favicon.svg`. Tu peux le remplacer par ton vrai logo.

### 7. Vraies URLs Facebook + LinkedIn
Cherche `PASTE_YOUR_FB` et `PASTE_YOUR_LINKEDIN` dans `web/app/page.tsx` et remplace.

### 8. Loom de démo pour Cold Outreach + AI Agent Playbook
Marqués "todo" dans les README de chaque produit. Pas critique pour le launch mais boost les conversions.

### 9. Notion AI Stack — construire le vrai template
Le produit livre le SPEC complet (`delivery/template-spec-{fr,en}.md` + PDFs). Tu dois construire le Notion (~30 min en suivant le spec) et fournir un duplicatable link aux acheteurs.

### 10. Déployer le site sur Vercel
À toi (risque de l'attacher au mauvais compte si je le fais) :
```bash
cd "c:/Users/yoanu/Documents/Claude code/Digital Products Project/web"
npx vercel
# suis les prompts, link à ton compte
npx vercel --prod
```
Tu auras une URL en `.vercel.app`. Achète le domaine après si besoin (taiyka.com ?).

**Conseil :** définis `NEXT_PUBLIC_SITE_URL` dans Vercel (ex: `https://taiyka.com`) pour que le sitemap et les meta tags utilisent la bonne URL en prod.

---

## 📂 Où trouver quoi

| Tu cherches… | C'est ici |
|---|---|
| Le code du site | `web/` |
| Les produits prêts à vendre | `products/<slug>/delivery/<slug>.zip` |
| Les sales copies | `products/<slug>/copy/sales-{fr,en}.{md,html,pdf}` |
| Les guides PDF | `products/<slug>/delivery/*.pdf` |
| Le workflow n8n de livraison | `funnel/n8n-workflows/lead-magnet-delivery.json` |
| Les diagrammes du portfolio | `portfolio/<slug>/diagram.svg` |
| Les couleurs de la marque | `brand/tokens.json` |
| L'index de tous les produits | `README.md` (à la racine) |
| Le contexte projet pour Claude | `CLAUDE.md` |
| Backup avant scrub (à supprimer) | `../Polymaker-project.backup-20260415-114309/` |
| Drive upload échoué | `drive-upload-failed.log` |

---

## 👥 Repo public + handoff dev (NEW)

Le repo est **public sur GitHub** : https://github.com/YooUhl/taiyka-workshop

L'historique a été réécrit pour retirer `tools/scrub-credentials.py` (qui embarquait des vrais secrets en regex). Les clés concernées (Google Maps, Apify token, 2 Sheet IDs, ref Supabase) sont **à rotater** dans leurs dashboards respectifs :

- Google Cloud Console → API key `AIzaSyABYl...` → Regenerate
- Apify Console → token `apify_api_dLHV...` (key `_NICOLAS` dans global.env) → Revoke + new
- Supabase → projet `ylvkvlzq...` → rotate `service_role_key` si exposé
- Google Sheets → vérifier les permissions sur les 2 Sheet IDs leakés (les retirer du public si applicable)

### Onboarding du dev (à lui forwarder)

```
git clone https://github.com/YooUhl/taiyka-workshop.git
cd taiyka-workshop

# 1. Lire dans l'ordre :
#    - CLAUDE.md (règles projet)
#    - web/AGENTS.md (Next.js 16 breaking changes — IMPORTANT)
#    - funnel/n8n-workflows/README-ai-news.md (pipeline newsletter)
#    - C:/Users/yoanu/.claude/plans/we-need-to-work-parallel-kay.md
#      (plan de la dernière session — workflow non encore importé)

# 2. Setup web
cp web/.env.local.example web/.env.local
# Remplir avec ses propres clés Supabase / DATABASE_URL / LEADMAGNET_WEBHOOK_URL
cd web && npm install && npm run dev
# Page hub sur http://localhost:3000 ; newsletter sur /brief

# 3. Setup n8n (pour bosser sur la newsletter)
# Importer dans son propre n8n :
#   funnel/n8n-workflows/ai-news-daily.json
#   funnel/n8n-workflows/brief-unsubscribe.json
#   funnel/n8n-workflows/lead-magnet-delivery.json
# Mapper credentials Gmail + Google Sheets + Anthropic + Apify
# Suivre README-ai-news.md pour les env vars + sheet ID
```

### Fichiers clés newsletter (par où commencer)

- `web/app/brief/page.tsx` — landing newsletter (FR/EN)
- `web/components/SampleIssuePreview.tsx` — aperçu visuel d'un numéro (doit matcher le rendu email)
- `funnel/n8n-workflows/ai-news-daily.json` — workflow quotidien (nœud `Render Email HTML` = source du template)
- `funnel/n8n-workflows/send_test_brief.py` — script Python pour preview email local
- `funnel/n8n-workflows/README-ai-news.md` — doc opérateur complète

### Statut newsletter au moment du handoff

- ✅ Page `/brief` shippée avec sample preview
- ✅ Page `/brief/unsubscribe` shippée (RGPD)
- ✅ Workflow `ai-news-daily.json` codé mais **non importé** dans n8n
- ✅ Workflow `brief-unsubscribe.json` codé mais **non importé**
- ✅ Test email envoyé une fois (preview HTML ouvert dans navigateur)
- ⏳ Manu (toi) avait demandé une pause newsletter pour rassembler une **punch list d'améliorations email** avant la prochaine vague dev

---

## 🐛 Si quelque chose casse

- **Site ne build pas :** `cd web && rm -rf .next && npm run build`
- **Formulaire email ne marche pas :** vérifie que `NEXT_PUBLIC_LEADMAGNET_WEBHOOK_URL` est dans `web/.env.local` ET que tu as redémarré `npm run dev`
- **HTML guide a mal rendu :** régénère avec `node tools/md-to-html.js`
- **PDF mal rendu :** régénère avec `bash tools/html-to-pdf.sh` (idempotent)
- **ZIP corrompu :** régénère via PowerShell `Compress-Archive`
- **Credential réapparaît dans un fichier :** relance `python tools/scrub-credentials.py` (idempotent)

---

## 💪 Bilan total (sprint nocturne + round 2)

- 📦 **8 produits complets** (2 free, 3 Tier 1, 3 Tier 2) — workflows + guides bilingues + sales copy + covers + ZIPs avec PDFs
- 🌐 **7 routes Next.js** : `/`, `/products`, `/portfolio`, `/free-n8n-pack`, `/_not-found`, `/sitemap.xml`, `/robots.txt`
- 📄 **42 fichiers HTML** print-ready + **42 PDFs** générés en batch
- 🗜️ **8 ZIPs** prêts à uploader (avec PDFs inclus, ~7 Mo total)
- 🛡️ **700 credentials scrubbed** sur 108 fichiers (Digital Products + Polymaker)
- 🔧 **3 outils** : `md-to-html.js`, `html-to-pdf.sh`, `scrub-credentials.py`
- 📂 **Git repo** initialisé, commit `d93fc71` sur `main`
- 🎨 **Site polish** : favicon, sitemap, robots, OG meta, OG image 1200×630
- ⚡ Build du site **passe** (Next 16 + Tailwind v4 + React 19)

Bon café ☕

— Claude
