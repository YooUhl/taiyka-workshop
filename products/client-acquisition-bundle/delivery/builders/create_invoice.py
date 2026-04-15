"""
Invoice Builder Script
Generates a clean PDF invoice from a JSON payload.
Optionally uploads to Google Drive.

Usage:
    python create_invoice.py <path_to_invoice_json>

See README.md for the JSON schema and setup.
"""

import json
import sys
import os
import pickle
from pathlib import Path
from dotenv import load_dotenv
from fpdf import FPDF

load_dotenv(Path(__file__).parent / ".env")

SCRIPT_DIR       = Path(__file__).parent
TOKEN_FILE       = SCRIPT_DIR / "token.pickle"
CREDENTIALS_FILE = Path(os.getenv(
    "GOOGLE_CREDENTIALS_PATH",
    str(SCRIPT_DIR / "credentials.json"),
))
SCOPES = ["https://www.googleapis.com/auth/drive.file"]

NAVY     = (26, 46, 74)
WHITE    = (255, 255, 255)
LIGHT_BG = (247, 249, 252)
MID_TEXT = (90, 100, 115)
BORDER   = (218, 226, 236)
DARK     = (30, 40, 55)
SUBTLE   = (175, 195, 218)
TBL_ALT  = (247, 249, 252)


def get_drive_service():
    try:
        from google_auth_oauthlib.flow import InstalledAppFlow
        from google.auth.transport.requests import Request
        from googleapiclient.discovery import build

        creds = None
        if TOKEN_FILE.exists():
            with open(TOKEN_FILE, "rb") as f:
                creds = pickle.load(f)
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                if not CREDENTIALS_FILE.exists():
                    return None
                flow = InstalledAppFlow.from_client_secrets_file(str(CREDENTIALS_FILE), SCOPES)
                creds = flow.run_local_server(port=0)
            with open(TOKEN_FILE, "wb") as f:
                pickle.dump(creds, f)
        return build("drive", "v3", credentials=creds)
    except Exception:
        return None


def upload_pdf_to_drive(drive_service, pdf_path: Path, invoice_number: str) -> str:
    from googleapiclient.http import MediaFileUpload
    file_metadata = {"name": f"Invoice {invoice_number}.pdf"}
    media = MediaFileUpload(str(pdf_path), mimetype="application/pdf")
    file = drive_service.files().create(
        body=file_metadata, media_body=media, fields="id, webViewLink"
    ).execute()
    return file["webViewLink"]


class InvoicePDF(FPDF):

    def __init__(self, data: dict):
        super().__init__("P", "mm", "A4")
        self.data           = data
        self.lang           = data.get("language", "english").lower()
        self.your_name      = data.get("your_name", "")
        self.your_address   = data.get("your_address", "")
        self.your_email     = data.get("your_email", "")
        self.your_id_num    = data.get("your_business_number", "")
        self.client_name    = data.get("client_name", "")
        self.client_address = data.get("client_address", "")
        self.client_email   = data.get("client_email", "")
        self.invoice_no     = data.get("invoice_number", "INV-001")
        self.invoice_date   = data.get("invoice_date", "")
        self.service_date   = data.get("service_date", "")
        self.due_date       = data.get("due_date", "")
        self.line_items     = data.get("line_items", [])
        self.payment_link   = data.get("payment_link", "")
        self.notes          = data.get("notes", "")
        self.legal_mention  = data.get("legal_mention", "")

        if self.lang == "french":
            self.lbl_title    = "FACTURE"
            self.lbl_ref      = "N°"
            self.lbl_invoice  = "Date d'émission"
            self.lbl_service  = "Date de prestation"
            self.lbl_due      = "Échéance"
            self.lbl_billto   = "FACTURÉ À"
            self.lbl_from     = "ÉMETTEUR"
            self.lbl_desc     = "Description"
            self.lbl_amount   = "Montant"
            self.lbl_total    = "TOTAL À PAYER"
            self.lbl_pay      = "Lien de paiement"
            self.lbl_notes    = "Notes"
        else:
            self.lbl_title    = "INVOICE"
            self.lbl_ref      = "No."
            self.lbl_invoice  = "Issue date"
            self.lbl_service  = "Service date"
            self.lbl_due      = "Due date"
            self.lbl_billto   = "BILL TO"
            self.lbl_from     = "FROM"
            self.lbl_desc     = "Description"
            self.lbl_amount   = "Amount"
            self.lbl_total    = "TOTAL DUE"
            self.lbl_pay      = "Payment link"
            self.lbl_notes    = "Notes"

        font_regular = os.getenv("FONT_REGULAR", "C:/Windows/Fonts/arial.ttf")
        font_bold    = os.getenv("FONT_BOLD",    "C:/Windows/Fonts/arialbd.ttf")
        font_italic  = os.getenv("FONT_ITALIC",  "C:/Windows/Fonts/ariali.ttf")
        self.add_font("Arial", style="",  fname=font_regular)
        self.add_font("Arial", style="B", fname=font_bold)
        self.add_font("Arial", style="I", fname=font_italic)

        self.set_margins(15, 15, 15)
        self.set_auto_page_break(True, margin=20)

    def footer(self):
        self.set_y(-13)
        self.set_font("Arial", "", 8)
        self.set_text_color(*MID_TEXT)
        self.cell(0, 5, str(self.page_no()), align="C")

    def build(self):
        self.add_page()
        self._draw_header()
        self._draw_meta()
        self._draw_parties()
        self._draw_items()
        self._draw_total()
        self._draw_payment()
        self._draw_legal()

    def _draw_header(self):
        H = 35
        self.set_xy(0, 0)
        self.set_fill_color(*NAVY)
        self.rect(0, 0, 210, H, "F")
        self.set_font("Arial", "B", 22)
        self.set_text_color(*WHITE)
        self.set_xy(15, 11)
        self.cell(150, 10, self.lbl_title)
        self.set_font("Arial", "", 10)
        self.set_text_color(*SUBTLE)
        self.set_xy(140, 14)
        self.cell(55, 5, f"{self.lbl_ref}  {self.invoice_no}", align="R")
        self.set_y(H + 5)

    def _draw_meta(self):
        y = self.get_y()
        self.set_fill_color(*LIGHT_BG)
        self.rect(0, y, 210, 16, "F")
        self.set_font("Arial", "B", 8)
        self.set_text_color(*MID_TEXT)
        self.set_xy(15, y + 3); self.cell(60, 4, self.lbl_invoice.upper())
        self.set_xy(80, y + 3); self.cell(60, 4, self.lbl_service.upper())
        self.set_xy(145, y + 3); self.cell(50, 4, self.lbl_due.upper())
        self.set_font("Arial", "", 10)
        self.set_text_color(*DARK)
        self.set_xy(15, y + 8); self.cell(60, 5, self.invoice_date)
        self.set_xy(80, y + 8); self.cell(60, 5, self.service_date)
        self.set_xy(145, y + 8); self.cell(50, 5, self.due_date)
        self.set_y(y + 22)

    def _draw_parties(self):
        y = self.get_y()
        self.set_font("Arial", "B", 8)
        self.set_text_color(*MID_TEXT)
        self.set_xy(15, y); self.cell(80, 4, self.lbl_from)
        self.set_xy(115, y); self.cell(80, 4, self.lbl_billto)

        self.set_font("Arial", "B", 11)
        self.set_text_color(*DARK)
        self.set_xy(15, y + 6); self.cell(80, 5.5, self.your_name)
        self.set_xy(115, y + 6); self.cell(80, 5.5, self.client_name)

        self.set_font("Arial", "", 9)
        self.set_text_color(*MID_TEXT)
        self.set_xy(15, y + 13); self.multi_cell(80, 4.5, self.your_address)
        self.set_xy(115, y + 13); self.multi_cell(80, 4.5, self.client_address)

        self.set_xy(15, y + 26); self.cell(80, 4.5, self.your_email)
        self.set_xy(115, y + 26); self.cell(80, 4.5, self.client_email)

        if self.your_id_num:
            self.set_xy(15, y + 31); self.cell(80, 4.5, self.your_id_num)

        self.set_y(y + 40)

    def _draw_items(self):
        x_start = 15
        col_desc = 130
        col_amt = 50

        # Header row
        self.set_fill_color(*NAVY)
        self.set_text_color(*WHITE)
        self.set_font("Arial", "B", 9.5)
        self.set_x(x_start)
        self.cell(col_desc, 9, f"  {self.lbl_desc}", fill=True)
        self.cell(col_amt, 9, f"{self.lbl_amount} (EUR)  ", fill=True, align="R")
        self.ln()

        # Rows
        self.set_text_color(*DARK)
        for idx, item in enumerate(self.line_items):
            description = item.get("description", "")
            amount = item.get("amount", 0)
            self.set_fill_color(*(TBL_ALT if idx % 2 == 1 else WHITE))
            self.set_font("Arial", "", 9.5)
            self.set_x(x_start)
            self.cell(col_desc, 8, f"  {description}", fill=True)
            self.cell(col_amt, 8, f"{amount:,.2f}  ", fill=True, align="R")
            self.ln()
            self.set_draw_color(*BORDER)
            self.line(x_start, self.get_y(), x_start + col_desc + col_amt, self.get_y())

    def _draw_total(self):
        total = sum(item.get("amount", 0) for item in self.line_items)
        self.ln(4)
        self.set_x(15 + 130)
        self.set_fill_color(*NAVY)
        self.set_text_color(*WHITE)
        self.set_font("Arial", "B", 11)
        self.cell(50, 11, f"{total:,.2f} EUR  ", fill=True, align="R")
        self.ln()
        self.set_x(15 + 130)
        self.set_font("Arial", "B", 7.5)
        self.set_text_color(*MID_TEXT)
        self.cell(50, 4, f"{self.lbl_total}  ", align="R")
        self.ln(8)

    def _draw_payment(self):
        if not self.payment_link:
            return
        self.set_x(15)
        self.set_font("Arial", "B", 9.5)
        self.set_text_color(*NAVY)
        self.cell(0, 6, self.lbl_pay.upper(), new_x="LMARGIN", new_y="NEXT")
        self.set_font("Arial", "", 9.5)
        self.set_text_color(*DARK)
        self.set_x(15)
        self.multi_cell(180, 5, self.payment_link)
        self.ln(2)

    def _draw_legal(self):
        if self.notes:
            self.ln(2)
            self.set_x(15)
            self.set_font("Arial", "B", 9.5)
            self.set_text_color(*NAVY)
            self.cell(0, 6, self.lbl_notes.upper(), new_x="LMARGIN", new_y="NEXT")
            self.set_font("Arial", "", 9.5)
            self.set_text_color(*DARK)
            self.set_x(15)
            self.multi_cell(180, 5, self.notes)
            self.ln(2)

        if self.legal_mention:
            self.ln(2)
            self.set_x(15)
            self.set_font("Arial", "I", 8.5)
            self.set_text_color(*MID_TEXT)
            self.multi_cell(180, 4.5, self.legal_mention)


def generate_pdf(data: dict, output_path: Path):
    pdf = InvoicePDF(data)
    pdf.build()
    pdf.output(str(output_path))


def main():
    if len(sys.argv) < 2:
        print("Usage: python create_invoice.py <path_to_invoice_json>")
        sys.exit(1)

    json_path = Path(sys.argv[1])
    if not json_path.exists():
        print(f"ERROR: File not found: {json_path}")
        sys.exit(1)

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    output_dir = SCRIPT_DIR / "output"
    output_dir.mkdir(exist_ok=True)
    invoice_number = data.get("invoice_number", "INV-001")
    pdf_path = output_dir / f"Invoice_{invoice_number}.pdf"

    print("Building invoice PDF...")
    generate_pdf(data, pdf_path)
    print(f"PDF saved: {pdf_path}")

    drive_link = None
    if CREDENTIALS_FILE.exists():
        print("Uploading to Google Drive...")
        try:
            drive_service = get_drive_service()
            if drive_service:
                drive_link = upload_pdf_to_drive(drive_service, pdf_path, invoice_number)
        except Exception as e:
            print(f"Drive upload skipped: {e}")

    total = sum(item.get("amount", 0) for item in data.get("line_items", []))
    print("\n--- INVOICE CREATED ---")
    if drive_link:
        print(f"Google Drive: {drive_link}")
    print(f"PDF saved:    {pdf_path}")
    print(f"Invoice #:    {invoice_number}")
    print(f"Total:        EUR {total:,.2f}")
    print(f"Due date:     {data.get('due_date', '')}")


if __name__ == "__main__":
    main()
