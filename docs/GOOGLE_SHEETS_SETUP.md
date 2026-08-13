# Google Sheets Lead Tracking Setup

## 1. Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it "Raven Digital Leads"
3. Add the following headers in Row 1:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Lead ID | Date | Time | Business Type | Business Name | Business Description | Package | Base Price | Additional Features | Brand Identity Option | Logo Requirement | Logo Style | Logo Upload Status | Brand Colour | Custom Colours | Business Owner Name | Phone Number | Email | City | Website | Estimated Total | Submission Status | Contact Method | Follow-Up Status |

## 2. Create Google Apps Script

1. In the Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code and paste the following:

```javascript
const SHEET_NAME = 'Sheet1'; // Change if your sheet has a different name

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'saveLead') {
      return saveLead(data.data);
    } else if (data.action === 'updateLeadStatus') {
      return updateLeadStatus(data.leadId, data.submissionStatus, data.contactMethod);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Invalid action' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function saveLead(rowData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  
  // Check if lead already exists (by Lead ID in column A)
  const leadId = rowData[0];
  const existingRow = findRowByLeadId(sheet, leadId);
  
  if (existingRow > 0) {
    // Update existing row
    const range = sheet.getRange(existingRow, 1, 1, rowData.length);
    range.setValues([rowData]);
  } else {
    // Append new row
    sheet.appendRow(rowData);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function updateLeadStatus(leadId, submissionStatus, contactMethod) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const row = findRowByLeadId(sheet, leadId);
  
  if (row > 0) {
    // Column V (22) = Submission Status, Column W (23) = Contact Method
    sheet.getRange(row, 22).setValue(submissionStatus);
    sheet.getRange(row, 23).setValue(contactMethod);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Lead not found' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function findRowByLeadId(sheet, leadId) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) { // Start at 1 to skip header
    if (data[i][0] === leadId) {
      return i + 1; // +1 because array is 0-indexed but sheet rows are 1-indexed
    }
  }
  return 0;
}
```

3. Save the script (Ctrl+S)
4. Click **Deploy > New deployment**
5. Choose **Web app**
6. Set:
   - Description: "Raven Digital Lead Tracker"
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy**
8. Copy the **Web App URL** - it will look like:
   `https://script.google.com/macros/s/AKfycbxxxxx/exec`

## 3. Configure Vercel Environment Variables

In your Vercel project settings, add:

```
GOOGLE_APPS_SCRIPT_ID=AKfycbxxxxx
```

(Use the script ID from the Web App URL - the part after `/macros/s/` and before `/exec`)

## 4. Test the Integration

1. Deploy your Vercel app
2. Complete a test planner submission
3. Check the Google Sheet - you should see a new row with the lead data
4. The Submission Status should be "Completed – No Contact" initially
5. After clicking WhatsApp, it should update to "WhatsApp"

## Column Mapping Reference

| Column | Field | Description |
|--------|-------|-------------|
| A | Lead ID | Unique identifier (RD-YYYY-NNNN) |
| B | Date | Submission date |
| C | Time | Submission time |
| D | Business Type | Restaurant, Hotel, etc. |
| E | Business Name | From contact form |
| F | Business Description | Required textarea |
| G | Package | Launch Website / Business Pro |
| H | Base Price | 1199 / 2999 |
| I | Additional Features | Comma-separated list |
| J | Brand Identity Option | Have branding / Logo Design / Complete Branding |
| K | Logo Requirement | Have logo / Need design / No logo |
| L | Logo Style | Minimal, Modern, etc. (if design selected) |
| M | Logo Upload Status | Uploaded / Not uploaded / Will provide later |
| N | Brand Colour | Selected palette name |
| O | Custom Colours | Custom hex/description |
| P | Business Owner Name | Contact name |
| Q | Phone Number | Contact phone |
| R | Email | Contact email |
| S | City | Contact city |
| T | Website | Existing website URL |
| U | Estimated Total | Calculated total |
| V | Submission Status | Completed – No Contact / WhatsApp / Email |
| W | Contact Method | WhatsApp / Email / None |
| X | Follow-Up Status | New / Contacted / Quoted / Closed |