export type Lang = "fr" | "en";

export const EMAIL_MAX = 320;

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value);
}

/** Normalize an email for storage + dedup: trim + lowercase. */
export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

/** Ticker strings shared by the /brief surfaces (landing, confirmed, unsubscribe). */
export const BRIEF_TICKER: Record<Lang, string[]> = {
  fr: [
    "L'IA qui compte, tous les 2 jours",
    "2 minutes de lecture",
    "Désinscription en 1 clic",
  ],
  en: [
    "The AI that matters, every 2 days",
    "2-minute read",
    "One-click unsubscribe",
  ],
};

// Brand tokens (mirror the site's Taiyka palette; site is debranded to "L'Atelier"
// as a display name, so emails sign off as Le Brief / @manu_ai.to, not "Taiyka").
const NAVY = "#0a1628";
const BLUE = "#00a6ff";
const TEXT = "#e8f0fe";
const MUTED = "#8fa3bd";

/**
 * Double-opt-in confirmation email. FR-only for V1 (EN kept for V2 parity).
 * `confirmUrl` points at /api/brief/confirm?token=...
 */
export function buildConfirmEmail(
  confirmUrl: string,
  lang: Lang = "fr",
): { subject: string; html: string; text: string } {
  const copy =
    lang === "en"
      ? {
          subject: "Confirm your subscription to Le Brief",
          preheader: "One click and you're in.",
          heading: "One more click",
          body: "Click the button to confirm your subscription to Le Brief — here's what's coming.",
          expect: [
            {
              label: "📅 Every other day",
              text: "the AI news that actually matters. Not every day — just when it's worth it.",
            },
            {
              label: "⚡ 2 minutes flat",
              text: "3-4 stories decoded in a few lines, the rest in brief. Not just links.",
            },
            {
              label: "🇫🇷 In French, free",
              text: "and one-click unsubscribe whenever you want, no hard feelings.",
            },
          ],
          button: "Confirm my subscription",
          nudge:
            "Tip: drag Le Brief into your Primary tab, or add brief@send.taiyka.com to your contacts, so no issue lands in Promotions.",
          ignore:
            "If you didn't sign up, just ignore this email — nothing happens without your confirmation.",
          signoff: "See you in your inbox,",
        }
      : {
          subject: "Confirme ton inscription à Le Brief",
          preheader: "Un clic et c'est bon.",
          heading: "Plus qu'un clic",
          body: "Clique sur le bouton pour confirmer ton inscription à Le Brief — et voici ce qui t'attend.",
          expect: [
            {
              label: "📅 Un jour sur deux",
              text: "l'actu IA qui compte vraiment. Pas tous les jours — juste quand ça vaut le coup.",
            },
            {
              label: "⚡ 2 minutes chrono",
              text: "3-4 news décryptées en quelques lignes, le reste en bref. Pas juste des liens.",
            },
            {
              label: "🇫🇷 En français, gratuit",
              text: "et désinscription en un clic quand tu veux, sans rancune.",
            },
          ],
          button: "Confirmer mon inscription",
          nudge:
            "Astuce : glisse Le Brief dans ta boîte Principale, ou ajoute brief@send.taiyka.com à tes contacts, pour qu'aucun numéro ne finisse dans Promotions.",
          ignore:
            "Si tu ne t'es pas inscrit, ignore cet email — rien ne se passe sans ta confirmation.",
          signoff: "À très vite dans ta boîte,",
        };

  // Postal address + privacy link footer (CNIL transparency + deliverability).
  // Derive the origin from confirmUrl so this stays a pure function.
  const origin = (() => {
    try {
      return new URL(confirmUrl).origin;
    } catch {
      return "";
    }
  })();
  const privacyUrl = origin ? `${origin}/privacy?lang=${lang}` : "#";
  const footer =
    lang === "en"
      ? { addr: "Taiyka · 180 Montée de Bellevue, 83210 Solliès-Pont, France", privacy: "Privacy" }
      : { addr: "Taiyka · 180 Montée de Bellevue, 83210 Solliès-Pont, France", privacy: "Confidentialité" };

  const expectHtml = copy.expect
    .map(
      (item) =>
        `<tr><td style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.55;padding-bottom:14px;"><span style="color:${TEXT};font-weight:700;">${item.label}</span> <span style="color:${MUTED};">— ${item.text}</span></td></tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="${lang}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${NAVY};">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${copy.preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${NAVY};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
        <tr><td style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${MUTED};font-size:12px;letter-spacing:0.18em;text-transform:uppercase;padding-bottom:20px;">Le Brief</td></tr>
        <tr><td style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${TEXT};font-size:22px;font-weight:700;line-height:1.3;padding-bottom:16px;">${copy.heading}</td></tr>
        <tr><td style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${MUTED};font-size:15px;line-height:1.6;padding-bottom:24px;">${copy.body}</td></tr>
        ${expectHtml}
        <tr><td style="padding-top:12px;padding-bottom:28px;">
          <a href="${confirmUrl}" style="display:inline-block;background:${BLUE};color:${NAVY};font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:8px;">${copy.button}</a>
        </td></tr>
        <tr><td style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${TEXT};font-size:13px;line-height:1.6;padding-bottom:16px;">${copy.nudge}</td></tr>
        <tr><td style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${MUTED};font-size:12px;line-height:1.6;padding-bottom:8px;">${copy.ignore}</td></tr>
        <tr><td style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${MUTED};font-size:13px;line-height:1.6;padding-top:20px;">${copy.signoff}<br>Manu · @manu_ai.to</td></tr>
        <tr><td style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${MUTED};font-size:11px;line-height:1.6;padding-top:24px;border-top:1px solid rgba(143,163,189,0.2);">${footer.addr}<br><a href="${privacyUrl}" style="color:${MUTED};text-decoration:underline;">${footer.privacy}</a></td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const expectText = copy.expect
    .map((item) => `${item.label} — ${item.text}`)
    .join("\n");

  const text = `${copy.heading}\n\n${copy.body}\n\n${expectText}\n\n${confirmUrl}\n\n${copy.nudge}\n\n${copy.ignore}\n\n${copy.signoff}\nManu · @manu_ai.to\n\n—\n${footer.addr}\n${footer.privacy}: ${privacyUrl}`;

  return { subject: copy.subject, html, text };
}
