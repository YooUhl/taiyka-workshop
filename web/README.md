# Taiyka — web

Public-facing Next.js site for Taiyka / @manu_ai.to. Hub + Products + Portfolio.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19 · TypeScript
- Tailwind CSS v4 (CSS-first, configured via `@theme` in `app/globals.css`)
- shadcn/ui (Base UI primitives) — `button`, `card`, `badge`
- Inter via `next/font/google`

## Scripts

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm run start   # serve production build
npm run lint
```

## Routes

- `/` — linktree-style hub (mobile-first, dark Taiyka brand)
- `/products` — 3-tier product grid (Free / 10-25€ / 25-50€) — placeholder copy
- `/portfolio` — 4 placeholder project cards (Polymaker, UFC Gym, Content System, Lead-gen Pipeline)

## Brand tokens

Source of truth: `../brand/tokens.json`. Mirrored into:

- `app/globals.css` — `@theme` block + `:root` vars (dark-first). Core colors: `--color-electric-blue #00A6FF`, `--color-cyan #00E5FF`, `--color-navy #0A1628`, plus charcoal/slate/ink/muted.
- `tailwind.config.ts` — kept for tooling/DX compatibility.
- Utilities: `bg-gradient-hero`, `bg-gradient-navy`, `bg-gradient-glow`, `text-gradient-hero`, `shadow-glow`.

If you change brand colors, update `brand/tokens.json` first, then mirror here.

## TODO for the next agents

- Replace the logo placeholder on `/` with the real Taiyka gear logo (electric blue glow).
- Wire real product copy into `/products` (pull from `products/<slug>/copy/sales-fr.md` and `sales-en.md`).
- Add Gumroad buy-button embeds on each product card (Tier 1/2).
- Fill `/portfolio` with real case studies — cross-check NDAs (Polymaker especially) before publishing.
- Add `/[lang]` routing or locale switcher — bilingual is non-negotiable (FR default, EN secondary).
- Hook up Skool, real social URLs, and the actual free-resources delivery (n8n email sequence).

## Notes

- Next.js 16 ships Turbopack by default. The shadcn `Button` primitive here comes from `@base-ui/react` and does **not** expose `asChild`; compose with `buttonVariants()` + `cn()` when wrapping a `Link` (see `app/page.tsx`).
- Do not deploy from here without Manu's explicit OK.
