---
slug: content-pack
icon: Sparkles
tier: entry
price: "24€"
priceNumeric: 24
status: coming-soon
fr:
  title: "Pack Contenu"
  tagline: "Pipeline idée → script → publication, connecté à Claude."
  hoverDescription: "Multi-plateforme : IG, TikTok, LinkedIn. Les idées viennent toutes seules, la publication aussi."
en:
  title: "Content Pack"
  tagline: "Idea → script → publish pipeline, wired to Claude."
  hoverDescription: "Multi-platform: IG, TikTok, LinkedIn. Ideas show up on their own, publishing runs itself."
nodes:
  - "Anthropic · Claude idea generator"
  - "Anthropic · Claude script writer"
  - "Airtable / Notion · Content calendar"
  - "Buffer / Make · Multi-platform publisher"
  - "Webhook · Performance tracker"
variables:
  - name: "ANTHROPIC_API_KEY"
    description: "Clé API Anthropic pour Claude (idéation + scripts)"
  - name: "AIRTABLE_API_KEY"
    description: "Clé Airtable (ou token Notion équivalent)"
  - name: "BUFFER_ACCESS_TOKEN"
    description: "Token Buffer pour publication multi-plateforme"
costEstimate:
  fr: "≈ 0,05€ par script généré. Coût Buffer / Notion selon ton plan."
  en: "≈ €0.05 per script generated. Buffer / Notion cost depends on your plan."
valueProps:
  fr:
    - "10 idées de contenu générées par jour, automatiquement"
    - "Scripts long et court formats, prêts à tourner"
    - "Publication centralisée sur IG, TikTok, LinkedIn"
    - "Calendrier éditorial synchronisé avec Airtable / Notion"
  en:
    - "10 content ideas generated per day, automatically"
    - "Long and short-form scripts, ready to film"
    - "Centralized publishing on IG, TikTok, LinkedIn"
    - "Editorial calendar synced to Airtable / Notion"
---

# Description (FR)

Le Pack Contenu transforme ton n8n en moteur de création quotidien. Tu lui donnes ta niche, ton positionnement et ton ton de voix une fois, puis il génère idées, scripts et publications en continu — sans que tu aies à t'asseoir devant une page blanche.

Le pipeline part de l'idée (Claude génère 10 angles par jour à partir de ton positionnement), passe par le script (long format vidéo + version short), et finit dans ton calendrier (Airtable ou Notion). Tu valides ou ajustes, et Buffer publie automatiquement aux bons horaires sur IG, TikTok et LinkedIn.

Le pack est livré avec des prompts pré-réglés pour 4 angles (éducation, storytelling, hot take, behind-the-scenes) que tu peux adapter à ta niche.

---

# Description (EN)

The Content Pack turns your n8n into a daily creation engine. You give it your niche, positioning, and tone of voice once, then it generates ideas, scripts, and posts continuously — no more sitting in front of a blank page.

The pipeline starts at idea (Claude generates 10 angles per day from your positioning), moves through script (long-form video + short version), and lands in your calendar (Airtable or Notion). You approve or adjust, then Buffer auto-publishes at the right times on IG, TikTok, and LinkedIn.

The pack ships with pre-tuned prompts for 4 angles (education, storytelling, hot take, behind-the-scenes) that you can adapt to your niche.
