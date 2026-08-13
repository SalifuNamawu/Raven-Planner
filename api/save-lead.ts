import { VercelRequest, VercelResponse } from '@vercel/node';
import { createSign } from 'crypto';

const SPREADSHEET_ID = '18I2xuIcmddM_IryaJon4kuJ974rSKVSwHTfwxsXcJ9g';
const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

// ── JWT / OAuth ────────────────────────────────────────────────────────────────

async function getAccessToken(email: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const header  = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: email,
    scope: SHEETS_SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  })).toString('base64url');

  const signingInput = `${header}.${payload}`;
  const signer = createSign('RSA-SHA256');
  signer.update(signingInput);
  const signature = signer.sign(privateKey, 'base64url');

  const jwt = `${signingInput}.${signature}`;

  const tokenRes = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!tokenRes.ok) {
    const msg = await tokenRes.text();
    throw new Error(`OAuth token error: ${msg}`);
  }

  const { access_token } = await tokenRes.json() as { access_token: string };
  return access_token;
}

// ── Sheets append ──────────────────────────────────────────────────────────────

async function appendRow(accessToken: string, row: (string | number)[]): Promise<void> {
  const range = encodeURIComponent('Sheet1!A1');
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [row] }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Sheets append error: ${msg}`);
  }
}

// ── Handler ────────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKeyRaw        = process.env.GOOGLE_PRIVATE_KEY;

  // Graceful degradation — if credentials not yet configured, log and continue
  if (!serviceAccountEmail || !privateKeyRaw) {
    console.warn('[save-lead] Google Sheets credentials not set — skipping sheet write');
    return res.status(200).json({ ok: true, warning: 'Sheets credentials not configured' });
  }

  // Google stores private keys with literal \n in JSON — restore real newlines
  const privateKey = privateKeyRaw.replace(/\\n/g, '\n');

  const d = req.body as Record<string, unknown>;

  const row: (string | number)[] = [
    String(d.leadId             ?? ''),
    String(d.date               ?? ''),
    String(d.time               ?? ''),
    String(d.businessType       ?? ''),
    String(d.businessName       ?? ''),
    String(d.businessDescription ?? ''),
    String(d.package            ?? ''),
    Number(d.basePrice          ?? 0),
    String(d.additionalFeatures ?? 'None'),
    String(d.brandIdentityOption ?? ''),
    String(d.logoRequirement    ?? ''),
    String(d.logoStyle          ?? 'N/A'),
    String(d.logoUploadStatus   ?? 'N/A'),
    String(d.brandColour        ?? ''),
    String(d.customColours      ?? 'N/A'),
    String(d.businessOwnerName  ?? ''),
    String(d.phoneNumber        ?? ''),
    String(d.email              ?? ''),
    String(d.city               ?? ''),
    String(d.website            ?? 'N/A'),
    Number(d.estimatedTotal     ?? 0),
    String(d.submissionStatus   ?? ''),
    String(d.contactMethod      ?? ''),
    String(d.followUpStatus     ?? 'New'),
  ];

  try {
    const token = await getAccessToken(serviceAccountEmail, privateKey);
    await appendRow(token, row);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[save-lead] Failed to write to Google Sheets:', err);
    // Return 500 so the frontend can show the retry button
    return res.status(500).json({ error: String(err) });
  }
}
