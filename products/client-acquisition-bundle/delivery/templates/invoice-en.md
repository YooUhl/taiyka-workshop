# Invoice

> Template to fill in for each client invoice. Format works with a simple PDF layout. All `[FIELDS]` need to be replaced.

---

## Header

**INVOICE**
**No.:** [INVOICE_NUMBER, e.g. INV-001]

| Issue date | [ISSUE_DATE_DD/MM/YYYY] |
|---|---|
| Service date | [SERVICE_DATE_DD/MM/YYYY] |
| Due date | [DUE_DATE_DD/MM/YYYY] *(default Net 30)* |

---

## From

**[YOUR_NAME_OR_BUSINESS_NAME]**
[YOUR_ADDRESS]
[YOUR_POSTCODE] [YOUR_CITY], [YOUR_COUNTRY]
Business number: [YOUR_BUSINESS_NUMBER]
Email: [YOUR_EMAIL]

---

## Bill to

**[CLIENT_NAME_OR_COMPANY]**
[CLIENT_ADDRESS]
[CLIENT_POSTCODE] [CLIENT_CITY], [CLIENT_COUNTRY]
Email: [CLIENT_EMAIL]

---

## Line items

| Description | Quantity | Unit price (€) | Amount (€) |
|---|---:|---:|---:|
| [LINE_DESCRIPTION_1] | [QTY] | [UNIT_PRICE] | [AMOUNT] |
| [LINE_DESCRIPTION_2] | [QTY] | [UNIT_PRICE] | [AMOUNT] |
| [LINE_DESCRIPTION_3] | [QTY] | [UNIT_PRICE] | [AMOUNT] |

---

## Total

| | |
|---|---:|
| Subtotal | **[SUBTOTAL] €** |
| Tax | **[TAX_AMOUNT — often 0 €]** |
| **TOTAL DUE** | **[TOTAL_AMOUNT] €** |

---

## Payment terms

**Accepted payment methods:** [BANK TRANSFER / STRIPE / OTHER]

**Payment link:** [STRIPE_OR_OTHER_LINK — optional]

**Bank details (if transfer):**
IBAN: [YOUR_IBAN]
BIC / SWIFT: [YOUR_BIC]
Bank: [YOUR_BANK]

---

## Legal mentions

[ADAPT TO YOUR STATUS — examples:]

- *VAT not applicable* (or applicable rate based on your jurisdiction)
- Late payments may incur a flat-rate recovery fee and interest at the legal rate in force.
- No discount for early payment.

---

**Thank you for your business.**

[YOUR_NAME] — [YOUR_EMAIL]
