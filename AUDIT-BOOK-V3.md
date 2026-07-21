# AUDIT-BOOK-V3 — Consolidated /book audit (2026-06-30)

**Scope:** `/book` qualification flow + `/api/book` POST + Calendly handoff.
**Baseline:** first-pass audit shipped 22 fixes 2026-06-21. This is second pass.
**Method:** 6 parallel agents (Backend / Frontend / Security / Copy / Edge / CRO).
**Raw reports:** `audit-tmp/A1-backend.md` · `A2-frontend.md` · `A3-security.md` · `A4-copy.md` · `A5-edge.md` · `A6-cro.md`.

**Triage totals after dedupe:** 22 P0 · 31 P1 · 24 P2 · 14 P3 = **91 findings**.

---

## P0 — Ship before any further /book promotion (22)

### Backend / data integrity

**P0-1 · Pool only cached in dev — prod leaks connections** [A1]
`web/lib/book/db.ts:34`. `global.__bookPgPool` set only when `NODE_ENV !== "production"`. Every prod request creates a new `Pool`, leaks conns, exhausts Supabase.
**Fix:** drop the NODE_ENV guard. Always cache to global.

**P0-2 · Rate-limit Map never evicts — unbounded memory** [A1]
`web/lib/book/rate-limit.ts:6`. Entries accumulate across deploys. Long-lived instances OOM.
**Fix:** prune entries older than `WINDOW_MS` on each call, or use TTL Map.

**P0-3 · Rate-limit Map per-instance on Vercel — useless under load** [A1 · A3 · A5]
Each serverless instance has its own Map. Effective limit = 5 × N warm instances.
**Fix:** Upstash Redis / Vercel KV with `@upstash/ratelimit`, or push counter into Postgres.

**P0-4 · UNIQUE(email,source) → silent 500 for every returning user** [A1 · A5]
`web/sql/003_book.sql:30` + `route.ts:179`. Returning user hits constraint violation, sees generic "Database insert failed", stuck forever.
**Fix:** branch on pg code `23505` → treat as success, return existing `calendlyUrl`. Or change SQL to `on conflict (email, source) do nothing`.

### Security

**P0-5 · Trivial rate-limit bypass via spoofed X-Forwarded-For** [A1 · A3 · A5]
`route.ts:119`. Code splits XFF on `,` and takes first value. Vercel APPENDS real IP at end. Client-supplied prepended values win → spoof random IPv4 per request, bypass 5/min.
**Fix:** read LAST entry of XFF, or use `x-vercel-forwarded-for` (Vercel-rewritten, can't be spoofed).

**P0-6 · Zero bot defense — no CAPTCHA, no honeypot** [A3]
Endpoint shape public via shipped JS. Naive fetch loop from residential proxies floods DB with junk leads, poisons future cold-email lists.
**Fix:** Cloudflare Turnstile (free, invisible) verified server-side + hidden honeypot field (`name="company_website"`, off-screen). Both together kill 99% bots.

### Frontend / state machine

**P0-7 · localStorage cleared on submit BEFORE Calendly loads** [A2 · A5 · A6]
`book-client.tsx:220`. Submit succeeds → wipe draft. If Calendly script fails (ad-block, CSP, in-app browser), user sees empty white box. Refresh restarts from Q1 with no data.
**Fix:** move `removeItem` into `booked` effect — only clear once `event_scheduled` postMessage fires. Add fallback `<a href={calendlyUrl} target="_blank">` link below iframe mount.

**P0-8 · Lang switch wipes all answers (separate storage key per lang)** [A2 · A5]
`book-client.tsx:57`. `getStorageKey(lang)` returns `taiyka:book:answers:fr` vs `:en` — different keys. Switching mid-flow loads empty draft from other-lang key, user starts over.
**Fix:** unify key to `taiyka:book:answers` (data is language-agnostic enums + free text). Migrate from per-lang on hydrate.

**P0-9 · Phase not persisted — refresh after error restarts entire flow** [A2 · A5]
`book-client.tsx:70`. Phase is pure component state. Server 500 → refresh → back to Q1, click through Q1→Q2→Q3→contact again before retry possible.
**Fix:** persist `phase` in localStorage alongside answers. On hydrate, auto-resume to last incomplete phase.

**P0-10 · Browser back button leaves site instead of stepping phases** [A5]
No URL sync of phase. Intuitive back nav = exit site → answers vanish from view.
**Fix:** wire phase to `?step=q2` search param via `useSearchParams`. Browser back walks phases naturally.

### Calendly integration

**P0-11 · No Calendly webhook — booking confirmations rely on browser postMessage** [A3 · A5]
Tab closes before postMessage → booking exists in Calendly + Google Calendar, our DB doesn't know. Reschedules/cancellations never sync. Returning user submits duplicate → hits P0-4.
**Fix:** subscribe Calendly webhook (`invitee.created`, `invitee.canceled`) to `/api/book/calendly-webhook`. Webhook = source of truth. postMessage = UI hint only.

### Copy / conversion

**P0-12 · Q1 audience includes "Salarié" + "Étudiant" — bring unqualified leads** [A4]
`content.ts:82-87`. Persona doc says entrepreneurs only. Currently inviting employees + students into paid call qualification.
**Fix:** FR `Chef d'entreprise / Indépendant ou freelance / Je lance mon projet / Autre`. EN equivalent.

**P0-13 · Q3 placeholder examples narrow funnel to LinkedIn/IG DM use-cases** [A4]
`content.ts:97-98`. Restaurant owner, accountant, coach reads it and bounces. Audience is "tout secteur confondu".
**Fix:** FR `"Par exemple : automatiser le suivi de mes devis et factures, qualifier mes leads entrants, ou créer un agent qui répond aux demandes clients la nuit…"`. EN equivalent.

**P0-14 · Q2 "Perso" / "Collaboration" labels too vague — invites unqualified leads** [A4]
`content.ts:90-94`. Ambiguous choices reduce qualification signal.
**Fix:** FR `Pour mon entreprise / Pour un side-project / Un partenariat ou collab pro`. EN equivalent.

**P0-15 · `calendlyMissing` fallback hides a real failure as success** [A4]
`content.ts:122-124`. When backend returns no `calendlyUrl`, user sees green ✅ + promise of manual email follow-up Manu has no automation for. Also `"Réservé reçu"` is grammatically wrong FR.
**Fix:** FR title `"Bien reçu"` + blurb `"Tes réponses sont enregistrées. Je t'envoie un lien de réservation manuellement sous 24h ouvrées — check tes spams."`. Confirm Manu actually does this.

**P0-16 · Step indicator math broken — `4` total but contact step hidden** [A4 · A6]
`book-client.tsx:247`. User sees `Étape 3 / 4` then nothing on contact phase. Math doesn't match experience.
**Fix:** drop `phase !== "contact"` exclusion. Show `Étape 4 / 4` on contact. Kill redundant `contactKicker` "Dernière étape".

### CRO

**P0-17 · No pre-form context — visitor lands cold inside Q1** [A6]
No hero, no outcome promise, no agenda, no author photo. Cold IG/TikTok visitor bounces in 2s.
**Fix:** add hero above Q1 — H1 with outcome, subline with deliverable, micro-line with logistics. Suggested FR: `"30 min avec Manu — on cadre ta première (ou prochaine) automatisation IA. Tu repars avec un plan concret : quel workflow attaquer en premier, quels outils, et un ordre de grandeur de temps/budget. Gratuit, sans engagement."`

**P0-18 · Q3 free-text wall is the funnel's biggest mid-flow killer** [A6]
20-char min free-text on mobile soft-keyboard. Many qualified buyers don't have crisp language — that's why they're booking. Forcing articulation inverts value exchange.
**Fix (ranked):** (1) move to Calendly custom question (post-commit, 3-5x lower drop), (2) make optional with "Je préfère t'en parler de vive voix" skip, (3) keep + lower min to 10 chars + add clickable example pills.

**P0-19 · Zero social proof / authority signal — cold form on cold page** [A6]
No photo, no name, no past-client names, no testimonials. Visitor from 30s TikTok has no way to verify Manu.
**Fix:** compact author strip in hero. Avatar + `"Manu — Taiyka. J'ai construit l'automatisation concurrentielle de Polymaker, le SaaS gym UFC Wallis & Futuna, et le système d'outreach IA pour @manu_ai.to (15k+ abonnés)."`

**P0-20 · No risk reversal — visitor assumes worst-case sales pitch** [A6]
No "free, no commitment", no "not a sales call", no escape hatch. Fence-sitters bounce.
**Fix:** add to hero `"Pas un appel de vente. Si je peux pas t'aider, je te pointe vers une ressource gratuite et on se sépare bons amis."` Reinforce in contact-step blurb.

**P0-21 · Submit CTA "Choisir un créneau" promises calendar that may not load** [A4]
`content.ts:115`. If backend returns no `calendlyUrl`, CTA was a lie.
**Fix:** FR `"Valider et choisir mon créneau"`. EN `"Confirm and pick my slot"`. Verb shift breaks the false promise.

**P0-22 · Calendly customAnswers a1/a2 leak free-text projectDescription via URL** [A3]
`book-client.tsx:153-156`. Up to 2000 chars of confidential project context → Calendly URL → browser history + Calendly logs + Referer header. Manu's leads' confidential business problems sit in 3 third-party logs.
**Fix:** stop prefilling a1/a2. Manu already has the context in his own DB. Only prefill name + email (Calendly needs them to book).

---

## P1 — This sprint (31)

### Backend / API

**P1-1 · Error log exposes pg error code + message → PII in Vercel logs** [A1 · A3]
`route.ts:175-178`. pg errors echo offending values (`Key (email)=(victim@gmail.com) already exists`). Vercel logs indexed/searchable indefinitely by anyone with project access.
**Fix:** log only `err.code` (SQLSTATE). Strip `message`, `detail`, `hint`, `where`. Add log drain to SIEM with retention.

**P1-2 · No email length cap in validator** [A1 · A3]
`content.ts:212`. Regex matches `aaa...@bbb...com` of arbitrary length. DB cap is 320, validator never checks. 50MB email field passes regex before DB rejection — wastes serverless CPU.
**Fix:** `EMAIL_MAX = 320` in content.ts. Check `email.length <= EMAIL_MAX` before regex. Enforce client `maxLength`.

**P1-3 · No request body size limit** [A3]
`route.ts:128-136`. `request.json()` accepts any size. 100MB POST → Node buffers, parses, returns 400. Repeated → memory pressure + Vercel bill.
**Fix:** `request.text()` first, check `body.length <= 16384`, then `JSON.parse`. Or `Content-Length` header check at handler top.

**P1-4 · No security headers (CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy)** [A3]
`next.config.ts:10-22`. Only cache headers on `/og/*`. Site iframable (clickjacking), full Referer leak, no XSS defense, no feature constraint.
**Fix:** add global `headers()` block for `/(.*)`:
- `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://assets.calendly.com; frame-src https://calendly.com; connect-src 'self' https://calendly.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
- `X-Content-Type-Options: nosniff`

**P1-5 · pg connection uses `rejectUnauthorized: false` — MITM-able** [A3]
`db.ts:23`. TLS verification disabled. Any network attacker on Vercel→Supabase pooler path can intercept all booking inserts cleartext.
**Fix:** use Supabase CA bundle. `ssl: { ca: SUPABASE_CA_PEM, rejectUnauthorized: true }`.

**P1-6 · Pool max=5 with no connectionTimeoutMillis — burst stalls** [A1]
`db.ts:21-26`. 6+ concurrent submits queue. Slow query blocks entire instance.
**Fix:** `connectionTimeoutMillis: 5000`. Switch to Supabase pooled URL (port 6543).

**P1-7 · 500 on transient DB error consumes rate limit, blocks retry** [A1]
`route.ts:164-183`. Transient pg failure → 500 (non-retryable). Rate limit already counted, user can't retry.
**Fix:** detect transient errors (ECONNREFUSED, timeout) → return 503 + don't count toward rate limit.

**P1-8 · projectDescription CHECK constraint allows 1-char string, route requires 20** [A1]
`sql/003_book.sql:18`. DB CHECK is `between 1 and 2000`. Mismatch with route validation (20-2000). Any insert bypassing route accepts 1-char.
**Fix:** update CHECK to `between 20 and 2000`.

**P1-9 · UNIQUE(email,source) lets attackers enumerate registered emails via timing** [A3]
Duplicate-key violations return faster than fresh inserts (index detects conflict early). Attacker times responses → enumerates Manu's client list.
**Fix:** constant-time response (sleep to minimum bound), OR use `on conflict do nothing returning id`, treat both paths identically with 200.

### Frontend

**P1-10 · Calendly postMessage origin check too strict / brittle** [A2 · A3]
`book-client.tsx:121-130`. Trusts any `calendly.event_scheduled` from `calendly.com` origin with no payload verification. Future Calendly version change or extension injection → false "booked" state.
**Fix:** verify payload (event URI, invitee ID). Use webhook (P0-11) as source of truth.

**P1-11 · localStorage written on every keystroke — no debounce, no quota handling** [A2]
`book-client.tsx:108-116`. Storage quota fills silently. Private mode users lose draft.
**Fix:** debounce 300ms. Warn on `setItem` failure.

**P1-12 · Submit-fail leaves stale localStorage that re-hydrates next session** [A2]
`book-client.tsx:189-230`. Failed submit → user retries → restores old data.
**Fix:** version localStorage keys or only clear on `event_scheduled`.

**P1-13 · isContactValid email regex too permissive — UX flickers between valid/error** [A2]
`book-client.tsx:177-183`. Regex passes `john@example.c`. User sees button enable, API rejects.
**Fix:** validate on blur with stricter regex, OR add invalid-state styling per-field.

**P1-14 · Field component lacks per-field error display** [A2]
`book-client.tsx:562-569`. API validation errors render as single `<p>` below all fields. User doesn't know which field failed.
**Fix:** pass error keyed by field name. Render per-field error below each input.

**P1-15 · Q1 auto-advances without confirmation, no Back button on Q1** [A2]
`book-client.tsx:261-275`. Fat-finger select → phase flips, must back from Q2 to undo.
**Fix:** add Back to Q1 (to home), or wrap auto-advance in 300ms confirmation.

**P1-16 · Top-bar Back link omits `?lang=en`** [A2]
`book-client.tsx:247-257`. User on `/book?lang=en` → back → lands FR home.
**Fix:** use `withLang` helper.

**P1-17 · Calendly mount missing `window.Calendly` guard** [A2]
`book-client.tsx:136-165`. Script fails → mount stays empty, no error.
**Fix:** check `window.Calendly` after script load. Show retry / fallback link.

**P1-18 · Calendly mount minWidth 320 causes horizontal scroll at 375px** [A2]
`book-client.tsx:446-456`. iPhone SE landscape (~280px viewport) compounded with chrome.
**Fix:** wrap in `overflow-x-hidden` + `width: 100%`. Drop minHeight on landscape via media query.

**P1-19 · Char count at max 2000 has no visual warning, no aria-live** [A2]
`book-client.tsx:317-319`. Mobile soft keyboard hides count.
**Fix:** color shift red at 90%+. Add `aria-live` polite announce.

**P1-20 · Q3 textarea maxLength silently truncates paste** [A5]
User pastes 5000 chars from Notion → silently truncated to 2000, ends mid-word.
**Fix:** remove `maxLength`, allow paste, show "Trimmed at 2000 — please summarize" warning when over.

**P1-21 · `headingRef.current?.focus()` on every phase scrolls page on mobile keyboards** [A5]
`book-client.tsx:88-90`. iPhone Safari → focus jumps to h1, virtual keyboard closes, user re-scrolls + re-taps.
**Fix:** `focus({ preventScroll: true })`. Only focus on initial mount + after errors.

**P1-22 · `useEffect` Calendly init missing `lang` dep — locale switch breaks** [A5]
Switching lang on calendly phase = full nav → empty other-lang storage → restart from Q1.
**Fix:** unify storage key (P0-8). Re-init Calendly with new locale on lang change.

### Calendly / integration

**P1-23 · Calendly script loaded only after submit — 3-5s blank wait** [A6]
Visitor submits, sees empty white box for script + iframe handshake. Some reload (and lose state per P0-7), others bounce.
**Fix:** preload Calendly script on contact-phase entry. Add skeleton + "Préparation de tes créneaux…" copy. 10s timeout → fallback link.

**P1-24 · Calendly init guard not robust against StrictMode double-render** [A5]
`book-client.tsx:136-165`. Reset effect flips `calendlyInitialized.current` back to false on phase change. StrictMode double-invocation could double-init.
**Fix:** `replaceChildren()` before init. Or use DOM marker `data-initialized` on mount element.

### Rate-limit / abuse

**P1-25 · Rate-limit oldest-window uses `recent[0]` — clock-jump unsafe** [A5]
NTP correction / container clock skew → `recent[0]` no longer minimum.
**Fix:** `const oldest = Math.min(...recent);`.

**P1-26 · NAT collision blocks legit users — shared corporate / mobile IPs hit limit** [A5]
5 colleagues on office NAT submit within a minute → 6th legit user 429s.
**Fix:** add second signal (signed token, email hash) to dedupe besides IP.

### Copy / voice

**P1-27 · Q1 "Tu es ?" / "You are?" lands cold, abrupt EN** [A4]
`content.ts:81`. Two-word question, no warmth. EN parses as broken English.
**Fix:** FR `"D'abord, tu fais quoi ?"`. EN `"First — what do you do?"`.

**P1-28 · Contact blurb uses corporate "on", drifts from Manu's first-person voice** [A4]
`content.ts:103-104`. "On t'envoie" generic SaaS.
**Fix:** FR `"Je prépare ton appel à partir de tes réponses. La confirmation arrive par email juste après."` EN `"I prep your call from your answers. Confirmation lands in your inbox right after."`

**P1-29 · "Réservé reçu ✅" is grammatically wrong FR** [A4]
`content.ts:122`. "Réservé" is past participle of *réserver*, not a noun.
**Fix:** `"Bien reçu ✅"`.

**P1-30 · Booked-success copy reads like SaaS auto-confirmation, not Manu** [A4]
`content.ts:126-129`. Generic confirmation, no personal touch.
**Fix:** FR kicker `"Bien joué"` title `"On est calés"` blurb `"À très vite. Le mail de confirmation arrive avec le lien — check tes spams au cas où. Prépare 1 ou 2 questions concrètes, on attaque direct."`

**P1-31 · No 429 rate-limit message — falls back to generic error** [A4]
User hitting rate limit sees "Une erreur est survenue", assumes site broken.
**Fix:** add `errorRateLimit` key. FR `"Tu as déjà envoyé ta demande. Si tu n'as rien reçu dans 5 min, écris-moi à manu.uhila@taiyka.com."` Wire in `book-client.tsx` via `res.status === 429`.

---

## P2 — Next sprint (24)

### Backend / Security

**P2-1 · PII in localStorage indefinitely** [A3]
Form draft (name + email + free-text) persists post-abandon. Future 3rd-party script could `localStorage.getItem`.
**Fix:** persist only enums (role, projectType, lang) to localStorage. PII in memory only. Or `sessionStorage`.

**P2-2 · No GDPR retention policy — Manu is in France** [A3]
No auto-purge, no privacy notice on /book. Right-to-erasure with no process.
**Fix:** privacy line under contact step with link to policy. Postgres `pg_cron` job: `delete from book.qualifications where created_at < now() - interval '12 months'`. Document retention in SQL comment.

**P2-3 · user_agent stored verbatim — fingerprint surface** [A3 · A5]
GDPR-adjacent.
**Fix:** drop entirely, OR hash `sha256(ua + secret).slice(0,12)`.

**P2-4 · No CSRF Origin/Referer check** [A3]
Defense-in-depth. Today low impact, becomes exploitable if auth ever added.
**Fix:** reject if `Origin` is set and not in allowlist (taiyka.com / taiyka-workshop.vercel.app / localhost).

**P2-5 · Calendly iframe loaded without `sandbox` / restricted permissions** [A3]
Iframe inherits full parent permissions.
**Fix:** Permissions-Policy on parent (covered in P1-4 headers). Confirm Calendly's required permissions list.

**P2-6 · Email validation accepts internal unicode whitespace** [A1]
U+00A0 not stripped by `trim()`, matches `\s` in regex.
**Fix:** stricter email check after trim — reject any internal whitespace.

**P2-7 · pg ssl: rejectUnauthorized: false silent in dev** [A1]
No warning logged. (Related to P1-5 prod fix.)
**Fix:** document why, or gate on prod.

**P2-8 · Email case not normalized — duplicate rows for same person** [A5]
`Manu@x.com` ≠ `manu@x.com` for UNIQUE constraint.
**Fix:** `result.data.email.toLowerCase()` before insert. Also lowercase before regex.

**P2-9 · NAME_MIN=1 / LOCATION_MIN=1 too permissive** [A1 · A5]
`"."` passes name validation, `"X"` passes location.
**Fix:** NAME_MIN=2, LOCATION_MIN=3 + `\p{L}` letter requirement.

**P2-10 · Pool exhaustion under burst not mitigated** [A5]
20 simultaneous submits → 5 connections per instance → queue.
**Fix:** lower `max` for short-lived serverless. Use Supabase pooler (port 6543).

### Frontend / UX

**P2-11 · Submit button no spinner / visual disabled state during submit** [A2]
`book-client.tsx:382-394`. "Envoi…" text only.
**Fix:** add `opacity-60 pointer-events-none` + spinner icon.

**P2-12 · No real-time inline field validation** [A2]
`book-client.tsx:376-379`. Errors appear only on submit click.
**Fix:** validate on blur. Red underline + per-field message.

**P2-13 · Hint text not linked to input via aria-describedby** [A2]
`book-client.tsx:557-574`. Screen readers don't announce hints.
**Fix:** add `aria-describedby` + matching `id` on hint span.

**P2-14 · Heading `tabIndex={-1}` is keyboard-inaccessible** [A2]
`book-client.tsx:88-90`. May cause SR skip.
**Fix:** test with VoiceOver. Use `focus({preventScroll:true})` — covered in P1-21.

**P2-15 · CSS opacity animation requires JS — blank flash if JS fails** [A2]
`book-client.tsx:235`.
**Fix:** initial opacity 1, animation as enhancement.

**P2-16 · ChoiceList buttons lack explicit aria-label** [A2]
`book-client.tsx:520-536`.
**Fix:** add explicit `aria-label`.

**P2-17 · Stale localStorage schema silently merged — future enum rename breaks** [A5]
Hydrate merges parsed into EMPTY. Old enum keys persist, server rejects.
**Fix:** version key `taiyka:book:answers:v2`. Wipe on mismatch.

**P2-18 · Corrupt JSON in localStorage silently resets** [A5]
User loses draft with no notification.
**Fix:** show "we couldn't restore your saved progress" on catch.

**P2-19 · Two tabs of /book → second tab silently overwrites first** [A5]
Both tabs share localStorage key, no cross-tab sync.
**Fix:** listen for `storage` event. Toast "draft updated in another tab".

**P2-20 · Calendly `customAnswers.a1/a2` hard-coded to position** [A5]
If Manu reorders questions in Calendly dashboard, prefill maps to wrong question.
**Fix:** code comment with required Calendly ordering. Add to deploy checklist. Use Calendly named-question feature if available.

**P2-21 · Validation server returns issues[] but UI shows only first** [A5]
`book-client.tsx:213`. Other invalid fields stay unhighlighted.
**Fix:** lift `issues[]` into state. Pass to Field components.

### Copy / CRO

**P2-22 · Location field is friction with false justification** [A6]
Calendly auto-detects timezone. Hint "pour gérer le décalage horaire" is technically false.
**Fix:** cut OR make optional. If kept, change hint to honest reason.

**P2-23 · Lang switch in top-bar competes with primary CTA + accidental click resets form** [A6]
Plus per P0-8, click wipes everything.
**Fix:** hide lang switch on /book (user already chose via home click-through).

**P2-24 · Booked-confirmation screen is dead-end — peak commitment moment wasted** [A6]
Only CTA "Retour à l'accueil".
**Fix:** "While you wait" section: download free n8n workflows (call prep framing) → Skool → IG. Three small links below primary CTA.

---

## P3 — Polish (14)

**P3-1 · created_at index enables enumeration if read endpoint ever exposed** [A3]
Dormant. Add comment in schema.

**P3-2 · Supply chain — quarterly `npm audit`** [A3]
Subscribe Dependabot.

**P3-3 · Document `runtime = "nodejs"` requirement (pg dep)** [A3]
Prevents future edge-runtime migration breakage.

**P3-4 · NAME_MAX/MIN tightening + compound index for future analytics** [A1]
Low priority.

**P3-5 · Email placeholder "tonemail@exemple.com" awkward** [A4]
`content.ts:108`. Fix: `"ton.email@exemple.com"` or `"prenom@exemple.com"`.

**P3-6 · Name placeholder "Manu Uhila" — self-referential** [A4]
`content.ts:106`. Fix: `"Jean Dupont"` / `"Jane Doe"`.

**P3-7 · `errorRequired` defined but never rendered** [A4]
Dead string. Either wire to per-field on-blur error, or delete.

**P3-8 · `retry` key defined but never used** [A4]
Wire to retry button on error, or delete.

**P3-9 · Add timezone hint above Calendly widget** [A4 · A5]
FR `"Les créneaux s'affichent dans ton fuseau horaire (modifiable en haut du calendrier)."`

**P3-10 · `errorEmail` "Email invalide." — no recovery hint** [A4]
Fix: FR `"Cet email a l'air cassé — vérifie le @ et le point com."`

**P3-11 · `errorLength` passive impersonal — robotic** [A4]
Fix: FR `"Entre ${min} et ${max} caractères, stp."`

**P3-12 · Email field needs `autoCapitalize="none"` + `autoCorrect="off"` on iOS** [A5]
`book-client.tsx:540-575`.

**P3-13 · Pre-render `<p role="alert" aria-live="assertive">` always** [A5]
Better SR support than conditional render.

**P3-14 · No `/api/book/health` for uptime monitor** [A5]
Add HEAD endpoint returning 200/503.

---

## Cross-cutting themes

1. **Stale state recovery is broken in 4 distinct ways** — P0-7, P0-8, P0-9, P0-10 all share the same root cause: state is purely component-local, persistence is fragile. A single refactor (URL-sync phase + unified storage key + persist-until-booked) closes all four.

2. **Rate limit is theatrical** — P0-2 (memory leak) + P0-3 (per-instance) + P0-5 (XFF spoof) + P1-25 (clock jump) + P1-26 (NAT collision) make the current implementation worse than nothing (false sense of security). Either rip it out or migrate to Upstash.

3. **Calendly integration assumes happy path** — P0-7, P0-11, P1-17, P1-22, P1-23 all stem from no fallback when Calendly script fails to load or postMessage doesn't fire. Calendly webhook + script preload + ad-block detection close most of them.

4. **Copy is in "competent SaaS" mode, not "Manu" mode** — P0-12 through P0-16, P1-27 through P1-31 all symptoms of generic copy. Voice docs `style-guide.md` say "intéresser, jamais vendre" + "ancrage personnel" — current copy is impersonal/formal.

5. **CRO foundations missing** — P0-17 through P0-20 (pre-form context, social proof, authority, risk reversal) are unrelated to the engineering audit but stack-rank as highest expected lift. They're cheap to ship.

---

## Recommended next move

Don't fix all 91 at once. Sprint plan:

- **Sprint A (P0-only, ~1 day):** all 22 P0 items. Split across 2-3 builder agents in parallel (backend / frontend / copy lanes).
- **Sprint B (P1, ~2-3 days):** 31 P1 items. Same parallel split.
- **Sprint C (P2/P3, opportunistic):** as time allows.

Most P0s fall into 4 surgical patches:
1. Backend safety patch (P0-1 to P0-6) — single file edits, single test pass.
2. State recovery refactor (P0-7 to P0-11) — book-client.tsx + a webhook route.
3. Copy + CRO overhaul (P0-12 to P0-22) — content.ts rewrite + book-client hero block.
4. Calendly hardening (P0-7, P0-11, P0-22) — overlap with above; webhook is the new file.

---

## Source agents

- A1 Backend — `audit-tmp/A1-backend.md`
- A2 Frontend — `audit-tmp/A2-frontend.md`
- A3 Security — `audit-tmp/A3-security.md`
- A4 Copy — `audit-tmp/A4-copy.md`
- A5 Edge — `audit-tmp/A5-edge.md`
- A6 CRO — `audit-tmp/A6-cro.md`
