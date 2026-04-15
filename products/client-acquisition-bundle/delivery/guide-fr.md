# Client Acquisition Bundle — Guide de setup

> Tout ce qu'il te faut pour signer et facturer un client comme un pro, sans copier-coller des templates pourris trouvés sur Google. Templates bilingues + 3 scripts Python qui te génèrent les PDFs en 2 secondes.
> — Manu, fondateur de [Taiyka](https://instagram.com/manu_ai.to)

---

## Ce que tu tiens entre les mains

```
client-acquisition-bundle/
├── templates/
│   ├── contract-fr.md        ← contrat (forfait + retainer en un seul fichier)
│   ├── contract-en.md
│   ├── proposal-fr.md
│   ├── proposal-en.md
│   ├── invoice-fr.md
│   └── invoice-en.md
├── builders/
│   ├── create_proposal.py    ← génère le PDF de proposition
│   ├── create_contract.py    ← génère le PDF de contrat
│   ├── create_invoice.py     ← génère le PDF de facture
│   ├── samples/              ← exemples JSON prêts à copier
│   ├── .env.example
│   └── README.md
├── guide-fr.md               ← tu es ici
├── guide-en.md
└── cover.svg
```

Deux façons d'utiliser le bundle :

- **Mode rapide** : tu copies les `.md` dans Google Docs, tu remplis les `[CHAMPS]`, tu exportes en PDF. 5 minutes par document.
- **Mode auto** : tu remplis un petit JSON, tu lances le script Python, tu reçois le PDF brandé (et optionnellement uploadé sur ton Drive). 30 secondes par document après le setup initial.

Choisis selon tes goûts. La majorité des freelances utiliseront le mode rapide. Si tu signes plus de 2-3 contrats par mois, le mode auto te fait gagner des heures.

---

## Mode rapide — utiliser les templates Markdown

1. Ouvre le template qui te concerne (`contract-fr.md`, `proposal-en.md`, etc.)
2. Copie tout dans un nouveau Google Doc (ou Notion, ou Word — peu importe)
3. Remplace tous les `[CHAMPS_ENTRE_CROCHETS]` par les vraies valeurs
4. Pour le contrat : supprime la variante que tu n'utilises pas (FORFAIT ou ABONNEMENT)
5. Exporte en PDF (Fichier → Télécharger → PDF)
6. Envoie à ton client

C'est tout. Pas de Python, pas de setup. Si tu démarres, fais ça.

---

## Mode auto — utiliser les builders Python

### Prérequis

- **Python 3.10+** installé (`python --version` pour vérifier)
- **pip** installé
- 5 minutes pour le setup initial

### Setup en 4 étapes

**1. Ouvre un terminal dans le dossier `builders/`** :

```bash
cd builders
```

**2. Installe les dépendances** :

```bash
pip install fpdf2 python-dotenv google-api-python-client google-auth-oauthlib
```

> Si tu ne veux pas l'upload Google Drive, tu peux skipper les paquets `google-*`. Le script tournera quand même, il fera juste un PDF local.

**3. Copie `.env.example` en `.env`** :

```bash
cp .env.example .env
```

Ouvre `.env` et adapte les chemins de fonts si tu n'es pas sur Windows. Sur Mac/Linux, regarde les exemples commentés.

**4. (Optionnel) Active l'upload Google Drive** :

- Va sur [console.cloud.google.com](https://console.cloud.google.com)
- Crée un projet (n'importe quel nom)
- Active la **Google Drive API** (menu APIs & Services → Library)
- Crée des **identifiants OAuth 2.0** type **Desktop app** (menu Credentials → + Create credentials)
- Télécharge le JSON, renomme-le `credentials.json` et mets-le dans le dossier `builders/`
- La première fois que tu lances un script, ton navigateur s'ouvre pour autoriser. Après c'est silencieux à vie.

> Si tu ne veux pas Google Drive : ne fais simplement rien. Le script détecte l'absence de `credentials.json` et skip l'upload sans planter.

### Utilisation

Chaque script prend un fichier JSON en argument :

```bash
python create_proposal.py samples/proposal-sample.json
python create_contract.py samples/contract-sample.json
python create_invoice.py  samples/invoice-sample.json
```

Le PDF arrive dans `./output/`. Si Drive est configuré, le lien partageable s'affiche dans le terminal.

### Workflow recommandé

1. Tu as un nouveau client → tu dupliques `samples/proposal-sample.json` en `mon-client.json`
2. Tu remplis les champs (nom client, sections, prix...)
3. Tu lances `python create_proposal.py mon-client.json`
4. Tu envoies le PDF au client
5. Le client signe → tu fais pareil pour le contrat
6. Tu factures → pareil pour l'invoice

Une fois habitué, c'est 5 minutes par document. Tu remplis le JSON pendant que tu réfléchis au pricing, le script s'occupe de la mise en page.

---

## Personnaliser les templates

### Couleurs

Chaque script Python a une constante `NAVY = (26, 46, 74)` en haut. C'est la couleur principale. Change-la pour matcher ton brand. Pareil pour `LIGHT_BG`, `MID_TEXT`, etc.

### Logo

Les scripts utilisent `fpdf2`. Pour ajouter un logo, tu peux modifier la méthode `_draw_cover_header` et y ajouter `self.image("path/to/logo.png", x=15, y=10, w=30)`. Si tu veux que je le fasse pour toi, vois la communauté Skool.

### Devise

Le builder `create_invoice.py` affiche `EUR` par défaut. Si tu factures en USD/GBP/CHF, fais un find-and-replace dans le fichier (`"EUR"` → `"USD"`).

### Sections du contrat / proposition

Les scripts affichent **toutes** les sections présentes dans ton JSON. Tu peux ajouter, retirer, réordonner librement. Le template Markdown contient le squelette complet — copie-le quand tu commences une section nouvelle.

---

## Exemple complet — mode auto, du début à la fin

Imagine que tu signes Acme Corp pour un projet de chatbot à 3000€. Voici ta journée :

**Étape 1 — proposition**

```bash
cp samples/proposal-sample.json acme-proposal.json
# Tu édites acme-proposal.json : nom client, défi, solution, prix
python create_proposal.py acme-proposal.json
# → output/Proposal_PRO-001.pdf prêt à envoyer
```

**Étape 2 — contrat (le client a dit oui)**

```bash
cp samples/contract-sample.json acme-contract.json
# Tu édites : tu réutilises les sections de la proposition, tu ajoutes les clauses
python create_contract.py acme-contract.json
# → output/Contract_CTR-001.pdf prêt à signer
```

**Étape 3 — facture d'acompte (50%)**

```bash
cp samples/invoice-sample.json acme-deposit.json
# Tu édites : 1500 EUR, échéance immédiate
python create_invoice.py acme-deposit.json
# → output/Invoice_INV-001.pdf prêt à envoyer
```

**Étape 4 — facture solde (à la livraison)**

```bash
cp samples/invoice-sample.json acme-balance.json
# Pareil mais INV-002, montant 1500
python create_invoice.py acme-balance.json
```

Total : 4 documents pros, ~10 minutes de travail. Sans bundle, prévois 1-2 heures de copier-coller dans Google Docs.

---

## Troubleshooting

**`FileNotFoundError: arial.ttf`**
→ Tu n'es pas sur Windows. Adapte les chemins `FONT_REGULAR` / `FONT_BOLD` / `FONT_ITALIC` dans `.env`. Les exemples Mac/Linux sont commentés dans `.env.example`.

**`ModuleNotFoundError: No module named 'fpdf'`**
→ Tu as installé `fpdf` au lieu de `fpdf2`. Désinstalle (`pip uninstall fpdf`) puis installe le bon (`pip install fpdf2`).

**Le PDF s'affiche mais les accents sont remplacés par des carrés**
→ La font que tu as choisie ne supporte pas l'Unicode complet. Utilise Arial, Helvetica ou DejaVu Sans.

**L'upload Google Drive ne se fait jamais**
→ Vérifie que tu as bien créé un OAuth client de type **Desktop app** (pas Web). Vérifie aussi que le fichier s'appelle exactement `credentials.json` et qu'il est dans le dossier `builders/`. Supprime `token.pickle` pour relancer le flow d'auth.

**Le script tourne mais aucun PDF n'apparaît**
→ Vérifie le dossier `output/` à l'intérieur de `builders/`. Le script ne crée jamais le PDF ailleurs.

**Erreur "JSON decode error"**
→ Ton fichier JSON n'est pas valide. Colle-le dans [jsonlint.com](https://jsonlint.com) pour trouver l'erreur (souvent une virgule en trop, ou des guillemets droits manquants).

---

## Mentions légales — à adapter à ta situation

Les templates incluent des mentions légales **basées sur le droit français pour un micro-entrepreneur**. Si tu es :

- **Salarié-porté ou indépendant français hors micro** : adapte la mention TVA et le statut à l'article 1.
- **Auto-entrepreneur belge / suisse / canadien** : remplace les références au CGI par tes propres références fiscales.
- **Société (SAS, SARL, EURL...)** : ajoute les mentions RCS, capital social, etc. à l'article 1.
- **Hors UE** : retire la mention RGPD (article 14) ou adapte à la loi locale (CCPA, LGPD...).

> ⚠️ Ce bundle ne remplace pas un avocat. Si tu signes un gros contrat (> 20k€), fais relire par un pro. Pour des projets freelance classiques, ces templates sont solides et utilisés tous les jours par des milliers d'indépendants.

---

## Pour aller plus loin

Tu veux passer au niveau suivant — automatiser **toute** ta gestion client (CRM, signature électronique, relances de facture, suivi cash flow) ?

→ [Rejoins la communauté Skool](https://taiyka.com/skool) — accès à mes workflows n8n complets pour la gestion client, les Claude skills `/contract-builder`, `/proposal-builder` et `/invoice-builder` (mode conversationnel guidé), et des Q&A directs avec moi chaque semaine.

---

**Manu** · [@manu_ai.to](https://instagram.com/manu_ai.to) · [taiyka.com](https://taiyka.com)

Tu bloques quelque part ? Réponds à l'email de livraison, je lis tout.
