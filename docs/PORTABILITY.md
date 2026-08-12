# Portability

## Architecture

```
Replit (develop) → GitHub (source of truth) → Vercel (deploy) → DNS (custom domain)
```

## Development Environment

Replit is used as the development IDE only. It is not required for production.
All Replit-specific tooling is conditionally loaded and excluded from production builds.

## GitHub — Source of Truth

The complete application is reproducible from the GitHub repository.
All source, config, migrations, and lockfiles are committed.
Secrets are **NOT** committed — they live in Replit Secrets (dev) and Vercel Environment Variables (prod).

## Production Platform

- **Frontend:** Vercel (static Vite build)
- **API Server:** Vercel (separate project) or Railway / Render (persistent Express process)

## Replit-Specific Components

| Component | Classification | Notes |
|---|---|---|
| `@replit/vite-plugin-cartographer` | development-only | Loaded only when `REPL_ID` is set and `NODE_ENV !== 'production'` |
| `@replit/vite-plugin-dev-banner` | development-only | Same guard as above |
| `@replit/vite-plugin-runtime-error-modal` | development-only | Included in devDependencies; safe to keep |
| `REPL_ID` env var | development-only | Used only as a guard to enable Replit dev plugins |
| `BASE_PATH` env var | development-only | Injected by Replit artifact runner; defaults to `/` when absent (Vercel) |
| `PORT` env var | development-only | Required for dev server; not required at build time |

## External Production Services

| Service | Provider | Purpose |
|---|---|---|
| Database | PostgreSQL (e.g. Neon, Supabase, Railway) | Drizzle ORM via `DATABASE_URL` |
| Email | Gmail SMTP | Planner form submissions via `GMAIL_USER` / `GMAIL_APP_PASSWORD` |

## Portability Status

**PASS WITH WARNINGS**

- ✅ No Replit-specific code in production paths
- ✅ No Replit Auth, Replit Database, or Replit Storage
- ✅ No secrets in committed files
- ✅ Replit dev plugins are conditionally loaded (dev-only guard)
- ⚠️ `DATABASE_URL` is required by `lib/db` — the DB package is a workspace dependency but the schema is currently empty (`lib/db/src/schema/index.ts` exports nothing). Ensure a real PostgreSQL database is provisioned before deploying the API server.

## Known Portability Limitations

- The API server is a persistent Express process and cannot run as a Vercel Serverless Function without adaptation. Deploy it to Railway, Render, or as a separate Vercel project using `@vercel/node`.
- If the API is deployed on a different domain from the frontend, `VITE_API_BASE_URL` must be set and `setBaseUrl()` must be called in the frontend entry point before API calls are made. (No cross-origin API calls exist yet in the frontend.)

## Handover Checklist

To hand this project to a client or another developer:

- [ ] Transfer GitHub repository ownership
- [ ] Transfer Vercel project (frontend)
- [ ] Transfer Vercel / Railway project (API server)
- [ ] Transfer domain / DNS
- [ ] Share `DATABASE_URL` via secure channel (never via Git)
- [ ] Share `SESSION_SECRET`, `GMAIL_USER`, `GMAIL_APP_PASSWORD` via secure channel
- [ ] Transfer Gmail account used for `GMAIL_USER`, or reconfigure with the client's email
- [ ] Remove original developer's personal accounts from all production services
