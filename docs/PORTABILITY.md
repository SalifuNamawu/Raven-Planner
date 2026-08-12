# Portability

## Architecture

```
Replit (develop) → GitHub (source of truth) → Vercel (deploy) → DNS (custom domain)
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

## Project Structure (Simplified)

```
/
├── api/send-email.ts   ← Vercel Function (email delivery)
├── src/                ← React app source
├── public/             ← Static assets
├── index.html
├── package.json        ← All app dependencies
├── vite.config.ts
├── tsconfig.json
└── artifacts/          ← Dev-only (not deployed)
```

## Development Environment

Replit is used as the development IDE only. It is not required for production.
All Replit-specific tooling is conditionally loaded and excluded from production builds.

## GitHub — Source of Truth

The complete application is reproducible from the GitHub repository.
All source, config, and lockfiles are committed.
Secrets are **NOT** committed — they live in Replit Secrets (dev) and Vercel Environment Variables (prod).

## Replit-Specific Components

| Component | Classification | Notes |
|---|---|---|
| `@replit/vite-plugin-cartographer` | development-only | Loaded only when `REPL_ID` is set and `NODE_ENV !== 'production'` |
| `@replit/vite-plugin-dev-banner` | development-only | Same guard as above |
| `@replit/vite-plugin-runtime-error-modal` | development-only | In devDependencies; safe in prod bundles |
| `REPL_ID` env var | development-only | Used only as a guard to enable Replit dev plugins |
| `BASE_PATH` env var | development-only | Injected by Replit artifact runner; defaults to `/` when absent |
| `PORT` env var | development-only | Required for dev server; not required at build time |
| `artifacts/api-server` | development-only | Express server for local /api proxy; not deployed |
| `artifacts/mockup-sandbox` | development-only | Design tool; not deployed |

## External Production Services

| Service | Provider | Purpose |
|---|---|---|
| Email | Gmail SMTP | Planner form submissions via `GMAIL_USER` / `GMAIL_APP_PASSWORD` |

## Portability Status

**PASS**

- ✅ No Replit-specific code in production paths
- ✅ No Replit Auth, Replit Database, or Replit Storage
- ✅ No secrets in committed files
- ✅ Replit dev plugins are conditionally loaded (dev-only guard)
- ✅ No persistent Express server required in production
- ✅ No database required in production
- ✅ Standard Vite project at repo root — Vercel auto-detects framework
- ✅ `vercel.json` provides minimal explicit config
- ✅ `api/send-email.ts` — Vercel Function, co-hosted with frontend (no CORS, no separate domain)
- ✅ Frontend calls `/api/send-email` — relative URL, works on Vercel and in Replit dev (via Vite proxy)
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
