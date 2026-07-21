# Belvédère logo — Path A (unified golden B)

**Decision 2026-06-12:** ditched the AI-modified personal photo route. Single brand mark across all touchpoints (sales site favicon + IG profile + TikTok profile + future merch). Calitures-style brand consistency.

## Source

- SVG: `belvedere-logo.svg` (canonical, single source of truth)
- Also lives at `Belvedere/public/favicon.svg` in the sales site repo. Keep both in sync if the design ever changes.

## Specs

- Background: navy gradient `#0E1623 → #070C16`, rounded square, 6px corner radius on 32px viewBox.
- Mark: golden serif "B", Cormorant Garamond, gradient `#E89B5C → #C97B3A`, weight 500, centered.

## Rendered exports

| File | Size | Use |
|---|---|---|
| `belvedere-logo-FINAL.png` | 1080×1080 | **IG + TT profile upload source.** This is the one to upload. |
| `belvedere-logo-1080.png` | 1080×1080 | Same as FINAL (kept as backup). |
| `belvedere-logo-512.png` | 512×512 | General web / social fallback. |
| `belvedere-logo-320.png` | 320×320 | IG display-size readability check. |
| `belvedere-logo-40.png` | 40×40 | Feed-thumbnail readability check. |

## Verification done

- ✅ Renders cleanly at 320px (display size).
- ✅ "B" readable even at 40×40 (feed thumbnail).
- ✅ Already shipping as favicon on the Belvédère sales site.

## Next steps for Manu

1. Upload `belvedere-logo-FINAL.png` as profile picture on:
   - Instagram `@belvedere.paris`
   - TikTok `@belvedereparis`
2. (Optional) Use the same image for any future Twitter/X, YouTube, email signature, merch.

## Regeneration

If the SVG ever changes, re-run `Belvedere/scripts/render-belvedere-logo.mjs` from the Belvedere project root to regenerate all PNG sizes.
