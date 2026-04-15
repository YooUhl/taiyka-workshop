# Quick-start — Si tu n'as que 2 heures

> Pour ceux qui veulent voir le système tourner avant de lire le playbook complet. Suis ces 7 étapes, tu auras ton premier rapport stratégique en 2h.

---

## Ce dont tu as besoin

- Un compte n8n (cloud ou self-hosted)
- Un compte Supabase (plan gratuit)
- Un compte Apify (~20€ de crédit couvre des mois)
- Une clé API Anthropic (5€ de crédit suffit)
- Une clé API YouTube Data v3 (gratuite)

---

## 1. Supabase — créer la base (10 min)

1. Crée un projet sur [supabase.com](https://supabase.com)
2. Récupère **Project URL** + **Service Role Key** (Settings → API)
3. SQL Editor → colle `delivery/supabase-schema.sql` → Run

---

## 2. Seed tes concurrents (15 min)

Dans le SQL Editor :

```sql
insert into competitors (name) values ('Concurrent A'), ('Concurrent B');

insert into competitor_handles (competitor_id, platform, handle, status)
  select id, 'instagram', 'concurrent_a', 'approved' from competitors where name = 'Concurrent A';
```

Répète pour Instagram, TikTok, YouTube, LinkedIn selon tes concurrents.

Pour YouTube, ajoute aussi le `channel_id` dans `metadata` (trouvable via [commentpicker.com/youtube-channel-id.php](https://commentpicker.com/youtube-channel-id.php)).

---

## 3. Clés API (15 min)

Récupère tes 4 clés :
- Supabase → Settings → API
- Apify → Settings → Integrations
- YouTube → [console.cloud.google.com](https://console.cloud.google.com) → activer YouTube Data API v3
- Anthropic → [console.anthropic.com](https://console.anthropic.com)

---

## 4. Importer les 5 workflows (20 min)

Dans n8n, **+ Add workflow → Import from File** pour chacun :
- `01-instagram-collector.json`
- `02-tiktok-collector.json`
- `03-youtube-collector.json`
- `04-linkedin-collector.json`
- `05-weekly-report-generator.json`

Ctrl+F dans chaque workflow → remplace tous les `PASTE_YOUR_*_HERE` par tes vraies clés.

---

## 5. Gmail credential (10 min)

Dans n8n : Credentials → New → Gmail OAuth2 API. Suis le flow OAuth. Dans le workflow 05, sélectionne ce credential dans "Send via Gmail" et remplace `PASTE_YOUR_RECIPIENT_EMAIL_HERE` par ton email.

---

## 6. Tester chaque workflow (30 min)

Pour chaque collector (01 à 04) :
1. **Manual Trigger** → **Execute Workflow**
2. Vérifie que tous les nodes sont verts
3. Va dans Supabase → `channel_metrics` → tes lignes y sont

Si un workflow échoue, check le node rouge → corrige la clé ou le handle concerné.

---

## 7. Activer et attendre (5 min + quelques jours)

Active les 5 workflows (toggle en haut à droite).

Attends 2-3 jours que la data s'accumule. Lance le workflow 05 manuellement pour générer ton premier rapport. Le lundi suivant, tout tourne en auto.

---

## Tu veux aller plus loin ?

- Lis le **playbook complet** (`playbook-fr.md`) pour customiser l'analyse, ajouter des plateformes, changer la fréquence
- Rejoins la **[communauté Skool Taiyka](https://taiyka.com/skool)** — pipeline avancé, lives hebdo, tous mes prompts calibrés

---

**Manu** · [@manu_ai.to](https://instagram.com/manu_ai.to)

Tu bloques ? Réponds à l'email de livraison.
