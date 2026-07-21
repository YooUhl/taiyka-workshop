# Linktree Infrastructure Audit — 2026-07-02

Multi-agent audit (6 lenses: code / design / a11y / seo / perf / infra) of the linktree hub and its supporting infrastructure. Each finding adversarially verified against the code and the installed Next.js 16 docs before inclusion. Duplicates merged. 50 raw confirmed findings → 37 unique issues below. 16 findings rejected as false-positive or taste (listed at bottom).

**Scope:** `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `lib/lang-utils.ts`, `lib/utils.ts`, `app/robots.ts`, `app/sitemap.ts`, `next.config.ts`.

**Reminder for the fix phase:** per `web/AGENTS.md`, this is a *modified* Next.js 16.2.3. Read the relevant guide under `web/node_modules/next/dist/docs/` before touching any Next API (metadata, viewport, sitemap, robots, fonts, CSP).

---

## P1 — Fix before any launch (1)

### 1. Social share preview is broken on the bio link
- **Files:** `app/page.tsx:94-107` (same bug repeats on `app/book/page.tsx`, `app/shop/page.tsx`)
- **Problem:** `generateMetadata` returns an `openGraph` object with no `images` and a `twitter` object with `card: 'summary'` and no images. Next 16 **shallow-replaces** nested metadata objects (verified in `generate-metadata.md` L1324-1358) — it does not deep-merge. So the layout's `og:image` (`/og/home.png`, 1200×630), the `summary_large_image` twitter card + its image, and `og:alternateLocale` are all **dropped on the home route**. This URL is the exact link shared in the IG/TikTok/LinkedIn bio — shares render with no thumbnail and the weakest card type, directly hurting click-through on the surface the whole funnel depends on.
- **Fix:** Pull the OG/twitter image into a shared constant and spread it into `openGraph` in both layout and every page (`generate-metadata.md` recommends exactly this at L1360-1388). Restore `twitter.card: 'summary_large_image'` + `images`. Re-add `alternateLocale`. Consider per-lang OG images.

---

## P2 — Important (12)

### Visible (design / UX / a11y)

### 2. Language toggle tap target far below 44×44px
- **File:** `app/page.tsx:140-146`
- **Problem:** Top-right lang switch is an 11px inline text link with zero padding — hit area ~30×16px, fails WCAG 2.5.8. Sits in the hardest-to-reach corner on the most-important mobile surface.
- **Fix:** `inline-flex items-center justify-center min-h-[44px] px-3`. Note: `min-h-[44px]` will grow the top-bar row (it's `items-center`) — verify layout after.

### 3. Wordmark overflows on narrow phones (≤340px)
- **File:** `app/page.tsx:155-161`
- **Problem:** `whitespace-nowrap` + `text-[clamp(2.25rem,9vw,4.5rem)]`. Mobile root font is 17px, so the clamp floor = ~38px and 9vw only overtakes it above ~425px. At 320px the container is ~269px wide but EN "THE WORKSHOP" at 38px Bold measures ~285-290px → clips or triggers horizontal scroll. FR "L'ATELIER" fits fine; only EN on ultra-narrow devices (SE gen1, Fold) breaks.
- **Fix:** Lower the clamp floor to ~`1.75rem` so it actually scales down at 320px (keeps single line). Test both languages at 320/360/414px.

### 4. No footer, no legal pages (legally required in France)
- **File:** `app/page.tsx:263` (site-wide gap)
- **Problem:** Homepage ends on a decorative hairline — no privacy, no *mentions légales*, no contact, no copyright. Sibling pages (`free-n8n-pack`, `qcm`) already render a "© Taiyka" footer, so the homepage is inconsistent. For a SIRET-registered commercial site (shop + booking), mentions légales are mandatory under LCEN. No legal page exists anywhere in the site.
- **Fix:** Add a homepage footer matching siblings, AND create a real `/mentions-legales` page (+ privacy) linked from footers site-wide. A bare link with no destination does not satisfy the law.

### 5. Gradient wordmark disappears in high-contrast / forced-colors mode
- **File:** `app/globals.css:183-188`
- **Problem:** `.text-gradient-hero` uses `background-clip:text` + `color:transparent` with no forced-colors fallback. In Windows High Contrast, the background image is dropped but the transparent color remains → the accent word (and, on portfolio/shop pages, the entire H1) renders invisible. The `prefers-contrast: more` block doesn't restore a solid color either.
- **Fix:** `@media (forced-colors: active){ .text-gradient-hero{ color: CanvasText; -webkit-text-fill-color: currentColor; background: none; } }`

### Invisible (perf / seo / a11y-internal / infra)

### 6. Calendly stylesheet render-blocks every route
- **File:** `app/layout.tsx:102`
- **Problem:** `<link rel="stylesheet" href="https://assets.calendly.com/.../widget.css">` sits in the root `<head>`, so it loads on the hub (and every page) even though only `/book` uses Calendly. Cross-origin, render-blocking, cold DNS+TLS on first paint of the highest-traffic page, for zero benefit. Calendly JS is only loaded on `/book`, so the CSS is orphaned everywhere else.
- **Fix:** Remove from layout; load it only on `/book` alongside the existing widget.js. CSP already allows `assets.calendly.com` in `style-src`.

### 7. Inter shipped as 3 static weights; the weight the tiles use isn't even loaded
- **File:** `app/layout.tsx:6-11`
- **Problem:** `Inter({ weight: ["400","700","900"] })` forces 3 static woff2 files, all preloaded (Inter defaults `preload:true`) on every route. Weight 900 is unused on the hub yet preloaded. Worse, the nav tile labels use `font-medium` (500) which is **not loaded**, so they down-match to 400.
- **Fix:** Load Inter as a variable font — drop the `weight` array entirely. One woff2 covers 400-900 incl. 500, cuts preloaded font requests 3→1, and renders `font-medium` correctly. (Keeps `/products`, which uses 900, working.)

### 8. Sitemap is wrong in both directions
- **File:** `app/sitemap.ts:8-23`
- **Problem:** Missing indexable pages `/book` and `/shop` (two primary funnel routes, both fully canonical'd, no noindex). AND `/skool` **is** in the sitemap but sets `robots noindex` — the inverse bug (submitting a noindexed URL to crawlers). `/resources` is correctly excluded (it's noindex too).
- **Fix:** Add `/book` and `/shop`. Remove `/skool`. Do NOT add `/resources`.

### 9. `<html lang>` is hardcoded "fr" at SSR for the English variant
- **File:** `app/layout.tsx:94-100`
- **Problem:** Server always emits `<html lang="fr">`; `?lang=en` is only patched client-side by the beforeInteractive script. For EN at SSR / no-JS / first paint, English content is declared as French — WCAG 3.1.1 (Level A) failure. Root layouts genuinely can't read `searchParams` in Next 16 (verified `layout.md:178-182`), so the client patch is a defensible workaround but leaves SSR wrong.
- **Fix:** Least-disruptive given the `?lang=` model: middleware maps `?lang=en` → a cookie/header, read via `cookies()`/`headers()` in the root layout to set the correct `lang` at SSR. Keep the client script as progressive-enhancement fallback. (A real `app/[lang]` segment is cleaner but forces a URL restructure.)

### 10. English variant canonicalizes to the French root
- **File:** `app/page.tsx:87-93`
- **Problem:** `canonical` is set to `SITE` (bare root) for both languages, while hreflang declares `en-US → /?lang=en`. So `/?lang=en` tells Google "my canonical is the FR page" → EN gets deduped into FR and never indexed separately, and the hreflang cluster becomes contradictory.
- **Fix:** Make canonical lang-aware: `SITE` for fr, `${SITE}/?lang=en` for en (`lang` is already computed). Keep the hreflang map.

### 11. `NEXT_PUBLIC_SITE_URL` default duplicated across ~12 files
- **Files:** `app/page.tsx:30`, `app/layout.tsx:28`, `app/robots.ts:3`, `app/sitemap.ts:3`, + JSON-LD literals in brief/qcm/prospect-audit
- **Problem:** `process.env.NEXT_PUBLIC_SITE_URL ?? "https://taiyka.com"` is copy-pasted everywhere that drives canonical/OG/sitemap/robots URLs. On a preview deploy or domain change, these silently diverge. (Verifier found ~12 sites, not the 4 originally reported.)
- **Fix:** Extract `export const SITE = ...` in `lib/site.ts`, import everywhere, including the hardcoded literals.

### 12. No JSON-LD structured data
- **File:** `app/page.tsx` (n/a)
- **Problem:** No schema.org markup anywhere. For a personal-brand bio hub this is the highest-leverage SEO add: `Person` (Manu) with `sameAs` → IG/TikTok, `Organization` (Taiyka), `WebSite`. Helps Google build the brand entity and disambiguate `@manu_ai.to`.
- **Fix:** Render a `<script type="application/ld+json">` with a `@graph` in the server component (ships in initial HTML). **Must XSS-sanitize** per the docs: `dangerouslySetInnerHTML` with `JSON.stringify(...).replace(/</g,'\\u003c')`.

### 13. CSP ships `'unsafe-eval'` in production
- **File:** `next.config.ts:8`
- **Problem:** `script-src` includes `'unsafe-eval'` unconditionally. The installed Next 16 CSP guide states it's not needed in prod (dev-only, for React error stacks). Re-enables `eval()`-based injection vectors for zero functional benefit. (Marginal since `'unsafe-inline'` is also present, and this is a static no-input page — hence P2 not P1.)
- **Fix:** Gate to dev: `${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}`.

---

## P3 — Polish / hygiene (24)

**Code**
- `app/page.tsx:9` — local `type Lang = "fr"|"en"` re-declared; import the exported one from `lib/portfolio`.
- `app/page.tsx:200` — `<Fragment>` wraps a single `<Link>`; move `key` to `<Link>`, drop the Fragment import.
- `app/page.tsx:157` — `text-balance` is a no-op next to `whitespace-nowrap`; remove one (ties to #3).

**Design / UX**
- `app/layout.tsx` — no `viewport` export with `themeColor: '#0A1628'`; browser chrome not branded (Chromium only — WebKit in-app browsers ignore it). Needs `import type { Viewport }`.
- `app/page.tsx:152` — brand logo (`public/logo-512.png`) never rendered; hub is text-only. Consider a ~64-80px logo/avatar above the wordmark for cold-arrival recognition.
- `app/page.tsx:153` — no visible tagline/bio; the context-bearing H1 is `sr-only`, so sighted users get no "what is this". Add a one-line value prop.
- `app/page.tsx:174-256` — all cues are `hover:`/`group-hover:` with no `active:` state; taps give no confirmation. Add `active:scale-[0.99] active:bg-primary/10`.
- `app/globals.css:20-31` — brand hexes hand-mirrored from `brand/tokens.json` with a "source of truth" comment, but nothing enforces it and drift already exists (radius scale). Add a test asserting the hexes match (full tooling is overkill here).

**A11y**
- `app/page.tsx:143` — toggle `aria-label` is other-language text with no `lang` attr (WCAG 3.1.2). Simplest fix: word it in the current page language ("Voir en anglais").

**Perf**
- `app/layout.tsx:20-26` — VT323 instantiated globally but only `/portfolio` uses `.font-display-hud`; move it into a portfolio-scoped layout so its `@font-face` CSS stops shipping on every route (font file itself is already lazy via `preload:false`).
- `app/layout.tsx:13-18` — JetBrains Mono is `preload:false` but renders above the fold on the hub (status bar, kicker, tile arrows) → FOUT glyph swap. Set `preload:true`.
- `app/page.tsx:122-125` — the fixed 60vh `bg-gradient-glow` div has `blur-2xl` (~40px filter) with no `md:` gate, unlike the other HUD layers which globals.css gates to ≥768px. Costly mobile composite; the radial gradient is already soft. Gate to ≥768px (or drop the blur).
- `app/page.tsx:111-117` — reading `searchParams` opts the hub into dynamic rendering (no static/edge cache). Low impact (no data fetching). Longer term: PPR (Suspense) or path-based `/en` for clean caching.

**SEO**
- `app/page.tsx` / `app/layout.tsx` / `app/sitemap.ts` — hreflang `x-default` missing everywhere; add `'x-default': '/'`.
- `app/sitemap.ts` — `/shop/workflows/[slug]` product pages absent (map slugs from `getShopWorkflows()`). Low priority while products are "coming-soon".
- `app/robots.ts:11` — `Disallow` broadcasts the obscure private slug `/manu-uhila-work-87k9` in public robots.txt. The page already has `noindex` in metadata, and the Disallow can *prevent* Google reading that noindex. Just remove the slug from robots.txt.
- `app/robots.ts:16` — `host` hardcoded to `https://taiyka.com` while sitemap uses env `SITE`; diverges on preview. Use `host: SITE` or drop it (Yandex-only).
- `app/layout.tsx:84` — `twitter.creator: '@manu_ai.to'` is the IG/TikTok handle, not a valid X username → inert attribution. Drop it (or use a real X handle).
- `app/page.tsx:97` / shop / resources — `og:site_name` inconsistent ("Taiyka" vs "L'Atelier" vs "My Workshop" — the last looks like placeholder copy). Standardize to "Taiyka"; put the page name in `og:title`.
- `app/resources/page.tsx:19-26` — noindex page still emits canonical + hreflang alternates (contradictory, wasted markup). Drop the `languages` block on noindex pages.
- `app/sitemap.ts:6` — `LAST_MOD` frozen at 2026-05-25 for all URLs. Weak signal; a build timestamp is the clean uniform fix (mtime only covers products/portfolio).

**Infra**
- `next.config.ts` — no `Strict-Transport-Security` header. Add `max-age=63072000; includeSubDomains; preload` (verify all subdomains are https first). Low impact (static, no PII).
- `app/layout.tsx` — no `app/manifest.ts`, no `apple-touch-icon`, no `themeColor`; `logo-512.png` exists to power them. Adds branded home-screen icon for "Add to Home Screen".
- `public/` — 6 unused scaffold SVGs (`next.svg`, `vercel.svg`, `window.svg`, `file.svg`, `globe.svg`, `og-image.svg`) referenced nowhere. Delete.

---

## Rejected (16 — false-positive or taste, not fixed)

- "No social links on the hub" — deliberate funnel decision; visitors arrive *from* social. Re-linking leaks them out.
- "Primary CTA doesn't stand out at rest" — false; it has persistent blue icon + arrow + brackets vs muted greys.
- "Secondary tile arrow invisible at rest" ×2 — it's an `aria-hidden` decorative glyph; clickability carried by the full card.
- "Content vertically centered reads sparse" — standard bio-link pattern, taste.
- "Focus ring offset color mismatch" — `#00a6ff` ring has strong contrast on both navy and black; imperceptible.
- "Lang toggle shows only target language" — standard switcher convention.
- "Lang toggle < 24px target" — qualifies for WCAG 2.5.8 spacing exception (isolated in top bar). [Note: the 44px version, #2, still holds as a UX nicety.]
- "Tile borders < 3:1" — WCAG exempts boundary when text identifies the control; strong focus ring present.
- "sitemap lastModified fixed date" (as P-worthy) — kept as a P3 hygiene item only.
- "sitemap lists /products/prospect-audit-funnel" — that's a live 49€ product, correctly indexed.
- "LCP gated behind opacity fade" — LCP myth; Chrome records renderTime at fade *start*, ~1 frame penalty.
- "background-attachment:fixed jank" — iOS WebKit (the actual audience) ignores it; trivial 2-stop paint.
- "No preconnect for calendly" — micro-opt with a mismatched fix; the real issue (global render-block) is #6.
- "Inline lang-sync forces unsafe-inline" — informational; strict CSP isn't a goal here.
- "CSP img-src allows any https" — incoherent threat given unsafe-inline is already present; would break Calendly avatars.
