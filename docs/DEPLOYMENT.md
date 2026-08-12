# Deployment Guide

## Stack

- **Package manager:** pnpm 10+
- **Node version:** 24+ (see `engines` in `package.json`)
- **Frontend framework:** Vite + React (static build)
- **API framework:** Express 5 (persistent process)
- **Monorepo:** YES — pnpm workspaces

## Install

```bash
pnpm install
```

## Build

```bash
# Build the frontend only
pnpm --filter @workspace/raven-digital run build

# Build the API server only
pnpm --filter @workspace/api-server run build

# Build everything (typecheck + all packages)
pnpm run build
```

## Output Directories

| App | Output |
|---|---|
| `raven-digital` frontend | `artifacts/raven-digital/dist/public` |
| `api-server` | `artifacts/api-server/dist/index.mjs` |

---

## Vercel — Frontend (raven-digital)

Create a **new Vercel project** linked to the GitHub repository with these settings:

| Setting | Value |
|---|---|
| Framework Preset | Other |
| Root Directory | `artifacts/raven-digital` |
| Install Command | `cd ../.. && pnpm install` |
| Build Command | `cd ../.. && pnpm --filter @workspace/raven-digital run build` |
| Output Directory | `dist/public` |
| Node Version | 24.x |
| Production Branch | `main` |

### Environment Variables (Vercel — Frontend)

Configure in **Vercel → Settings → Environment Variables**.

#### Public / client-safe (`VITE_` prefix — included in browser bundle)

| Variable | Environment | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Production, Preview | Full URL of the deployed API server, e.g. `https://api.ravendigital.com.gh`. Leave unset if frontend and API share the same origin. |

> **Note:** No `VITE_*` variables are currently read by the frontend source. Set `VITE_API_BASE_URL` and call `setBaseUrl(import.meta.env.VITE_API_BASE_URL)` in `src/main.tsx` when you need the frontend to call the API across origins.

---

## API Server — Deployment Options

The API server is a persistent Express process. It cannot run as a stateless Vercel Serverless Function without adaptation. Choose one of:

### Option A — Railway (recommended for simplicity)

1. Create a new Railway project from the GitHub repo
2. Set the **Start Command:** `pnpm --filter @workspace/api-server run start`
3. Set the **Build Command:** `pnpm install && pnpm --filter @workspace/api-server run build`
4. Set all environment variables (see below)
5. Note the Railway-assigned URL; use it as `VITE_API_BASE_URL` in Vercel

### Option B — Separate Vercel Project

1. Create a second Vercel project for the API
2. Set **Root Directory** to `artifacts/api-server`
3. Set **Build Command** to `cd ../.. && pnpm --filter @workspace/api-server run build`
4. Set **Output Directory** to `dist`
5. Add a `vercel.json` inside `artifacts/api-server/` to expose the Express app via `@vercel/node`

### Environment Variables (API Server)

| Variable | Environment | Description |
|---|---|---|
| `PORT` | All | Port to listen on (set automatically by Railway / Vercel) |
| `DATABASE_URL` | Production, Preview | PostgreSQL connection string |
| `SESSION_SECRET` | Production, Preview | Session signing secret (min 32 chars) |
| `GMAIL_USER` | Production, Preview | Gmail address used to send planner submissions |
| `GMAIL_APP_PASSWORD` | Production, Preview | Gmail App Password (16-char, not the account password) |
| `NODE_ENV` | Production | Set to `production` |

---

## Deployment Workflow

```
1. Develop on a feature branch in Replit
2. Push branch to GitHub
3. Vercel automatically creates a Preview deployment for the frontend
4. Review and QA the Preview URL
5. Merge branch to `main`
6. Vercel automatically promotes to Production
7. Site is live at the custom domain
```

---

## Custom Domain / DNS

1. Add domain in **Vercel → Settings → Domains**
2. At your DNS registrar (e.g. GoDaddy, Namecheap, Cloudflare):
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

### Database (PostgreSQL)

1. Provision a PostgreSQL database on [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app)
2. Copy the connection string
3. Set `DATABASE_URL` in your deployment environment
4. Run schema migrations (when schema tables are defined):
   ```bash
   DATABASE_URL=<your-url> pnpm --filter @workspace/db run push
   ```

---

## Local Development (outside Replit)

```bash
# Install dependencies
pnpm install

# Copy environment variables template
cp .env.example .env  # create this file with your local values

# Start the API server (requires DATABASE_URL, PORT)
PORT=5000 pnpm --filter @workspace/api-server run dev

# Start the frontend dev server (requires PORT, BASE_PATH)
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/raven-digital run dev
```

Required local env vars:
| Variable | Example |
|---|---|
| `PORT` | `3000` (frontend), `5000` (API) |
| `BASE_PATH` | `/` |
| `DATABASE_URL` | `postgresql://user:pass@localhost:5432/ravendb` |
| `GMAIL_USER` | `your@gmail.com` |
| `GMAIL_APP_PASSWORD` | `abcd efgh ijkl mnop` |
