---
slug: ops-pack
icon: Settings
tier: entry
price: "29€"
priceNumeric: 29
status: coming-soon
fr:
  title: "Pack Opérations"
  tagline: "Facturation, relances et reporting — pilote ton business sans y penser."
  hoverDescription: "Auto-suivi des paiements Stripe, sync Notion + Google Drive."
en:
  title: "Ops Pack"
  tagline: "Invoicing, reminders, and reporting — run your business on autopilot."
  hoverDescription: "Stripe payment auto-tracking, Notion + Google Drive sync."
nodes:
  - "Stripe · Payment listener + invoice creator"
  - "Gmail · Reminder sender"
  - "Notion · Client database sync"
  - "Google Drive · Document filing"
  - "Slack · Daily ops digest"
variables:
  - name: "STRIPE_SECRET_KEY"
    description: "Clé secrète Stripe (mode live ou test)"
  - name: "GMAIL_OAUTH"
    description: "OAuth Gmail pour l'envoi des relances"
  - name: "NOTION_API_KEY"
    description: "Clé API Notion + ID de ta base clients"
  - name: "SLACK_WEBHOOK_URL"
    description: "Webhook Slack (optionnel) pour le digest quotidien"
costEstimate:
  fr: "Coût n8n uniquement (gratuit si self-hosted). APIs Stripe / Notion gratuites jusqu'à un certain volume."
  en: "n8n cost only (free if self-hosted). Stripe / Notion APIs free up to a volume threshold."
valueProps:
  fr:
    - "Factures Stripe générées et envoyées automatiquement"
    - "Relances clients sans intervention humaine"
    - "Base clients toujours à jour dans Notion"
    - "Digest quotidien Slack : CA, factures en attente, retards"
  en:
    - "Stripe invoices generated and sent automatically"
    - "Client follow-ups with zero human intervention"
    - "Client database always up to date in Notion"
    - "Daily Slack digest: revenue, outstanding invoices, late payers"
---

# Description (FR)

Le Pack Opérations automatise la couche administrative que tout solopreneur déteste : facturation, relances, et reporting. Tu installes une fois, et tu n'y touches plus.

Dès qu'un client paye un produit (Stripe), un workflow crée la facture, l'envoie par email, met à jour ta base clients Notion, et range le PDF dans le bon dossier Google Drive. Si une facture reste impayée plus de 7 jours, une relance polie part automatiquement. Et chaque matin, un digest Slack résume : CA de la semaine, factures en attente, clients à relancer.

Le pack est conçu pour les solopreneurs et les petites équipes (< 5 personnes). Plus gros que ça, il faut adapter — mais la base reste solide.

---

# Description (EN)

The Ops Pack automates the admin layer every solopreneur hates: invoicing, reminders, and reporting. Install once, never touch again.

When a client pays for a product (Stripe), a workflow creates the invoice, emails it, updates your Notion client database, and files the PDF in the right Google Drive folder. If an invoice stays unpaid past 7 days, a polite reminder fires automatically. And every morning, a Slack digest sums up: weekly revenue, outstanding invoices, clients to chase.

The pack is designed for solopreneurs and small teams (< 5 people). Bigger than that, it needs adapting — but the foundation stays solid.
