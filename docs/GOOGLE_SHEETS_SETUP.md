# Google Sheets Lead Tracking Setup

Completed planner forms are saved directly to Google Sheets using a service account. No Google Apps Script or public webhook is required.

## 1. Share the spreadsheet

Open the target Google Sheet and click **Share**. Add the service account email from the credential JSON as an **Editor**. The service account needs editor access to add and update lead rows.

## 2. Set the Vercel environment variables

In **Vercel → Project Settings → Environment Variables**, add these values for Production and Preview:

| Variable | Value |
| --- | --- |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | `18I2xuIcmddM_IryaJon4kuJ974rSKVSwHTfwxsXcJ9g` |
| `GOOGLE_SHEETS_SHEET_NAME` | The worksheet tab name, normally `Sheet1` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | The `client_email` value from the credential JSON |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | The `private_key` value from the credential JSON, including `-----BEGIN` and `-----END` lines |

For local testing, create an ignored `.env.local` based on `.env.example`. Keep the key on one line with literal `\n` characters; the API converts those to line breaks securely at runtime.

## 3. Set the header row

The first worksheet row must contain these headers, in order:

| Lead ID | Date | Time | Business Type | Business Name | Business Description | Package | Base Price | Additional Features | Brand Identity Option | Logo Requirement | Logo Style | Logo Upload Status | Brand Colour | Custom Colours | Business Owner Name | Phone Number | Email | City | Website | Estimated Total | Submission Status | Contact Method | Follow-Up Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Behaviour

- Finishing the planner creates a lead row.
- Continuing through WhatsApp or email updates the same row instead of creating a duplicate.
- The API identifies rows by **Lead ID**, so do not edit that column.
