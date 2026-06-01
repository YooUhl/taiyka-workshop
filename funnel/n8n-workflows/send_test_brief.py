"""
One-shot: send a sample AI NEWS brief to a test recipient via Gmail SMTP.

Uses the same HTML template as the n8n workflow's 'Render Email HTML' node so
the inbox preview matches what the production pipeline will send.

Run: BRIEF_TEST_RECIPIENT=you@example.com python send_test_brief.py
   or: python send_test_brief.py you@example.com
"""

import os
import smtplib
import ssl
import sys
from datetime import datetime
from email.message import EmailMessage
from email.utils import formataddr

from dotenv import load_dotenv

# Load creds from local .env then optional personal global config.
load_dotenv()
load_dotenv(os.path.expanduser("~/.config/global.env"))

SENDER = os.environ["GMAIL_SENDER"]
APP_PASSWORD = os.environ["GMAIL_APP_PASSWORD"]
RECIPIENT = os.environ.get("BRIEF_TEST_RECIPIENT") or (sys.argv[1] if len(sys.argv) > 1 else "")
if not RECIPIENT:
    sys.exit("Set BRIEF_TEST_RECIPIENT env var or pass an email as the first arg.")

ISSUE_NUMBER = 42
DATE_LABEL = datetime.now().strftime("%A %d %B").lower()

STORIES = [
    {
        "headline": "Anthropic sort Claude Opus 4.7 — 1M tokens de contexte",
        "take": (
            "Pour la première fois un modèle frontier accepte des codebases entières d'un "
            "seul coup. Si tu codes avec Claude Code, tes sessions vont durer 3x plus longtemps "
            "sans /compact."
        ),
        "source": "anthropic.com",
        "url": "https://www.anthropic.com/news",
    },
    {
        "headline": "OpenAI lance les Agents Apps — un App Store pour GPT",
        "take": (
            "Sam Altman dévoile un marketplace où n'importe qui peut publier un agent "
            "monétisable. C'est le moment de bâtir le tien — la fenêtre va se fermer vite."
        ),
        "source": "openai.com",
        "url": "https://openai.com/blog",
    },
    {
        "headline": "n8n passe les 60k stars GitHub — les workflows IA explosent",
        "take": (
            "Plateforme self-hosted devient la stack par défaut pour orchestrer agents et "
            "automations. Si tu veux shipper un produit IA cette année, c'est ton outil pivot."
        ),
        "source": "github.com/n8n-io",
        "url": "https://github.com/n8n-io/n8n",
    },
]


def render_email_html(issue_number: int, date_label: str, stories: list, recipient_email: str) -> str:
    """Mirrors the 'Render Email HTML' node in ai-news-daily.json."""
    rows = []
    for i, s in enumerate(stories, start=1):
        rows.append(
            f"""
  <tr><td style="padding:0 0 28px 0;">
    <div style="font-family:'JetBrains Mono',ui-monospace,monospace;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#00a6ff;margin-bottom:8px;">{i:02d}</div>
    <h3 style="margin:0 0 8px 0;font-family:Inter,Arial,sans-serif;font-size:18px;line-height:1.3;color:#e8f0fe;font-weight:600;"><a href="{s['url']}" style="color:#e8f0fe;text-decoration:none;">{s['headline']}</a></h3>
    <p style="margin:0 0 8px 0;font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.55;color:#8da2c0;">{s['take']}</p>
    <div style="font-family:'JetBrains Mono',ui-monospace,monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#8da2c0;"><a href="{s['url']}" style="color:#8da2c0;text-decoration:underline;">{s['source']}</a></div>
  </td></tr>"""
        )
    stories_html = "".join(rows)

    return f"""<!doctype html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a1628;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a1628;">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#0f1a2e;border:1px solid rgba(141,162,192,0.2);border-radius:8px;padding:28px;">
    <tr><td style="border-bottom:1px solid rgba(141,162,192,0.2);padding-bottom:16px;">
      <table role="presentation" width="100%"><tr>
        <td style="font-family:'JetBrains Mono',ui-monospace,monospace;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#00a6ff;">AI NEWS · #{issue_number:03d}</td>
        <td align="right" style="font-family:'JetBrains Mono',ui-monospace,monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#8da2c0;">{date_label} · 7h</td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:24px 0 0 0;"><table role="presentation" width="100%">{stories_html}</table></td></tr>
    <tr><td style="border-top:1px solid rgba(141,162,192,0.2);padding-top:16px;text-align:center;font-family:Inter,Arial,sans-serif;font-size:12px;color:#8da2c0;">
      <p style="margin:0 0 6px 0;">— Manu · <a href="https://instagram.com/manu_ai.to" style="color:#00a6ff;text-decoration:none;">@manu_ai.to</a></p>
      <p style="margin:0;font-size:11px;"><a href="https://taiyka.com/brief/unsubscribe?email={recipient_email}" style="color:#8da2c0;text-decoration:underline;">Se désinscrire en 1 clic</a></p>
    </td></tr>
  </table>
</td></tr></table>
</body></html>"""


def main():
    html_body = render_email_html(ISSUE_NUMBER, DATE_LABEL, STORIES, RECIPIENT)
    subject = f"[TEST] AI NEWS #{ISSUE_NUMBER:03d} — {DATE_LABEL}"

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = formataddr(("AI NEWS · Taiyka", SENDER))
    msg["To"] = RECIPIENT
    msg.set_content(
        "Cet email est un test. Ouvre la version HTML dans Gmail pour voir le rendu réel."
    )
    msg.add_alternative(html_body, subtype="html")

    try:
        import certifi
        context = ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        # Windows fallback when certifi isn't installed — trust system store only
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.ehlo()
        server.starttls(context=context)
        server.ehlo()
        server.login(SENDER, APP_PASSWORD)
        server.send_message(msg)

    print(f"OK — sent {subject!r} to {RECIPIENT}")


if __name__ == "__main__":
    main()
