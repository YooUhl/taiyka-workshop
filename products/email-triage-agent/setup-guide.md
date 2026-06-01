# Email Triage Agent — Guide d'installation

**Temps estimé :** 15 à 30 minutes
**Prérequis :** zéro expérience n8n requise. Si tu sais cliquer sur "Import", t'es bon.

Bienvenue. Ce workflow, c'est exactement le premier agent que j'ai vendu en freelance (250€/mois récurrents par client). Tu vas l'avoir tourner sur ta propre boîte Gmail en moins d'une demi-heure.

Ce qu'il fait, en clair : chaque matin à 8h, il lit les 24 dernières heures de ta boîte Gmail, demande à Claude de classer chaque mail en 4 catégories (`client`, `prospect`, `admin`, `junk`) avec un score de priorité de 1 à 3, et t'envoie un résumé HTML propre dans ta propre boîte. Tu ouvres ton mail le matin, tu sais en 30 secondes ce qui mérite ton attention.

---

## Ce qu'il te faut avant de commencer

| Service | Pourquoi | Coût |
|---|---|---|
| **n8n** (cloud ou self-host) | Faire tourner le workflow | Free tier OK |
| **Anthropic API** (console.anthropic.com) | Faire classer les mails par Claude | ~$0.0005 par mail. Les 5$ de crédit offerts couvrent ~10 000 mails |
| **Compte Google** (Gmail) | Lire ta boîte + t'envoyer le résumé | Gratuit |

Pas de compte n8n ? Va sur [n8n.io](https://n8n.io) → *Start for free*. Le free tier suffit largement pour 1 run/jour.

Pas de clé Anthropic ? [console.anthropic.com](https://console.anthropic.com) → *API Keys* → *Create Key*. Mets 5$ de crédit, ça dure des mois.

---

## Étape 1 — Importer le workflow

1. Télécharge le fichier `n8n-workflow.json` joint au post Skool.
2. Ouvre ton n8n.
3. Clique en haut à droite sur **Add workflow** → **Import from File**.
4. Sélectionne le `.json`.

Tu vois 10 nodes connectés. C'est normal. On va les configurer un par un.

---

## Étape 2 — Configurer la credential Gmail OAuth

C'est la partie la plus longue (5 min) mais c'est du clic-clic.

1. Clique sur le node **Gmail — last 24h**.
2. Dans le champ **Credential to connect with**, clique **Create new credential**.
3. Type : **Gmail OAuth2 API**.
4. n8n te donne deux URLs (OAuth Redirect URL). Copie-les.
5. Va sur [console.cloud.google.com](https://console.cloud.google.com) → crée un projet → active **Gmail API** → **OAuth consent screen** (External, ton mail, scopes : `gmail.modify` et `gmail.send`) → **Credentials** → **Create Credentials** → **OAuth client ID** → type *Web application* → colle les redirect URLs de n8n.
6. Tu récupères un **Client ID** + **Client Secret**. Colle-les dans n8n.
7. Clique **Sign in with Google** dans la fenêtre n8n → autorise → ✅ c'est connecté.
8. Réutilise la même credential pour le node **Send digest** (en bas du workflow).

> Si t'as déjà une credential Gmail dans n8n d'un autre workflow, sélectionne-la dans la liste et saute toute cette étape.

---

## Étape 3 — Configurer ta clé Anthropic + ton email destinataire

1. Clique sur le node **Config** (le 2ème node, juste après le Schedule).
2. Tu vois 5 variables. Remplace les `PASTE_YOUR_*_HERE` :
   - `anthropic_api_key` → ta clé Anthropic (commence par `sk-ant-...`)
   - `claude_model` → laisse `claude-haiku-4-5` (ne change pas sauf si tu sais ce que tu fais)
   - `digest_recipient_email` → ton adresse Gmail (celle qui recevra le résumé chaque matin)
   - `batch_size` → laisse `25`
   - `max_emails_per_run` → laisse `50`
3. Clique **Save**.

> Bonne pratique : crée un label Gmail "Triage" et redirige le résumé vers ce label avec un filtre. Tu garderas ta boîte propre.

---

## Étape 4 — (Optionnel) Changer le destinataire

Par défaut le résumé t'es envoyé à toi-même. Si tu veux l'envoyer à une autre adresse (ton mail pro, ton assistante, ta team), change juste la valeur de `digest_recipient_email` dans le node **Config**.

Tu peux mettre plusieurs adresses séparées par une virgule.

---

## Étape 5 — Tester manuellement

Avant d'activer le scheduling, on test une fois en manuel.

1. Clique sur le node **Schedule trigger** (premier node).
2. En haut à droite du canvas, clique **Execute Workflow**.
3. Attends 10-30 secondes.
4. Va checker ta boîte → tu devrais avoir reçu un mail intitulé *"Triage du jour — X mails dans ta boîte"*.

**Tu vois pas le mail ?** Va dans **Executions** (menu de gauche dans n8n) → ouvre la dernière run → regarde quel node est rouge. La table de troubleshooting plus bas couvre les cas classiques.

---

## Étape 6 — Activer le workflow

1. En haut à droite du canvas, bascule le switch **Inactive → Active**.
2. C'est tout. Demain matin à 8h, ton résumé arrive.

Tu peux changer l'heure dans le node **Every day at 8h** → modifie l'expression cron (`0 8 * * *` = 8h pile, `30 7 * * *` = 7h30, etc.).

---

## Étape 7 — (Optionnel) Personnaliser les catégories

Les 4 catégories par défaut (`client`, `prospect`, `admin`, `junk`) marchent pour 90% des cas. Mais tu peux les changer si t'as un usage différent.

**Exemple : reclasser pour une boîte perso plutôt que pro.**

1. Ouvre le node **Build Claude batch prompt**.
2. Dans le code JavaScript, trouve le bloc `# CATEGORIES` dans la variable `system`.
3. Remplace par tes propres catégories (ex: `important`, `social`, `newsletter`, `junk`).
4. Ouvre le node **Format summary email** et change le mapping `CATEGORY_META` pour refléter tes nouvelles catégories (label + couleur + icône).
5. Sauvegarde, re-teste.

> Si tu te plantes, importe à nouveau le `.json` original, t'as tout retrouvé.

---

## Troubleshooting

| Problème | Cause probable | Fix |
|---|---|---|
| Le mail n'arrive jamais | Workflow inactif ou Gmail OAuth pas autorisé | Vérifie le switch *Active*, puis re-connecte la credential Gmail |
| Erreur `401 unauthorized` sur le node Call Claude | Clé Anthropic invalide ou pas de crédit | Va sur console.anthropic.com → vérifie la clé et le solde |
| Erreur `429 rate limit` sur le node Call Claude | Trop d'emails d'un coup ou compte sans crédit | Réduis `max_emails_per_run` à 25 dans le node Config |
| Le résumé arrive vide (0 mails) | Boîte Gmail vide ces 24h OU filtre Gmail trop strict | Normal si pas de mails. Sinon teste avec `newer_than:3d` dans le node *Gmail — last 24h* |
| Les catégories sont toutes "admin" | Claude n'a pas reçu de snippet utile | Vérifie le node *Normalize emails* — peut-être que le format Gmail renvoie pas le snippet attendu. Active le mode `simple: false` dans le node Gmail |

---

## Going further

Quand tu maîtrises la base, voilà 3 améliorations qui valent le coup :

1. **Notification Slack au lieu d'email.** Remplace le node *Send digest* par un node Slack → poste le résumé dans un canal `#triage-matin` perso. Idéal si t'es plus sur Slack que sur Gmail le matin.

2. **Auto-archive des junk.** Ajoute un node Gmail *Modify* après *Group + sort* qui prend tous les `junk` et les archive (supprime le label `INBOX`). Tu ouvres ta boîte le matin, les promos ont disparu.

3. **Digest hebdo au lieu de quotidien.** Change le cron en `0 9 * * 1` (lundi 9h), passe `newer_than:1d` à `newer_than:7d` dans le node Gmail. Tu reçois un résumé du lundi qui couvre toute la semaine passée. Utile si t'as une boîte calme.

---

## Tu veux aller plus loin ?

Cet agent c'est le niveau 1. Les membres du Skool reçoivent **un nouveau workflow comme celui-ci chaque mois**, plus un canal *#aide-technique* où je débloque en direct, plus un call live par semaine pour reviewer tes builds.

[**Rejoindre la communauté Skool →**](#)

— Manu
