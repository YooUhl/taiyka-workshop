# Guide d'utilisation — 50 Prompts pour Automatiser ton Business

> Le pack que j'utilise tous les jours dans mes propres workflows.
> — Manu, [Taiyka](https://instagram.com/manu_ai.to)

---

## Ce que tu as dans le pack

- **`prompts-fr.md`** — les 50 prompts en français, organisés par catégorie
- **`prompts-en.md`** — la version anglaise (utile si tu travailles avec des clients EN)
- **`prompts.csv`** — fichier prêt à importer dans Notion (FR + EN dans les mêmes lignes)
- **Ce guide** — comment utiliser, importer, et remixer

---

## Les 5 catégories

1. **Contenu** — hooks, scripts, captions, carousels (10 prompts)
2. **Ventes** — cold emails, DMs, pitches, suivis (10 prompts)
3. **Opérations** — SOPs, audits workflow, planning (10 prompts)
4. **Recherche** — synthèses, veille, personas, comparatifs (10 prompts)
5. **Support client** — réponses, FAQ, onboarding, refunds (10 prompts)

---

## Comment utiliser un prompt

1. **Copie le prompt** depuis le `.md` ou le `.csv`
2. **Remplace les `{variables}`** entre accolades par tes infos
3. **Colle dans ton outil** : Claude, ChatGPT, Gemini, ou un node n8n
4. **Ajuste le résultat** avec le "Tweak this" en bas de chaque prompt

**Petit tip :** pour les prompts longs, garde une version épurée pour mobile et la version complète pour les sessions de travail au calme.

---

## Importer le CSV dans Notion

1. Crée une nouvelle page dans Notion → **Import** → **CSV**
2. Sélectionne `prompts.csv`
3. Notion crée automatiquement une database avec les colonnes : `title_fr`, `title_en`, `category`, `prompt_fr`, `prompt_en`
4. Optionnel : passe la propriété `category` en **Select** pour filtrer plus facilement

**Vues utiles à créer :**
- 📋 **Liste par catégorie** — vue Gallery groupée par `category`
- 🔥 **Mes favoris** — ajoute une propriété Checkbox "Favori" puis vue filtrée
- 🌍 **FR uniquement / EN uniquement** — selon ce que tu utilises le plus

---

## Importer dans Claude Projects ou ChatGPT (mémoire)

Tu peux uploader le `.md` directement comme fichier de référence dans :
- **Claude Projects** (Knowledge files)
- **ChatGPT Custom GPT** (Knowledge)
- **Gemini Gems** (Instructions ou fichiers attachés)

Ensuite tu demandes : *"Utilise le prompt #12 pour cette situation : [contexte]"* — l'IA va piocher direct dans le pack.

---

## Comment remixer un prompt

Les prompts sont des **bases**, pas des dogmes. Voici 3 façons de les adapter :

### 1. Change le ton
Remplace "voix confiante directe ‘tu’" par ce que tu veux (formel, humoristique, B2B corporate, etc.).

### 2. Change la langue de sortie
Tous les prompts sont neutres sur la langue de sortie. Ajoute juste "Réponds en {langue}" à la fin.

### 3. Combine deux prompts
Exemple : prompt #2 (script Reel) + prompt #7 (storytelling client) = un script Reel basé sur un projet client anonymisé.

---

## Conseils pour rendre tes prompts encore meilleurs

- **Plus tu donnes de contexte, meilleur c'est.** Ajoute toujours : ton secteur, ton audience, des exemples concrets.
- **Mets des contre-exemples.** Dis "JAMAIS X" est aussi puissant que "fais Y".
- **Demande plusieurs variantes.** "Génère 3 versions" force le modèle à explorer plus large.
- **Garde un fichier ‘mes meilleurs prompts à moi’** où tu copies les versions que tu as remixées et qui marchent vraiment pour toi.

---

## Rituel hebdo recommandé

Bloque **30 minutes le dimanche soir** pour :
1. Choisir 3 prompts que tu vas utiliser cette semaine
2. Les remixer avec ton contexte (entreprise, client, projet en cours)
3. Les sauvegarder dans tes "favoris"

En 4 semaines, tu auras un arsenal de 12 prompts ultra calibrés à TOI.

---

## C'est quoi la suite ?

Tu veux passer à l'étape supérieure ?

- 🤖 **Construire ton premier vrai agent IA** (Claude + n8n, de A à Z) ?
  → [Build Your First AI Agent (29€)](https://taiyka.com/products/ai-agent-playbook)

- 📊 **Une bibliothèque vivante de prompts + workflows + templates dans une vraie communauté** ?
  → [La communauté Skool](https://taiyka.com/skool)

---

**Manu** · [@manu_ai.to](https://instagram.com/manu_ai.to) · [taiyka.com](https://taiyka.com)
