# 50 Prompts pour Automatiser ton Business

> Les prompts que j'utilise vraiment dans Claude, ChatGPT, n8n et mes agents IA.
> — Manu, fondateur de [Taiyka](https://instagram.com/manu_ai.to)

---

## Comment lire ce pack

Chaque prompt suit le même format :
- **Titre** — ce que ça fait en 5 mots
- **Cas d'usage** — quand l'utiliser
- **Le prompt** — copie-colle, remplace les `{variables}` entre accolades
- **Tweak this** — comment l'adapter à ton contexte

Tu peux les utiliser dans Claude, ChatGPT, Gemini, ou les brancher dans un node "AI Agent" / "Basic LLM Chain" sur n8n.

---

# CATÉGORIE 1 — CONTENU (10 prompts)

## 1. Hook viral pour Reel
**Cas d'usage :** générer 10 hooks accrocheurs pour un Reel Instagram à partir d'un sujet.

```
Tu es un scénariste de vidéos courtes spécialisé dans le contenu IA et entrepreneuriat (FR).

Sujet : {sujet}
Audience : {audience}

Génère 10 hooks (premières phrases de la vidéo, max 12 mots chacun).

Règles :
- Crée un curiosity gap — ne révèle pas tout
- Utilise "tu" jamais "vous"
- Mélange : observation marché, question directe, contrarian take, anecdote perso, chiffre choc
- Pas de "Dans cette vidéo..." ni "Aujourd'hui je vais..."
- Pas d'emoji

Format : liste numérotée, un hook par ligne.
```

**Tweak this :** ajoute "Style : {nom d'un créateur que tu aimes}" pour calquer un ton précis.

---

## 2. Script Reel 30 secondes
**Cas d'usage :** transformer une idée en script complet vidéo courte.

```
Écris un script de Reel Instagram de 30 secondes maximum sur le sujet suivant.

Sujet : {sujet}
Angle : {angle — ex: tutoriel, opinion, demo}
Voix : confiante, directe, "tu", française parlée naturelle.

Structure :
1. HOOK (0-3s) — phrase qui stoppe le scroll
2. SETUP (3-8s) — pourquoi ça compte
3. CONTENU (8-25s) — 2-3 points concrets, exemples réels
4. CLOSE (25-30s) — punchline, observation calme, ou humour. JAMAIS un CTA classique du type "abonne-toi".

Inclure entre crochets [INDICATIONS DE TOURNAGE] (cut, B-roll, texte à l'écran).
Pas de jargon. Pas de tips génériques. Parle d'expérience.
```

**Tweak this :** précise ton format (TikTok, YouTube Short, Reel) — la durée idéale change.

---

## 3. Caption Instagram qui crée la curiosité
**Cas d'usage :** rédiger une légende qui ne résume PAS la vidéo.

```
Rédige une caption Instagram pour ce Reel.

Sujet de la vidéo : {sujet}
Résultat / promesse : {ce qui est montré}

Règles :
- 1 à 2 phrases maximum
- NE PAS résumer la vidéo
- Soit créer la curiosité, soit ajouter un angle complémentaire, soit livrer la punchline
- Ton confiant, "tu", style FR parlé
- Max 1 emoji fonctionnel
- Termine par 4-6 hashtags : #ai #automation #entrepreneur + 2-3 contextuels
```

**Tweak this :** demande 5 variantes pour A/B tester.

---

## 4. Carousel LinkedIn 7 slides
**Cas d'usage :** générer un carousel pédagogique structuré.

```
Crée un carousel LinkedIn de 7 slides sur le sujet suivant.

Sujet : {sujet}
Audience : {audience}
Objectif : {ex: éduquer, montrer un système, raconter une expérience}

Structure :
- Slide 1 : Hook visuel + promesse claire
- Slide 2 : Le problème (ce que les gens font mal)
- Slide 3-5 : 3 étapes / 3 idées concrètes (max 5 mots par ligne, méthode 555)
- Slide 6 : Exemple réel ou résultat chiffré
- Slide 7 : CTA doux (question ouverte, pas "DM moi")

Pour chaque slide, donne :
- Titre (max 6 mots)
- 3-5 bullets ultra courts
- Note pour le designer (visuel, icône, capture)
```

**Tweak this :** demande la version "case study" si tu pars d'un projet client.

---

## 5. Idées de contenu pour 7 jours
**Cas d'usage :** débloquer un planning hebdo en 30 secondes.

```
Génère 7 idées de contenu (1 par jour) pour ma semaine sur Instagram.

Mon créneau : {ex: AI automation pour entrepreneurs}
Mon angle unique : {ex: je construis mes propres systèmes en n8n}
Audience : {audience}

Mix recommandé :
- 2-3 démos d'outils IA (avec nom précis et résultat)
- 1 moment perso / journey
- 1 hook mindset / challenge
- 1 stratégie business
- 1 réaction à une actualité IA

Pour chaque idée :
- Format (Reel, carousel, story)
- Hook proposé
- Angle en une phrase
- Pourquoi ça va marcher (1 ligne)
```

**Tweak this :** précise tes piliers de contenu pour rester aligné.

---

## 6. Réutilisation : Reel → Tweet thread
**Cas d'usage :** transformer un script vidéo en thread X/Twitter.

```
Voici le script d'un de mes Reels :

{script}

Transforme-le en thread Twitter/X de 6-8 tweets.

Règles :
- Tweet 1 = hook ultra court (max 220 caractères) qui pourrait fonctionner seul
- Tweets suivants = 1 idée par tweet, espace entre les phrases
- Pas de hashtags dans le thread sauf le dernier
- Dernier tweet = punchline ou observation, jamais "RT si vous êtes d'accord"
- Voix : confiante, directe, "tu" si applicable

Termine en proposant 3 visuels possibles (capture, schéma, chiffre).
```

**Tweak this :** demande aussi la version newsletter ou article LinkedIn.

---

## 7. Storytelling : transformer un projet client en post
**Cas d'usage :** raconter un projet sans casser le NDA.

```
Je veux raconter un projet client sans le nommer.

Contexte du projet : {description rapide}
Problème résolu : {problème}
Solution mise en place : {solution}
Résultat chiffré : {résultat}

Génère un post Instagram (caption + idée vidéo) qui :
- Anonymise le client (jamais de nom, secteur générique)
- Met en avant LE problème + LA solution + LE résultat
- Garde un ton humble — pas de flex
- Inspire d'autres entrepreneurs à automatiser
- Inclut une métaphore ou image mentale forte

Format : hook vidéo + caption + 3 angles alternatifs.
```

**Tweak this :** ajoute "anonymise aussi le secteur" si NDA strict.

---

## 8. Script YouTube long format (8-12 min)
**Cas d'usage :** structurer une vidéo longue.

```
Écris la structure complète d'une vidéo YouTube de 8-12 minutes.

Sujet : {sujet}
Promesse : {ce que le viewer aura appris à la fin}
Audience : {audience}

Structure :
- HOOK (0-15s) — promesse + raison de rester
- INTRO (15-45s) — qui je suis + pourquoi écouter ça
- 3 à 5 SECTIONS — chacune avec : titre, key takeaway, exemple concret, transition vers la suivante
- DEMO / CASE STUDY au milieu
- OUTRO — résumé en 3 points + CTA doux (question ou prochaine vidéo)

Pour chaque section, ajoute :
- Durée estimée
- B-roll suggéré
- Phrase de transition
```

**Tweak this :** demande la version "tutoriel" vs "opinion" — la structure change.

---

## 9. Reformulation : ton trop générique → ton perso
**Cas d'usage :** réécrire un texte fade dans ta voix.

```
Voici un texte trop générique :

{texte}

Réécris-le dans la voix suivante :
- Confiante, directe, jamais arrogante
- "Tu" en français
- Phrases courtes
- Pas de superlatifs ("incroyable", "génial", "révolutionnaire")
- Pas de tips / conseils — parler d'expérience uniquement
- Si terme technique, explication immédiate ("n8n, t'inquiète c'est juste...")
- Une métaphore concrète si possible
- Termine par une observation calme, pas un CTA forcé

Garde le sens, change le style.
```

**Tweak this :** colle 2-3 exemples de TON propre texte pour calibrer encore plus précisément.

---

## 10. Brief créatif pour designer
**Cas d'usage :** transformer une idée visuelle en brief clair.

```
Génère un brief créatif pour un designer à partir de cette idée :

Idée : {idée visuelle}
Format : {ex: thumbnail YouTube, post carousel, cover ebook}
Marque : {nom + 2 couleurs principales}
Audience : {audience}

Le brief doit contenir :
1. Objectif du visuel (en 1 phrase)
2. Mood / direction artistique (3 mots-clés)
3. Élément central (ce qui doit attirer l'œil immédiatement)
4. Hiérarchie visuelle (ordre de lecture)
5. Couleurs et contraste
6. Texte à intégrer (titre, sous-titre, max)
7. À éviter (anti-références)
8. 3 références visuelles à chercher (sites, comptes, styles)
```

**Tweak this :** ajoute le format de livraison final (Figma, PDF, dimensions exactes).

---

# CATÉGORIE 2 — VENTES (10 prompts)

## 11. Icebreaker cold email personnalisé
**Cas d'usage :** générer une accroche personnalisée à partir d'infos publiques.

```
Tu écris UNE seule phrase en français qui sert d'accroche personnalisée pour un email de prospection à froid.

Contexte du prospect :
- Nom de l'entreprise : {entreprise}
- Secteur / ville : {secteur_ville}
- Détail observé sur leur site/réseaux : {detail}

Règles strictes :
1. UNE seule phrase
2. UN seul compliment léger maximum (niveau "belle réputation en ligne")
3. INTERDIT : flatterie excessive, chiffres précis, mots "IA", énergie de fan
4. La phrase doit se lire naturellement avant : ", c'est pour ça que je vous contacte."
5. Doit donner l'impression "cette personne a regardé mon business" — pas "cette personne me flatte pour vendre"

Retourne uniquement la phrase, sans guillemets ni ponctuation finale.
```

**Tweak this :** adapte le secteur (immobilier, e-commerce, agences) — change les détails à observer.

---

## 12. Cold email séquence 4 touches
**Cas d'usage :** construire une séquence d'outreach complète.

```
Construis une séquence de cold email de 4 touches en français.

Mon offre : {offre en 1 ligne}
Cible : {persona précis}
Pain point principal : {pain}
Résultat promis : {résultat chiffré si possible}

Pour chaque email :
1. Subject line (max 5 mots, pas de majuscules abusives)
2. Body (max 80 mots, structure : accroche perso → problème → preuve/résultat → 1 question simple)
3. Délai entre cet email et le précédent

Ton : direct, professionnel, jamais commercial agressif.
- Email 1 : intro + valeur
- Email 2 : preuve / case study
- Email 3 : angle différent ou ressource gratuite
- Email 4 : breakup mail court et propre

Pas de "J'espère que vous allez bien". Pas de pitch dans l'email 1.
```

**Tweak this :** ajoute "secteur : {x}" pour adapter le vocabulaire.

---

## 13. DM Instagram qui ne ressemble pas à un pitch
**Cas d'usage :** ouvrir une conversation, pas vendre directement.

```
Écris 5 variantes de DM Instagram pour ouvrir une conversation avec ce prospect.

Profil cible : {description}
Mon angle : {ce qui me connecte au prospect}
Mon offre future (ne pas pitcher dans le DM) : {offre}

Règles :
- Max 2 phrases
- Référence un détail SPÉCIFIQUE de leur profil ou d'un post récent
- Termine par UNE question simple à laquelle on a envie de répondre
- Jamais de pitch direct
- Jamais de "j'ai vu ton profil et je trouve ça incroyable"
- Pas d'emoji sauf si naturel

Génère 5 variantes avec angles différents.
```

**Tweak this :** remplace par message LinkedIn — change juste la longueur (3-4 phrases).

---

## 14. Discovery call : 10 questions à poser
**Cas d'usage :** structurer un appel de découverte client.

```
Je vais avoir un appel de découverte avec un prospect.

Leur secteur : {secteur}
Mon offre : {offre}
Ce que je sais déjà : {infos}

Génère 10 questions à poser dans cet ordre :
1-2 : Contexte business (où ils en sont)
3-4 : Pain point actuel (chiffrer si possible)
5-6 : Solutions déjà essayées
7-8 : Vision / objectif 6-12 mois
9 : Budget / process de décision
10 : Question de clôture qui fait réfléchir

Pour chaque question, ajoute :
- Pourquoi tu la poses
- Ce que tu cherches à apprendre
- Une question de relance possible
```

**Tweak this :** demande la version "audit technique" si l'appel est plus tech que sales.

---

## 15. Proposition commerciale en 1 page
**Cas d'usage :** structurer une proposition courte et percutante.

```
Rédige une proposition commerciale d'une page pour ce client.

Client : {nom + secteur}
Problème identifié : {problème}
Solution proposée : {solution}
Livrables : {liste}
Timeline : {durée}
Investissement : {prix} EUR

Structure :
1. CONTEXTE (3 lignes — leur situation actuelle)
2. CE QUE JE PROPOSE (la solution en termes de bénéfice, pas de feature)
3. LIVRABLES (liste claire avec dates)
4. INVESTISSEMENT (prix + modalités)
5. CE QUI SE PASSE ENSUITE (next steps clairs)

Ton : professionnel, confiant, JAMAIS commercial. Aucun superlatif.
Pas de "nous sommes ravis de vous présenter".
```

**Tweak this :** demande la version "options 3 paliers" pour upsell automatique.

---

## 16. Objection handling : top 5 objections
**Cas d'usage :** préparer les réponses aux objections classiques.

```
Mon offre : {offre + prix}
Cible : {persona}

Liste les 5 objections les plus probables que va me sortir un prospect, et pour chacune :

1. L'objection (formulée comme un humain la dirait, pas "c'est trop cher")
2. Ce qu'il y a derrière (la vraie peur ou le vrai blocage)
3. Ma réponse en 2-3 phrases (calme, pas défensive, qui reframe)
4. La question à poser pour rebondir et continuer la conversation

Pas de techniques de vente agressives. On joue la transparence.
```

**Tweak this :** demande "version FR culture business" — les objections françaises sont souvent indirectes.

---

## 17. Pitch elevator 30 secondes
**Cas d'usage :** se présenter clairement en réseau ou en story.

```
Construis-moi un pitch elevator de 30 secondes maximum.

Mon business : {nom + activité}
Pour qui : {cible précise}
Problème résolu : {problème}
Différence vs concurrents : {ce qui me rend unique}

Structure :
- Phrase 1 : qui je sers et quel problème je résous (pas "j'aide les gens à...")
- Phrase 2 : COMMENT (la méthode ou le système, en 1 ligne)
- Phrase 3 : preuve concrète OU déclaration confiante
- Termine par une question ouverte qui invite à continuer

Pas de jargon. Pas de "passionné par". Pas de "je suis un expert en".
Génère 3 variantes (formel, casual, story).
```

**Tweak this :** précise le contexte (event tech, dîner perso, podcast).

---

## 18. Email de relance après silence
**Cas d'usage :** relancer un prospect sans être lourd.

```
Écris un email de relance court pour ce contexte :

Dernier échange : {date + sujet}
Pourquoi le silence est probable : {hypothèse}
Mon offre/proposition initiale : {offre}

Règles :
- Max 60 mots
- Ne pas s'excuser ("désolé de vous relancer")
- Apporter UN élément nouveau (info marché, mise à jour, ressource)
- Une seule question simple à la fin
- Ton : posé, jamais désespéré

Génère 3 variantes (info marché / case study / breakup propre).
```

**Tweak this :** ajoute "ton FR pro mais pas rigide" pour clients français.

---

## 19. Page de vente : section bénéfices
**Cas d'usage :** transformer features en bénéfices client.

```
Voici les features de mon produit :

{liste de features}

Pour chaque feature :
1. Récris-la comme un BÉNÉFICE concret pour le client (pas "fonctionnalité X" mais "tu obtiens Y en moins de Z")
2. Ajoute un mini-exemple ou métaphore qui rend ça palpable
3. Indique la peur ou le désir profond auquel ça répond

Format : tableau avec 3 colonnes (Feature → Bénéfice → Émotion derrière).
Voix : "tu", confiante, jamais "découvrez nos solutions innovantes".
```

**Tweak this :** demande aussi 5 témoignages-types crédibles pour cette cible.

---

## 20. Suivi post-démo (qualification)
**Cas d'usage :** envoyer un récap clair après une démo produit.

```
Je viens de faire une démo de mon produit/service à ce prospect.

Ce qui a été montré : {démo résumée}
Leur réaction perçue : {réaction}
Leurs questions principales : {questions}
Prochaine étape évoquée : {next step}

Écris un email de suivi qui :
1. Récapitule en 3 bullets ce qui a été montré
2. Répond aux questions évoquées (en ligne, pas en pj)
3. Confirme la prochaine étape avec date + heure proposée
4. Inclut UN lien utile (ressource, case study, doc)
5. Termine par une question simple

Max 120 mots. Ton : professionnel, posé, pas commercial.
```

**Tweak this :** ajoute "joindre une proposition courte" si la conversation est mûre.

---

# CATÉGORIE 3 — OPÉRATIONS (10 prompts)

## 21. SOP (Standard Operating Procedure) à partir d'un process
**Cas d'usage :** documenter un process pour le déléguer.

```
Documente le process suivant comme une SOP claire qu'un nouveau membre d'équipe pourrait suivre seul.

Process : {description du process en 1 paragraphe}
Outils utilisés : {liste outils}
Fréquence : {ex: hebdo, à la demande}

Format de sortie :
1. NOM DU PROCESS + objectif en 1 ligne
2. PRÉ-REQUIS (accès, infos, outils)
3. ÉTAPES NUMÉROTÉES (chacune avec : action, screenshot suggéré, output attendu)
4. POINTS D'ATTENTION (erreurs courantes)
5. CRITÈRES DE SUCCÈS (comment savoir que c'est bien fait)
6. ESCALATION (quoi faire si bloqué)

Style : impératif clair ("Ouvre X, clique sur Y"). Pas de jargon non expliqué.
```

**Tweak this :** demande aussi la checklist version courte pour l'usage quotidien.

---

## 22. Audit d'un workflow n8n
**Cas d'usage :** identifier les faiblesses d'un workflow existant.

```
Je vais te décrire un workflow n8n. Audit-le et propose des améliorations.

Description du workflow : {description}
Trigger : {trigger}
Nodes principaux : {liste nodes}
Output attendu : {output}
Problèmes constatés : {bugs ou frustrations}

Analyse :
1. POINTS FAIBLES (logique, error handling, performance, sécurité)
2. RISQUES CACHÉS (rate limits, données sensibles, points de panne)
3. SIMPLIFICATIONS POSSIBLES (nodes à fusionner, branches inutiles)
4. AMÉLIORATIONS PRIORITAIRES (top 3, classées par impact/effort)
5. AJOUTS RECOMMANDÉS (logging, retry, fallback)

Pour chaque amélioration : effort estimé (S/M/L) + impact (faible/moyen/élevé).
```

**Tweak this :** colle le JSON du workflow directement pour un audit ultra précis.

---

## 23. Plan de migration d'un outil A → outil B
**Cas d'usage :** structurer une migration sans rien casser.

```
Je migre de {outil_A} vers {outil_B}.

Données concernées : {types de données}
Volume : {volume approximatif}
Contraintes : {ex: zero downtime, conserver historique}

Construis le plan de migration :
1. PRÉ-MIGRATION (audit data, backup, mapping des champs)
2. PHASE TEST (sur sous-ensemble, critères de validation)
3. MIGRATION FULL (étapes ordonnées, points de rollback)
4. POST-MIGRATION (vérifications, communication équipe/clients)
5. PLAN B (si tout casse, on revient comment ?)

Pour chaque étape : qui, durée estimée, livrable, risque principal.
Format : timeline jour par jour.
```

**Tweak this :** précise le nombre d'utilisateurs impactés pour calibrer la com.

---

## 24. Email récap réunion (avec décisions et actions)
**Cas d'usage :** clôturer une réunion avec un récap actionnable.

```
Voici les notes brutes de ma réunion :

{notes brutes}

Transforme-les en email récap structuré comme suit :
1. CONTEXTE (1 ligne — date, participants, sujet)
2. DÉCISIONS PRISES (liste à puces, claire et nette)
3. ACTIONS À MENER (tableau : action / responsable / deadline)
4. POINTS OUVERTS (à trancher plus tard)
5. PROCHAINE RÉUNION (date proposée + agenda court)

Ton : factuel, professionnel, zéro fioriture.
Si une info est ambiguë dans les notes, marque-la [À CONFIRMER] plutôt que d'inventer.
```

**Tweak this :** demande la version "interne" vs "client-facing" — formalisme différent.

---

## 25. Plan de tâches pour la semaine (méthode 80/20)
**Cas d'usage :** prioriser quand tout semble urgent.

```
Voici toutes mes tâches pour la semaine :

{liste de tâches en vrac}

Mes 3 objectifs prioritaires de la semaine :
1. {objectif 1}
2. {objectif 2}
3. {objectif 3}

Applique le 80/20 :
1. Identifie les 20% de tâches qui produisent 80% de l'impact sur mes objectifs
2. Classe les autres en : déléguer / reporter / supprimer
3. Propose un planning avec time-blocking sur 5 jours, max 6 blocs/jour
4. Types de blocs : 🎯 Deep work (90 min) · 📋 Admin (30-45 min) · ☕ Break (15 min) · 🍽️ Repas
5. Identifie LE chantier qui, s'il est fait cette semaine, fait avancer le mois entier

Pas de procrastination déguisée. Si une tâche n'est pas alignée avec un objectif, dis-le.
```

**Tweak this :** ajoute tes contraintes (rdv fixes, énergie matin/soir).

---

## 26. Onboarding nouveau client (checklist)
**Cas d'usage :** standardiser le démarrage d'un projet client.

```
Crée une checklist d'onboarding pour un nouveau client.

Type de projet : {type}
Durée : {durée}
Livrables principaux : {livrables}

Structure :
1. AVANT KICK-OFF (signature, paiement acompte, accès)
2. KICK-OFF MEETING (agenda type, durée, infos à collecter)
3. SEMAINE 1 (setup technique, intros, premiers livrables)
4. RITUELS (réunions récurrentes, reporting, canal de com)
5. CRITÈRES DE FIN (livraison finale, transfert de connaissance, recueil témoignage)

Pour chaque item : responsable, deadline relative, livrable concret.
Génère aussi 5 questions clés à poser au kick-off pour éviter les surprises.
```

**Tweak this :** précise le canal préféré (Slack, Notion, email) pour adapter les rituels.

---

## 27. Trier une boîte mail avec règles claires
**Cas d'usage :** designer un système de tri d'inbox.

```
J'ai une boîte mail saturée. Aide-moi à designer un système de tri.

Types d'emails que je reçois : {liste types}
Volume quotidien estimé : {volume}
Mes priorités : {priorités}

Propose :
1. UN SYSTÈME DE LABELS / DOSSIERS (max 6, jamais plus)
2. RÈGLES DE TRI AUTOMATIQUE (à recréer dans Gmail/Outlook)
3. CRITÈRES DE TRI MANUEL (matin/soir, en 5 min)
4. RÈGLE DES 2 MIN (quoi traiter immédiatement vs reporter)
5. ROUTINE INBOX ZERO (fréquence, durée max)

Inclure : les 3 templates de réponses rapides à copier-coller pour les emails récurrents.
```

**Tweak this :** ajoute "j'ai un assistant" si tu veux le mode délégation.

---

## 28. Rédiger un README technique
**Cas d'usage :** documenter un projet code/automatisation pour quelqu'un d'autre.

```
Rédige un README pour ce projet :

Nom : {nom}
Objectif : {objectif en 1 phrase}
Stack : {techno utilisée}
Audience du README : {dev junior, client, partenaire}

Structure :
1. ## What it does — 2 lignes max
2. ## Why it exists — le problème résolu
3. ## How it works — diagramme mental ou ASCII si pertinent
4. ## Setup — étapes précises pour faire tourner le projet en local
5. ## Configuration — variables d'env, secrets, .env example
6. ## Usage — exemples concrets de commandes
7. ## Troubleshooting — les 3 erreurs les plus probables et comment les fixer
8. ## Contact — qui demander si bloqué

Style : direct, simple, pas de jargon non expliqué.
```

**Tweak this :** demande la version "non-tech" pour un client qui doit juste utiliser l'output.

---

## 29. Préparer un kick-off projet
**Cas d'usage :** structurer une réunion de lancement projet.

```
Je dois animer un kick-off pour ce projet :

Projet : {nom + objectif}
Durée projet : {durée}
Équipe : {participants}
Budget : {si pertinent}

Construis l'agenda du kick-off (60-90 min) :
1. CONTEXTE & ENJEUX (10 min)
2. OBJECTIFS & SUCCESS METRICS (15 min)
3. SCOPE & LIVRABLES (15 min)
4. RÔLES & RESPONSABILITÉS (RACI léger, 10 min)
5. TIMELINE & MILESTONES (15 min)
6. RISQUES & DÉPENDANCES (10 min)
7. RITUELS & COM (5 min)

Pour chaque section : 3 questions à poser à voix haute, format suggéré (whiteboard, doc partagé), output attendu.
Termine par : 5 questions à envoyer aux participants AVANT le meeting pour qu'ils arrivent préparés.
```

**Tweak this :** précise si le projet est interne ou client — la dynamique change.

---

## 30. Choisir entre 2 outils (cadre de décision)
**Cas d'usage :** trancher une décision tech sans procrastiner.

```
Je dois choisir entre {outil_A} et {outil_B} pour résoudre {problème}.

Mes contraintes :
- Budget : {budget}
- Skill technique disponible : {niveau}
- Critères non négociables : {liste}
- Volume / scale : {volume}

Construis une matrice de décision :
1. CRITÈRES (5-7 critères pondérés selon ce que j'ai dit)
2. TABLEAU COMPARATIF (note 1-5 par critère, justification 1 ligne)
3. SCORE FINAL pondéré
4. RECOMMANDATION CLAIRE (pas "ça dépend") + 1 risque à surveiller
5. PLAN B si la reco ne marche pas dans 3 mois

Si une option est meilleure pour 80% mais perd sur 1 critère bloquant, dis-le explicitement.
```

**Tweak this :** ajoute "horizon temporel" — court terme vs long terme change le poids des critères.

---

# CATÉGORIE 4 — RECHERCHE (10 prompts)

## 31. Synthèse rapide d'un long article
**Cas d'usage :** transformer un article 3000 mots en notes utiles.

```
Voici un article long :

{texte de l'article}

Synthétise-le pour quelqu'un qui n'a pas le temps de le lire.

Format :
1. THÈSE PRINCIPALE (1 phrase claire)
2. 5 IDÉES CLÉS (1 ligne chacune, pas de bla bla)
3. CHIFFRES / FAITS À RETENIR (3-5 max, sourcés si possible dans le texte)
4. CITATION FORTE (1 phrase à reprendre verbatim)
5. CE QU'IL MANQUE / ANGLES NON COUVERTS (regard critique, 2-3 points)
6. SI TU DEVAIS EN TIRER UN POST DE CONTENU : angle proposé en 1 phrase

Ton : factuel, pas servile. N'invente jamais un chiffre absent du texte.
```

**Tweak this :** demande "en français parlé" pour un usage immédiat sur les réseaux.

---

## 32. Veille concurrentielle d'un compétiteur
**Cas d'usage :** analyser un concurrent pour s'en inspirer ou se différencier.

```
Analyse ce concurrent et donne-moi un brief stratégique.

Concurrent : {nom + URL}
Mon business : {nom + activité}
Ce que tu sais déjà sur leur offre : {infos}

Analyse :
1. POSITIONNEMENT (en 2 phrases — qui ils servent et comment ils se présentent)
2. OFFRE (produits, prix, modèle business)
3. POINTS FORTS (3 max)
4. POINTS FAIBLES / GAPS visibles (3 max)
5. ANGLES DE DIFFÉRENCIATION pour MOI (3 idées concrètes)
6. CE QU'ILS FONT MIEUX QUE MOI (à voler / s'inspirer)
7. CE QUE JE FAIS MIEUX QU'EUX (à mettre plus en avant)

Sois honnête, pas servile envers eux ni envers moi.
```

**Tweak this :** ajoute "regarde leurs 5 derniers posts sur {plateforme}" pour analyse contenu.

---

## 33. Analyse persona client
**Cas d'usage :** documenter un profil cible pour aligner ton et offre.

```
Construis un persona détaillé pour ma cible :

Description rapide : {description en 2-3 lignes}
Mon offre actuelle : {offre}

Le persona doit contenir :
1. PRÉNOM + ÂGE + CONTEXTE pro (1 paragraphe vivant, pas robotique)
2. UNE JOURNÉE TYPE (matin/journée/soir, 5 lignes)
3. PAINS PROFONDS (3 — pas "manque de temps" générique)
4. DÉSIRS PROFONDS (3 — au-delà du business)
5. OBJECTIONS PROBABLES face à mon offre
6. OÙ IL/ELLE TRAÎNE (réseaux, communautés, médias)
7. CE QU'IL/ELLE A DÉJÀ ESSAYÉ (et pourquoi ça n'a pas marché)
8. MESSAGE CLÉ qui résonne avec ce persona

Évite les clichés. Si une info manque, marque-la [À VALIDER PAR INTERVIEW CLIENT].
```

**Tweak this :** demande 3 personas si tu hésites entre plusieurs cibles.

---

## 34. Recherche marché : 3 angles non couverts
**Cas d'usage :** trouver une opportunité de positionnement.

```
Je veux entrer sur le marché de {marché / niche}.

Ce que je sais :
- Concurrents principaux : {liste}
- Audience type : {description}
- Mes atouts : {atouts}

Identifie :
1. TROIS ANGLES NON COUVERTS sur ce marché (gaps évidents)
2. POUR CHAQUE ANGLE :
   - Pourquoi personne ne l'occupe (vraie raison ou négligence ?)
   - Combien d'audience il pourrait toucher
   - Difficulté pour MOI de l'occuper (1-10)
3. RECOMMANDATION : quel angle attaquer en premier + premier contenu à publier dans 24h

Sois critique. Si un "angle non couvert" est en fait un cimetière (déjà essayé et flop), dis-le.
```

**Tweak this :** ajoute "horizon : démarrer dans 30 jours" pour forcer la concrétisation.

---

## 35. Décrypter un sujet technique pour un débutant
**Cas d'usage :** comprendre vite un sujet complexe avant un appel.

```
Explique-moi {sujet technique} comme si j'avais 14 ans, mais que je devais ensuite l'expliquer à un client.

Format :
1. ANALOGIE concrète (vie quotidienne)
2. C'EST QUOI EN 1 PHRASE
3. POURQUOI ÇA EXISTE (le problème que ça résout)
4. COMMENT ÇA MARCHE en 3 étapes simples
5. EXEMPLE CONCRET
6. CE QU'UN CLIENT BUSINESS DOIT EN RETENIR (pas la tech, le ROI/usage)
7. PIÈGES / MALENTENDUS classiques
8. SI JE VEUX EN APPRENDRE PLUS : 3 ressources à creuser

Pas de jargon non expliqué. Si un terme apparaît, définition immédiate entre parenthèses.
```

**Tweak this :** précise "pour un client {secteur}" pour ajuster les exemples.

---

## 36. Comparer 5 outils sur 5 critères
**Cas d'usage :** mini-revue d'outils sans perdre 3 heures.

```
Compare ces 5 outils selon ces 5 critères :

Outils : {liste 5 outils}
Critères : {liste 5 critères — ex: prix, courbe d'apprentissage, intégrations, scaling, support FR}
Mon contexte : {besoin précis}

Sortie :
1. TABLEAU COMPARATIF (5 colonnes outils × 5 lignes critères, note 1-5)
2. POUR CHAQUE OUTIL : 1 force + 1 faiblesse en 1 ligne chacune
3. RECOMMANDATION pour MON contexte (pas générale)
4. RUNNER-UP (si la reco ne convient pas, lequel choisir ?)
5. PIÈGE À ÉVITER (l'outil qui semble bien mais qui te bloquera dans 6 mois)

N'invente pas. Si tu n'es pas sûr d'une feature, marque [À VÉRIFIER].
```

**Tweak this :** demande version "free vs paid" si tu veux trancher sur le coût.

---

## 37. Brief de recherche utilisateur (interview)
**Cas d'usage :** préparer 5 interviews clients en 1h.

```
Je veux interviewer 5 personnes de ma cible pour valider une idée de produit.

Idée : {idée en 1 paragraphe}
Cible : {persona}

Construis :
1. OBJECTIF DES INTERVIEWS (en 1 phrase — ce que je dois apprendre)
2. 10 QUESTIONS dans cet ordre :
   - 2 questions de contexte (pour les mettre à l'aise)
   - 3 questions sur leur problème ACTUEL (jamais sur ma solution)
   - 2 questions sur leur "job-to-be-done"
   - 2 questions sur leurs solutions actuelles (et ce qui cloche)
   - 1 question de clôture qui ouvre une suite
3. CE QU'IL FAUT ÉCOUTER (pas seulement entendre)
4. RED FLAGS qui invalident l'idée
5. GREEN FLAGS qui confirment l'opportunité

JAMAIS de question fermée du type "tu paierais X € pour ça ?" — ça ne marche pas.
```

**Tweak this :** précise "format : 30 min Zoom" pour calibrer la profondeur.

---

## 38. Synthèse de plusieurs sources contradictoires
**Cas d'usage :** y voir clair quand tout le monde dit le contraire.

```
Voici plusieurs sources sur le même sujet :

Sujet : {sujet}
Source 1 : {résumé / extrait}
Source 2 : {résumé / extrait}
Source 3 : {résumé / extrait}

Synthétise :
1. POINTS DE CONSENSUS (où elles sont d'accord)
2. POINTS DE DIVERGENCE (où elles s'opposent — sans prendre parti)
3. POURQUOI elles divergent (méthodologie ? biais ? data différente ?)
4. CE QUE TU EN CONCLURAIS si tu devais agir aujourd'hui
5. CE QU'IL MANQUE pour trancher définitivement (data à chercher, expert à interroger)

Sois nuancé. N'aplatis pas les divergences. Évite de dire "la vérité est entre les deux" si ce n'est pas vrai.
```

**Tweak this :** ajoute la date des sources — important pour les sujets qui évoluent vite.

---

## 39. Brief avant d'écrire un long article
**Cas d'usage :** structurer un article 1500-2500 mots avant d'écrire.

```
Je veux écrire un long article sur ce sujet :

Sujet : {sujet}
Audience : {audience}
Promesse de l'article : {promesse}
Mots-clés SEO si pertinent : {mots-clés}

Construis le brief :
1. ANGLE UNIQUE (différenciant des 10 premiers résultats Google)
2. OUTLINE détaillé (H1 + 5-7 H2 + 2-3 H3 sous chaque H2)
3. POUR CHAQUE H2 : key takeaway en 1 ligne + exemple/data à inclure
4. INTRO suggérée (3 phrases — hook, contexte, promesse)
5. CONCLUSION suggérée (3 phrases — résumé, ouverture, CTA doux)
6. 3 IDÉES VISUELLES (schéma, capture, infographie)
7. 5 LIENS INTERNES POSSIBLES (vers tes autres contenus)

Pas de "Dans cet article nous allons voir...". Démarre par une affirmation.
```

**Tweak this :** précise SEO vs LinkedIn vs newsletter — la structure idéale change.

---

## 40. Décrypter un contrat / mentions légales
**Cas d'usage :** comprendre un texte juridique en 5 minutes.

```
Voici un texte juridique :

{texte}

Analyse-le pour quelqu'un qui n'est pas juriste.

Format :
1. DE QUOI IL S'AGIT en 1 phrase
2. PARTIES IMPLIQUÉES
3. PRINCIPAUX ENGAGEMENTS de chaque partie
4. CLAUSES À SURVEILLER (résiliation, propriété intellectuelle, paiement, exclusivité)
5. RED FLAGS — clauses inhabituelles ou risquées
6. POINTS À NÉGOCIER si encore possible
7. EN UNE PHRASE : signe-le ou pas ? (en précisant les conditions)

Disclaimer : précise toujours en fin de réponse "Ceci n'est pas un avis juridique professionnel. Pour un engagement important, consulte un avocat."
```

**Tweak this :** précise le contexte (client B2B, freelance, partenariat) — le risque change.

---

# CATÉGORIE 5 — SUPPORT CLIENT (10 prompts)

## 41. Réponse à un client mécontent
**Cas d'usage :** désamorcer une situation tendue par écrit.

```
Un client est mécontent. Voici son message :

{message du client}

Contexte :
- Produit/service concerné : {produit}
- Ce qui s'est réellement passé : {faits}
- Notre part de responsabilité : {part}

Écris une réponse qui :
1. Reconnaît son ressenti (sans dire "je comprends votre frustration" — formule autrement)
2. Énonce les FAITS (sans excuses ni accusations)
3. Propose UNE solution concrète + une option B
4. Donne un délai précis pour la résolution
5. Termine par une ouverture (proposer d'en discuter par téléphone si nécessaire)

Ton : pro, calme, ferme. Pas servile, pas défensif. Max 150 mots.
```

**Tweak this :** précise si on est en faute ou non — ça change la tonalité acceptable.

---

## 42. FAQ d'un produit (à partir de questions clients)
**Cas d'usage :** transformer des questions répétées en FAQ propre.

```
Voici les 10 questions les plus posées par mes clients :

{liste questions brutes}

Pour chaque question :
1. Reformule-la comme un client la dirait NATURELLEMENT (jamais "Comment puis-je...")
2. Réponse claire en 2-3 phrases max
3. Si pertinent : lien vers ressource OU contact pour aller plus loin
4. Tag : {basique / avancé / facturation / technique / autre}

Format final : tableau Q/R + tag + lien.
Style : direct, "tu", confiant, jamais "n'hésitez pas à nous contacter".
Ordonne les FAQ de la plus à la moins fréquente.
```

**Tweak this :** demande "version 5 FAQ" si tu veux les 5 plus stratégiques pour ta page de vente.

---

## 43. Email d'onboarding produit (Day 0)
**Cas d'usage :** premier email envoyé après un achat.

```
Écris l'email d'onboarding envoyé immédiatement après l'achat de ce produit.

Produit : {nom + ce qu'il fait en 1 ligne}
Type de client : {persona}
Lien d'accès : {URL}

Structure :
1. Subject (max 5 mots, peut contenir un emoji si naturel)
2. Hello + reconnaissance courte
3. ACCÈS DIRECT au produit (lien clair)
4. 3 ÉTAPES POUR DÉMARRER (1 ligne chacune)
5. PAR OÙ COMMENCER : la chose à faire EN PREMIER (1 conseil concret)
6. Comment me joindre si bloqué
7. Signature courte

Max 150 mots. Ton : confiant, "tu", jamais "Merci infiniment pour votre confiance".
```

**Tweak this :** ajoute "PS : prochain produit recommandé" si upsell pertinent.

---

## 44. Email de relance "tu n'as pas encore utilisé X"
**Cas d'usage :** réactiver un client qui a acheté mais pas utilisé.

```
Écris un email de réactivation pour ce contexte :

Produit acheté : {produit}
Date de l'achat : {date}
Activité depuis : {ex: ouvert email mais pas téléchargé / téléchargé mais pas utilisé}

Email :
1. Subject (curiosité, pas culpabilisation)
2. Reconnaissance que la vie est chargée (1 phrase, pas servile)
3. Rappel du bénéfice principal du produit (en 1 ligne, pas tout réexpliquer)
4. UN seul next step ULTRA SIMPLE (pas "voici 5 étapes")
5. Question ouverte qui invite à répondre
6. Signature

Max 100 mots. Pas de "Tu as oublié de...". On garde de la dignité.
```

**Tweak this :** ajoute "+ proposer un appel express 15 min" si client premium.

---

## 45. Réponse aux refunds / annulations
**Cas d'usage :** gérer un remboursement avec classe.

```
Un client demande un remboursement. Voici son message :

{message}

Contexte :
- Produit : {produit + prix}
- Politique de remboursement : {politique}
- Ancienneté du client : {ancienneté}
- Raison invoquée : {raison}

Écris une réponse qui :
1. Confirme la prise en compte sans drame
2. Si le remboursement est possible et justifié : confirme le délai + comment ça se passe
3. Si tu veux comprendre pourquoi (utile pour amélioration) : pose UNE seule question optionnelle
4. Garde la porte ouverte (sans pousser à racheter)
5. Termine par une note humaine

JAMAIS : "êtes-vous sûr ?", "avez-vous bien essayé ?", "nous sommes tristes...". Max 100 mots.
```

**Tweak this :** précise si tu veux faire signer un témoignage ou pas.

---

## 46. Macro de réponse pour question récurrente
**Cas d'usage :** créer un template réutilisable pour la 50e fois qu'on te pose la même question.

```
Question récurrente : {question}
Mon contexte : {produit/service concerné}

Crée une "macro" de réponse :
1. VERSION COURTE (3-4 phrases — pour Slack/DM)
2. VERSION MOYENNE (1 paragraphe — pour email)
3. VERSION LONGUE (avec lien vers doc — pour ticket support)

Chaque version doit :
- Répondre directement à la question (pas de préambule)
- Anticiper la sous-question logique suivante
- Inclure un lien ressource si utile
- Garder le ton "humain" même si c'est un template

Pas de "Bonjour, merci pour votre message". On entre direct dans le sujet.
```

**Tweak this :** crée 10 macros d'un coup pour ton top 10 questions = boîte mail allégée.

---

## 47. Sondage post-livraison (NPS amélioré)
**Cas d'usage :** récolter du feedback utile, pas juste une note.

```
Je veux récolter du feedback après livraison de ce produit/service :

Produit : {produit}
Cible : {client type}

Construis un sondage de 5 questions max :
1. Une question quanti type NPS reformulée
2. Une question qualitative ouverte sur LE moment où ils ont ressenti la valeur
3. Une question sur ce qui a manqué / ce qu'ils auraient aimé en plus
4. Une question sur le contexte (à qui ils recommanderaient ce produit ?)
5. Une question de clôture pour récolter un témoignage si NPS élevé

Ton : conversationnel, pas corporate. Court (max 3 min à remplir).
Bonus : pour chaque question, indique POURQUOI tu la poses (objectif business).
```

**Tweak this :** ajoute "format Tally" pour un export prêt à brancher.

---

## 48. Argumentaire pour upsell soft
**Cas d'usage :** proposer le produit suivant sans casser la relation.

```
Mon client a acheté {produit_actuel}.
Le prochain palier logique est {produit_suivant} (à {prix} EUR).

Écris une séquence de 2 emails étalée sur 14 jours :

Email 1 (J+10) : centré sur la VALEUR concrète qu'ils ont déjà eue avec le produit actuel + question d'engagement.
Email 2 (J+14) : présente le produit suivant comme la suite NATURELLE du parcours, pas comme un nouveau pitch. Inclure :
- Ce que ça résout au prochain niveau
- Ce qui change concrètement vs aujourd'hui
- Lien direct, prix transparent
- Une seule offre, pas de bundles

Ton : confiant, "tu", JAMAIS "exclusivement pour vous". Max 120 mots par email.
```

**Tweak this :** précise si tu veux insérer un témoignage client entre Email 1 et Email 2.

---

## 49. Documentation d'un bug pour le tech
**Cas d'usage :** aider un client non-tech à reporter un bug clairement.

```
Un client signale un problème mais sa description est confuse :

Message brut du client : {message}

Reformule-la en ticket de bug clair :
1. RÉSUMÉ EN 1 LIGNE (pour le titre du ticket)
2. STEPS TO REPRODUCE (étape par étape, ce que le client a fait)
3. RÉSULTAT ACTUEL (ce qu'il a vu)
4. RÉSULTAT ATTENDU (ce qu'il aurait dû voir)
5. ENVIRONMENT (device, navigateur, version — si présents dans le message ou à demander)
6. SÉVÉRITÉ proposée : critique / élevée / moyenne / basse
7. INFORMATIONS MANQUANTES (à demander au client en 1 message court)

Inclure aussi le message à RENVOYER au client pour qu'il complète les infos manquantes (poli, court, max 50 mots).
```

**Tweak this :** précise la stack utilisée pour suggérer les bonnes questions techniques.

---

## 50. Email de fin de mission (clôture client)
**Cas d'usage :** clôturer un projet client proprement.

```
Le projet avec ce client se termine.

Projet : {nom + livrables}
Durée : {durée}
Résultat obtenu : {résultat chiffré si possible}

Écris l'email de clôture :
1. RÉSUMÉ DE CE QUI A ÉTÉ FAIT (3 bullets)
2. TRANSFERT DE CONNAISSANCE (accès, doc, contacts utiles)
3. CE QUI A FONCTIONNÉ + UN apprentissage honnête de notre côté
4. PROCHAINES ÉTAPES POSSIBLES (sans pitcher) — si évolution future, comment me recontacter
5. DEMANDE DE TÉMOIGNAGE (en 1 phrase, optionnel pour eux, format leur convenance)
6. Note humaine de fin

Ton : pro, posé, sincère. Max 200 mots. Pas de "Ce fut un plaisir de travailler avec vous" générique.
```

**Tweak this :** ajoute "+ proposer une rétro 30 min" si la relation est forte.

---

## C'est quoi la suite ?

Tu veux aller plus loin avec l'IA ?

- 🤖 **Construire ton premier agent IA de A à Z (Claude + n8n)** ?
  → [Build Your First AI Agent (29€)](https://taiyka.com/products/ai-agent-playbook)

- 📊 **Une bibliothèque évolutive de prompts + workflows + templates dans une vraie communauté** ?
  → [La communauté Skool](https://taiyka.com/skool)

---

**Manu** · [@manu_ai.to](https://instagram.com/manu_ai.to) · [taiyka.com](https://taiyka.com)
