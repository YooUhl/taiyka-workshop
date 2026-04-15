# Funnel — Email Capture & Delivery

Automation glue between the website (or a form) and the user's inbox.

## Files

- [n8n-workflows/lead-magnet-delivery.json](n8n-workflows/lead-magnet-delivery.json) — POST `/webhook/leadmagnet-n8n-pack` → save lead to Google Sheet → send delivery email (FR or EN based on input)

## Setup checklist for `lead-magnet-delivery.json`

1. **Host the deliverable ZIPs** somewhere with public direct-download links:
   - Upload `products/free-n8n-pack/delivery/` (workflows + guide PDF) to Google Drive, Dropbox, or Cloudflare R2
   - Get the FR ZIP link → replace `PASTE_YOUR_FR_ZIP_LINK_HERE` in the workflow
   - Get the EN ZIP link → replace `PASTE_YOUR_EN_ZIP_LINK_HERE`

2. **Create the leads Google Sheet**:
   - Columns: `captured_at`, `email`, `name`, `lang`, `source`, `product`
   - Copy the sheet ID (from the URL) → replace `PASTE_YOUR_LEADS_SHEET_ID_HERE`

3. **Connect credentials in n8n**:
   - Google Sheets OAuth → replace `REPLACE_WITH_YOUR_SHEETS_CREDENTIAL_ID`
   - Gmail OAuth → replace `REPLACE_WITH_YOUR_GMAIL_CREDENTIAL_ID`

4. **Activate the workflow** → the webhook URL appears in n8n. Use it as the form action on the landing page.

## Webhook contract

POST to `/webhook/leadmagnet-n8n-pack` with JSON body:

```json
{
  "email":  "buyer@example.com",
  "name":   "Optional first name",
  "lang":   "fr",
  "source": "instagram-bio | linkedin | landing-page | etc."
}
```

Response: `{ "status": "ok", "message": "Lead captured, email sent." }`

## Future expansion

- Add a 3-day follow-up email (Day 0 = delivery, Day 3 = "have you tried it?", Day 7 = upsell to Tier 1)
- Pipe leads into a real ESP (Resend, Loops, Mailerlite) once volume justifies it
- Tag leads by `source` for attribution
