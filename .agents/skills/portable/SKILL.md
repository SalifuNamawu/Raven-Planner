---
name: portable
description: Audits and enforces production portability for any project. Ensures the app can be developed in Replit, owned in GitHub, deployed independently to Vercel, and handed over to a client without depending on Replit for production. Use when the user says "run the portable skill", "portable audit", "make this deployable to Vercel", "check portability", "prepare for handover", or "can this run without Replit".
---

# Portable

Enforce the architecture: **Develop in Replit → Own in GitHub → Deploy on Vercel → Route via DNS.**

Replit is a development tool only. Production must never depend on it.

## Invocation Modes

- **`portable`** — NORMAL MODE: inspect, audit, fix safe issues, validate, document, report.
- **`portable audit`** — AUDIT-ONLY MODE: inspect, audit, report. Do NOT modify any files.

---

## Core Principle

> If Replit disappeared tomorrow, could this application be cloned from GitHub, configured with its documented external services, built, deployed, operated, and handed over?

If YES → portable. If NO → identify exactly why and fix or report the dependency.

---

## Execution Procedure (NORMAL MODE)

### Step 1 — Inspect

Read: `package.json`, lockfiles, workspace config, framework config, build config, `.gitignore`, `replit.md`, `artifact.toml`, `.replit`, `vercel.json` (if present), `tsconfig.json`.

Identify: framework, package manager + version, runtime/Node version, monorepo structure, frontend, backend, database, storage, auth, email, external APIs.

### Step 2 — Detect Architecture

Determine:
- Package manager (`npm` / `pnpm` / `yarn` / `bun`) and lockfile
- Node/runtime version (`engines`, `.nvmrc`, `.node-version`, `packageManager`)
- Monorepo: workspace roots, all deployable apps, shared packages
- Frontend framework (Vite/React, Next.js, etc.)
- Backend (Express, Next.js API routes, standalone server, none)
- Database, storage, auth, email services

#### Workspace Analysis (monorepos)

Do not assume every workspace package is a production requirement. For each package, determine:

| Classification | Description |
|---|---|
| `production` | Built and deployed; genuinely needed at runtime |
| `development-only` | Used for local dev, design tools, sandboxes, code generators |
| `unused` | Listed in workspace but never imported by any production code |

Specifically identify:
- **Mockup / sandbox apps** — design tools, component playgrounds (e.g. `mockup-sandbox`). Not production.
- **Code generation packages** — OpenAPI generators, Orval, Prisma codegen. Run at dev time only.
- **Shared libraries with empty schemas or zero callers** — a `lib/db` package with an empty schema and no production queries is unused.
- **Orphaned generated code** — `lib/api-client-react` with no active callers in the main app.

### Step 3 — Reproducibility Check

Confirm that GitHub would contain everything needed to reproduce:
- Source code, workspace config, TypeScript config, framework config, build config, lockfile, static assets, DB schema/migrations
- NOT committed: secrets, `.env` with values, generated outputs that can be rebuilt

### Step 4 — Portability Audit

Scan for portability risks (see `reference/audit-checklist.md`):
- `@replit/*` packages in production dependencies
- `REPLIT_*` / `REPL_ID` env var usage in production code
- Hardcoded `replit.com` / `replit.dev` / `localhost` URLs
- Replit Auth, Replit Database, Replit Storage usage
- Hardcoded ports in production code
- Filesystem persistence assumptions for user data
- Secrets or API keys in committed files
- Global packages not in lockfile
- In-memory state required for production
- Background processes incompatible with serverless

Classify each finding as: `CRITICAL` / `HIGH` / `MEDIUM` / `LOW` / `INFO`.

Severity guide:
- **CRITICAL**: Secrets exposed, production unsafe, severe data/security risk
- **HIGH**: Build/deployment blocked, or production directly depends on Replit
- **MEDIUM**: Portability/reproducibility impaired but deployment may still work
- **LOW**: Minor hygiene issue
- **INFO**: Architecture note, not a problem

### Step 5 — Replit Dependency Classification

For each `@replit/*` package or Replit API found, classify as:
- `development-only` — only used in dev tooling/vite config
- `optional` — convenience but not required for prod
- `production-critical` — would break production if removed
- `unknown` — investigate further

Do NOT blindly remove Replit packages. Understand them first.

### Step 6 — Backend & API Analysis

#### 6a — Is a persistent backend actually required?

Inspect every API route. For each route, classify as:

| Class | Description | Production Deployment |
|---|---|---|
| `stateless` | Validates input, calls an external service, returns JSON. No DB reads/writes. No shared state. | Vercel Function |
| `stateful` | Reads or writes a database per request | Vercel Function + database |
| `background` | Long-running task, queue worker, cron job | Separate worker (Railway, Render) |
| `streaming` | Server-Sent Events, WebSockets | Persistent server (Railway, Render, or Vercel Edge) |

**If all routes are `stateless` or `stateful`:** A persistent Express process is not required. Recommend Vercel Functions.

**If any route is `background` or `streaming`:** A persistent server is genuinely required. Document why.

Do not assume Express is incompatible with Vercel. Vercel supports Express via `@vercel/node`. But a Vercel Function is simpler and cheaper when all routes are stateless.

#### 6b — Deployment Recommendation

Based on route classification, recommend the **simplest** architecture:

| Scenario | Recommendation |
|---|---|
| No backend | Static Vercel |
| Stateless routes only | Vercel + Functions |
| Stateless routes + database | Vercel + Functions + database |
| Persistent server required | Vercel (frontend) + Railway/Render (backend) |
| Complex backend | Alternative platform (document why) |

#### 6c — Vercel Function Migration

When migrating a stateless Express route to a Vercel Function:
1. Create `api/<route-name>.ts` at the repo root (or inside the frontend artifact dir if Root Directory is set to it)
2. Export a default `handler(req, res)` function — no router, no Express
3. Move any route-specific dependencies to the correct `package.json`
4. Add a Vite dev proxy (`server.proxy`) so `/api/*` requests reach the Express server locally
5. Update frontend calls from `${VITE_API_BASE_URL}/api/...` → `/api/...` (relative URL — same origin on Vercel, proxied in dev)

### Step 7 — Database Analysis

#### Is a database actually used in production?

Inspect:
- Is there a DB package (`drizzle`, `prisma`, `pg`, `mongoose`, `better-sqlite3`, etc.)?
- Does any **production route** actually query it?
- Is the schema non-empty?

If the database package exists but:
- The schema is empty **and**
- No production route queries it

→ Classify as `unused`. **Do NOT provision a database just because the package exists.**

If the database is genuinely used:
- Document which routes use it and why
- Recommend the simplest compatible provider (Neon, Supabase, Railway Postgres)
- Document the migration/push command

### Step 8 — Environment Variables

Inventory all env vars. Classify each:

| Dimension | Values |
|---|---|
| Exposure | `public/client-safe` or `server-only` |
| Environment | `development` / `preview` / `production` / `all` |
| Lifecycle | `build-time` / `runtime` / `both` |

Document **names only**. Never expose values. Check `VITE_*` / `NEXT_PUBLIC_*` conventions for client-safe vars.

### Step 9 — Safe Fixes (NORMAL MODE only)

Fix issues that are safe and well-understood. Examples:
- Add/update `.gitignore` entries (`.env*`, `.vercel`, `dist/`, etc.)
- Move Replit-specific dev plugins behind conditional imports
- Fix hardcoded `localhost` in production API calls → use env var
- Add `engines` field to `package.json` if Node version is undeclared
- Create `vercel.json` only when genuinely required and not inferable
- Migrate stateless Express routes to Vercel Functions
- Add Vite dev proxy so `/api/*` is available locally
- Remove unused workspace package imports from production entry points
- Add missing runtime dependencies to the correct `package.json`

For risky changes (replacing auth, changing database, restructuring backend): report and recommend — do NOT automatically rewrite.

### Step 10 — Validate

Run what's available:
```bash
pnpm install / npm install   # fresh install check
pnpm typecheck / tsc --noEmit
pnpm lint / eslint
pnpm test
pnpm build / pnpm --filter <app> run build
```

Report each as: `PASS` / `FAIL` / `NOT AVAILABLE` / `NOT RUN`

Never report NOT AVAILABLE as FAIL. Never skip a validation and report it as PASS.

### Step 11 — Vercel Dry Run (if available)

```bash
vercel deploy --dry
```

If Vercel CLI is unavailable, not linked, or not authenticated → report `NOT RUN: <reason>`. Do not treat inability to run as a failure.

### Step 12 — Document (NORMAL MODE only)

Create or update:
- `docs/PORTABILITY.md` — architecture, Replit dev role, GitHub source-of-truth, prod platform, portability risks, handover notes
- `docs/DEPLOYMENT.md` — package manager, Node version, install/build commands, Vercel config, env var names, deployment workflow, external services

See `reference/doc-templates.md` for full templates.

### Step 13 — Report

Return the standardized report. See `reference/report-template.md`.

---

## AUDIT-ONLY MODE

Perform Steps 1–8 only. Run non-destructive validation (typecheck, build) if safe.

Do NOT:
- Modify source code
- Modify configuration files
- Install replacement architecture
- Update `docs/PORTABILITY.md` or `docs/DEPLOYMENT.md`

Return findings and recommendations only.

---

## Monorepo Guidance

This project uses a pnpm monorepo. Key rules:
- Identify all deployable apps (`artifacts/*/`)
- Not every artifact is a production deployment — identify which one(s) are
- Each deployable app may need a separate Vercel project with its own `Root Directory`
- Shared packages (`packages/*` or `lib/*`) must be included in the Vercel build
- `pnpm --filter <app> run build` is the typical per-app build command
- Preserve workspace dependencies; do not flatten the monorepo unless justified
- Development artifacts (sandboxes, mockups, design tools) are NOT deployed

### Recommend the simplest project structure

Before recommending a monorepo, ask: **is there more than one deployable application?**

If there is only one frontend app and one Vercel Function (or none):
- Recommend flattening to a standard single-project structure
- `src/` at repo root, `api/` at repo root, `package.json` at root
- `pnpm-workspace.yaml` may still exist for dev-only sub-packages (local Express server, sandbox tools) but the root is the app
- Vercel auto-detects Vite at the repo root — minimal or no `vercel.json` required

If the workspace does contain genuinely separate deployable apps (different brands, different domains, different Vercel projects):
- Keep the monorepo
- Each app gets its own Vercel project with `Root Directory` pointing to its subdirectory

### vercel.json for flattened root projects

When the app is a standard Vite project at the repo root:

```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install --frozen-lockfile"
}
```

Vercel Functions live in `api/` at the repo root. They are auto-detected — no `functions` config needed.

### vercel.json for monorepo sub-app deployments

When deploying a specific workspace app (not the root) to Vercel:

```json
{
  "buildCommand": "pnpm --filter @workspace/<app> run build",
  "outputDirectory": "artifacts/<app>/dist",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": null
}
```

### Vite dev proxy for /api routes

When a Vercel Function is at `api/send-email.ts`, add a proxy in `vite.config.ts` so local dev works:

```ts
server: {
  proxy: {
    '/api': {
      target: `http://localhost:${process.env.API_PORT ?? '8080'}`,
      changeOrigin: true,
    },
  },
}
```

This means:
- **Local dev**: `/api/*` → Express API server (same logic as the Vercel Function)
- **Vercel production**: `/api/*` → Vercel Function (native, no proxy)
- **Frontend code**: just calls `/api/send-email` — no base URL needed

---

## What NEVER to Do

- Commit secrets, API keys, tokens, passwords, or `.env` files with values
- Hardcode Replit domains, Replit URLs, or `localhost` in production code
- Make production depend on `REPLIT_*` env vars
- Use Replit Database, Replit Auth, or Replit Storage for production
- Report PASS for a check that was not actually run
- Rewrite working architecture without necessity
- Change package managers, databases, or auth systems without explicit user authorization
- Create a real Vercel production deployment just to test portability
- Provision a database just because a database package exists in the workspace
- Keep a persistent Express server for production when all routes are stateless

---

## Agency Workflow This Skill Enforces

```
Replit (develop)
    ↓
Git branch → GitHub (source of truth)
    ↓
Vercel Preview (branch deploys)
    ↓
Review / QA
    ↓
Merge to main
    ↓
Vercel Production
    ↓
Custom Domain (DNS)
```

Production ownership must be transferable. The client must not need Replit to operate their site.
