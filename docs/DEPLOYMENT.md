# Deployment Guide

## Stack

- **Package manager:** pnpm 10+
- **Node version:** 24+ (see `engines` in `package.json`)
- **Frontend framework:** Vite + React (static build)
- **API:** Vercel Functions (serverless — no persistent process required)
- **Structure:** single project at repo root

## Project Structure

```
/
├── api/
│   └── send-email.ts       ← Vercel Serverless Function
├── src/                    ← React application source
├── public/                 ← Static assets (favicon, robots.txt)
├── index.html              ← Entry point
├── package.json            ← App dependencies + scripts
├── vite.config.ts          ← Build configuration
├── tsconfig.json           ← TypeScript configuration
├── tsconfig.base.json      ← Base TypeScript configuration
├── vercel.json             ← Vercel deployment config
└── docs/                   ← Documentation
    ├── PORTABILITY.md
    └── DEPLOYMENT.md
```

## Install

```bash
pnpm install
```

## Build

```bash
pnpm run build
```

Output: `dist/`

## Vercel Deployment

Connect the GitHub repository to a new Vercel project. Vercel reads `vercel.json` at the repo root — no manual configuration required beyond environment variables.

### `vercel.json` (already in repo)

```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install --frozen-lockfile"
}
```

### Vercel Project Settings

| Setting | Value |
|---|---|
| Root Directory | *(repo root — leave blank)* |
| Framework Preset | Vite (auto-detected) |
| Node Version | 24.x |
| Production Branch | `main` |

### Vercel Functions

`api/send-email.ts` at the repo root is automatically deployed as a Vercel Serverless Function at `/api/send-email`. No extra configuration is needed.

### Environment Variables

Configure in **Vercel → Settings → Environment Variables**.

| Variable | Environments | Description |
|---|---|---|
| `GMAIL_USER` | Production, Preview | Gmail address used to send planner submissions |
| `GMAIL_APP_PASSWORD` | Production, Preview | Gmail App Password (16-char, not the account password) |

> **No `VITE_API_BASE_URL` needed.** The frontend calls `/api/send-email` relative to its own origin, which maps to the Vercel Function on the same domain.

---

## Deployment Workflow

```
1. Develop locally or in any IDE
2. Push branch to GitHub
3. Vercel automatically creates a Preview deployment
4. Review and QA the Preview URL
5. Merge branch to `main`
6. Vercel automatically promotes to Production
7. Site is live at the custom domain
```

---

## Custom Domain / DNS

1. Add domain in **Vercel → Settings → Domains**
2. At your DNS registrar (GoDaddy, Namecheap, Cloudflare, etc.):
   - Add a `CNAME` record: `www` → `cname.vercel-dns.com`
   - Add an `A` record for the apex (`@`) → Vercel's IP (shown in the Vercel UI)
3. Vercel provisions HTTPS automatically via Let's Encrypt

---

## External Services Setup

### Email (Gmail SMTP)

1. Enable **2-Factor Authentication** on the Gmail account used for sending
2. Go to **Google Account → Security → 2-Step Verification → App Passwords**
3. Generate an App Password for "Mail"
4. Set `GMAIL_USER` = the full Gmail address (e.g. `raven.dig.mar@gmail.com`)
5. Set `GMAIL_APP_PASSWORD` = the 16-character generated password

---

## Local Development

```bash
# Install dependencies
pnpm install

# Start the frontend dev server
pnpm run dev
```

The Vite dev server runs on `http://localhost:3000` (or PORT env var).

### Optional: Local API Server

For local email testing, run a local API server on port 8080:

```bash
# In a separate terminal
PORT=8080 GMAIL_USER=... GMAIL_APP_PASSWORD=... node api/send-email.ts
```

The Vite dev server proxies `/api/*` → `http://localhost:8080` automatically.
If the API server is not running, email submissions fall back gracefully (WhatsApp is the primary channel).

Required local env vars:

| Variable | Example | Notes |
|---|---|---|
| `PORT` | `3000` | Frontend dev server port (optional, defaults to 3000) |
| `GMAIL_USER` | `your@gmail.com` | Optional for local dev |
| `GMAIL_APP_PASSWORD` | `abcd efgh ijkl mnop` | Optional for local dev |

---

## Architecture Notes

### Why no separate Express server in production?

The planner's only backend operation is sending email — a stateless, request-scoped operation with no database, no background processing, and no shared state. A Vercel Serverless Function handles this perfectly.

### Why no database?

The planner submits via WhatsApp and email only. No data is stored server-side.