import { createSign } from 'node:crypto';

const GOOGLE_SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const DEFAULT_SHEET_NAME = 'Sheet1';
const LEAD_COLUMN_COUNT = 24;

interface GoogleSheetsConfig {
  spreadsheetId: string;
  sheetName: string;
  clientEmail: string;
  privateKey: string;
  tokenUri: string;
}

interface AccessToken {
  value: string;
  expiresAt: number;
}

let cachedAccessToken: AccessToken | undefined;

function encodeBase64Url(value: string): string {
  return Buffer.from(value).toString('base64url');
}

function getConfig(): GoogleSheetsConfig {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!spreadsheetId || !clientEmail || !privateKey) {
    throw new Error('Google Sheets credentials are not configured');
  }

  return {
    spreadsheetId,
    sheetName: process.env.GOOGLE_SHEETS_SHEET_NAME || DEFAULT_SHEET_NAME,
    clientEmail,
    privateKey,
    tokenUri: process.env.GOOGLE_SERVICE_ACCOUNT_TOKEN_URI || 'https://oauth2.googleapis.com/token',
  };
}

async function getAccessToken(config: GoogleSheetsConfig): Promise<string> {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now() + 60_000) {
    return cachedAccessToken.value;
  }

  const now = Math.floor(Date.now() / 1000);
  const unsignedToken = [
    encodeBase64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' })),
    encodeBase64Url(JSON.stringify({
      iss: config.clientEmail,
      scope: GOOGLE_SHEETS_SCOPE,
      aud: config.tokenUri,
      iat: now,
      exp: now + 3600,
    })),
  ].join('.');

  const signer = createSign('RSA-SHA256');
  signer.update(unsignedToken);
  signer.end();
  const assertion = `${unsignedToken}.${signer.sign(config.privateKey, 'base64url')}`;

  const response = await fetch(config.tokenUri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!response.ok) {
    throw new Error(`Google authentication failed (${response.status})`);
  }

  const payload = await response.json() as { access_token?: string; expires_in?: number };
  if (!payload.access_token) {
    throw new Error('Google authentication returned no access token');
  }

  cachedAccessToken = {
    value: payload.access_token,
    expiresAt: Date.now() + (payload.expires_in || 3600) * 1000,
  };
  return cachedAccessToken.value;
}

function sheetRange(sheetName: string, range: string): string {
  return encodeURIComponent(`${sheetName}!${range}`);
}

async function sheetsRequest(path: string, init: RequestInit = {}): Promise<Response> {
  const config = getConfig();
  const accessToken = await getAccessToken(config);
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Google Sheets request failed (${response.status})`);
  }
  return response;
}

async function findLeadRow(leadId: string): Promise<number | undefined> {
  const { sheetName } = getConfig();
  const response = await sheetsRequest(`values/${sheetRange(sheetName, 'A2:A')}`);
  const payload = await response.json() as { values?: string[][] };
  const index = payload.values?.findIndex(([value]) => value === leadId) ?? -1;
  return index >= 0 ? index + 2 : undefined;
}

export async function upsertLead(row: string[]): Promise<void> {
  if (row.length !== LEAD_COLUMN_COUNT || !row[0]) {
    throw new Error('Invalid lead row');
  }

  const { sheetName } = getConfig();
  const existingRow = await findLeadRow(row[0]);

  if (existingRow) {
    await sheetsRequest(`values/${sheetRange(sheetName, `A${existingRow}:X${existingRow}`)}?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      body: JSON.stringify({ values: [row] }),
    });
    return;
  }

  await sheetsRequest(`values/${sheetRange(sheetName, 'A:X')}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, {
    method: 'POST',
    body: JSON.stringify({ values: [row] }),
  });
}

export async function updateLeadStatusInSheet(leadId: string, submissionStatus: string, contactMethod: string): Promise<boolean> {
  const { sheetName } = getConfig();
  const row = await findLeadRow(leadId);
  if (!row) return false;

  await sheetsRequest(`values/${sheetRange(sheetName, `V${row}:W${row}`)}?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    body: JSON.stringify({ values: [[submissionStatus, contactMethod]] }),
  });
  return true;
}
