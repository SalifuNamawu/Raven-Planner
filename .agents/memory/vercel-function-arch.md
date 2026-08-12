---
name: Vercel Function architecture
description: How the Raven Digital planner sends email — Vercel Function in production, Express proxy in dev
---

The planner's email backend was migrated from a persistent Express server to a Vercel Serverless Function.

**Production path:** Frontend → `/api/send-email` → `api/send-email.ts` (Vercel Function) → Gmail SMTP

**Dev path:** Frontend → `/api/send-email` → Vite proxy (`server.proxy`) → `localhost:8080` (Express API server)

**Why:** The only API route that matters for production is POST `/send-email`. It is fully stateless (no DB, no shared state). Express was only needed in Replit dev.

**How to apply:**
- `vercel.json` at repo root specifies `buildCommand`, `outputDirectory`, `installCommand`, `framework: null`
- `api/send-email.ts` at repo root is the Vercel Function (default export `handler(req, res)`)
- `artifacts/raven-digital/vite.config.ts` has `server.proxy['/api']` → `http://localhost:${API_PORT ?? 8080}`
- Frontend calls `/api/send-email` (relative) — no `VITE_API_BASE_URL` needed
- `nodemailer` + `@types/nodemailer` in root `package.json` (for the function) and `artifacts/api-server/package.json` (for dev server)
- `lib/db` exists with empty schema — NOT used in production, NOT provisioned
- `@workspace/api-client-react` removed from `raven-digital` — `setBaseUrl` was a no-op (planner uses raw fetch)
