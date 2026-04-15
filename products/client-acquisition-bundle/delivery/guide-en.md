# Client Acquisition Bundle — Setup guide

> Everything you need to sign and bill a client like a pro, without copy-pasting garbage templates from Google. Bilingual templates + 3 Python scripts that generate branded PDFs in 2 seconds.
> — Manu, founder of [Taiyka](https://instagram.com/manu_ai.to)

---

## What's in the bundle

```
client-acquisition-bundle/
├── templates/
│   ├── contract-fr.md        ← contract (fixed-price + retainer in one file)
│   ├── contract-en.md
│   ├── proposal-fr.md
│   ├── proposal-en.md
│   ├── invoice-fr.md
│   └── invoice-en.md
├── builders/
│   ├── create_proposal.py    ← generates the proposal PDF
│   ├── create_contract.py    ← generates the contract PDF
│   ├── create_invoice.py     ← generates the invoice PDF
│   ├── samples/              ← ready-to-copy example JSONs
│   ├── .env.example
│   └── README.md
├── guide-fr.md
├── guide-en.md               ← you are here
└── cover.svg
```

Two ways to use the bundle:

- **Quick mode** — copy the `.md` files into Google Docs, fill in the `[FIELDS]`, export to PDF. 5 minutes per document.
- **Auto mode** — fill a small JSON, run the Python script, get a branded PDF (and optionally uploaded to your Drive). 30 seconds per document after initial setup.

Pick what fits you. Most freelancers will use quick mode. If you sign more than 2-3 contracts a month, auto mode saves you hours.

---

## Quick mode — using the Markdown templates

1. Open the template you need (`contract-en.md`, `proposal-en.md`, etc.)
2. Copy everything into a new Google Doc (or Notion, or Word — doesn't matter)
3. Replace all `[FIELDS_IN_BRACKETS]` with real values
4. For the contract: delete the variant you're not using (FIXED-PRICE or RETAINER)
5. Export to PDF (File → Download → PDF)
6. Send to your client

That's it. No Python, no setup. If you're starting out, do this.

---

## Auto mode — using the Python builders

### Prerequisites

- **Python 3.10+** installed (`python --version` to check)
- **pip** installed
- 5 minutes for initial setup

### Setup in 4 steps

**1. Open a terminal in the `builders/` folder**:

```bash
cd builders
```

**2. Install dependencies**:

```bash
pip install fpdf2 python-dotenv google-api-python-client google-auth-oauthlib
```

> If you don't want Google Drive upload, you can skip the `google-*` packages. The script will run anyway and just produce a local PDF.

**3. Copy `.env.example` to `.env`**:

```bash
cp .env.example .env
```

Open `.env` and adapt font paths if you're not on Windows. macOS/Linux examples are commented in.

**4. (Optional) Enable Google Drive upload**:

- Go to [console.cloud.google.com](https://console.cloud.google.com)
- Create a project (any name)
- Enable the **Google Drive API** (APIs & Services → Library)
- Create **OAuth 2.0 credentials** of type **Desktop app** (Credentials → + Create credentials)
- Download the JSON, rename it `credentials.json`, drop it into the `builders/` folder
- The first time you run a script, your browser opens to authorise. After that, it's silent forever.

> If you don't want Google Drive: do nothing. The script detects the missing `credentials.json` and skips the upload silently.

### Usage

Each script takes a JSON file as argument:

```bash
python create_proposal.py samples/proposal-sample.json
python create_contract.py samples/contract-sample.json
python create_invoice.py  samples/invoice-sample.json
```

The PDF lands in `./output/`. If Drive is configured, the shareable link appears in the terminal.

### Recommended workflow

1. New client → copy `samples/proposal-sample.json` to `my-client.json`
2. Fill in the fields (client name, sections, price...)
3. Run `python create_proposal.py my-client.json`
4. Send the PDF to the client
5. Client signs → same flow for the contract
6. You invoice → same flow for the invoice

Once used to it, it's 5 minutes per document. You fill the JSON while you think about pricing, and the script handles the layout.

---

## Customising the templates

### Colours

Each Python script has a `NAVY = (26, 46, 74)` constant at the top. That's the main colour. Change it to match your brand. Same for `LIGHT_BG`, `MID_TEXT`, etc.

### Logo

The scripts use `fpdf2`. To add a logo, edit the `_draw_cover_header` method and add `self.image("path/to/logo.png", x=15, y=10, w=30)`. Want this done for you? Check the Skool community.

### Currency

`create_invoice.py` displays `EUR` by default. If you bill in USD/GBP/CHF, do a find-and-replace in the file (`"EUR"` → `"USD"`).

### Contract / proposal sections

The scripts render **all** sections present in your JSON. Add, remove, reorder freely. The Markdown templates carry the full skeleton — copy from there when you start a new section.

---

## Full example — auto mode, end to end

Imagine you sign Acme Corp for a chatbot project at 3000€. Here's your day:

**Step 1 — proposal**

```bash
cp samples/proposal-sample.json acme-proposal.json
# Edit acme-proposal.json: client name, challenge, solution, price
python create_proposal.py acme-proposal.json
# → output/Proposal_PRO-001.pdf ready to send
```

**Step 2 — contract (client said yes)**

```bash
cp samples/contract-sample.json acme-contract.json
# Edit: reuse sections from the proposal, add the clauses
python create_contract.py acme-contract.json
# → output/Contract_CTR-001.pdf ready to sign
```

**Step 3 — deposit invoice (50%)**

```bash
cp samples/invoice-sample.json acme-deposit.json
# Edit: 1500 EUR, immediate due date
python create_invoice.py acme-deposit.json
# → output/Invoice_INV-001.pdf ready to send
```

**Step 4 — balance invoice (on delivery)**

```bash
cp samples/invoice-sample.json acme-balance.json
# Same, but INV-002, amount 1500
python create_invoice.py acme-balance.json
```

Total: 4 professional documents, ~10 minutes of work. Without the bundle, plan 1-2 hours of Google Docs copy-paste.

---

## Troubleshooting

**`FileNotFoundError: arial.ttf`**
→ You're not on Windows. Adapt `FONT_REGULAR` / `FONT_BOLD` / `FONT_ITALIC` paths in `.env`. Mac/Linux examples are commented in `.env.example`.

**`ModuleNotFoundError: No module named 'fpdf'`**
→ You installed `fpdf` instead of `fpdf2`. Uninstall (`pip uninstall fpdf`) then install the right one (`pip install fpdf2`).

**The PDF shows up but accents are replaced by squares**
→ The font you picked doesn't support full Unicode. Use Arial, Helvetica or DejaVu Sans.

**Google Drive upload never happens**
→ Check you created an OAuth client of type **Desktop app** (not Web). Make sure the file is exactly named `credentials.json` and lives in `builders/`. Delete `token.pickle` to restart the auth flow.

**Script runs but no PDF appears**
→ Check the `output/` folder inside `builders/`. The script never creates the PDF anywhere else.

**"JSON decode error"**
→ Your JSON file is invalid. Paste it into [jsonlint.com](https://jsonlint.com) to find the issue (often a trailing comma or smart quotes).

---

## Legal mentions — adapt to your situation

The templates include legal mentions **based on French law for a sole trader / micro-entrepreneur**. If you are:

- **Self-employed elsewhere in the EU**: adapt the VAT mention and status in Article 1.
- **Sole trader in the UK / US / Canada / Australia**: replace French tax code references with your local equivalents (HMRC, IRS, CRA, ATO...).
- **Operating as a company (LLC, Ltd, GmbH...)**: add registration number, share capital, registered office mentions to Article 1.
- **Outside the EU**: remove the GDPR mention (Article 14) or adapt to local data protection law (CCPA, LGPD...).

> ⚠️ This bundle does not replace a lawyer. For large contracts (> €20k or local equivalent), get it reviewed. For typical freelance projects, these templates are battle-tested and used daily by thousands of independents.

---

## Going further

Want to level up — automate your **entire** client management (CRM, e-signature, invoice follow-ups, cash flow tracking)?

→ [Join the Skool community](https://taiyka.com/skool) — access to my full n8n workflows for client management, the Claude skills `/contract-builder`, `/proposal-builder` and `/invoice-builder` (guided conversational mode), and direct Q&A with me every week.

---

**Manu** · [@manu_ai.to](https://instagram.com/manu_ai.to) · [taiyka.com](https://taiyka.com)

Stuck somewhere? Reply to the delivery email, I read everything.
