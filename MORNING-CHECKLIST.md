# 🌅 Morning Checklist — Manu

Bonjour 👋 Voilà ce qui s'est passé pendant ta nuit et ce qu'il te reste à faire. Tout ce qui pouvait être fait sans tes accès tiers est fait. Ce qui suit a besoin de toi.

Total estimé pour tout terminer : **~3-4 heures de travail** (dont ~2h de comptes tiers + ~1h de visuels/Loom).

---

## 🟢 Ce qui est fait (rien à faire)

- ✅ 8 produits complets — guides FR/EN, sales copy FR/EN, covers SVG, ZIPs prêts à uploader
- ✅ Site Next.js avec hub + /products + /portfolio + /free-n8n-pack (toggle FR/EN partout)
- ✅ Formulaire de capture email branché sur webhook n8n
- ✅ Workflow n8n de livraison du lead magnet (FR/EN selon la langue choisie)
- ✅ Versions HTML print-ready de TOUS les guides (`Cmd+P → Save as PDF` dans le navigateur)
- ✅ Diagrammes Excalidraw-style pour les 4 projets du portfolio
- ✅ Sanitisation : zéro credential, email, ou nom client réel dans les fichiers shippés
- ✅ Build du site vérifié (`npm run build` passe)

---

## 🔴 PRIORITÉ HAUTE — À faire en premier (sécurité)

### 1. Faire tourner les credentials qui ont leaké
**Pourquoi :** Pendant l'exploration j'ai trouvé tes vrais credentials en clair dans plusieurs fichiers source. Ils n'ont jamais été shippés (les versions delivery/ sont nettoyées) mais ils traînent localement. Mieux vaut les rotate maintenant.

À rotate :
- **Supabase service_role JWT** du projet `ylvkvlzq...(full ref in your dashboard)` → Dashboard Supabase → Settings → API → Reset
- **Apify API token** `apify_api_dLHVe...` → Dashboard Apify → Settings → Integrations → Regenerate
- **Google Maps API key** `AIzaSyABYl...(full key in Google Cloud console)` → [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials → Regenerate

Après rotation, mets les nouvelles clés dans `C:/Users/yoanu/.config/global.env` et dans tes workflows n8n productifs.

---

## 🟡 PRIORITÉ MOYENNE — Lancer la machine

### 2. Convertir les guides Markdown en PDF
**Auto :** Tous les guides ont déjà un `.html` print-ready dans le même dossier.

**Méthode rapide :**
1. Ouvre `products/<slug>/delivery/guide-fr.html` dans Chrome
2. `Ctrl+P` → Destination : `Enregistrer en PDF`
3. Sauvegarde sous le même nom mais en `.pdf`
4. Répète pour les EN + tous les playbooks/template-specs

**Liste à convertir (36 fichiers HTML au total) :**
```bash
ls products/*/delivery/*.html products/*/copy/*.html
```

Si tu veux automatiser : `wkhtmltopdf` ou la lib Python `pdfkit` peuvent batcher tout ça.

### 3. Héberger les ZIPs publiquement
Les 8 ZIPs sont prêts dans `products/<slug>/delivery/<slug>.zip`.

**Recommandation :** crée un dossier "Taiyka Products" sur Google Drive, upload les 8 ZIPs, partage chacun avec "Anyone with the link can view → Direct download".

Note les liens dans un fichier `links.txt` à la racine pour référence.

### 4. Configurer le webhook n8n du lead magnet
1. Ouvre n8n
2. Importe `funnel/n8n-workflows/lead-magnet-delivery.json`
3. Crée un Google Sheet "Taiyka Leads" avec colonnes : `captured_at, email, name, lang, source, product`
4. Remplace dans le workflow :
   - `PASTE_YOUR_LEADS_SHEET_ID_HERE` → ton Sheet ID
   - `PASTE_YOUR_FR_ZIP_LINK_HERE` → le lien Drive du ZIP FR
   - `PASTE_YOUR_EN_ZIP_LINK_HERE` → le lien Drive du ZIP EN
5. Connecte tes credentials Gmail + Sheets dans n8n
6. Active le workflow → copie l'URL du webhook
7. Crée `web/.env.local` à partir de `web/.env.local.example` :
   ```
   NEXT_PUBLIC_LEADMAGNET_WEBHOOK_URL=https://n8n.your-domain.com/webhook/leadmagnet-n8n-pack
   ```
8. Redémarre `npm run dev` → teste le formulaire

### 5. Créer le compte Skool + décider du pricing
- Crée la communauté sur [skool.com](https://skool.com)
- Décision pricing : 29€/mo, 49€/mo, ou 19€/mo + 99€ trimestre ?
- Récupère le lien public + remplace `PASTE_YOUR_SKOOL_LINK` dans `web/app/page.tsx` (recherche le placeholder)

### 6. Créer les listings Gumroad
- Crée un compte sur [gumroad.com](https://gumroad.com) si pas déjà fait
- Pour chaque produit Tier 1 et Tier 2 (6 produits payants) :
  1. Nouveau produit
  2. Hero image : utilise le `delivery/cover.svg` (convertir en PNG via le navigateur si besoin)
  3. Title + tagline + description : copie depuis `copy/sales-fr.md` (ou EN selon ta cible)
  4. Price : voir tableau dans `README.md`
  5. File : upload le `delivery/<slug>.zip`
- Récupère les liens Gumroad
- Remplace `https://gumroad.com/PASTE_YOUR_GUMROAD_LINK` dans `web/lib/products.ts` (8 produits → 8 liens)

---

## 🟢 PRIORITÉ BASSE — Polish & growth

### 7. Logo final
Le hub utilise actuellement le mot "TAIYKA" en gradient comme logo placeholder. Si tu as un logo SVG/PNG :
- Drop dans `brand/logo/`
- Update `web/app/page.tsx` pour utiliser ton logo au lieu du wordmark gradient

### 8. Vraies URLs Facebook + LinkedIn
Cherche `PASTE_YOUR_FB` et `PASTE_YOUR_LINKEDIN` dans `web/app/page.tsx` et remplace.

### 9. Loom de démo pour Cold Outreach + AI Agent Playbook
Marqués "todo" dans les README de chaque produit. Pas critique pour le launch mais boost les conversions.

### 10. Notion AI Stack — construire le vrai template
Le produit livre le SPEC complet (`delivery/template-spec-{fr,en}.md`). Tu dois construire le Notion (~30 min en suivant le spec) et fournir un duplicatable link aux acheteurs. Le sales copy est déjà honnête là-dessus.

### 11. Déployer le site sur Vercel
Pas fait par moi (risque de l'attacher au mauvais compte). À toi :
```bash
cd "c:/Users/yoanu/Documents/Claude code/Digital Products Project/web"
npx vercel
# suis les prompts, link à ton compte
npx vercel --prod
```
Tu auras une URL en `.vercel.app`. Achète le domaine après si besoin (taiyka.com ?).

### 12. Initialiser le git du projet
Le projet n'est pas un repo git pour l'instant. Pour versionner :
```bash
cd "c:/Users/yoanu/Documents/Claude code/Digital Products Project"
git init
echo "node_modules/" > .gitignore
echo "web/.next/" >> .gitignore
echo "web/.env.local" >> .gitignore
echo "products/*/source/" >> .gitignore  # garde les sources internes hors du repo
git add .
git commit -m "Initial commit: Taiyka digital products ecosystem"
```
Crée un repo privé sur GitHub si tu veux backup.

---

## 📂 Où trouver quoi

| Tu cherches… | C'est ici |
|---|---|
| Le code du site | `web/` |
| Les produits prêts à vendre | `products/<slug>/delivery/<slug>.zip` |
| Les sales copies | `products/<slug>/copy/sales-{fr,en}.md` |
| Le workflow n8n de livraison | `funnel/n8n-workflows/lead-magnet-delivery.json` |
| Les diagrammes du portfolio | `portfolio/<slug>/diagram.svg` |
| Les couleurs de la marque | `brand/tokens.json` |
| L'index de tous les produits | `README.md` (à la racine) |
| Le contexte projet pour Claude | `CLAUDE.md` |

---

## 🐛 Si quelque chose casse

- **Site ne build pas :** `cd web && rm -rf .next && npm run build`
- **Formulaire email ne marche pas :** vérifie que `NEXT_PUBLIC_LEADMAGNET_WEBHOOK_URL` est dans `web/.env.local` ET que tu as redémarré `npm run dev`
- **HTML guide a mal rendu :** régénère avec `node tools/md-to-html.js`
- **ZIP corrompu :** régénère depuis le terminal avec PowerShell `Compress-Archive`

---

## 💪 Bilan de la nuit

- 📦 **6 nouveaux produits** ajoutés (Free Claude Starter, Notion AI Stack, Prompt Pack 50, Client Acquisition Bundle, AI Agent Playbook, Competitor Intelligence System)
- 🌐 **5 routes Next.js** fonctionnelles avec lang toggle FR/EN
- 📄 **36 fichiers HTML** print-ready générés
- 🗜️ **8 ZIPs** prêts à uploader
- 🛡️ **Zéro leak** dans les delivery/ (sweep grep validé)
- ⚡ Build du site **passe** (Next 16 + Tailwind v4 + React 19)

Bon café ☕

— Claude
