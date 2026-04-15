# Builders — auto-generate contracts, proposals & invoices

Three Python scripts that turn a JSON payload into a clean, branded PDF (and optionally upload it to your Google Drive). Same layout engine, same setup.

```
builders/
├── create_proposal.py
├── create_contract.py
├── create_invoice.py
├── samples/
│   ├── proposal-sample.json
│   ├── contract-sample.json
│   └── invoice-sample.json
├── .env.example
└── README.md   ← you are here
```

---

## 1. Requirements

- **Python 3.10+** (3.11 recommended)
- **pip** installed
- A system font available for PDF generation. The scripts default to **Arial** on Windows (`C:/Windows/Fonts/arial.ttf`). If you're on macOS / Linux, override the paths via `.env` (see below).

### Install dependencies

```bash
pip install fpdf2 python-dotenv google-api-python-client google-auth-oauthlib
```

> The `google-*` packages are only needed if you want the optional Google Drive upload. Skip them if you only want the local PDF.

---

## 2. Environment setup

Copy `.env.example` to `.env` and fill in (all optional):

```env
# Path to your Google OAuth credentials JSON (only if you want Drive upload)
GOOGLE_CREDENTIALS_PATH=./credentials.json

# Override fonts if you're not on Windows
FONT_REGULAR=/System/Library/Fonts/Supplemental/Arial.ttf
FONT_BOLD=/System/Library/Fonts/Supplemental/Arial Bold.ttf
FONT_ITALIC=/System/Library/Fonts/Supplemental/Arial Italic.ttf
```

### Google Drive upload (optional)

If you want PDFs auto-uploaded to your Drive:

1. Go to [console.cloud.google.com](https://console.cloud.google.com/) and create a project.
2. Enable the **Google Drive API**.
3. Create **OAuth 2.0 credentials** (Desktop app type).
4. Download the JSON file. Rename it `credentials.json` and place it next to the scripts (or set `GOOGLE_CREDENTIALS_PATH` in `.env`).
5. The first time you run a script, a browser window will open asking you to authorise. After that, a `token.pickle` file is saved and you won't be asked again.

> Without `credentials.json`, the scripts run normally and just skip the Drive upload silently.

---

## 3. Run a builder

Each script takes one argument: the path to the JSON payload.

```bash
# Proposal
python create_proposal.py samples/proposal-sample.json

# Contract
python create_contract.py samples/contract-sample.json

# Invoice
python create_invoice.py samples/invoice-sample.json
```

The output PDFs land in `./output/` (created automatically).

---

## 4. JSON payload reference

### Proposal — `proposal-sample.json`

```json
{
  "language": "english",
  "proposal_number": "PRO-001",
  "date": "01/04/2026",
  "your_name": "Your Name",
  "your_email": "you@example.com",
  "client_name": "Jane Doe",
  "client_company": "Acme Corp",
  "client_email": "jane@acme.com",
  "sections": [
    {"title": "1. EXECUTIVE SUMMARY", "content": "Full paragraph text..."},
    {
      "title": "4. FEATURES",
      "content": "",
      "table": {
        "headers": ["Module", "Detail"],
        "col_widths": [50, 130],
        "rows": [["Auto-reply", "24/7 instant replies"], ["FAQ", "Common questions"]]
      }
    }
  ]
}
```

### Contract — `contract-sample.json`

```json
{
  "language": "english",
  "contract_number": "CTR-001",
  "date": "01/04/2026",
  "your_name": "Your Name",
  "your_address": "123 Main St, City, Country",
  "your_email": "you@example.com",
  "your_business_number": "YOUR_BUSINESS_NUMBER",
  "client_name": "Jane Doe",
  "client_company": "Acme Corp",
  "client_address": "456 Oak Ave, City, Country",
  "client_email": "jane@acme.com",
  "sections": [
    {"title": "1. PARTIES", "content": "Full paragraph..."},
    {"title": "2. OBJECT AND SCOPE OF SERVICES", "content": "Full paragraph..."}
  ]
}
```

### Invoice — `invoice-sample.json`

```json
{
  "language": "english",
  "invoice_number": "INV-001",
  "invoice_date": "01/04/2026",
  "service_date": "28/03/2026",
  "due_date": "01/05/2026",
  "your_name": "Your Name",
  "your_address": "123 Main St, City, Country",
  "your_email": "you@example.com",
  "your_business_number": "YOUR_BUSINESS_NUMBER",
  "client_name": "Jane Doe",
  "client_address": "456 Oak Ave, City, Country",
  "client_email": "jane@acme.com",
  "line_items": [
    {"description": "AI automation build", "amount": 2000.00},
    {"description": "Strategy session (2h)", "amount": 500.00}
  ],
  "payment_link": "https://buy.stripe.com/your-link",
  "notes": "Project: Acme CRM Integration",
  "legal_mention": "VAT not applicable."
}
```

---

## 5. Customising

- **Brand color** — open any script and edit the `NAVY` constant at the top (RGB tuple).
- **Logo / signature image** — `fpdf2` supports `pdf.image()` calls. Drop yours into the `_draw_cover_header` method.
- **Sections** — the proposal and contract scripts render whatever `sections` array you pass. Add or remove sections freely in your JSON.
- **Currency** — invoice script hardcodes `EUR` in the totals row. Change `"EUR"` to `"USD"`, `"GBP"`, etc. in `create_invoice.py` if needed.

---

## 6. Troubleshooting

| Issue | Fix |
|---|---|
| `FileNotFoundError: arial.ttf` | You're not on Windows. Set `FONT_REGULAR` / `FONT_BOLD` / `FONT_ITALIC` in `.env` to your system fonts. |
| `ModuleNotFoundError: fpdf` | Install with `pip install fpdf2` (note the `2`). |
| Drive upload fails silently | Make sure `credentials.json` is a **Desktop OAuth client** type. Web client won't work. |
| Browser doesn't open on first auth | Run from a terminal that can launch a browser. SSH sessions need `ssh -X` or you'll need to use a service account instead. |
| Accents / em-dashes look wrong | Make sure the font file you point to supports Unicode (Arial is fine). |

---

## 7. Going further

If you want a guided, conversational workflow (Claude asks you questions, fills the JSON, runs the script for you), check the **Skool community** — full Claude skills for `/contract-builder`, `/proposal-builder` and `/invoice-builder` are bundled there, alongside other automation tooling.

Skool: see the main guide.
