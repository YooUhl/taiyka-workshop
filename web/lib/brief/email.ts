import "server-only";

// Dependency-free Resend client. We POST to the Resend REST API directly with
// fetch so no npm package is needed. Requires two env vars (set during Phase 0):
//   RESEND_API_KEY   — the Resend API key
//   BRIEF_FROM_EMAIL — verified sender, e.g. "Le Brief <brief@taiyka.com>"

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export class BriefEmailNotConfigured extends Error {
  constructor() {
    super("RESEND_API_KEY is not set");
    this.name = "BriefEmailNotConfigured";
  }
}

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

/**
 * Send one email via Resend. Throws BriefEmailNotConfigured if the key is
 * missing (so callers can degrade gracefully before Phase 0 is done), and a
 * generic Error on API failure.
 */
export async function sendEmail({ to, subject, html, text }: SendArgs): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new BriefEmailNotConfigured();
  }
  const from =
    process.env.BRIEF_FROM_EMAIL ?? "Le Brief <brief@send.taiyka.com>";

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html, ...(text ? { text } : {}) }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend send failed: ${res.status} ${detail}`);
  }
}
