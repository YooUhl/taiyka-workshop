# Le Brief — Deliverability Setup (action items for Manu)

This is the checklist to make Le Brief land in inboxes (not spam / Promotions). Sending is via **Resend** from `send.taiyka.com`, DNS on **Cloudflare**. SPF + DKIM are already live (added when the domain was verified in Resend). What's missing is **DMARC**, **Google Postmaster**, and a **warmup ramp**.

Priority order: 1 (DMARC) → 2 (Postmaster) → 3 (mail-tester) → 4 (warmup). Do 1–3 before sending to any real subscribers.

---

## 1. Add the DMARC record in Cloudflare  ← do this first

Cloudflare → DNS → Records → **Add record**:

```
Type:  TXT
Name:  _dmarc
Content: v=DMARC1; p=none; rua=mailto:dmarc@taiyka.com; ruf=mailto:dmarc@taiyka.com; fo=1; adkim=r; aspf=r; pct=100; sp=none
TTL:   Auto
Proxy: (TXT records have no proxy toggle — nothing to set)
```

- `Name` = just `_dmarc` (Cloudflare appends `.taiyka.com` → becomes `_dmarc.taiyka.com`). This org-level record covers `send.taiyka.com` and every future subdomain.
- `p=none` = **monitor only** (nothing gets rejected yet — you just collect reports). This is the safe starting point and satisfies Gmail/Yahoo's bulk-sender requirement.
- Make sure the mailbox `dmarc@taiyka.com` exists (or swap it for a real inbox you read). Raw DMARC XML is noisy — consider a free aggregator later (Postmark DMARC Digests, dmarcian, EasyDMARC) so it's readable.

**Later (after ~3 weeks of clean reports):** tighten to `p=quarantine` then `p=reject`. Don't rush it.

## 2. Register Google Postmaster Tools

Go to **postmaster.google.com**, add `taiyka.com`, verify with the TXT record it gives you (paste in Cloudflare same as above). This is the free dashboard that shows your Gmail spam-complaint rate and domain reputation — the single best early-warning signal. Keep spam complaints **under 0.3%** (ideally under 0.1%).

## 3. Run a spam-score test (mail-tester)

Once there's real content to send:
1. Go to **mail-tester.com**, copy the throwaway address it shows.
2. Send a real Le Brief issue to that address (from the live pipeline).
3. Click "check your score." **Target 9/10 or 10/10.** Fix whatever it flags before sending to the real list.

The email already ships with the things mail-tester checks for: a plain-text version, a physical address in the footer, a working unsubscribe, and (see below) the one-click unsubscribe header.

## 4. Warm up the sending domain (don't blast the full list on day one)

`send.taiyka.com` is a fresh sending domain with zero reputation. Ramp slowly:

| Phase | Days | Volume/day | Send to |
|---|---|---|---|
| Seed | 1–3 | 5–20 | Your own inboxes (Gmail, Outlook, Yahoo, iCloud). **Open, reply, drag to Primary, mark "Not spam," add sender to contacts.** |
| Friends | 4–7 | 20–50 | Colleagues/friends who'll actually open |
| Engaged | Week 2 | 50–150 | Most engaged real subscribers |
| Ramp | Weeks 3–4 | ~double every 2–3 days | Expand outward |
| Full | Week 5+ | Full list | Everyone; keep pruning non-openers |

Rule: never more than ~2× the previous day. Early opens/replies build reputation faster than volume.

---

## Already handled in the pipeline (no action needed)

- **One-click unsubscribe (RFC 8058):** each issue now sends the `List-Unsubscribe` + `List-Unsubscribe-Post: List-Unsubscribe=One-Click` headers (Gmail/Yahoo require this for bulk). Plus a visible unsubscribe link in the footer.
- **Plain-text part:** every email goes out multipart (HTML + text) — a common spam flag when missing, now covered.
- **Physical address in footer:** `Taiyka · 180 Montée de Bellevue, 83210 Solliès-Pont, France` (CAN-SPAM / RGPD requirement).
- **Few links, text-heavy, image-free:** good for deliverability by default.

## How to verify SPF/DKIM are still passing

After the first real send, open the email in Gmail → **⋮ → Show original**. You want:
```
SPF:   PASS
DKIM:  PASS
DMARC: PASS
```
If any fails, the sending address must be `@send.taiyka.com` (alignment breaks if you send from a different domain).
