# Claude Code Starter Pack — 3 skills pour démarrer

> Le pack que j'aurais aimé avoir quand j'ai découvert Claude Code.
> — Manu, fondateur de [Taiyka](https://instagram.com/manu_ai.to)

---

## C'est quoi Claude Code ?

Claude Code, c'est Claude (l'IA d'Anthropic) qui tourne directement dans ton terminal et qui peut **lire tes fichiers, écrire du code, lancer des commandes et exécuter des "skills"**.

Pense-le comme un assistant ultra-puissant qui vit dans ton ordi : tu lui parles, il agit. Pas de copier-coller depuis ChatGPT, pas de context perdu entre deux conversations.

Un **skill**, c'est juste un fichier `.md` qui dit à Claude *"voici comment tu dois faire X quand on te demande X"*. Tu en installes un, et à partir de ce moment, dès que tu déclenches le bon mot-clé, Claude suit la procédure que tu lui as donnée.

Ce pack contient **3 skills prêts à l'emploi** + ce guide pour les installer en 30 minutes.

---

## Avant de commencer

**Tu as besoin de :**
- Un compte [Anthropic](https://console.anthropic.com) (pour la clé API) OU un abonnement Claude.ai Pro/Max (qui inclut Claude Code)
- Node.js v18+ installé sur ta machine
- Un terminal (Windows : PowerShell ou Git Bash / Mac : Terminal)
- 30 minutes

---

## Étape 1 — Installer Claude Code

### Sur Windows ou Mac

Ouvre ton terminal et tape :

```bash
npm install -g @anthropic-ai/claude-code
```

Vérifie l'install :

```bash
claude --version
```

Si tu vois un numéro de version, c'est bon.

### Authentifier ton compte

Lance :

```bash
claude
```

Au premier lancement, Claude Code t'ouvre une page web pour te connecter (soit avec ta clé API, soit avec ton compte Claude.ai).

C'est tout. Tu peux maintenant lui parler dans le terminal.

---

## Étape 2 — Où mettre les skills

Les skills vivent dans un dossier spécial sur ton ordi. Claude Code les lit automatiquement.

### Sur Mac / Linux
```
~/.claude/skills/
```

### Sur Windows
```
C:\Users\TON_NOM\.claude\skills\
```

Si le dossier `skills` n'existe pas, **crée-le**.

Ensuite, **copie les 3 fichiers `.md` du dossier `skills/` du pack** dans ce dossier. Tu devrais te retrouver avec :

```
~/.claude/skills/
├── content-creator.md
├── morning-planner.md
└── excalidraw-diagram.md
```

C'est tout. Pas de redémarrage, pas de config.

---

## Étape 3 — Comment déclencher un skill

Lance Claude Code dans n'importe quel dossier :

```bash
claude
```

Puis tape une demande qui matche la **description** du skill. Claude détecte automatiquement quel skill utiliser.

### Exemples

**Pour content-creator :**
> "Aide-moi à écrire un script de Reels sur l'automatisation"

**Pour morning-planner :**
> "Planifie ma journée"

**Pour excalidraw-diagram :**
> "Fais-moi un diagramme du flow d'inscription utilisateur"

Claude reconnaît l'intention, charge le skill correspondant, et suit la procédure étape par étape.

---

## Les 3 skills du pack

### 1. content-creator
Génère des scripts de Reels/TikTok, des captions Instagram, des carrousels, ou 10 idées de contenu quand tu sèches. Pose 3 questions sur ton niche/audience/ton, puis sort du contenu prêt à publier.

### 2. morning-planner
Rituel matinal de planification. Lit ton Google Calendar (si MCP connecté), te demande tes tâches, applique la logique 80/20 pour identifier les 3 tâches qui comptent vraiment, et te construit un emploi du temps réaliste.

### 3. excalidraw-diagram
Génère des diagrammes éditables Excalidraw à partir d'une simple description. Architecture, flows, comparaisons, timelines — tout y passe. Sortie en `.excalidraw` que tu ouvres sur excalidraw.com pour éditer.

---

## Troubleshooting

**"claude: command not found"**
→ Node.js n'est pas installé ou pas dans ton PATH. Installe Node depuis [nodejs.org](https://nodejs.org), redémarre ton terminal.

**Le skill ne se déclenche pas**
→ Vérifie que le fichier `.md` est bien dans `~/.claude/skills/` (Mac) ou `C:\Users\TON_NOM\.claude\skills\` (Windows). Vérifie aussi que la **description** du skill matche ta demande — si ta phrase est trop vague, Claude ne sait pas quel skill activer.

**Claude répond mais n'utilise pas le skill**
→ Sois explicite : "Utilise le skill morning-planner pour planifier ma journée."

**morning-planner n'écrit pas dans Google Calendar**
→ Normal : tu n'as pas le MCP Google Calendar connecté. Le skill marche quand même et te sort le planning en markdown que tu peux copier manuellement. Pour aller plus loin, ajoute le MCP Google Calendar (doc Anthropic).

---

## Pour aller plus loin

Tu veux :

- **Apprendre à construire ton premier agent IA de A à Z** ?
  → [Build Your First AI Agent (29€)](https://taiyka.com/products/ai-agent-playbook)

- **Rejoindre une communauté de Solopreneurs IA + accès à tous mes nouveaux skills, workflows et produits** ?
  → [La communauté Skool](https://taiyka.com/skool)

- **Voir comment je construis mes propres skills** ?
  → Suis-moi sur [@manu_ai.to](https://instagram.com/manu_ai.to), je publie tout en open source.

---

**Manu** · [@manu_ai.to](https://instagram.com/manu_ai.to) · [taiyka.com](https://taiyka.com)
