# Competitor Intelligence System — Playbook

> Le système complet pour espionner tes concurrents sur Instagram, TikTok, YouTube et LinkedIn — et recevoir un rapport stratégique chaque lundi matin. Sans lever le petit doigt.
> — Manu, fondateur de [Taiyka](https://instagram.com/manu_ai.to)

---

## Avant de démarrer

**Ce playbook n'est pas un cours théorique.** C'est un chantier. À la fin, tu auras :

1. Un pipeline n8n qui scrape 4 plateformes par jour
2. Une base Supabase qui stocke l'historique complet de tes concurrents
3. Un rapport Claude qui arrive dans ta boîte mail chaque lundi

**Prérequis :**
- Un compte n8n (cloud ou self-hosted)
- Un compte Supabase (plan gratuit suffit au démarrage)
- Un compte Apify avec ~20€ de crédit (couvre plusieurs mois)
- Une clé API Anthropic (Claude) — 5€ de crédit largement suffisant
- Une clé API YouTube Data v3 (gratuite)
- 2-3h pour le setup complet la première fois

---

## 1. Ce que fait le système

```
Apify scrapers ──┐
YouTube API   ───┼──► n8n collectors ──► Supabase (channel_metrics)
                 │                              │
                 │                              ▼
                 │                    n8n weekly report ──► Claude ──► Gmail
                 │                                            │
                 │                                            ▼
                 │                                  Rapport stratégique
```

**Concrètement, chaque jour :**
- 06:00 UTC — Instagram Collector tourne sur tous tes concurrents approuvés
- 06:15 UTC — TikTok Collector
- 06:30 UTC — YouTube Collector
- 07:30 UTC — LinkedIn Collector

**Chaque lundi 08:00 UTC :**
- Le Weekly Report Generator lit les 14 derniers jours de data
- Calcule les deltas (cette semaine vs la précédente)
- Envoie le tout à Claude avec un prompt calibré
- Tu reçois un rapport de ~500 mots directement par email

---

## 2. Architecture

Quatre briques. Chacune fait une seule chose bien.

### n8n — l'orchestrateur
C'est le "chef d'orchestre". Les 5 workflows du pack tournent tous dedans. Chaque workflow = un cron + une suite de nodes.

### Apify — les scrapers
Un service qui exécute des "actors" (scrapers pré-faits) à la demande. On utilise :
- `apify/instagram-profile-scraper` (~$0.003/profil)
- `clockworks/tiktok-profile-scraper` (~$0.004/profil)
- `harvestapi/linkedin-company` (~$0.008/profil)

**Coût réel :** pour tracker 20 concurrents × 3 plateformes Apify × 30 jours → ~7€/mois.

### YouTube Data API v3
Gratuit (10 000 unités/jour, largement suffisant). On utilise l'endpoint `channels.list?part=statistics`.

### Supabase — la mémoire
Base Postgres managée. 3 tables : `competitors`, `competitor_handles`, `channel_metrics`. Plan gratuit suffit (500 MB, le système tient 2+ ans dedans).

### Claude API — le cerveau
Le modèle qui lit les chiffres et écrit le rapport. `claude-sonnet-4-5` par défaut. Coût : ~0,01€ par rapport hebdo.

### Gmail — la livraison
Le rapport arrive par email. Tu peux le renvoyer à ton équipe, l'imprimer, tout ce que tu veux.

---

## 3. Setup — 6 étapes

### Étape 1 — Créer la base Supabase

1. Va sur [supabase.com](https://supabase.com) → crée un projet
2. Note l'URL du projet (format `https://xxxxx.supabase.co`) et la **Service Role Key** (Settings → API)
3. Ouvre le SQL Editor → colle le contenu de `delivery/supabase-schema.sql` → Run
4. Tu as maintenant 3 tables prêtes

### Étape 2 — Seed tes concurrents

Dans le SQL Editor, ajoute tes concurrents :

```sql
insert into competitors (name) values
  ('Concurrent A'),
  ('Concurrent B'),
  ('Concurrent C');

insert into competitor_handles (competitor_id, platform, handle, status)
  select id, 'instagram', 'concurrent_a_ig', 'approved' from competitors where name = 'Concurrent A';
-- répète pour chaque (concurrent, plateforme)
```

**Pour YouTube**, tu dois aussi stocker le `channel_id` dans `metadata` :

```sql
update competitor_handles
  set metadata = '{"channel_id":"UCxxxxxxxxxxxxxxxxxxxxxx"}'::jsonb
  where handle = 'ConcurrentA' and platform = 'youtube';
```

Le channel_id se récupère via [commentpicker.com/youtube-channel-id.php](https://commentpicker.com/youtube-channel-id.php) en collant l'URL de la chaîne.

### Étape 3 — Récupérer tes clés API

| Service | Où trouver |
|---|---|
| Supabase URL + Service Role Key | Supabase → Settings → API |
| Apify API token | Apify Console → Settings → Integrations |
| YouTube Data API key | [console.cloud.google.com](https://console.cloud.google.com) → API Library → YouTube Data API v3 → Create credential |
| Anthropic API key | [console.anthropic.com](https://console.anthropic.com) → API Keys |

### Étape 4 — Importer les workflows n8n

1. Ouvre ton n8n
2. **+ Add workflow → ... → Import from File**
3. Importe un par un : `01-instagram-collector.json`, `02-tiktok-collector.json`, `03-youtube-collector.json`, `04-linkedin-collector.json`, `05-weekly-report-generator.json`
4. Dans chaque workflow, remplace tous les `PASTE_YOUR_*_HERE` par tes vraies clés (Ctrl+F dans chaque node concerné)

### Étape 5 — Activer les credentials Gmail (workflow 05)

Le workflow `05-weekly-report-generator.json` utilise un node Gmail natif n8n. Tu dois créer un credential OAuth Gmail dans n8n :

1. Credentials → New → Gmail OAuth2 API
2. Follow la procédure (elle dure 2 min)
3. Sélectionne ce credential dans le node "Send via Gmail"
4. Remplace `PASTE_YOUR_RECIPIENT_EMAIL_HERE` par ton email

### Étape 6 — Tester

Pour chaque collector :
1. Clique sur **Manual Trigger** → **Execute Workflow**
2. Vérifie que chaque node passe au vert
3. Ouvre Supabase → table `channel_metrics` → tu dois voir les lignes apparaître

Pour le rapport :
1. Attends 2-3 jours que la data s'accumule (sinon les deltas sont nuls)
2. Run le workflow 05 manuellement
3. Check ta boîte Gmail

Une fois tout validé, **active** les 5 workflows (toggle en haut à droite).

---

## 4. Par plateforme — ce qu'il faut savoir

### Instagram (workflow 01)
- Scrape les comptes publics uniquement
- Métriques stockées : `followers`, `total_posts`
- Apify actor : `apify/instagram-profile-scraper`

### TikTok (workflow 02)
- Tous les profils sont publics → pas de friction
- Métriques stockées : `followers` (fans), `total_posts` (videos)
- Apify actor : `clockworks/tiktok-profile-scraper`

### YouTube (workflow 03)
- Passe par l'API officielle (gratuit + stable)
- Nécessite le `channel_id` (pas juste le handle)
- Métriques stockées : `followers` (subscribers), `total_posts` (videos), `total_views`

### LinkedIn (workflow 04)
- **Pages Company uniquement** (pas les profils persos)
- Métriques stockées : `followers`, `employee_count`
- L'Apify actor est le plus lent (~90s/profil) et le plus cher (~$0.008)

---

## 5. Le prompt Claude — comment il fonctionne

Le workflow 05 construit un prompt en deux parties :

**System prompt (identité de l'analyste) :**
```
You are a senior competitive intelligence analyst. Your client tracks
competitors across social platforms and relies on you to surface what
matters each week. Be sharp, concise, and actionable. Never invent numbers.
Base every claim on the data provided. Write in the same language as the
user's request.
```

**User prompt (la data + les consignes) :**
- Les deltas calculés (followers, posts, views, semaine N vs N-1)
- Un format de rapport imposé : Executive summary → Top movers → Content cadence → Platform insights → Recommandations

Tu peux customiser les 5 sections dans le node "Build Claude Prompt" (workflow 05). Exemple : ajouter "Focus on LinkedIn if B2B client, Instagram if B2C client".

---

## 6. Exemple de rapport

```markdown
# Competitor Intel — Week ending 2026-04-14

## Executive summary
- Concurrent A a gagné +8.2k followers IG cette semaine (+3.1% vs la moyenne du mois)
- Concurrent B ralentit sur TikTok — seulement 2 posts en 7 jours
- Concurrent C lance clairement une campagne LinkedIn (+1.4k followers, +8 posts)

## Top movers
**Gagnants :**
- Concurrent A (Instagram) : +8 200 followers
- Concurrent C (LinkedIn) : +1 400 followers
- Concurrent A (TikTok) : +2 100 fans

**Perdants :**
- Concurrent B (TikTok) : -120 fans (unfollow wave après un post controversé)

## Content cadence signal
Concurrent A maintient son rythme (5 posts IG cette semaine). Concurrent B est
en pause sur TikTok (2 posts vs 7 la semaine dernière). Concurrent C passe à
l'offensive sur LinkedIn — probablement une campagne commerciale en cours.

## Platform-by-platform
**Instagram :** Concurrent A domine. Ses gains sont probablement tirés par un
reel viral. À investiguer.
**TikTok :** Marché calme cette semaine, sauf la baisse de Concurrent B.
**LinkedIn :** Mouvement clair côté Concurrent C. Check leur feed.

## Recommendations
1. Poster un Reel Instagram de ton côté cette semaine — le feed est très actif
2. Regarder les 3 derniers posts LinkedIn de Concurrent C (campagne en cours)
3. Ne rien changer côté TikTok — le secteur est flat
```

---

## 7. Customisation

### Changer la fréquence
- **Quotidien** (par défaut) → change les crons : `0 6 * * *`, `15 6 * * *`, etc.
- **Hebdo** → `0 6 * * 1` (lundi 06:00)
- **Mensuel** → `0 6 1 * *` (1er du mois)

Les deltas du rapport se calculent sur 7 jours. Si tu changes la fréquence en mensuel, change aussi `86400000 * 7` → `86400000 * 30` dans le node "Compute Weekly Deltas".

### Ajouter une plateforme
Le pattern est toujours le même : Schedule → Fetch handles → Loop → Apify/API → Build row → Upsert. Duplique un collector existant, change l'actor Apify et l'extraction. 30-45 min.

Les actors Apify populaires :
- Facebook : `apify/facebook-pages-scraper`
- Twitter/X : `apify/twitter-scraper`
- Twitch : `pocesar/twitch-scraper`

### Changer les critères d'analyse
Tout est dans le node "Build Claude Prompt" (workflow 05). Tu peux :
- Ajouter des sections (ex: "Prix affichés cette semaine")
- Changer le ton ("formal" vs "casual")
- Forcer une langue (par défaut : l'analyste répond dans la langue du prompt)

### Envoyer le rapport autre part
Remplace le node Gmail final par :
- Un node **Slack** (channel #competitive-intel)
- Un node **Notion** (ajoute une ligne dans une database "Weekly Reports")
- Un node **Google Sheets** (archive de tous les rapports)

---

## 8. Troubleshooting

| Symptôme | Cause probable | Fix |
|---|---|---|
| "No approved handles found" | Aucun handle en `status='approved'` | Update la table : `update competitor_handles set status='approved' where ...` |
| Le scraper Apify timeout | Handle en erreur ou privé | Mets le handle en `status='paused'` |
| Le rapport est vide | < 7 jours de data | Attends une semaine avant le premier vrai rapport |
| Claude renvoie une erreur 401 | Clé API mal copiée | Vérifie `PASTE_YOUR_ANTHROPIC_API_KEY_HERE` remplacé partout |
| YouTube renvoie quota exceeded | Plus de 10k appels/jour | Stagger les crons, ou demande un quota bump |
| Gmail "Invalid credentials" | OAuth n8n expiré | Reconnecte le credential (Credentials → Gmail → Update) |

---

## 9. Aller plus loin

Tu as le système qui tourne. Voici comment passer à la vitesse supérieure :

- 🚀 **La [communauté Skool Taiyka](https://taiyka.com/skool)** — accès aux versions avancées du pipeline (analyse de contenu par post, détection automatique de campagnes, alerting temps réel), lives hebdo Q&A, review de tes rapports, tous mes prompts calibrés.

- 📩 **Le [Cold Outreach Pack](https://taiyka.com/products/cold-outreach-pack) (19€)** — pour transformer l'intel en outbound ciblé (identifier les clients de tes concurrents, leur proposer mieux).

- 🤖 **Le [AI Agent Playbook](https://taiyka.com/products/ai-agent-playbook) (29€)** — pour brancher un agent Claude qui répond à "dis-moi ce qu'a fait le Concurrent A cette semaine" en live (Slack / DM).

---

**Manu** · [@manu_ai.to](https://instagram.com/manu_ai.to) · [taiyka.com](https://taiyka.com)

Ton système tourne ? Envoie-moi un DM, j'adore voir les rapports en prod.
