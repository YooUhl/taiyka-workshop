# Cold Outreach Pack — Guide de setup

> Le système exact que j'utilise pour sortir des leads de Google Maps, trouver leur email, écrire un icebreaker avec Claude, et envoyer le tout via Gmail. Zéro bullshit, zéro code.
> — Manu, fondateur de [Taiyka](https://instagram.com/manu_ai.to)

---

## Ce que tu tiens entre les mains

4 workflows n8n qui forment **une seule pipeline** :

```
[Google Maps] → [Email Finder] → [AI Icebreaker] → [Gmail Send]
   Workflow 1      Workflow 2       Workflow 3       Workflow 4
```

Tu lances le premier, un Google Sheet se remplit de leads. Les 3 suivants enrichissent ce même sheet jusqu'à l'envoi du mail.

Une seule base de données (ton Google Sheet), 4 étages d'enrichissement.

---

## Prérequis

**Comptes à avoir (tous ont un tier gratuit) :**
- **n8n** — cloud ou self-hosted, peu importe
- **Google Cloud** — pour la clé Google Maps API (activer "Places API")
- **Hunter.io** — 25 recherches gratuites / mois
- **Anthropic** — clé API Claude (quelques euros de crédit suffisent pour 1000 icebreakers)
- **Gmail** — un compte Google standard, connecté à n8n via OAuth

**Temps de setup :** compte **45 minutes** pour tout câbler la première fois. Après c'est 2 clics.

**Ton Google Sheet :** crée-en un avec ces colonnes dans l'ordre (importe le template si tu veux, mais c'est plus rapide à la main) :

```
id | name | websiteUri | address | phone | rating | email | email_source | email_status |
hunter_first_name | hunter_last_name | hunter_position | hunter_confidence |
icebreaker | icebreaker_status | icebreaker_model |
approved | sent_status | sent_at
```

La colonne `id` doit être **unique** par ligne (une simple suite 1, 2, 3... suffit). C'est elle qui sert de clé pour les updates.

---

## Comment importer un workflow

1. Ouvre n8n
2. **"+ Add workflow"** → menu **... → Import from File**
3. Choisis le `.json`
4. Connecte les credentials demandés (Google Sheets, Gmail, etc.)
5. Remplace les `PASTE_YOUR_X_HERE` dans le node **"Edit Fields"** en haut du workflow
6. Active et lance

---

## Workflow 1 — Scraper Google Maps

**Fichier :** `01-lead-google-maps.json`
**Difficulté :** ⭐⭐
**APIs requises :** Google Maps API + Google Sheets

### Ce que ça fait
Tu lui donnes un type de business + une ville (ex: "barbershops à Toulon"), il te sort jusqu'à 100 leads avec nom, adresse, téléphone, site web, note moyenne. Direct dans ton Google Sheet.

### Setup
1. [Crée une clé Google Maps API](https://console.cloud.google.com) → active **Places API**
2. Dans le node **"Edit Fields"**, remplace :
   - `PASTE_YOUR_GOOGLE_MAPS_API_KEY_HERE` → ta clé
   - `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` → l'ID de ton sheet (dans l'URL, la longue chaîne entre `/d/` et `/edit`)
   - Adapte `query` (ex: "dentistes", "agences immobilières") et `location` (ex: "Lyon, France")
3. Connecte ton compte Google Sheets
4. Lance → tes leads arrivent dans le sheet

### Astuce
Mets un **filter node** après pour ne garder que les profils avec `rating >= 4.0` si tu cibles les boîtes qui tournent bien.

---

## Workflow 2 — Email Finder

**Fichier :** `02-lead-email-finder.json`
**Difficulté :** ⭐⭐
**APIs requises :** Hunter.io + Google Sheets

### Ce que ça fait
Pour chaque lead qui a un site web mais pas encore d'email, il :
1. **Scrape d'abord le site** pour y trouver un email (gratuit, silencieux)
2. **Fallback Hunter.io** si rien trouvé — priorise les décideurs (owner, CEO, fondateur)
3. **Filtre les emails génériques** (info@, contact@, noreply@... virés automatiquement)

Tu gardes seulement les emails de vraies personnes.

### Setup
1. [Crée un compte Hunter.io gratuit](https://hunter.io) → copie ta clé API
2. Dans **"Edit Fields"** :
   - `PASTE_YOUR_HUNTER_API_KEY_HERE` → ta clé Hunter
   - `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` → même sheet que Workflow 1
3. Lance → la colonne `email` se remplit

### Astuce
Les 25 recherches/mois de Hunter gratuit partent vite. Le scrape du site est gratuit et couvre ~40-60% des cas — donc l'ordre est important : **scrape d'abord, Hunter en backup**. C'est déjà câblé comme ça dans le code.

---

## Workflow 3 — AI Icebreaker (Claude)

**Fichier :** `03-icebreaker-claude.json`
**Difficulté :** ⭐⭐⭐
**APIs requises :** Anthropic (Claude) + Google Sheets

### Ce que ça fait
Pour chaque lead qui a un email mais pas encore d'icebreaker, le workflow :
1. Lit la ligne (nom, rôle, ville, niche, site web)
2. Envoie tout ça à **Claude** avec un prompt calibré : max 2 phrases, ton humain, pas de flatterie corporate
3. Écrit l'icebreaker dans la colonne `icebreaker` du sheet

Le prompt system est volontairement strict : **"Slightly imperfect English is fine — it signals a real human wrote it"**. C'est exactement le style que j'utilise dans mes propres cold emails.

### Setup
1. [Récupère ta clé Anthropic](https://console.anthropic.com) → génère une API key
2. Dans **"Edit Fields"** :
   - `PASTE_YOUR_ANTHROPIC_API_KEY_HERE` → ta clé
   - `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` → ton sheet
   - Adapte `sender_first_name` et `sender_offer` (décris ton offre en une phrase)
3. Lance → la colonne `icebreaker` se remplit

### Astuce
Avant d'envoyer, **relis les icebreakers dans le sheet**. Claude est bon mais pas magique — certains seront à jeter. Mets `approved = yes` manuellement sur ceux que tu valides. Ce filtre est déjà prévu dans Workflow 4.

### Coût
~0,003€ par icebreaker avec `claude-sonnet-4-5`. 1000 leads = 3€. Pour des volumes énormes, switch sur `claude-haiku-4-5` dans le champ `claude_model` (divise le coût par 10).

---

## Workflow 4 — Gmail Send (avec approval)

**Fichier :** `04-gmail-send.json`
**Difficulté :** ⭐⭐⭐
**APIs requises :** Gmail (OAuth) + Google Sheets

### Ce que ça fait
Pour chaque lead **approuvé** (`approved = yes`) et **pas encore envoyé** (`sent_status ≠ sent`), il :
1. Construit le mail à partir de templates (subject + body avec `{{first_name}}`, `{{icebreaker}}`, `{{signature}}`)
2. **Mode dry-run par défaut** — le mail est envoyé à toi-même avec `[DRY RUN]` dans le subject, pour que tu puisses contrôler le rendu avant d'envoyer à un vrai prospect
3. Quand tu passes `dry_run = false`, il envoie pour de vrai et marque `sent_status = sent` + la date

### Setup
1. Connecte ton compte Gmail à n8n via OAuth (n8n te guide)
2. Dans **"Edit Fields"** :
   - `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` → ton sheet
   - Remplace `PASTE_YOUR_EMAIL_HERE@example.com` dans le node **Dry run** par ton propre email
   - Adapte `sender_signature`, `subject_template`, `body_template` à ton offre
3. **Teste en dry-run d'abord** (`dry_run = true`)
4. Quand tout est clean → `dry_run = false` et relance

### Workflow d'approval
Dans ton Google Sheet, ajoute une validation de données sur la colonne `approved` (liste : `yes` / `no` / vide). Tu valides ligne par ligne ce qui part. **Ne skippe jamais cette étape** — un icebreaker foireux envoyé à 100 prospects, c'est 100 mauvaises premières impressions.

### Astuce deliverability
- **Commence à 20-30 envois/jour max** les 2 premières semaines (warm-up du domaine)
- Envoie entre **mardi et jeudi, 9h-11h** heure locale du prospect
- Laisse 30-60 secondes entre chaque envoi (ajoute un node **Wait** si tu veux)
- Utilise un domaine de sending séparé si tu scales (ne brûle pas ta boîte pro)

---

## Pipeline complète — l'ordre d'exécution

```
1. Lance Workflow 1 → 100 leads dans le sheet
2. Lance Workflow 2 → ~40-60 emails trouvés
3. Lance Workflow 3 → ~40-60 icebreakers générés
4. Relis le sheet, mets approved=yes sur ~20-30 leads propres
5. Lance Workflow 4 en dry_run=true → vérifie les mails dans ta propre inbox
6. Passe dry_run=false → les mails partent aux prospects
```

Tu peux laisser tourner chaque étape sur un trigger (Schedule toutes les 6h par exemple), mais pour commencer **garde tout en manuel**. Tu veux voir ce qui se passe avant d'automatiser.

---

## Troubleshooting

**"Google Sheets: column not found"**
→ Ton sheet n'a pas toutes les colonnes attendues. Vérifie la liste des colonnes dans la section Prérequis (elle est stricte).

**"Hunter: quota exceeded"**
→ Les 25 recherches gratuites sont consommées. Soit tu passes au plan payant (~49$/mois pour 500 recherches), soit tu attends le mois suivant, soit tu bascules sur un autre tool (Apollo, Dropcontact, Findymail).

**"Anthropic 401"**
→ Ta clé API est soit mal collée (espaces invisibles à la fin), soit pas active. Regénère-en une.

**Gmail "Insufficient permissions"**
→ Réautorise ton compte Google dans n8n. OAuth scope "send email" doit être coché.

**Les icebreakers sont tous bidons**
→ Retouche le prompt dans le node **"Build prompt"** (Workflow 3). Ajoute des exemples d'icebreakers que TU aimerais recevoir, dans la section `system`. Claude suit les exemples concrets mieux que les règles abstraites.

**Le dry-run n'envoie rien**
→ Vérifie que `dry_run = true` ET que tu as bien mis ton email dans `PASTE_YOUR_EMAIL_HERE@example.com` du node Gmail Dry run.

---

## Pour aller plus loin

Quelques extensions naturelles du pack :

- **Séquence de relance auto** : ajoute un Workflow 5 qui relit le sheet 3 jours après envoi et envoie un bump si `replied = no`
- **Détection de réponse** : un trigger Gmail qui update `replied = yes` automatiquement quand un prospect répond → ça stoppe la séquence
- **Enrichissement LinkedIn** : remplace le scrape Google Maps par un scrape LinkedIn Sales Navigator (via Apify) si tu cibles du B2B tech
- **A/B test sur l'icebreaker** : génère 2 versions par prospect avec 2 prompts différents, envoie 50/50, mesure les réponses

Si tu veux tout ça déjà câblé + les prompts pro calibrés pour chaque niche → voir la suite ⬇️

---

## La suite

Ce pack t'amène du zéro au premier cold email envoyé automatiquement. Si tu veux passer au niveau d'après :

- 🤖 **Construire ton premier agent IA de A à Z** — un agent qui qualifie tes leads, répond à leurs questions, prend des RDV à ta place
  → [Build Your First AI Agent (29€)](https://taiyka.com/products/ai-agent-playbook)

- 🚀 **Rejoindre la communauté Skool** — accès à tous mes produits, lives hebdo, templates exclusifs, Q&A directs avec moi
  → [La communauté Skool](https://taiyka.com/skool)

---

**Manu** · [@manu_ai.to](https://instagram.com/manu_ai.to) · [taiyka.com](https://taiyka.com)

Tu bloques quelque part ? Réponds à l'email de livraison, je lis tout.
