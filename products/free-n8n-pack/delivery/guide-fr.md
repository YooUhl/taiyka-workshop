# 5 Workflows n8n pour Entrepreneurs IA

> Le starter pack que j'aurais aimé avoir quand j'ai commencé à automatiser mon business.
> — Manu, fondateur de [Taiyka](https://instagram.com/manu_ai.to)

---

## Avant de commencer

**Tu as besoin de :**
- Un compte **n8n** (cloud ou self-hosted — la version cloud gratuite suffit pour démarrer)
- Quelques clés API (selon le workflow) — chaque workflow indique lesquelles
- 30 minutes pour tout importer et tester

**Comment importer un workflow :**
1. Ouvre n8n
2. Clique sur **"+ Add workflow"** → menu **... → Import from File**
3. Sélectionne le `.json` correspondant
4. Connecte les credentials demandés (Gmail, Apify, Hunter, etc.)
5. Active le workflow

C'est tout. Aucun code à écrire.

---

## Workflow 1 — AI News Digest 📰

**Fichier :** `01-ai-news-digest.json`
**Difficulté :** ⭐ Débutant
**APIs requises :** Gmail uniquement (compte Google standard)

### Ce que ça fait
Chaque matin à 5h UTC, le workflow récupère les actus IA des principaux médias tech (TechCrunch, VentureBeat, Reuters, MIT Tech Review, CNBC...), les fusionne, génère un PDF et te l'envoie par email.

Tu n'as plus besoin de scroller Twitter pendant 30 min pour rester à jour.

### Configuration
1. Importe le workflow
2. Connecte ton compte Gmail (n8n te guide via OAuth)
3. Remplace `PASTE_YOUR_EMAIL_HERE@example.com` par ton email
4. Active → tu reçois ton premier digest demain matin

### Pour aller plus loin
- Ajoute/retire des sources RSS dans les nodes "RSS Feed Read"
- Change le créneau horaire dans le node "Schedule Trigger"
- Adapte le format HTML de l'email dans "Format Email HTML"

---

## Workflow 2 — Lead Machine : Email Finder 🎯

**Fichier :** `02-lead-email-finder.json`
**Difficulté :** ⭐⭐ Intermédiaire
**APIs requises :** Hunter.io (gratuit jusqu'à 25 recherches/mois) + Google Sheets

### Ce que ça fait
À partir d'une liste d'entreprises dans un Google Sheet, le workflow trouve l'email du fondateur ou du décideur de chaque boîte. Il scrape d'abord le site web de l'entreprise, et fallback sur Hunter.io si besoin.

Parfait pour préparer une campagne cold outreach sans payer un outil à 99€/mois.

### Configuration
1. Crée un compte gratuit sur [hunter.io](https://hunter.io) → récupère ta clé API
2. Crée un Google Sheet avec une colonne `domain` (ex: `acme.com`, `stripe.com`, ...)
3. Importe le workflow
4. Remplace dans le node "Edit Fields" :
   - `PASTE_YOUR_HUNTER_API_KEY_HERE` → ta clé Hunter
   - `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` → l'ID de ton Google Sheet (visible dans l'URL)
5. Connecte ton compte Google Sheets
6. Lance le workflow → les emails apparaissent dans ton sheet

### Pour aller plus loin
- Branche-le sur Apollo, Lemlist, ou Instantly pour automatiser la séquence
- Ajoute un node Claude pour générer un icebreaker personnalisé par contact

---

## Workflow 3 — Lead Machine : Google Maps 🗺️

**Fichier :** `03-lead-google-maps.json`
**Difficulté :** ⭐⭐ Intermédiaire
**APIs requises :** Google Maps API + Google Sheets

### Ce que ça fait
Tu lui donnes un type de business + une ville (ex: "barbershops à Toulon"), et le workflow scrape Google Maps pour récupérer **nom, adresse, téléphone, site web, note moyenne** de tous les résultats. Sortie directe dans un Google Sheet.

Idéal pour prospecter localement (agences digitales, freelances, offres locales).

### Configuration
1. Crée une clé Google Maps API ([console.cloud.google.com](https://console.cloud.google.com)) — il faut activer "Places API"
2. Importe le workflow
3. Dans le node "Edit Fields", remplace :
   - `PASTE_YOUR_GOOGLE_MAPS_API_KEY_HERE` → ta clé
   - `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` → ton sheet
   - Adapte `query` (type de business) et `location` (ville)
4. Connecte ton compte Google Sheets
5. Lance → tes leads sont dans le sheet

### Pour aller plus loin
- Combine avec le Workflow 2 pour enrichir avec l'email du gérant
- Ajoute un filtre sur la note moyenne (`>= 4.0`) pour ne cibler que les bons profils

---

## Workflow 4 — Amazon Rankings Scraper 🛒

**Fichier :** `04-amazon-rankings.json`
**Difficulté :** ⭐⭐⭐ Avancé
**APIs requises :** Apify (compte gratuit avec 5$ de crédits offerts)

### Ce que ça fait
Le workflow scrape les **bestsellers Amazon dans 10 marketplaces** (US, UK, FR, DE, JP, etc.) et extrait les top 100 marques par marché. Sortie dans Google Sheets.

Si tu fais du e-commerce ou que tu veilles un marché concurrentiel, c'est de l'or.

### Configuration
1. Crée un compte gratuit sur [apify.com](https://apify.com) → récupère ton API token
2. Définis la variable d'environnement `APIFY_TOKEN` dans n8n (Settings → Variables)
3. Importe le workflow
4. Adapte le `spreadsheet_id` dans le code Google Sheets API
5. Lance → ~5-10 min pour les 10 marchés

### Pour aller plus loin
- Lance-le toutes les semaines via un Schedule Trigger
- Ajoute un node Claude pour synthétiser les tendances du mois

---

## Workflow 5 — Instagram Daily Collector 📸

**Fichier :** `05-instagram-monitor.json`
**Difficulté :** ⭐⭐⭐⭐ Expert
**APIs requises :** Apify + Supabase

### Ce que ça fait
Chaque jour à 6h UTC, le workflow scrape les comptes Instagram de tes concurrents (followers, posts, engagement) et stocke l'historique dans Supabase pour faire de la veille concurrentielle.

C'est la version pro du système. Si tu veux juste tester, garde celui-ci pour plus tard et joue avec les 4 premiers.

### Configuration
Le setup demande Supabase (table `competitor_handles` + `channel_metrics`) — je te recommande d'attendre d'être à l'aise avec n8n avant de t'attaquer à celui-là.

Doc complète dans le **[Competitor Intelligence System](https://taiyka.com/products/competitor-intel)** (produit premium).

---

## C'est quoi la suite ?

Tu veux :

- 📩 **Une vraie séquence cold outreach automatisée** (LinkedIn → email → relance) ?
  → [n8n Pack: Cold Outreach (19€)](https://taiyka.com/products/cold-outreach-pack)

- 🤖 **Apprendre à construire ton premier agent IA de A à Z** ?
  → [Build Your First AI Agent (29€)](https://taiyka.com/products/ai-agent-playbook)

- 🚀 **Rejoindre une communauté de Solopreneurs IA + accès à tous mes nouveaux produits** ?
  → [La communauté Skool](https://taiyka.com/skool)

---

**Manu** · [@manu_ai.to](https://instagram.com/manu_ai.to) · [taiyka.com](https://taiyka.com)
