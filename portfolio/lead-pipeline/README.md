# Multi-Platform Lead Pipeline — Lead-gen social multi-sources

> Un pipeline qui scrape 6 plateformes sociales chaque jour et dépose des leads qualifiés dans Supabase + Google Sheets.

## Le problème
La prospection manuelle sur les réseaux sociaux ne passe pas à l'échelle. Chaque plateforme a ses propres outils, ses propres formats, ses propres limites de rate. Pour une agence qui veut des leads qualifiés depuis Instagram, TikTok, Facebook, Twitter, YouTube et LinkedIn en continu, il n'y a pas d'outil tout-en-un — il faut le construire.

## La solution
J'ai construit un pipeline de data centralisé autour de collecteurs quotidiens, un par plateforme. Chaque collecteur utilise l'actor Apify adapté, applique des filtres de qualification (mots-clés, taille d'audience, engagement), puis dédoublonne contre Supabase avant d'écrire. Une couche Google Sheets sert de surface opérationnelle pour l'équipe commerciale — consultable depuis le mobile, avec scoring et tags. n8n orchestre les runs quotidiens et gère les erreurs de rate limit / actor sans intervention.

## Stack
`Python` · `Apify` · `Supabase` · `Google Sheets API` · `n8n` · `Claude API` (qualification)

## Résultats
- 6 plateformes sociales couvertes par un seul pipeline unifié
- Exécution quotidienne, dédoublonnage automatique — zéro doublon en base
- Leads accessibles en temps réel depuis mobile via Google Sheets
- Architecture modulaire : ajouter une plateforme = ajouter un collecteur, rien à refactorer

## Statut
En production, réutilisé sur plusieurs projets.

---

# Multi-Platform Lead Pipeline — Multi-source social lead-gen

> A pipeline that scrapes 6 social platforms daily and drops qualified leads into Supabase + Google Sheets.

## The problem
Manual social prospecting doesn't scale. Every platform has its own tools, its own formats, its own rate limits. For an agency that wants qualified leads from Instagram, TikTok, Facebook, Twitter, YouTube and LinkedIn on a continuous basis, there's no all-in-one tool — you have to build it.

## The solution
I built a centralized data pipeline around daily collectors, one per platform. Each collector uses the matching Apify actor, applies qualification filters (keywords, audience size, engagement), then deduplicates against Supabase before writing. A Google Sheets layer acts as the operational surface for the sales team — mobile-accessible, with scoring and tags. n8n orchestrates the daily runs and handles rate limit / actor failures without human touch.

## Stack
`Python` · `Apify` · `Supabase` · `Google Sheets API` · `n8n` · `Claude API` (qualification)

## Outcome
- 6 social platforms covered through one unified pipeline
- Daily runs, automatic deduplication — zero duplicates in the database
- Leads accessible in real time from mobile via Google Sheets
- Modular architecture — adding a platform = adding a collector, no refactor

## Status
Live in production, reused across multiple projects.
