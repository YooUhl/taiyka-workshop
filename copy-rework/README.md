# Copy Rework — mode d'emploi

Ce dossier contient **tout le texte visible** du site (web/), extrait route par route, pour que tu puisses retravailler la copywriting **sans toucher au code**.

## Comment ça marche

1. **Tu édites uniquement les fichiers `.md` de ce dossier.** Tu ne touches jamais au dossier `web/`.
2. Chaque fichier correspond à une page (route) du site. À l'intérieur, chaque bloc de texte visible (titre, bouton, label de formulaire, message d'erreur, titre SEO, email…) a sa propre section.
3. Pour chaque bloc tu vois :
   - **FR :** le texte français actuel
   - **EN :** le texte anglais actuel
   - **→ Nouvelle version FR :** (ligne vide à remplir)
   - **→ Nouvelle version EN :** (ligne vide à remplir)
4. **Tu remplis la ligne « Nouvelle version » seulement si tu veux changer le texte.**
   - Ligne laissée **vide** = on garde le texte actuel, aucune modification.
   - Ligne remplie = Claude remplacera l'ancien texte par le tien dans le code.
5. Quand tu as fini, tu dis à Claude « applique les nouvelles versions » et il recâble tout dans le code (`web/`).

## Règles

- **Ne renomme pas les sections** (`## nom de surface`) — Claude s'en sert pour retrouver où chaque texte va dans le code.
- **Garde le format FR/EN.** Si une surface n'a qu'une seule langue dans le code, tu verras une seule ligne — c'est normal.
- **Ne supprime pas de sections** même si tu ne les changes pas. Laisse simplement les lignes « Nouvelle version » vides.
- Les chaînes purement techniques (URLs, noms de classes, schema.org) ne sont pas ici — inutile de les toucher.

## Fichiers

| Fichier | Route(s) couverte(s) |
|---|---|
| `home.md` | `/` (page d'accueil / hub de liens) |
| `book.md` | `/book` (réservation d'appel) |
| `brief.md` | `/brief`, `/brief/confirmed`, `/brief/unsubscribe` + emails Le Brief |
| `shop.md` | `/shop`, `/shop/workflows/[slug]` (boutique + fiches workflow) |
| `portfolio.md` | `/portfolio` (portfolio public) |
| `resources.md` | `/resources` (ressources gratuites) |
| `skool.md` | `/skool` (communauté Skool) |
| `qcm.md` | `/qcm`, `/qcm/quiz`, `/qcm/resultat/[profil]` (quiz de profilage) |
| `free-n8n-pack.md` | `/free-n8n-pack` (lead magnet n8n) |
| `misc.md` | `/privacy`, layout global, métadonnées diverses, autres surfaces |

> Note : les pages internes/privées (outils `/tools/*`, espace de travail `/manu-uhila-work-87k9`) ne sont pas incluses — ce sont des outils perso non destinés au public.
