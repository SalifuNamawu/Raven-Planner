/**
 * Local dev API server — mirrors the Vercel serverless functions so that
 * Vite's proxy (/api → localhost:8080) works during development.
 *
 * Run with:  node api-server.mjs
 * Node 24+:  no compilation needed.
 */
import http from 'node:http';
import { createSign } from 'node:crypto';

const PORT = Number(process.env.API_PORT ?? 8080);

// ── helpers ──────────────────────────────────────────────────────────────────

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(raw || '{}')); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    'Access-Control-Allow-Origin': '*',
  });
  res.end(payload);
}

// ── Google Sheets ─────────────────────────────────────────────────────────────

const SPREADSHEET_ID = '18I2xuIcmddM_IryaJon4kuJ974rSKVSwHTfwxsXcJ9g';
const SHEETS_SCOPE   = 'https://www.googleapis.com/auth/spreadsheets';
const TOKEN_URL      = 'https://oauth2.googleapis.com/token';

async function getAccessToken(email, privateKey) {
  const now     = Math.floor(Date.now() / 1000);
  const header  = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: email, scope: SHEETS_SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600,
  })).toString('base64url');

  const sigInput  = `${header}.${payload}`;
  const signer    = createSign('RSA-SHA256');
  signer.update(sigInput);
  const signature = signer.sign(privateKey, 'base64url');

  const tokenRes = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${sigInput}.${signature}`,
    }),
  });
  if (!tokenRes.ok) throw new Error(`OAuth error: ${await tokenRes.text()}`);
  const { access_token } = await tokenRes.json();
  return access_token;
}

async function appendRow(accessToken, row) {
  const range = encodeURIComponent('Sheet1!A1');
  const url   = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const res   = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [row] }),
  });
  if (!res.ok) throw new Error(`Sheets error: ${await res.text()}`);
}

async function handleSaveLead(req, res) {
  const d = await readBody(req);

  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKeyRaw       = process.env.GOOGLE_PRIVATE_KEY;

  if (!serviceAccountEmail || !privateKeyRaw) {
    console.warn('[save-lead] Sheets credentials not set — skipping write');
    return json(res, 200, { ok: true, warning: 'Sheets credentials not configured' });
  }

  const privateKey = privateKeyRaw.replace(/\\n/g, '\n');

  const row = [
    String(d.leadId              ?? ''),
    String(d.date                ?? ''),
    String(d.time                ?? ''),
    String(d.businessType        ?? ''),
    String(d.businessName        ?? ''),
    String(d.businessDescription ?? ''),
    String(d.package             ?? ''),
    Number(d.basePrice           ?? 0),
    String(d.additionalFeatures  ?? 'None'),
    String(d.brandIdentityOption ?? ''),
    String(d.logoRequirement     ?? ''),
    String(d.logoStyle           ?? 'N/A'),
    String(d.logoUploadStatus    ?? 'N/A'),
    String(d.brandColour         ?? ''),
    String(d.customColours       ?? 'N/A'),
    String(d.businessOwnerName   ?? ''),
    String(d.phoneNumber         ?? ''),
    String(d.email               ?? ''),
    String(d.city                ?? ''),
    String(d.website             ?? 'N/A'),
    Number(d.estimatedTotal      ?? 0),
    String(d.submissionStatus    ?? ''),
    String(d.contactMethod       ?? ''),
    String(d.followUpStatus      ?? 'New'),
  ];

  try {
    const token = await getAccessToken(serviceAccountEmail, privateKey);
    await appendRow(token, row);
    console.log('[save-lead] ✓ Row appended for lead', d.leadId);
    return json(res, 200, { ok: true });
  } catch (err) {
    console.error('[save-lead] Failed:', err.message);
    return json(res, 500, { error: String(err) });
  }
}

// ── Email (nodemailer) ────────────────────────────────────────────────────────

async function handleSendEmail(req, res) {
  const d = await readBody(req);

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    console.warn('[send-email] Gmail credentials not set');
    return json(res, 503, { error: 'Email not configured' });
  }

  // Lazy-import nodemailer (CommonJS interop)
  const nm = await import('nodemailer');
  const transporter = nm.default.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from:    `"Raven Digital" <${user}>`,
      to:      d.to    ?? 'raven.dig.mar@gmail.com',
      subject: d.subject ?? 'New lead',
      text:    d.body  ?? '',
    });
    console.log('[send-email] ✓ Sent to', d.to);
    return json(res, 200, { ok: true });
  } catch (err) {
    console.error('[send-email] Failed:', err.message);
    return json(res, 500, { error: String(err) });
  }
}

// ── Router ────────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' });
    return res.end();
  }

  try {
    if (req.method === 'POST' && req.url === '/api/save-lead')  return await handleSaveLead(req, res);
    if (req.method === 'POST' && req.url === '/api/send-email') return await handleSendEmail(req, res);

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  } catch (err) {
    console.error('Unhandled:', err);
    json(res, 500, { error: String(err) });
  }
});

server.listen(PORT, () => {
  console.log(`[api-server] Listening on http://localhost:${PORT}`);
});
