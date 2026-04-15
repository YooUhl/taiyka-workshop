# Polymaker — Système d'intelligence concurrentielle

> Scraper 7 plateformes sociales → rapports stratégiques Claude → dashboards Google Sheets livrés chaque semaine, sans intervention humaine.

## Le problème
Un fabricant mondial de filament 3D voulait savoir ce que faisait vraiment la concurrence — pas en théorie, dans les DMs, les commentaires, les Reels, les threads Discord. L'équipe marketing n'avait aucun moyen de suivre 7 plateformes en parallèle, et les agences classiques livraient des PDFs trop lents et trop génériques.

## La solution
J'ai construit un pipeline qui scrape Instagram, TikTok, YouTube, Facebook, LinkedIn, Discord et Reddit via Apify, stocke chaque post / vidéo / thread dans Supabase, puis envoie le tout à Claude qui produit une analyse stratégique structurée par canal. Un workflow n8n orchestre le tout chaque semaine et pousse les résultats dans un Google Sheet branché sur leurs KPIs. Le client ouvre son dashboard le lundi matin, la veille d'analyse est déjà faite.

## Stack
`Python` · `Apify` · `Claude API (Sonnet 4.5)` · `n8n` · `Supabase` · `Google Sheets API`

## Résultats
- 7 plateformes sociales suivies en parallèle, ~1000+ contenus concurrents ingérés par cycle
- Rapports stratégiques livrés chaque semaine sans intervention humaine
- Remplace 10-15h de veille manuelle par semaine pour l'équipe marketing
- Système utilisé en production comme source de vérité pour leurs décisions de contenu

## Statut
En production.

---

# Polymaker — Competitive Intelligence System

> Scrape 7 social platforms → Claude-powered strategic reports → weekly Google Sheets dashboards delivered with zero human input.

## The problem
A global 3D printing filament manufacturer wanted to know what competitors were actually doing — not in theory, in the DMs, the comments, the Reels, the Discord threads. The marketing team had no way to monitor 7 platforms in parallel, and traditional agencies delivered PDFs that were too slow and too generic.

## The solution
I built a pipeline that scrapes Instagram, TikTok, YouTube, Facebook, LinkedIn, Discord and Reddit through Apify, stores every post / video / thread in Supabase, then pipes the whole dataset through Claude to generate a structured strategic analysis per channel. An n8n workflow orchestrates the run every week and pushes the output into a Google Sheet wired to their KPIs. The client opens their dashboard Monday morning — the intel work is already done.

## Stack
`Python` · `Apify` · `Claude API (Sonnet 4.5)` · `n8n` · `Supabase` · `Google Sheets API`

## Outcome
- 7 social platforms tracked in parallel, ~1000+ competitor assets ingested per cycle
- Strategic reports delivered weekly with zero manual work
- Replaces 10-15 hours of manual intel work per week for the marketing team
- Running in production as the source of truth for their content decisions

## Status
Live in production.
