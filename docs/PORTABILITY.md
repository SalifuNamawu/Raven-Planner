# Portability

## Architecture

```
GitHub (source of truth) → Vercel (deploy) → DNS (custom domain)
```

## Production Architecture

```
Vercel
├── Static frontend  (dist/)
└── /api/send-email  (api/send-email.ts — Vercel Serverless Function)
        ↓
    Gmail SMTP
```

One repository. One Vercel project. No persistent server. No database.

## Project Structure

```
/
├── api/
│   └── send-email.ts   ← Vercel Function (email delivery)
├── src/                ← React app source
├── public/             ← Static assets
├── index.html
├── package.json        ← All app dependencies
├── vite.config.ts
├── tsconfig.json
├── tsconfig.base.json
├── vercel.json
└── docs/
    ├── PORTABILITY.md
    └── DEPLOYMENT.md
```

## Development Environment

Standard Node.js development environment. No Replit-specific tooling required.

## GitHub — Source of Truth

The complete application is reproducible from the GitHub repository.
All source, config, and lockfiles are committed.
Secrets are **NOT** committed — they live in Vercel Environment Variables (prod) and local `.env` (dev).

## External Production Services

| Service | Provider | Purpose |
|---|---|---|
| Email | Gmail SMTP | Planner form submissions via `GMAIL_USER` / `GMAIL_APP_PASSWORD` |

## Portability Status

**PASS**

- ✅ No Replit-specific code or configuration
- ✅ No Replit Auth, Replit Database, or Replit Storage
- ✅ No secrets in committed files
- ✅ No persistent Express server required in production
- ✅ No database required in production
- ✅ Standard Vite project at repo root — Vercel auto-detects framework
- ✅ `vercel.json` provides minimal explicit config
- ✅ `api/send-email.ts` — Vercel Function, co-hosted with frontend (no CORS, no separate domain)
- ✅ Frontend calls `/api/send-email` — relative URL, works on Vercel and in local dev (via Vite proxy)
- ✅ Single `package.json` at root — all dependencies in one place

## Handover Checklist

To hand this project to a client or another developer:

- [ ] Transfer GitHub repository ownership
- [ ] Transfer Vercel project
- [ ] Transfer domain / DNS
- [ ] Share `GMAIL_USER` via secure channel (never via Git)
- [ ] Share `GMAIL_APP_PASSWORD` via secure channel
- [ ] Transfer Gmail account used for `GMAIL_USER`, or reconfigure with the client's email
- [ ] Remove original developer's personal accounts from all production services