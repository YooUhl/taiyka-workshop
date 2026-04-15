"""
Contract Builder Script
Generates a professional PDF service contract from a JSON payload.
Reuses the same layout engine as the proposal builder.
Optionally uploads to Google Drive.

Usage:
    python create_contract.py <path_to_contract_json>

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
DARK     = (30, 40, 55)
SUBTLE   = (175, 195, 218)


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


def upload_pdf_to_drive(drive_service, pdf_path: Path, contract_number: str) -> str:
    from googleapiclient.http import MediaFileUpload
    file_metadata = {"name": f"Contract {contract_number}.pdf"}
    media = MediaFileUpload(str(pdf_path), mimetype="application/pdf")
    file = drive_service.files().create(
        body=file_metadata, media_body=media, fields="id, webViewLink"
    ).execute()
    return file["webViewLink"]


class ContractPDF(FPDF):

    def __init__(self, data: dict):
        super().__init__("P", "mm", "A4")
        self.data         = data
        self.lang         = data.get("language", "english").lower()
        self.your_name    = data.get("your_name", "")
        self.your_address = data.get("your_address", "")
        self.your_email   = data.get("your_email", "")
        self.your_id_num  = data.get("your_business_number", "")
        self.contract_no  = data.get("contract_number", "CTR-001")
        self.date         = data.get("date", "")
        self.client_name  = data.get("client_name", "")
        self.client_company = data.get("client_company", "")
        self.client_address = data.get("client_address", "")
        self.client_email = data.get("client_email", "")

        if self.lang == "french":
            self.lbl_title = "CONTRAT DE PRESTATION DE SERVICES"
            self.lbl_ref   = "N°"
            self.lbl_date  = "Date"
        else:
            self.lbl_title = "SERVICE AGREEMENT"
            self.lbl_ref   = "No."
            self.lbl_date  = "Date"

        font_regular = os.getenv("FONT_REGULAR", "C:/Windows/Fonts/arial.ttf")
        font_bold    = os.getenv("FONT_BOLD",    "C:/Windows/Fonts/arialbd.ttf")
        font_italic  = os.getenv("FONT_ITALIC",  "C:/Windows/Fonts/ariali.ttf")
        self.add_font("Arial", style="",  fname=font_regular)
        self.add_font("Arial", style="B", fname=font_bold)
        self.add_font("Arial", style="I", fname=font_italic)

        self.set_margins(15, 15, 15)
        self.set_auto_page_break(True, margin=20)

    def header(self):
        if self.page_no() > 1:
            self.set_fill_color(*NAVY)
            self.rect(0, 0, 210, 9, "F")
            self.set_font("Arial", "", 7.5)
            self.set_text_color(*WHITE)
            self.set_xy(15, 2)
            self.cell(90, 5, f"{self.lbl_title}  —  {self.lbl_ref} {self.contract_no}")
            self.set_xy(105, 2)
            client_display = (
                f"{self.client_name} — {self.client_company}"
                if self.client_company else self.client_name
            )
            self.cell(90, 5, client_display, align="R")
            self.set_y(14)

    def footer(self):
        self.set_y(-13)
        self.set_font("Arial", "", 8)
        self.set_text_color(*MID_TEXT)
        self.cell(0, 5, str(self.page_no()), align="C")

    def build(self):
        self.add_page()
        self._draw_cover_header()
        self.ln(8)
        self._draw_sections()
        self._draw_signature_block()

    def _draw_cover_header(self):
        H = 48
        self.set_xy(0, 0)
        self.set_fill_color(*NAVY)
        self.rect(0, 0, 210, H, "F")
        self.set_font("Arial", "B", 18)
        self.set_text_color(*WHITE)
        self.set_xy(15, 13)
        self.cell(150, 10, self.lbl_title)
        self.set_font("Arial", "", 9)
        self.set_text_color(*SUBTLE)
        self.set_xy(15, 28)
        self.cell(120, 5, f"{self.lbl_ref}  {self.contract_no}    |    {self.lbl_date}  {self.date}")
        self.set_y(H + 5)

    def _draw_sections(self):
        for section in self.data.get("sections", []):
            title = section["title"]
            content = section.get("content", "")

            if self.get_y() > 250:
                self.add_page()

            self.set_x(15)
            self.set_font("Arial", "B", 11)
            self.set_text_color(*NAVY)
            self.cell(0, 7, title.upper(), new_x="LMARGIN", new_y="NEXT")
            self.ln(1)

            for paragraph in content.split("\n\n"):
                for line in paragraph.split("\n"):
                    stripped = line.strip()
                    if not stripped:
                        continue
                    if stripped.startswith("-") or stripped.startswith("•"):
                        self._draw_bullet(stripped.lstrip("-• ").strip())
                    else:
                        self.set_font("Arial", "", 10)
                        self.set_text_color(*DARK)
                        self.set_x(15)
                        self.multi_cell(180, 5.2, stripped)
                self.ln(0.8)
            self.ln(2)

    def _draw_bullet(self, text: str):
        self.set_font("Arial", "", 10)
        self.set_text_color(*DARK)
        if self.get_y() > 268:
            self.add_page()
        y = self.get_y()
        self.set_xy(18, y)
        self.cell(6, 5.2, "\u2022")
        self.set_xy(24, y)
        self.multi_cell(171, 5.2, text)
        self.ln(0.3)

    def _draw_signature_block(self):
        if self.get_y() > 230:
            self.add_page()
        else:
            self.ln(10)

        if self.lang == "french":
            sig_title = "SIGNATURES"
            l_provider = "Le Prestataire"
            l_client   = "Le Client"
            l_signed   = "Signature :"
            l_date     = "Date :"
        else:
            sig_title = "SIGNATURES"
            l_provider = "The Service Provider"
            l_client   = "The Client"
            l_signed   = "Signature:"
            l_date     = "Date:"

        self.set_font("Arial", "B", 11)
        self.set_text_color(*NAVY)
        self.set_x(15)
        self.cell(0, 7, sig_title, new_x="LMARGIN", new_y="NEXT")
        self.ln(4)

        y = self.get_y()
        self.set_font("Arial", "B", 10)
        self.set_text_color(*DARK)
        self.set_xy(15, y); self.cell(80, 6, l_provider)
        self.set_xy(115, y); self.cell(80, 6, l_client)

        self.set_font("Arial", "", 10)
        self.set_xy(15, y + 7); self.cell(80, 6, self.your_name)
        self.set_xy(115, y + 7); self.cell(80, 6, self.client_name)

        self.set_xy(15, y + 22); self.cell(80, 6, l_signed)
        self.set_xy(115, y + 22); self.cell(80, 6, l_signed)
        self.set_xy(15, y + 32); self.cell(80, 6, l_date)
        self.set_xy(115, y + 32); self.cell(80, 6, l_date)


def generate_pdf(data: dict, output_path: Path):
    pdf = ContractPDF(data)
    pdf.build()
    pdf.output(str(output_path))


def main():
    if len(sys.argv) < 2:
        print("Usage: python create_contract.py <path_to_contract_json>")
        sys.exit(1)

    json_path = Path(sys.argv[1])
    if not json_path.exists():
        print(f"ERROR: File not found: {json_path}")
        sys.exit(1)

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    output_dir = SCRIPT_DIR / "output"
    output_dir.mkdir(exist_ok=True)
    contract_number = data.get("contract_number", "CTR-001")
    pdf_path = output_dir / f"Contract_{contract_number}.pdf"

    print("Building contract PDF...")
    generate_pdf(data, pdf_path)
    print(f"PDF saved: {pdf_path}")

    drive_link = None
    if CREDENTIALS_FILE.exists():
        print("Uploading to Google Drive...")
        try:
            drive_service = get_drive_service()
            if drive_service:
                drive_link = upload_pdf_to_drive(drive_service, pdf_path, contract_number)
        except Exception as e:
            print(f"Drive upload skipped: {e}")

    print("\n--- CONTRACT CREATED ---")
    if drive_link:
        print(f"Google Drive: {drive_link}")
    print(f"PDF saved:    {pdf_path}")
    print(f"Contract #:   {contract_number}")
    print(f"Client:       {data.get('client_name', '')}")


if __name__ == "__main__":
    main()
