# Deployment Guide

## Stack

- **Package manager:** pnpm 10+
- **Node version:** 24+ (see `engines` in `package.json`)
- **Frontend framework:** Vite + React (static build)
- **API:** Vercel Functions (serverless — no persistent process required)
- **Monorepo:** YES — pnpm workspaces

## Install

```bash
pnpm install
```

## Build

```bash
# Build the frontend only
pnpm --filter @workspace/raven-digital run build

# Build everything (typecheck + all packages)
pnpm run build
```

## Output Directories

| App | Output |
|---|---|
| `raven-digital` frontend | `artifacts/raven-digital/dist/public` |

---

## Vercel Deployment

Connect the GitHub repository to a new Vercel project. Vercel reads `vercel.json` at the repo root — no manual configuration needed beyond environment variables.

### `vercel.json` (already in repo)

```json
{
  "buildCommand": "pnpm --filter @workspace/raven-digital run build",
  "outputDirectory": "artifacts/raven-digital/dist/public",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": null
}
```

### Vercel Project Settings

| Setting | Value |
|---|---|
| Root Directory | *(repo root — leave blank)* |
| Framework Preset | Other (auto-detected via vercel.json) |
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

> **No `VITE_API_BASE_URL` needed.** The frontend calls `/api/send-email` relative to its own origin, which is handled by the Vercel Function on the same domain.

---

## Deployment Workflow

```
1. Develop on a feature branch in Replit
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

## Local Development (outside Replit)

```bash
# Install dependencies
pnpm install

# Start the API server (for /api proxy in dev — optional, email falls back gracefully)
PORT=8080 GMAIL_USER=... GMAIL_APP_PASSWORD=... pnpm --filter @workspace/api-server run dev

# Start the frontend dev server
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/raven-digital run dev
```

The Vite dev server proxies `/api/*` → `http://localhost:8080` automatically.
If the API server is not running, email submissions fall back gracefully (WhatsApp is the primary channel).

Required local env vars:

| Variable | Example |
|---|---|
| `PORT` | `3000` (frontend), `8080` (API server) |
| `BASE_PATH` | `/` |
| `GMAIL_USER` | `your@gmail.com` |
| `GMAIL_APP_PASSWORD` | `abcd efgh ijkl mnop` |

---

## Architecture Notes

### Why no separate Express server in production?

The planner's only backend operation is sending email. This is a stateless, request-scoped operation:
- No database reads or writes
- No background processing
- No long-running state
- No WebSockets

A Vercel Serverless Function handles this perfectly. No persistent server is needed.

### Why keep the Express API server in the repo?

The Express server (`artifacts/api-server`) provides the local `/api` endpoint during Replit development, proxied from the Vite dev server. It is **not** deployed to Vercel. The production path is:

```
Browser → Vercel CDN (static) + Vercel Function (/api/send-email)
```

### Why no database?

The planner submits via WhatsApp and email only. There is no data that needs to be stored server-side. `lib/db` exists as a workspace package with an empty schema — it is not used in production and does not need to be provisioned.
