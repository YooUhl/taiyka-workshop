---
slug: acquisition-pack
icon: Target
tier: entry
price: "19€"
priceNumeric: 19
status: coming-soon
fr:
  title: "Pack Acquisition"
  tagline: "8 workflows pour automatiser ta prospection de A à Z."
  hoverDescription: "Scraping + enrichissement + envoi personnalisé. Setup en 60 minutes."
en:
  title: "Acquisition Pack"
  tagline: "8 workflows to automate your prospecting end-to-end."
  hoverDescription: "Scraping + enrichment + personalized outreach. 60-minute setup."
nodes:
  - "Apify · Apollo / LinkedIn scraper"
  - "Hunter.io · Email finder + verifier"
  - "Anthropic · Claude personalization writer"
  - "Gmail / Outlook · Sequence sender"
  - "Google Sheets · Pipeline tracker"
  - "Webhook · Reply detector"
variables:
  - name: "APIFY_TOKEN"
    description: "Token Apify pour le scraping (Apollo, LinkedIn)"
  - name: "HUNTER_API_KEY"
    description: "Clé API Hunter.io pour la vérification d'email"
  - name: "ANTHROPIC_API_KEY"
    description: "Clé API Anthropic pour la rédaction personnalisée"
  - name: "GMAIL_OAUTH"
    description: "OAuth Gmail (ou SMTP Outlook équivalent)"
costEstimate:
  fr: "≈ 0,15€ par prospect contacté (scraping + email + IA + envoi)."
  en: "≈ €0.15 per prospect contacted (scraping + email + AI + send)."
valueProps:
  fr:
    - "Économise 4h par semaine sur la prospection"
    - "Setup complet en moins de 60 minutes"
    - "Personnalisation IA à grande échelle"
    - "Pipeline trackée automatiquement dans Google Sheets"
  en:
    - "Saves 4h per week on prospecting"
    - "Full setup in under 60 minutes"
    - "AI personalization at scale"
    - "Pipeline auto-tracked in Google Sheets"
---

# Description (FR)

Le Pack Acquisition rassemble 8 workflows n8n prêts à l'emploi pour bâtir un système de prospection complet, sans coder. Tu importes les workflows dans ton instance n8n, tu renseignes 4 variables d'environnement, et la machine tourne.

Le pack couvre toute la chaîne : du scraping de prospects qualifiés (Apollo ou LinkedIn via Apify) à la vérification d'email (Hunter.io), en passant par la personnalisation IA (Claude rédige chaque premier message en se basant sur le profil scrappé) et l'envoi multi-canal (Gmail ou Outlook).

Chaque workflow est documenté, testé, et accompagné d'un guide de setup. Si tu connais déjà n8n, compte 30 minutes. Sinon, 60 minutes max — un guide vidéo de setup est inclus.

---

# Description (EN)

The Acquisition Pack bundles 8 ready-to-use n8n workflows that build a complete prospecting system, no code required. You import the workflows into your n8n instance, fill in 4 environment variables, and the machine runs.

The pack covers the full chain: from scraping qualified prospects (Apollo or LinkedIn via Apify) to email verification (Hunter.io), through AI personalization (Claude writes every first message based on the scraped profile) and multi-channel sending (Gmail or Outlook).

Every workflow is documented, tested, and shipped with a setup guide. If you already know n8n, plan for 30 minutes. Otherwise 60 minutes max — a setup video walkthrough is included.
