# Guide d'installation — Smart Prospect Audit Funnel (FR)

> Ce guide est écrit pour un owner d'agence qui sait câbler un workflow n8n et déployer une page statique. Compte 60 à 90 minutes pour avoir le funnel en production, customisation comprise.

---

## Comptes requis

Avant de commencer, assure-toi d'avoir un accès actif aux services suivants :

- **n8n** — cloud (n8n.io) ou self-hosted, peu importe. Le workflow utilise des nodes natifs uniquement, aucune dépendance externe.
- **Anthropic** — clé API depuis [console.anthropic.com](https://console.anthropic.com). Prévois 5€ de crédit minimum pour les tests.
- **Google Workspace** — un compte Google avec accès Sheets + Gmail. Tu peux utiliser un compte perso, mais on recommande un compte dédié à ton agence.
- **Calendly** — un type d'event configuré (30 min, qualification call). Tu auras besoin de l'URL publique du type d'event.
- **Un hébergeur statique** pour le formulaire — Vercel, Netlify, Cloudflare Pages ou ton propre site WordPress avec un plugin HTML.

---

## Étape 1 — Importer le workflow n8n (5 min)

1. Ouvre ton instance n8n.
2. Crée un nouveau workflow vide : **+ Add workflow**.
3. Clique sur le menu (trois points en haut à droite) → **Import from File**.
4. Sélectionne `source/n8n-workflow.json`.
5. Tu dois voir 9 nodes apparaître, connectés en trois branches après "Parse + format" (Sheets / Gmail / Respond to form).

Si l'import échoue : vérifie que ta version n8n est au minimum 1.50. Le workflow utilise `typeVersion 3.4+` sur les nodes Set.

---

## Étape 2 — Configurer les credentials (15 min)

Tu as **5 credentials** à câbler. Ouvre chaque node et remplace les placeholders `PASTE_YOUR_*_HERE`.

### 2.1 — Node "Config"

Édite les valeurs directement dans le node Set (pas besoin de créer un credential n8n) :

| Champ | À remplir avec |
|---|---|
| `anthropic_api_key` | Ta clé API Anthropic (`sk-ant-...`) |
| `claude_model` | Laisse `claude-sonnet-4-6` ou bascule sur `claude-haiku-4-5` pour économiser |
| `agency_name` | Le nom de ton agence (ex: "Taiyka") |
| `agency_vertical` | Le vertical que tu sers (ex: "e-commerce DTC brands") |
| `calendly_url` | L'URL publique de ton type d'event Calendly |
| `notification_email` | Ton email où tu veux recevoir le debrief |
| `google_sheet_id` | L'ID de ton spreadsheet (dans l'URL : `docs.google.com/spreadsheets/d/SHEET_ID/edit`) |

### 2.2 — Google Sheets credential

1. Crée un spreadsheet Google avec un onglet nommé exactement **`prospects`**.
2. Ajoute la ligne d'en-tête suivante en première ligne (copie-colle telle quelle) :
   ```
   submitted_at | full_name | contact_email | contact_phone | company_name | company_size | industry | bottleneck | hours_wasted_weekly | tech_stack | ai_familiarity | budget_monthly | decision_authority | timeline | slot_intent | qualification_score | qualification_reason | summary | top_solutions_json
   ```
3. Dans n8n : Settings → Credentials → New → Google Sheets OAuth2.
4. Suis le wizard (utilise un projet Google Cloud dédié — autorise l'API Sheets).
5. Connecte le credential au node "Log to Google Sheets".

### 2.3 — Gmail credential

1. Dans n8n : Settings → Credentials → New → Gmail OAuth2.
2. Active l'API Gmail dans le même projet Google Cloud que pour Sheets.
3. Connecte le credential au node "Email debrief".

---

## Étape 3 — Customiser le prompt Claude pour ton vertical (15 min)

C'est l'étape qui sépare un funnel générique d'un funnel qui ferme des deals.

1. Ouvre le node **"Build Claude prompt"** (code node).
2. Dans le code JS, cherche la constante `system`. C'est là que vit le system prompt.
3. Édite trois zones :
   - `# IDENTITY` — déjà templated, n'y touche pas sauf pour ajuster le ton.
   - `# CONSTRAINTS` — ajoute 2-3 règles spécifiques à ton vertical. Exemples :
     - E-commerce : `Privilégie les solutions branchées sur Shopify, Klaviyo, ou Gorgias.`
     - Cabinets d'avocats : `Ne jamais proposer d'automatisations qui touchent au conseil juridique. Cible le back-office (facturation, suivi des dossiers, calendrier).`
   - **(Optionnel)** Ajoute une section `# QUALIFICATION RUBRIC` avec tes propres seuils budgétaires. Le template par défaut est dans `source/claude-prompt-template.md`.
4. Sauvegarde le node.

Astuce : avant de modifier, lance le workflow avec un faux prospect (étape 7) pour voir comment Claude répond avec le prompt par défaut. Ça te donne une baseline.

---

## Étape 4 — Customiser le formulaire (10 min)

Le fichier `source/audit-form-template.html` est ton point de départ. Ouvre-le dans un éditeur de texte.

**À adapter au minimum :**

1. La balise `<title>` — mets le nom de ton agence.
2. Le `<h1>` "Free Automation Audit" — ajuste si tu veux un wording plus accrocheur.
3. Les questions optionnelles — tu peux retirer la question 13 (téléphone) si ton vertical ne le demande pas, mais ne touche pas aux 10 premières, le prompt Claude les attend.

**À adapter selon ton positionnement :**

- Si tu vises un vertical précis, ajoute une question 15 du type "Quel est ton objectif business le plus important sur 6 mois ?". N'oublie pas de l'ajouter aussi dans le node `Normalize answers` et dans le prompt Claude.
- Si tu veux changer les couleurs : le fichier utilise Tailwind via CDN. Cherche `bg-[#0A1628]` et remplace par tes propres codes hex.

---

## Étape 5 — Connecter Calendly (5 min)

1. Va sur [calendly.com](https://calendly.com) → Event Types → ton event "Qualification Call".
2. Copie l'URL publique (format : `https://calendly.com/ton-handle/30min`).
3. Colle-la dans le champ `calendly_url` du node "Config" (cf. étape 2.1).
4. **Optionnel mais recommandé :** active les redirections post-booking de Calendly pour pointer vers une page "Merci" sur ton site. Ça améliore l'attribution.

---

## Étape 6 — Déployer le formulaire (15 min)

### Option A — Vercel (recommandé)

1. Crée un dossier `audit-funnel` sur ta machine.
2. Mets-y `index.html` (ton `audit-form-template.html` customisé).
3. Lance `npx vercel` à la racine, suis les prompts.
4. Vercel te donne une URL en `*.vercel.app`. Tu peux la mapper sur ton propre domaine (`audit.tonagence.com`).

### Option B — Netlify Drop

1. Va sur [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag-and-drop ton fichier HTML.
3. Récupère l'URL.

### Option C — Embed dans WordPress / Webflow

Utilise un block "Custom HTML" et colle le contenu complet du fichier. Vérifie que ton thème ne strip pas le `<script>` à la fin.

**Dans tous les cas :** remplace la constante `WEBHOOK_URL` (en haut du `<script>` dans le HTML) par l'URL de production de ton webhook n8n (Webhook node → "Production URL").

---

## Étape 7 — Test end-to-end (10 min)

1. Active le workflow dans n8n (toggle en haut à droite).
2. Ouvre le formulaire déployé.
3. Remplis-le avec des données réalistes (ton entreprise ou une fake plausible).
4. Soumets. Tu dois :
   - Voir une animation de loading pendant 15-30 secondes.
   - Recevoir la réponse avec une liste de solutions et le bouton Calendly.
   - Recevoir l'email debrief dans ton inbox (`notification_email`).
   - Voir une nouvelle ligne dans ton Google Sheet `prospects`.

Si l'un des 4 manque, va voir les logs d'exécution dans n8n (Executions tab).

---

## Étape 8 — Mise en production (5 min)

1. Vérifie que ton workflow est bien sur **Production URL** (pas Test).
2. Désactive le mode test du webhook.
3. Ajoute l'URL du formulaire à ta bio Instagram, dans tes signatures email, dans tes lead magnets.
4. Suis les conversions dans le Google Sheet — la colonne `qualification_score` te dit en un coup d'œil quels prospects valent un call.

---

## Troubleshooting

| Symptôme | Cause probable | Fix |
|---|---|---|
| Le formulaire reste bloqué sur "Analyzing…" | Le webhook n'est pas accessible publiquement ou le workflow n'est pas actif | Active le workflow, vérifie l'URL Production dans le node Webhook |
| Email debrief jamais reçu | Credential Gmail mal configuré ou Gmail OAuth pas autorisé | Reconnecte le credential, teste avec une exécution manuelle |
| "qualification_score: 0" et "parse_error" partout | Claude renvoie du Markdown au lieu de JSON pur | Vérifie que ton system prompt force bien "Return STRICT JSON, no prose around it" |
| Google Sheets pas mis à jour | Mauvais `google_sheet_id`, mauvais nom d'onglet, ou en-têtes manquants | Vérifie l'ID dans l'URL du Sheet, vérifie l'orthographe exacte de l'onglet `prospects` |
| HTTP 529 / rate limited from Anthropic | Ton plan Anthropic est saturé | Ajoute un retry dans le node "Call Claude" (Settings → Retry on fail) ou upgrade ton plan |
| Le prompt Claude répond toujours en anglais alors que mes prospects sont francophones | Auto-detection rate insuffisante | Ajoute dans le system prompt : `Reply ONLY in French.` |

---

## Pour aller plus loin

- Branche un node **Slack** après "Parse + format" pour ping ton commercial en direct sur les prospects au-dessus de 80/100.
- Branche un node **HubSpot/Pipedrive** pour créer automatiquement un deal qualifié.
- Si tu reçois >50 audits/mois, switch le modèle de `claude-sonnet-4-6` vers `claude-haiku-4-5` pour diviser le coût par 5 (qualité reste correcte sur ce use case structuré).

Tu bloques quelque part ? Réponds à l'email de livraison Gumroad.
