# Portability

## Architecture

```
Replit (develop) → GitHub (source of truth) → Vercel (deploy) → DNS (custom domain)
```

## Production Architecture

```
Vercel
├── Static frontend     (artifacts/raven-digital/dist/public)
└── /api/send-email     (api/send-email.ts — Vercel Serverless Function)
        ↓
    Gmail SMTP
```

No persistent Express server. No database. No external backend required.

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
| `@replit/vite-plugin-runtime-error-modal` | development-only | In devDependencies; not emitted in production bundles |
| `REPL_ID` env var | development-only | Used only as a guard to enable Replit dev plugins |
| `BASE_PATH` env var | development-only | Injected by Replit artifact runner; defaults to `/` when absent (Vercel) |
| `PORT` env var | development-only | Required for dev server; not required at build time |
| `artifacts/api-server` | development-only | Express server for local /api proxy; not deployed to Vercel |
| `artifacts/mockup-sandbox` | development-only | Design tool; not deployed |

## External Production Services

| Service | Provider | Purpose |
|---|---|---|
| Email | Gmail SMTP | Planner form submissions via `GMAIL_USER` / `GMAIL_APP_PASSWORD` |

## Workspace Analysis

| Package | Classification | Production? |
|---|---|---|
| `artifacts/raven-digital` | Required | YES — deployed to Vercel |
| `api/send-email.ts` | Required | YES — deployed as Vercel Function |
| `artifacts/api-server` | Development-only | NO — local proxy only |
| `artifacts/mockup-sandbox` | Development-only | NO — design tool |
| `lib/api-client-react` | Unused in production | NO — generated client, no active callers |
| `lib/api-spec` | Development-only | NO — OpenAPI codegen tool |
| `lib/api-zod` | Used by api-server only | NO — healthz route validation |
| `lib/db` | Unused | NO — empty schema, no queries |
| `scripts` | Development-only | NO — post-merge tooling |

## Portability Status

**PASS**

- ✅ No Replit-specific code in production paths
- ✅ No Replit Auth, Replit Database, or Replit Storage
- ✅ No secrets in committed files
- ✅ Replit dev plugins are conditionally loaded (dev-only guard)
- ✅ No persistent Express server required in production
- ✅ No database required in production
- ✅ `vercel.json` at repo root — one-click Vercel deployment
- ✅ `api/send-email.ts` — Vercel Function, co-hosted with frontend (no CORS, no separate domain)
- ✅ Frontend calls `/api/send-email` — relative URL, works identically on Vercel and in Replit dev (via Vite proxy)

## Handover Checklist

To hand this project to a client or another developer:

- [ ] Transfer GitHub repository ownership
- [ ] Transfer Vercel project
- [ ] Transfer domain / DNS
- [ ] Share `GMAIL_USER` via secure channel (never via Git)
- [ ] Share `GMAIL_APP_PASSWORD` via secure channel
- [ ] Transfer Gmail account used for `GMAIL_USER`, or reconfigure with the client's email
- [ ] Remove original developer's personal accounts from all production services
