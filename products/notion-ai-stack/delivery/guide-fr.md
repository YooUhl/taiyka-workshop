# Guide d'utilisation — Notion AI Stack

> Le dashboard que j'utilise pour garder mon business sous contrôle sans Google Sheets partout.
> — Manu, [Taiyka](https://instagram.com/manu_ai.to)

---

## Ce que tu as dans le pack

- **`template-spec-fr.md`** — la spec complète pour construire le dashboard (30 min)
- **`template-spec-en.md`** — version anglaise
- **`databases-schema.md`** — schéma JSON de chaque database (référence rapide)
- **Ce guide** — onboarding + rituels + idées d'intégration

> ⚠️ **Important :** ce produit est un **spec + guide**, pas un template Notion à dupliquer en 1 clic. La raison est expliquée dans le `template-spec-fr.md`. Un lien Notion dupliquable sera ajouté quand la v1 sera en ligne — tu recevras l'update gratuitement (garde ton email de commande).

---

## Une fois le dashboard construit : par où commencer

### Semaine 1 — peuple les databases

**Jour 1 — AI Tools (15 min)**
Liste les 10 à 20 outils que tu utilises vraiment. Une ligne par outil. Coût mensuel réel (pas le prix affiché sur leur site si tu as un deal).

**Jour 2 — Clients + Projects (20 min)**
Tous tes clients actifs, passés récents, et prospects en cours. Pour chaque client, liste les projets associés (même passés).

**Jour 3 — Automation Backlog (20 min)**
Vide ta tête : tout ce que tu veux automatiser, même les idées floues. Tag `Status = 💡 Idea` + `Impact` + `Effort`. Tu trieras plus tard.

**Jour 4 — Prompt Library (optionnel, 15 min)**
Si tu as acheté le **Prompt Pack 50**, importe le CSV directement dans cette database. Sinon, ajoute tes 5 prompts les plus utilisés.

**Jour 5 — Review + Command Center (10 min)**
Ouvre le dashboard, vérifie que toutes les vues s'affichent bien, ajuste les filtres si besoin.

---

## Les 3 rituels qui font vivre le dashboard

Ce dashboard est inutile si tu l'ouvres une fois par mois. Les rituels ci-dessous prennent **moins d'1h par semaine** et font toute la différence.

### 🗓️ Lundi matin (15 min) — planning hebdo
Ouvre le Command Center et réponds à 3 questions :
1. Quelles sont les 3 deadlines cette semaine ? (`Projects → Timeline`)
2. Qui dois-je relancer ? (`Clients → À recontacter`)
3. Quel chantier d'automation je pousse cette semaine ? (`Automation Backlog → Top priorités`)

Bloque ces items dans ton Google Calendar. Tu viens de gagner la semaine.

### 🗓️ Vendredi soir (20 min) — rétro
Objectif : clôturer proprement.
- Marque les projets livrés en `Status = ✅ Delivered`
- Coche `Paid = true` sur tout ce qui est encaissé
- Écris 3 lignes de post-mortem sur chaque projet livré (ce qui a marché, ce qu'il faut changer)
- Log dans `Prompt Library → Notes / variants` les prompts que tu as remixés cette semaine

### 🗓️ 1er du mois (30 min) — review stack
C'est le moment où tu évites de gaspiller 200€/mois en outils que tu n'ouvres jamais.
- Ouvre `AI Tools → Review queue`
- Pour chaque ligne : ça sert vraiment ? Je garde, je downgrade, ou je churn ?
- Calcule le coût total du stack actif
- Compare au mois dernier
- Bonus : publie un post "voici mon stack ce mois-ci" — contenu ultra facile qui marche bien

---

## Idées d'intégration (étape 2)

Quand tu es à l'aise avec le dashboard manuel, tu peux brancher des automatisations pour que **Notion se remplisse tout seul**. Voici 3 idées testées :

### 1. Formulaire prospect → Clients (easy)
- Tally ou Typeform avec les champs : nom, email, secteur, besoin
- n8n déclenche sur nouveau submit → crée une ligne dans `Clients` avec `Status = 👀 Prospect`
- Gain : zéro saisie manuelle, contexte déjà dans Notion quand tu prépares le call

### 2. Stripe payment → Projects (intermediate)
- Webhook Stripe sur `payment.succeeded`
- n8n matche le customer email avec un client → coche `Paid = true` sur le projet correspondant
- Gain : ta database de facturation est toujours à jour

### 3. Agent Claude lit ton backlog (advanced)
- Tous les lundis 7h, un workflow n8n lit les items `Priority = 🔥 High` de `Automation Backlog`
- Claude génère un mini-plan d'attaque pour celui du haut (découpage en tâches concrètes)
- Le résultat atterrit dans un bloc Notion ou directement en Telegram
- Gain : tu démarres la semaine avec un plan, pas une page blanche

---

## Les erreurs à éviter

❌ **Créer une 6ème database.** Tu penses "j'ai besoin d'une db Leads séparée" — non, filtre `Clients` par Status.

❌ **Over-customiser les statuts.** Les select proposés couvrent 95% des cas. Si tu ajoutes "🟠 En attente feedback", "🟣 Review v2", etc., dans 3 mois tu ne sais plus quoi mettre. Reste simple.

❌ **Remplir pour remplir.** Si une propriété est vide sur 80% des lignes, supprime-la. Une database saine a 80% de taux de remplissage sur ses propriétés clés.

❌ **Oublier les rituels.** Le dashboard perd sa valeur en 2 semaines sans discipline. Bloque les 3 rituels dans ton calendrier **maintenant**, pas après.

---

## C'est quoi la suite ?

- 🤖 **Automatiser le dashboard pour qu'il se remplisse tout seul** (Stripe, Gmail, n8n → Notion) ?
  → [Build Your First AI Agent (29€)](https://taiyka.com/products/ai-agent-playbook)

- 📊 **Voir comment d'autres solopreneurs utilisent ce dashboard + échanger tes setups** ?
  → [La communauté Skool](https://taiyka.com/skool)

---

**Manu** · [@manu_ai.to](https://instagram.com/manu_ai.to) · [taiyka.com](https://taiyka.com)
