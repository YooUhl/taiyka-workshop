# Site Audit — taiyka.com — 2026-07-21

Three-axis review (copywriting · design · technical) audited at commit `495d57a` on branch `feat/arctic-design-shop-topg`. **Audit only — nothing here is implemented yet.** Next session executes against this file.

Method: three parallel audit agents (one per axis), findings verified against the codebase. Copy audited against `content-creator/content-creation-style.md` (CCS). Design audit is code-level — the browser tool was locked all session, so §D lists what still needs eyeballing. Severities: **H** = damages conversions/trust/data today · **M** = visible inconsistency or real risk · **L** = polish.

---

## 0. CROSS-AXIS PRIORITY LIST — do these first, in this order

1. **[OPS-H] Push the branch.** 3 commits on `feat/arctic-design-shop-topg` exist only on this machine + Vercel. Remote exists (`github.com/YooUhl/taiyka-workshop`), branch never pushed — and the disk hit 100% full during this audit. One disk failure loses the entire redesign.
2. **[OPS-H] Disk.** C: oscillated between 1 GB and 41 GB free tonight (92% full at last check). This is what has been killing the dev server ("empty log, no clear cause" — Turbopack dies when it can't write .next/temp). Find the consumer: WinDirStat on temp dirs, Turbopack caches, the 3-4 MB screenshots at repo root, old node_modules.
3. **[COPY-H] The /resources dead end.** Three live surfaces (home "Ressources gratuites", /book hero fallback link, /book booked-page upsell) promise "5 workflows n8n gratuits" and land on an empty "Bientôt" page — while `/free-n8n-pack` with exactly that pack is live. Broken promise on the money path. Retarget the three links (or make /resources link the pack).
4. **[TECH-H] Doubled page titles in Google.** Every major page renders "… — L'Atelier — L'Atelier" (page title carries the brand AND the layout template appends it again). Live on production, visible in every search result. Fix: strip suffix from per-page titles or use `absolute`.
5. **[TECH-H] Regenerate all OG images.** All ~23 `public/og/*.png` are the pre-redesign "TAIYKA · HUB" navy brand. Every social share shows the old identity. `npm run og:generate` exists (`scripts/og-to-png.ts`) — update SVG sources first. Also: `/book` has no own og image (reuses brief's); shop workflow pages have none at all.
6. **[COPY-H] /book hero calque.** "Réserve 30 minutes avec Manu." is a word-for-word "book 30 minutes with" — the exact pattern CCS names as the cardinal sin, on the first line of the main conversion funnel.
7. **[COPY-H] /portfolio header is English dev-ops.** "OPS LOG" / "DEPLOYED" / "Workflows buildés, testés, en prod" greets non-technical French prospects. Rewrite outcome-first in French.
8. **[DESIGN-H] One CTA system.** Five button systems coexist (book's CTA constants, shop's py-4 variant, portfolio's min-h variants, shadcn rounded h-9 on /products, ComingSoon's mono CTA). Promote book's `CTA_BASE/ACTIVE/DISABLED` (square, h-14, tokens) to a shared recipe; kill the rest.
9. **[TECH-M] Prod pg Pool caching bug.** `lib/brief/db.ts`, `lib/shop/db.ts`, `lib/db.ts` only cache the Pool when NODE_ENV !== "production" → in prod every query constructs a fresh Pool, never ended. Connection churn/leak against the Supabase pooler under any real traffic. `lib/book/db.ts` does it right — make the other three match.
10. **[COPY-M] One truth per story.** Shop says simultaneously "ouvre bientôt" (meta) / "En ligne" (tab) / "Bientôt disponible" (every pack) / "quand le premier produit est en ligne" (waitlist). Skool: quiz results sell founder access on live skool.com while /skool says "ouvre bientôt" and /products describes a 12-week program. Pick one story per surface set.

---

## 1. COPYWRITING (audited against CCS: spoken FR not calque, tu, calm, outcomes-first, no jargon for the 80%, show-don't-claim, soft CTA)

Totals: **4 H · 32 M · 17 L.** Baseline: quiz questions, /book form flow, /brief, free-n8n-pack, /privacy and the five quiz-profile bodies are genuinely on-voice — the strongest writing on the site. Problems concentrate in: one broken funnel promise, one calqued hero, one anglicized page, cross-surface contradictions, and a layer of dev jargon on first-touch surfaces.

### H
- `web/lib/resources/content.ts:9` + `app/page.tsx` + `lib/book/content.ts:146,223` — the /resources dead end (see §0.3).
- `web/lib/book/content.ts:142` — "Réserve 30 minutes avec Manu." → calque; make it sound like Manu talking ("On se cale 30 minutes ?" direction).
- `web/app/portfolio/page.tsx:16-18` — "OPS LOG / DEPLOYED / Workflows buildés…" → English dev-ops header on a client-facing FR page → "LIVRÉ" / outcome-led FR.
- `web/lib/shop/content.ts:146` — "transformer ton IDE en équipe IA" → "IDE" is kill-list jargon on a public tab → outcome instead.

### M (grouped)
**Calques / franglais:**
- `lib/book/content.ts:129,184` — "Réponse en personne" / "Je réponds en personne" → "C'est moi qui réponds."
- `components/QuizEmailGate.tsx:45` — "Débloquer mon profil →" → "Voir mon profil →".
- `lib/quiz-results.ts:114` — "passer du brouillon au shipped" → "au truc lancé".
- `app/brief/unsubscribe/page.tsx:46-47` — "Te désinscrire de Le Brief ?" → "du Brief ?".
- `app/products/prospect-audit-funnel/page.tsx:144-145` — "Remboursement complet, pas de questions." → "Remboursé, sans discuter."
- `lib/shop/content.ts:245-246` — skoolBlurb abstract/nominalized (dupe in `workflow-client.tsx:51-52`) → say what's inside concretely.
- `app/portfolio/page.tsx:21` — "Prêt à shipper ?" → "On construit le tien ?"
- `app/portfolio/page.tsx:18` — "buildés" → "Construits pour de vrais clients."

**Jargon on first-touch surfaces (keep tech honesty in FAQs where it's earned):**
- `lib/shop/content.ts:112` — ticker ".json à importer" → "Prêts à importer en 2 clics".
- `lib/shop/content.ts:121` — "Tu remplis tes clés API" in hero → "Tu branches tes comptes".
- `lib/shop/content.ts:127,158-165,185-190` — "Done-for-you"/"DFY" → "Clé en main".
- acquisition-pack frBody — "4 variables d'environnement" → "4 clés — le guide te montre où".
- products cards: free-claude-starter "terminal… ultra-puissant"; client-acquisition-bundle "scripts Python… petit JSON" → outcomes.
- `app/portfolio/page.tsx:20` — ticker "n8n · Claude · Supabase" → outcomes or verticals, not tools.

**Contradictions (see §0.10):** shop status ×4 surfaces (`lib/shop/content.ts:103,135,234` vs product data all `coming-soon`) · Skool ×3 surfaces (`lib/quiz-results.ts:37` vs `lib/skool/content.ts:11` vs `/products`).

**Scarcity judgement calls:**
- `lib/quiz-results.ts:70,137,204` — "Tarif fondateur pour les 100 premiers · Verrouillé à vie" → ON-voice IF literally true; otherwise cut (guru scarcity).
- `app/portfolio/page.tsx:22` — cut "Places limitées.", keep "Je prends 2-3 projets ce mois-ci." (real, calm).
- prospect-audit "première vague à -20%" → fine if the discount is real.

**Vague-claim / promise copy:**
- acquisition-pack valueProps — "Personnalisation IA à grande échelle" (calque) → "Chaque email écrit sur mesure par Claude"; "Économise 4h par semaine" → anchor to something real or soften.
- acquisition-pack hover — "Scraping + enrichissement + envoi personnalisé." → outcome phrasing.

**Buyer-facing internal taxonomy:**
- `app/products/page.tsx:18-20` + prospect-audit "Tier 2 · 49€" + `lib/products.ts:299` "Free" badge → named FR tiers ("Gratuit / Pour commencer / Systèmes complets").
- `app/products/page.tsx:25-27` — "THE WORKSHOP — Build together" + telegraphic fragments → calm complete FR.

**Other M:** `/brief` features 01/02 restate the manifesto (padded) · free-n8n-pack ".json" in sub-hero → "5 workflows prêts à importer" · resources emptyState "Bientôt, à télécharger." → point at the live pack · competitor-intel card renders EMPTY (sales-fr.md headings don't match the parser — 49€ product shows bare title) · QuizEmailGate EN h1 renders two lines as one heading.

### L (batch in one sweep)
"Spam zéro." → "Zéro spam." · "(le bonus advanced)" → "avancé" · "les pures débutants" → "purs" · "sous 24h ouvrées" → "d'ici demain (jours ouvrés)" · "vérifie le @ et le point com" → generic ending · unsubscribe done-state present tense → "C'est fait" · shop footer "Tous les contenus sont produits par…" → "Tout est fait maison." · "suivre la pipeline dans un Sheet" → "tes prospects dans un Google Sheet" · "Idéation IA" → natural FR · brief JSON-LD "sans bullshit" → "sans blabla" (SEO surface) · skool OG siteName "My Workshop" → brand · resultat FR kicker align on "Ce que je ferais à ta place" · /products Tier-1 sub redundant · ai-agent-playbook card bullets too heavy.

---

## 2. DESIGN (coherence + responsiveness; code-level)

Verdict on "one design per page": the split is no longer old-glow vs new-flat — everything is roughly Arctic. The incoherence is now **micro**: caps vs no-caps headings, two mono-label trackings, ticker on 4 routes only, four top-bar layouts, five CTA systems, one route (/products) still on shadcn primitives.

### Route status table

| Route | Ticker | caps | .card-line | square CTAs | top-bar |
|---|---|---|---|---|---|
| `/` | ❌ | ❌ | ✅ | ⚠️ | new-ish |
| `/shop` | ✅ | partial | ✅ (1 hand-rolled) | ✅ | new 3-col |
| `/shop/workflows/[slug]` | ❌ | ❌ | ✅ | ✅ | new 3-col |
| `/book` | ✅ | partial | ✅ (pills hand-rolled) | ✅ | back-only |
| `/portfolio` | ✅ | ✅ | ✅ (footer hand-rolled) | ✅ | partial |
| `/qcm` | ✅ | ✅ | n/a | ✅ | legacy labels |
| `/qcm/quiz` | ❌ | ✅ | ⚠️ gate rounded-xl | ✅ | legacy labels |
| `/qcm/resultat` | ❌ | ✅ | n/a | ✅ | legacy, no lang |
| `/brief` (+2) | ❌ | ❌ | ✅ | ✅ | semi-new |
| `/products` | ❌ | ❌ | ⚠️ shadcn Card+ring | ❌ rounded h-9 | legacy |
| `/products/prospect-audit-funnel` | ❌ | ❌ | ✅ | ✅ | legacy + odd lang box |
| `/free-n8n-pack` | ❌ | ❌ | ✅ | ✅ | legacy |
| `/resources` `/skool` | ❌ | ❌ | n/a | ⚠️ unique style | lang-only |
| `/privacy` | ❌ | ❌ | ⚠️ hand-rolled | n/a | back-only |

### Coherence H
- `/products` + `ProductCard.tsx` — last shadcn island: `buttonVariants` rounded-lg h-9 (36px) buttons; `card-line` stacked on `Card` `rounded-xl + ring` (double edge, cascade-order dependent); Badge pills; rounded chips/rings → de-shadcn entirely (plain div.card-line, square chips, mono labels). NOTE: decision needed first — /products may be retired instead (see TECH §3, sitemap).
- Two micro-label dialects (~57 sites each): `font-mono-hud tracking-[0.18em]` vs legacy `font-mono tracking-[0.22em]` — legacy inside converted routes too (`qcm/page.tsx:177,238`, `quiz-client.tsx:202`, `resultat:179,310,329`, `book-client.tsx:981`, `QuizQuestion.tsx:199`, `QuizEmailGate.tsx:170`) → mechanical global normalize.
- Four top-bar layouts + brand-string drift ("TAIYKA" vs "L'Atelier" vs "Retour boutique") → one `TopBar` component (shop's 3-col is the template), min-h-44 hit areas, one brand string, no glow dot.
- Ticker: on shop/book/portfolio/qcm only, placement consistent (first child of main) → add to `/shop/workflows/[slug]` at minimum; decide policy for /, quiz, resultat, brief.

### Coherence M
- `display-caps` rule undecided: hero h1s on /brief, /free-n8n-pack, /prospect-audit, /privacy, ComingSoon, /shop h1+h2s, workflow h1 lack it; even within /shop only the FAQ h2 has it → decide (caps everywhere, or funnel-only) and enforce.
- `QuizEmailGate.tsx:201` — rounded-xl hand-rolled conversion panel on a converted route → card-line-accent.
- Glow dots `shadow-[0_0_8px…]` on `/` `:186`, shop `:110`, workflow `:94` — while qcm/brief use flat dots → one recipe, no glow.
- Hand-rolled boxes → card-line: portfolio footer CTA (`portfolio/page.tsx:198`), book q3 pills (`book-client.tsx:661`), PortfolioDetail sheet (`:146`), icon plates ×3 variants (shop FeatureMark `:517`, workflow `:112`, PortfolioTile `:192`).
- `SectionHead.tsx` is UNUSED — shop hand-rolls the identical head without caps (`:206-213`) → adopt or delete.
- CTA hover split `hover:bg-[#33b8ff]` vs `hover:bg-primary/90`; text `text-[#06131f]` vs `text-primary-foreground` → one token pair.
- Input bg split: `bg-card` vs `bg-obsidian` (BriefSignupForm:187, QuizEmailGate:236) → one input recipe.
- `PortfolioModal.tsx:26,34` — labels still name "/products" while href is /shop.

### Coherence L
`rounded-sm` on structural chips (home icon chips :238, workflow tier badge :121, PortfolioDetail tech chips :239) · paper-grid policy differs per route · ComingSoon CTA typography unique · dead utilities in globals.css (`row-flush`, `panel-well`, `hud-*`, `hover-grow`, gradient shims) → prune after /products decision.

### Responsiveness
- [H] `.band` uses `width:100vw` → horizontal wiggle on Windows with visible scrollbar wherever used without a clip (/book saved by overflow-x-hidden band-aid) → scrollbar-safe breakout or `overflow-x:clip` on body, then remove band-aids.
- [M] French caps headlines at 320px: `/qcm` h1 ("D'ENTREPRENEUR" ≈ wider than the column at display-xl), QuizEmailGate h2, resultat profile names — likely overflow → clamp floor ~2rem or per-heading overrides. Home EN "The Workshop" `whitespace-nowrap` borderline at 320.
- [M] Sub-44px touch targets on CONVERTED routes (unconverted pages already do min-h-44, ironically): shop/workflow top bars + tabs (~35px), portfolio top bar + carousel dots (22px), qcm bars, ComingSoon lang link → backport min-h-[44px].
- [M] Calendly embed fixed `minHeight:600` — on ≤568px-tall phones forces double-scroll → consider dropping the floor on small screens.
- [M] PortfolioCarousel `overflow-x-auto`+`overflow-y-visible` (computes to auto) — 3D-tilted tiles may clip shadows or spawn an inner scrollbar → visual check.
- [L] SectionHead meta `whitespace-nowrap` beside heading can overflow at 320 · portfolio placeholder min-h must match real height (CLS) · modal control row overlaps sheet edge at 320 · shop rail fine · hover-only info: none lost on touch (verified).

### Needs visual check (browser, 320/390/768/1280)
1. /qcm + email gate at 320 — caps headline wrap (most likely visible breakage). 2. Home EN at 320. 3. Portfolio carousel tilt/clip/snap at 320+768, modal controls. 4. Book → Calendly on short phones. 5. Windows scrollbar wiggle on every route. 6. /products rendered corner radius (cascade). 7. Shop rail stretch at 768 with 3 items. 8. Ticker seam with short lists at wide viewports. 9. panel-light boundary contrast + kicker AA on ice-white. 10. Focus rings inside panel-light use dark ring-offset (`BriefSignupForm.tsx:222`, privacy links) — wrong on light bg.

---

## 3. TECHNICAL

Totals: the API layer is largely healthy (book route is the gold standard; both webhooks verify signatures with replay guards; two-DB separation verified — no cross-write path). Problems are ops, SEO plumbing, and three hardening gaps.

### H
- Unpushed branch (see §0.1) and disk (see §0.2).
- OG images all stale + doubled titles (see §0.4, §0.5).

### M
- **Pool caching bug in prod** (see §0.9) — `lib/{brief,shop}/db.ts` + `lib/db.ts`; `lib/book/db.ts` is the correct pattern.
- **`/api/shop/waitlist` weakest route**: in-memory rate limiter (useless on serverless), no honeypot, no body-size cap, email not lowercased (case-duplicate signups) → port book/brief patterns.
- **`/api/brief/subscribe`** reads client IP from FIRST x-forwarded-for entry (spoofable → rate-limit bypass) → reuse book's `getClientIp`.
- **TLS**: all pools `rejectUnauthorized:false`; `BRIEF_DB_CA_CERT` supported but unset → set CA cert, extend to book/shop/tools pools.
- **Sitemap**: still lists `/products` + `/products/prospect-audit-funnel` (orphaned, indexed duplicates of /shop) → remove from sitemap AND decide: delete routes or 301 to /shop. `/privacy` missing from sitemap.
- **`/privacy` metadata**: canonical/og inherit root → page claims it IS the homepage → add own canonical + description.
- **No custom not-found.tsx** → default black Next 404, off-brand.
- **Env hygiene**: `.env.local.example` missing `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, `BRIEF_FROM_EMAIL`, `BRIEF_DB_CA_CERT`, `NEXT_PUBLIC_PROSPECT_AUDIT_FUNNEL_URL` (Resend ones are load-bearing — anyone redeploying from the example silently kills the newsletter). Turnstile vars in example but never implemented. **Delete `web/.env.new`** (leftover live-looking DB credentials from the wkswg→ylvk migration). `SUPABASE_SERVICE_ROLE_KEY` + NEXT_PUBLIC_SUPABASE_* in .env.local but zero code imports `lib/supabase/*` → remove locally + from Vercel.
- **Dead code**: `components/MailtoButton.tsx` (zero imports) · `lib/supabase/client.ts` + `server.ts` + `@supabase/supabase-js` dep (zero imports) · ProductCard tree goes if /products retired.
- **Dynamic rendering everywhere**: every marketing route is a serverless invocation because pages read `searchParams` for lang → consider static + client lang or path locales (cost/perf, not correctness).
- `NEXT_PUBLIC_SITE_URL` absent from `.env.local` (13× build warning locally; prod is set correctly).

### L
- hreflang: `?lang=en` canonicalizes to FR URL → EN alternates ignored by Google (matters only if EN indexing matters) · `/qcm` missing og:url · `X-Powered-By` exposed → `poweredByHeader:false` · CSP `script-src 'unsafe-inline'` (nonce migration later) · `shadcn` CLI in runtime deps → devDeps · `@types/node` ^20 vs Node 22 · console.warn ×4 error-path only (fine) · untracked repo-root clutter (7 screenshots up to 3.9 MB, research/, audit-tmp/, .playwright-mcp/) → gitignore or commit deliberately · triplicated `isValidEmail`/pool modules → one factory (would have prevented the pool bug).

### Verified healthy — do not re-audit
tsc clean · prod build clean · all 7 API routes' validation + secrets handling (nothing echoes secrets) · Calendly HMAC + Resend Svix webhook verification with replay guards · two-DB separation (tools vs public lead capture; pause behavior by design) · security headers live on prod (CSP, HSTS+preload, XFO DENY, nosniff) · `/tools` gate timing-safe, 404-on-fail, noindexed · fonts via next/font, no CLS · bundle small, Calendly + carousel lazy · no `<img>` misuse · JSON-LD static, no injection surface · robots/manifest sane · no env/PDF leaks in git history · MatrixRain alive (used by /resources + /skool).

---

## 4. SUGGESTED IMPLEMENTATION ORDER (next session)

1. **Ops first (10 min):** push branch · delete `.env.new` · gitignore root clutter · start disk hunt in background.
2. **Money-path copy (H):** /resources dead-end retarget · /book hero line · /portfolio header block · shop IDE line.
3. **SEO plumbing:** titles double-suffix · OG regenerate (needs new SVG sources at the new brand — small design task) · /privacy metadata · sitemap (/products out, /privacy in) · not-found.tsx · shop workflow og:images.
4. **One decision, then mechanics:** retire /products (301 → /shop) or convert it. Everything in DESIGN §/products + several TECH items hang on this.
5. **Design coherence batch (mechanical):** micro-label normalize · TopBar component · CTA recipe unify · card-line strays · display-caps rule · glow dots · ticker policy.
6. **Copy M+L batch:** contradictions (shop status, Skool story) need Manu's decisions on what's true; calque/jargon sweep is mechanical after that.
7. **API hardening:** pool caching fix · shop waitlist hardening · brief subscribe IP fix · CA certs.
8. **Responsive fixes + browser verification pass** (close the Chrome window first): the §2 visual-check list at 320/390/768/1280, then fix caps-wrap, touch targets, .band overflow.

## Decisions Manu owns (blocking items marked ✋)

- ✋ Is the Skool founder offer (100 places, lifetime lock) literally true? Determines whether that copy stays or goes.
- ✋ What's the shop's real status — live or waitlist? One answer, applied to 4 surfaces.
- ✋ Retire /products or convert it?
- ✋ display-caps on ALL hero h1s, or funnel pages only?
- ✋ Ticker on all pages or only commerce/funnel pages?
- NDA check on naming Polymaker + UFC on /portfolio (raised repeatedly, still open).
- Refunds + license FAQ answers for the shop (deferred from shop build).
