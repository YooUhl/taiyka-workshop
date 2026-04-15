# Quick-start — Si tu n'as que 30 min

> Pour ceux qui veulent voir l'agent tourner avant de lire le playbook complet. Suis ces 6 étapes, tu auras un agent IA fonctionnel en 30 minutes.

---

## Ce dont tu as besoin

- Un compte n8n (cloud ou self-hosted) — la version cloud gratuite suffit
- Une clé API Anthropic ([console.anthropic.com](https://console.anthropic.com)) — 5€ de crédit suffit largement
- 30 minutes

---

## 1. Importer le workflow (3 min)

1. Ouvre ton n8n
2. **+ Add workflow** → menu **... → Import from File**
3. Choisis `delivery/workflow/agent-starter.json`
4. Tu vois apparaître 6 nodes connectés

---

## 2. Configurer (5 min)

Clique sur le node **"Edit Fields (config)"** et remplace :

| Champ | Valeur |
|---|---|
| `anthropic_api_key` | Ta clé API Anthropic |
| `business_name` | Le nom de ton business |
| `business_offer` | Une phrase qui décrit ce que tu fais |

Optionnel : change `agent_name` ("Aria" par défaut) et `claude_model` (`claude-sonnet-4-6` par défaut, basculable sur `claude-haiku-4-5` pour économiser).

---

## 3. Activer le workflow (1 min)

1. Sauvegarde le workflow (Ctrl+S)
2. Active-le (toggle en haut à droite)
3. Clique sur le node **"Webhook (incoming message)"** → copie l'URL du webhook (deux versions s'affichent : "Test URL" pour les essais, "Production URL" pour la prod — utilise la Production)

---

## 4. Tester (5 min)

Dans un terminal :

```bash
curl -X POST "https://TON_N8N_URL/webhook/agent-starter" \
  -H "Content-Type: application/json" \
  -d '{"user_message": "Salut, vous proposez quoi ?", "user_name": "Marie"}'
```

Tu dois recevoir une réponse en JSON :

```json
{
  "reply": "Salut Marie ! On est [business_name]...",
  "model": "claude-sonnet-4-6"
}
```

🎉 Ton premier agent IA tourne.

---

## 5. Customiser le prompt (10 min)

Ouvre le node **"Build prompt"**. Le system prompt est en JavaScript dedans. C'est lui qui définit le comportement de l'agent.

**Trois choses à changer pour ton cas :**

- **Le `# YOUR JOB`** — décris ce que ton agent doit faire pour ton business
- **Les `# RULES (NEVER, EVER)`** — ajoute les règles spécifiques (ex: "Ne jamais quoter de prix exact", "Ne jamais promettre de date de livraison")
- **Le `# TONE & STYLE`** — adapte au ton de ton brand

Sauvegarde et relance le test. La réponse change immédiatement.

---

## 6. Brancher sur ton vrai canal (6 min)

Le webhook accepte n'importe quelle source. Quelques options rapides :

- **Site web** — ajoute un widget de chat (Tidio, Chatwoot, ou un input custom) qui POST sur l'URL du webhook
- **Instagram / Messenger** — connecte un node Meta Messenger en amont du Webhook (n8n a des nodes natifs)
- **WhatsApp** — via Twilio ou Meta WhatsApp Business
- **Email** — node Gmail Trigger en amont, qui POST sur le même endpoint

Pour la version "vraiment branchée sur Instagram", suis le **Chapitre 3** du playbook complet.

---

## Tu veux plus ?

- Lis le **playbook complet** (`playbook-fr.md`) — 6 chapitres pour comprendre, packager et **vendre** ton agent
- Bundle les 3 Claude skills (`delivery/skills/`) dans tes propres projets — `agent-prompt-architect` est ton meilleur ami pour designer le prompt
- Rejoins la **[communauté Skool](https://taiyka.com/skool)** pour les agents avancés (qui appellent des tools, qui mémoirent, qui se chaînent)

---

**Manu** · [@manu_ai.to](https://instagram.com/manu_ai.to)

Tu bloques ? Réponds à l'email de livraison.
