"""
Proposal Builder Script
Generates a professional PDF proposal using fpdf2.
Optionally uploads to Google Drive for cloud access.

Usage:
    python create_proposal.py <path_to_proposal_json>

See README.md for the JSON schema and setup instructions.
"""

import json
import sys
import os
import pickle
from pathlib import Path
from dotenv import load_dotenv
from fpdf import FPDF

# Load .env from the script directory if present
load_dotenv(Path(__file__).parent / ".env")

SCRIPT_DIR       = Path(__file__).parent
TOKEN_FILE       = SCRIPT_DIR / "token.pickle"
CREDENTIALS_FILE = Path(os.getenv(
    "GOOGLE_CREDENTIALS_PATH",
    str(SCRIPT_DIR / "credentials.json"),
))
SCOPES = ["https://www.googleapis.com/auth/drive.file"]

# Color palette — tweak to match your brand
NAVY     = (26, 46, 74)
WHITE    = (255, 255, 255)
LIGHT_BG = (247, 249, 252)
MID_TEXT = (90, 100, 115)
BORDER   = (218, 226, 236)
DARK     = (30, 40, 55)
SUBTLE   = (175, 195, 218)
TBL_ALT  = (247, 249, 252)


# ── Google Drive helpers ──────────────────────────────────────────────────────

def get_drive_service():
    """Authenticate with Google and return a Drive service client.
    Returns None silently if credentials are missing."""
    try:
        from google.oauth2.credentials import Credentials  # noqa: F401
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


def upload_pdf_to_drive(drive_service, pdf_path: Path, proposal_number: str) -> str:
    """Upload the PDF to Google Drive. Returns a viewable link."""
    from googleapiclient.http import MediaFileUpload

    file_metadata = {"name": f"Proposal {proposal_number}.pdf"}
    media = MediaFileUpload(str(pdf_path), mimetype="application/pdf")

    file = drive_service.files().create(
        body=file_metadata,
        media_body=media,
        fields="id, webViewLink",
    ).execute()

    return file["webViewLink"]


# ── PDF layout ────────────────────────────────────────────────────────────────

class ProposalPDF(FPDF):

    def __init__(self, data: dict):
        super().__init__("P", "mm", "A4")
        self.data           = data
        self.lang           = data.get("language", "english").lower()
        self.your_name      = data.get("your_name", "")
        self.your_email     = data.get("your_email", "")
        self.proposal_no    = data.get("proposal_number", "PRO-001")
        self.date           = data.get("date", "")
        self.client_name    = data.get("client_name", "")
        self.client_company = data.get("client_company", "")
        self.client_email   = data.get("client_email", "")

        # Labels based on language
        if self.lang == "french":
            self.lbl_title = "PROPOSITION DE SERVICES"
            self.lbl_ref   = "Réf."
            self.lbl_date  = "Date"
            self.lbl_for   = "PRÉPARÉ POUR"
            self.lbl_by    = "PRÉPARÉ PAR"
        else:
            self.lbl_title = "SERVICE PROPOSAL"
            self.lbl_ref   = "Ref."
            self.lbl_date  = "Date"
            self.lbl_for   = "PREPARED FOR"
            self.lbl_by    = "PREPARED BY"

        # Font configuration. Override via FONT_REGULAR / FONT_BOLD / FONT_ITALIC
        # env vars if Arial isn't available on your system.
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
            client_display = (
                f"{self.client_name} — {self.client_company}"
                if self.client_company else self.client_name
            )
            self.set_font("Arial", "", 7.5)
            self.set_text_color(*WHITE)
            self.set_xy(15, 2)
            self.cell(90, 5, f"{self.lbl_title}  —  {self.lbl_ref} {self.proposal_no}")
            self.set_xy(105, 2)
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
        self._draw_meta_row()
        self.ln(10)
        self._draw_sections()

    def _draw_cover_header(self):
        H = 48
        self.set_xy(0, 0)
        self.set_fill_color(*NAVY)
        self.rect(0, 0, 210, H, "F")
        self.set_font("Arial", "B", 20)
        self.set_text_color(*WHITE)
        self.set_xy(15, 13)
        self.cell(130, 10, self.lbl_title)
        self.set_font("Arial", "", 9)
        self.set_text_color(*SUBTLE)
        self.set_xy(145, 16)
        self.cell(50, 5, f"{self.lbl_ref}  {self.proposal_no}", align="R")
        self.set_xy(145, 22)
        self.cell(50, 5, f"{self.lbl_date}  {self.date}", align="R")
        self.set_y(H + 0.5)

    def _draw_meta_row(self):
        y = self.get_y()
        H = 36
        self.set_fill_color(*LIGHT_BG)
        self.rect(0, y, 210, H, "F")
        self.set_fill_color(*NAVY)
        self.rect(0, y + H, 210, 0.5, "F")

        client_display = (
            f"{self.client_name} — {self.client_company}"
            if self.client_company else self.client_name
        )

        self.set_font("Arial", "B", 7.5)
        self.set_text_color(*MID_TEXT)
        self.set_xy(15, y + 6)
        self.cell(80, 4, self.lbl_for)

        self.set_font("Arial", "B", 11)
        self.set_text_color(*DARK)
        self.set_xy(15, y + 12)
        self.cell(80, 5.5, client_display)

        self.set_font("Arial", "", 9)
        self.set_text_color(*MID_TEXT)
        self.set_xy(15, y + 19)
        self.cell(80, 5, self.client_email)

        self.set_font("Arial", "B", 7.5)
        self.set_text_color(*MID_TEXT)
        self.set_xy(120, y + 6)
        self.cell(75, 4, self.lbl_by, align="R")

        self.set_font("Arial", "B", 11)
        self.set_text_color(*DARK)
        self.set_xy(120, y + 12)
        self.cell(75, 5.5, self.your_name, align="R")

        self.set_font("Arial", "", 9)
        self.set_text_color(*MID_TEXT)
        self.set_xy(120, y + 19)
        self.cell(75, 5, self.your_email, align="R")

        self.set_y(y + H)

    def _draw_sections(self):
        for section in self.data.get("sections", []):
            self._draw_section(section)

    def _draw_section(self, section: dict):
        title = section["title"]
        content = section.get("content", "")
        table = section.get("table")

        if self.get_y() > 255:
            self.add_page()

        self.set_x(15)
        self.set_font("Arial", "B", 11)
        self.set_text_color(*NAVY)
        self.cell(0, 7, title.upper(), new_x="LMARGIN", new_y="NEXT")
        self.ln(2)

        if content:
            self._render_content(content)
        if table:
            self._draw_table(table)
        self.ln(3)

    def _render_content(self, text: str):
        blocks = text.split("\n\n")
        for i, block in enumerate(blocks):
            for line in block.split("\n"):
                stripped = line.strip()
                if not stripped:
                    continue
                if stripped.startswith("•") or stripped.startswith("-"):
                    self._draw_bullet(stripped.lstrip("•- ").strip())
                else:
                    self._draw_paragraph(stripped)
            if i < len(blocks) - 1:
                self.ln(1)

    def _draw_paragraph(self, text: str):
        self.set_font("Arial", "", 10.5)
        self.set_text_color(*DARK)
        self.set_x(15)
        self.multi_cell(180, 5.5, text)
        self.ln(0.5)

    def _draw_bullet(self, text: str):
        self.set_font("Arial", "", 10.5)
        self.set_text_color(*DARK)
        if self.get_y() > 268:
            self.add_page()
        y = self.get_y()
        self.set_xy(18, y)
        self.cell(6, 5.5, "\u2022")
        self.set_xy(24, y)
        self.multi_cell(171, 5.5, text)
        self.ln(0.5)

    def _draw_table(self, table: dict):
        headers = table.get("headers", [])
        rows = table.get("rows", [])
        col_widths = table.get("col_widths", [])
        if not headers or not rows:
            return
        if not col_widths:
            w = 180 / len(headers)
            col_widths = [w] * len(headers)
        if self.get_y() > 230:
            self.add_page()
        ROW_H = 9

        self.set_fill_color(*NAVY)
        self.set_text_color(*WHITE)
        self.set_font("Arial", "B", 9.5)
        x_start = 15
        self.set_x(x_start)
        for i, h in enumerate(headers):
            self.cell(col_widths[i], ROW_H, f"  {h}", fill=True)
        self.ln()

        self.set_font("Arial", "", 9.5)
        for idx, row in enumerate(rows):
            if self.get_y() > 265:
                self.add_page()
            self.set_fill_color(*(TBL_ALT if idx % 2 == 1 else WHITE))
            self.set_x(x_start)
            for i, cell_text in enumerate(row):
                self.set_text_color(*DARK)
                self.set_font("Arial", "B" if i == 0 else "", 9.5)
                self.cell(col_widths[i], ROW_H, f"  {cell_text}", fill=True)
            self.ln()
            self.set_draw_color(*BORDER)
            self.line(x_start, self.get_y(), x_start + sum(col_widths), self.get_y())


def generate_pdf(data: dict, output_path: Path):
    pdf = ProposalPDF(data)
    pdf.build()
    pdf.output(str(output_path))


def main():
    if len(sys.argv) < 2:
        print("Usage: python create_proposal.py <path_to_proposal_json>")
        sys.exit(1)

    json_path = Path(sys.argv[1])
    if not json_path.exists():
        print(f"ERROR: File not found: {json_path}")
        sys.exit(1)

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    output_dir = SCRIPT_DIR / "output"
    output_dir.mkdir(exist_ok=True)
    proposal_number = data.get("proposal_number", "PRO-001")
    pdf_path = output_dir / f"Proposal_{proposal_number}.pdf"

    print("Building proposal PDF...")
    generate_pdf(data, pdf_path)
    print(f"PDF saved: {pdf_path}")

    drive_link = None
    if CREDENTIALS_FILE.exists():
        print("Uploading to Google Drive...")
        try:
            drive_service = get_drive_service()
            if drive_service:
                drive_link = upload_pdf_to_drive(drive_service, pdf_path, proposal_number)
        except Exception as e:
            print(f"Drive upload skipped: {e}")

    print("\n--- PROPOSAL CREATED ---")
    if drive_link:
        print(f"Google Drive: {drive_link}")
    print(f"PDF saved:    {pdf_path}")
    print(f"Proposal #:   {proposal_number}")
    print(f"Client:       {data.get('client_name', '')}")


if __name__ == "__main__":
    main()
