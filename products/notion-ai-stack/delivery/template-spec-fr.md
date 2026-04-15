# Notion AI Stack — Spec complète du template

> Le dashboard Notion que j'ai construit pour mon propre business.
> Tu le recrées en 30 minutes à partir de cette spec.
> — Manu, [Taiyka](https://instagram.com/manu_ai.to)

---

## ⚠️ À lire avant de commencer

Ce fichier n'est **pas** un template Notion à dupliquer en un clic — c'est le **plan de construction exhaustif** pour que tu bâtisses le dashboard toi-même (30 min) **ou** que tu le fasses faire par quelqu'un.

Pourquoi ? Parce qu'un template Notion vraiment bien fait vit avec toi — tes databases, tes propriétés, tes vues doivent refléter **ton** business, pas le mien. Suivre cette spec à la lettre te donne le même résultat qu'un template premium, et tu sauras exactement ce qu'il y a dedans et pourquoi.

---

## Vue d'ensemble du dashboard

```
┌────────────────────────────────────────────────────────────┐
│              🚀 AI STACK — DASHBOARD SOLOPRENEUR            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│   📊 COMMAND CENTER (page d'accueil)                       │
│   ├─ Cette semaine (tâches auto-filtrées)                  │
│   ├─ Automation backlog (top 3)                            │
│   ├─ Revenus du mois (manual entry rapide)                 │
│   └─ Shortcuts (liens vers les 5 databases)                │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│   DATABASES                                                │
│   ├─ 🧠 AI Tools (ton stack)                                │
│   ├─ ⚡ Automation Backlog (workflows à construire)         │
│   ├─ 📚 Prompt Library (liée au Prompt Pack 50)            │
│   ├─ 🧑‍💼 Clients (CRM light)                               │
│   └─ 📦 Projects (livrables, deadlines)                    │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│   📅 RITUELS                                                │
│   ├─ Lundi — planning hebdo                                │
│   ├─ Vendredi — rétro                                      │
│   └─ 1er du mois — review stack                            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick build instructions (30 min chrono)

1. **(5 min)** Crée une page Notion vide → titre "AI Stack Dashboard"
2. **(15 min)** Crée les 5 databases dans l'ordre ci-dessous (chacune en "Full page database")
3. **(5 min)** Sur la page dashboard, ajoute 4 vues "Linked view of database" pour afficher les bonnes vues au bon endroit
4. **(5 min)** Ajoute les blocs de contenu statiques (rituels, shortcuts, notes)

Les sections détaillées ci-dessous te donnent **toutes les propriétés et toutes les vues** pour chaque database.

---

# Database 1 — 🧠 AI Tools

**Nom de la database :** `AI Tools`
**Icône :** 🧠
**Rôle :** tracker chaque outil IA de ton stack (payant/gratuit, coût, usage)

## Propriétés

| Nom | Type | Options / Format |
|---|---|---|
| `Name` | Title | — |
| `Category` | Select | LLM · Automation · Scraping · Content · Analytics · Voice · Image · Video · Other |
| `Status` | Select | 🟢 Active · 🟡 Testing · 🔴 Churned · ⚪ Watching |
| `Monthly cost` | Number | Format: Euro (€) |
| `Plan` | Select | Free · Starter · Pro · Enterprise · One-time |
| `Use case` | Text | 1 ligne — ce que tu fais avec |
| `Used by workflow` | Relation → `Automation Backlog` | Many-to-many |
| `Used on project` | Relation → `Projects` | Many-to-many |
| `Login URL` | URL | — |
| `API docs` | URL | — |
| `Added on` | Date | — |
| `Last reviewed` | Date | — |
| `Notes` | Text | Longs commentaires |

## Vues

### 1. 🟢 Active stack (default)
- **Type :** Table
- **Filter :** `Status = 🟢 Active`
- **Sort :** `Monthly cost` descending
- **Shown properties :** Name, Category, Monthly cost, Plan, Use case

### 2. 💰 Cost by category
- **Type :** Board
- **Group by :** `Category`
- **Filter :** `Status ≠ 🔴 Churned`
- **Shown properties :** Name, Monthly cost

### 3. 🧪 Testing
- **Type :** Gallery
- **Filter :** `Status = 🟡 Testing`
- **Shown properties :** Name, Use case, Added on

### 4. 📅 Review queue (à réévaluer chaque mois)
- **Type :** Table
- **Filter :** `Last reviewed < il y a 30 jours` OU vide
- **Sort :** `Last reviewed` ascending
- **Shown properties :** Name, Status, Monthly cost, Last reviewed

---

# Database 2 — ⚡ Automation Backlog

**Nom de la database :** `Automation Backlog`
**Icône :** ⚡
**Rôle :** lister les workflows à construire, les prioriser, suivre leur état

## Propriétés

| Nom | Type | Options / Format |
|---|---|---|
| `Name` | Title | — |
| `Status` | Select | 💡 Idea · 📋 Planned · 🛠️ Building · 🧪 Testing · ✅ Live · 💀 Killed |
| `Priority` | Select | 🔥 High · 🟡 Medium · 🟢 Low |
| `Impact` | Select | ⚡⚡⚡ High · ⚡⚡ Medium · ⚡ Low |
| `Effort` | Select | S (1-2h) · M (half day) · L (1-3 days) · XL (1 week+) |
| `Platform` | Multi-select | n8n · Make · Zapier · Python · Custom · Claude Skill |
| `Problem` | Text | Quel problème ça résout en 1 ligne |
| `Solution` | Text | Comment ça marche en 1 paragraphe |
| `Tools used` | Relation → `AI Tools` | Many-to-many |
| `For project` | Relation → `Projects` | One-to-many |
| `ROI estimate` | Text | Ex: "gagne 2h/semaine" / "1000€/mois" |
| `Started on` | Date | — |
| `Live since` | Date | — |
| `Runtime URL` | URL | Lien vers n8n, Make, etc. |
| `Notes` | Text | — |

## Vues

### 1. 🔥 Top priorités (default)
- **Type :** Table
- **Filter :** `Status ≠ ✅ Live` AND `Status ≠ 💀 Killed`
- **Sort :** `Priority` then `Impact` descending
- **Shown properties :** Name, Status, Priority, Impact, Effort, Platform

### 2. 🛠️ En cours
- **Type :** Board
- **Group by :** `Status`
- **Filter :** `Status = 🛠️ Building` OR `Status = 🧪 Testing`
- **Shown properties :** Name, Effort, Platform

### 3. ✅ Live
- **Type :** Table
- **Filter :** `Status = ✅ Live`
- **Sort :** `Live since` descending
- **Shown properties :** Name, Platform, ROI estimate, Runtime URL

### 4. 💡 Idées à trier
- **Type :** Gallery
- **Filter :** `Status = 💡 Idea`
- **Shown properties :** Name, Problem, Impact

### 5. 🎯 Matrice Impact × Effort
- **Type :** Board
- **Group by :** `Impact`
- **Sub-group by :** `Effort`
- **Filter :** `Status = 💡 Idea` OR `Status = 📋 Planned`

---

# Database 3 — 📚 Prompt Library

**Nom de la database :** `Prompt Library`
**Icône :** 📚
**Rôle :** bibliothèque de prompts (peut être peuplée via le Prompt Pack 50)

## Propriétés

| Nom | Type | Options / Format |
|---|---|---|
| `Title` | Title | — |
| `Category` | Select | Content · Sales · Operations · Research · Customer Support · Internal |
| `Use case` | Text | 1 ligne |
| `Prompt` | Text | Le prompt complet |
| `Language` | Select | FR · EN · Both |
| `Favorite` | Checkbox | — |
| `Remixed` | Checkbox | Coche si tu l'as modifié pour toi |
| `Model best for` | Multi-select | Claude · GPT · Gemini · Local · n8n node |
| `Used by workflow` | Relation → `Automation Backlog` | Many-to-many |
| `Last used` | Date | — |
| `Notes / variants` | Text | — |

## Vues

### 1. 📋 Par catégorie (default)
- **Type :** Gallery
- **Group by :** `Category`
- **Shown properties :** Title, Use case, Favorite

### 2. 🔥 Favoris
- **Type :** Table
- **Filter :** `Favorite = true`
- **Sort :** `Last used` descending
- **Shown properties :** Title, Category, Language, Last used

### 3. 🧪 Prompts remixés (mon gold)
- **Type :** Gallery
- **Filter :** `Remixed = true`
- **Shown properties :** Title, Category, Use case

### 4. 🌍 Par langue
- **Type :** Board
- **Group by :** `Language`

---

# Database 4 — 🧑‍💼 Clients

**Nom de la database :** `Clients`
**Icône :** 🧑‍💼
**Rôle :** CRM light pour garder contexte sur chaque client

## Propriétés

| Nom | Type | Options / Format |
|---|---|---|
| `Name` | Title | Client ou entreprise |
| `Status` | Select | 👀 Prospect · 💬 In talks · ✍️ Proposal sent · 🟢 Active · ⏸️ Paused · 🔵 Past |
| `Industry` | Select | SaaS · E-commerce · Agency · Local biz · Creator · Other |
| `Primary contact` | Text | Prénom + nom |
| `Email` | Email | — |
| `Language` | Select | FR · EN · Other |
| `Source` | Select | Referral · Inbound · Outbound · Social · Event · Other |
| `Projects` | Relation → `Projects` | One-to-many |
| `Total invoiced` | Rollup → `Projects.Price` | Sum |
| `First contact` | Date | — |
| `Last touch` | Date | — |
| `Next action` | Text | Ex: "Relancer le 15" |
| `Notes` | Text | Contexte, preferences, watchouts |

## Vues

### 1. 🟢 Actifs (default)
- **Type :** Table
- **Filter :** `Status = 🟢 Active`
- **Sort :** `Last touch` ascending
- **Shown properties :** Name, Industry, Primary contact, Last touch, Next action

### 2. 🔥 Pipeline
- **Type :** Board
- **Group by :** `Status`
- **Filter :** `Status = 👀 Prospect` OR `Status = 💬 In talks` OR `Status = ✍️ Proposal sent`
- **Shown properties :** Name, Industry, Next action

### 3. 📅 À recontacter
- **Type :** Table
- **Filter :** `Last touch < il y a 14 jours` AND `Status ≠ 🔵 Past`
- **Sort :** `Last touch` ascending

### 4. 💰 Top clients
- **Type :** Table
- **Sort :** `Total invoiced` descending
- **Shown properties :** Name, Status, Total invoiced

---

# Database 5 — 📦 Projects

**Nom de la database :** `Projects`
**Icône :** 📦
**Rôle :** livrables, deadlines, prix par projet

## Propriétés

| Nom | Type | Options / Format |
|---|---|---|
| `Name` | Title | — |
| `Client` | Relation → `Clients` | One-to-one |
| `Status` | Select | 📝 Scoping · 🛠️ In progress · 🧪 Review · ✅ Delivered · 💤 Paused · ❌ Cancelled |
| `Type` | Select | Automation · Consulting · Content · Build · Retainer · Training |
| `Price` | Number | Format: Euro (€) |
| `Invoiced` | Checkbox | — |
| `Paid` | Checkbox | — |
| `Start date` | Date | — |
| `Deadline` | Date | — |
| `Tools used` | Relation → `AI Tools` | Many-to-many |
| `Workflows built` | Relation → `Automation Backlog` | Many-to-many |
| `Deliverables` | Text | Liste à puces des livrables clés |
| `Post-mortem notes` | Text | Ce qui a marché / ce qu'il ne faut plus faire |

## Vues

### 1. 🛠️ En cours (default)
- **Type :** Board
- **Group by :** `Status`
- **Filter :** `Status ≠ ✅ Delivered` AND `Status ≠ ❌ Cancelled`
- **Shown properties :** Name, Client, Price, Deadline

### 2. 📅 Timeline
- **Type :** Timeline
- **Start :** `Start date`
- **End :** `Deadline`
- **Filter :** `Status ≠ ❌ Cancelled`

### 3. 💰 Facturation
- **Type :** Table
- **Filter :** `Invoiced = false` OR `Paid = false`
- **Sort :** `Deadline` ascending
- **Shown properties :** Name, Client, Price, Invoiced, Paid

### 4. 🏁 Livrés ce trimestre
- **Type :** Table
- **Filter :** `Status = ✅ Delivered` AND `Deadline` this quarter
- **Sort :** `Deadline` descending

---

# 📊 Command Center (page d'accueil)

La page principale contient, dans l'ordre vertical :

## Bloc 1 — Header
- **Callout** 🚀 avec ta mission du trimestre (ex: "Q2 : atteindre 10k€/mois récurrent")

## Bloc 2 — Cette semaine
- **Linked view of `Projects`** — vue "Timeline" filtrée sur la semaine en cours
- Largeur pleine page

## Bloc 3 — 2 colonnes côte à côte

**Colonne gauche :**
- Titre : `⚡ Automations — top 3`
- **Linked view of `Automation Backlog`** — vue custom :
  - Filter : `Priority = 🔥 High` AND `Status ≠ ✅ Live`
  - Limit : 3 items

**Colonne droite :**
- Titre : `🧑‍💼 Clients à recontacter`
- **Linked view of `Clients`** — vue "À recontacter"
  - Limit : 5 items

## Bloc 4 — 2 colonnes côte à côte

**Colonne gauche :**
- Titre : `🧠 Stack actif`
- **Linked view of `AI Tools`** — vue "🟢 Active stack"
  - Compact mode

**Colonne droite :**
- Titre : `📚 Prompts favoris`
- **Linked view of `Prompt Library`** — vue "🔥 Favoris"
  - Limit : 5 items

## Bloc 5 — Rituels
- **Toggle list** avec 3 entrées :
  - `📅 Lundi — planning hebdo (15 min)` → checklist intégrée
  - `📅 Vendredi — rétro (20 min)` → checklist intégrée
  - `📅 1er du mois — review stack (30 min)` → checklist intégrée

Contenu des checklists : voir section **Rituels** ci-dessous.

## Bloc 6 — Shortcuts
- **Columns 5** avec 5 cards cliquables linkant vers chaque database :
  `🧠 AI Tools` · `⚡ Backlog` · `📚 Prompts` · `🧑‍💼 Clients` · `📦 Projects`

---

# 📅 Rituels — contenu des checklists

## Lundi (15 min) — planning hebdo
- [ ] Ouvrir `Projects → Timeline` et identifier les 3 deadlines de la semaine
- [ ] Ouvrir `Clients → À recontacter` et lister les 3 messages prioritaires
- [ ] Ouvrir `Automation Backlog → Top priorités` et choisir 1 chantier à pousser cette semaine
- [ ] Bloquer les créneaux dans Google Calendar

## Vendredi (20 min) — rétro
- [ ] Marquer comme ✅ Delivered les projets livrés
- [ ] Marquer comme `Paid = true` les projets payés
- [ ] Ajouter un post-mortem court sur chaque projet livré (3 lignes max)
- [ ] Noter dans `Prompt Library → Notes / variants` les prompts que tu as vraiment utilisés cette semaine

## 1er du mois (30 min) — review stack
- [ ] Ouvrir `AI Tools → Review queue` et traiter chaque ligne : `Last reviewed = today`
- [ ] Identifier 1 outil à churner (si `Status = 🟡 Testing` et peu utilisé)
- [ ] Calculer le coût total du stack actif → comparer au mois dernier
- [ ] Publier 1 contenu sur ton stack actuel (transparence = contenu facile)

---

# 🎯 Conseils d'usage

- **Ne multiplie pas les databases.** 5 c'est le bon chiffre. Au-delà ça devient un cimetière.
- **Les vues filtrées > les databases en plus.** Plutôt que créer une db "Leads", filtre `Clients` sur `Status = 👀 Prospect`.
- **Rollups = ton ami.** `Total invoiced` sur un client se calcule seul. Zero saisie double.
- **Relations bidirectionnelles :** vérifie que chaque relation apparaît aussi dans la db cible (ex: `Projects → Tools used` doit se voir depuis `AI Tools → Used on project`).
- **Pour la mobilité :** crée une vue "Quick capture" sur chaque db avec seulement `Name + Status + Notes` pour ajouter un item en 5 secondes depuis ton téléphone.

---

# 🔌 Intégrations possibles (pour plus tard)

- **Automatisation n8n → Notion** : créer un client à partir d'un formulaire Tally → Notion crée la ligne automatiquement
- **Automatisation Stripe → Notion** : quand un paiement arrive, `Paid = true` automatiquement
- **Automatisation Claude → Notion** : un agent qui lit ton Automation Backlog et propose les 3 top priorités chaque lundi matin

Toutes ces intégrations sont buildables avec n8n + API Notion. C'est exactement ce qu'on couvre dans le Tier 2.

---

## C'est quoi la suite ?

- 🤖 **Brancher ton dashboard à n8n pour que tout se remplisse tout seul** ?
  → [Build Your First AI Agent (29€)](https://taiyka.com/products/ai-agent-playbook)

- 📊 **Voir comment d'autres solopreneurs utilisent ce dashboard + partager tes propres setups** ?
  → [La communauté Skool](https://taiyka.com/skool)

---

**Manu** · [@manu_ai.to](https://instagram.com/manu_ai.to) · [taiyka.com](https://taiyka.com)
