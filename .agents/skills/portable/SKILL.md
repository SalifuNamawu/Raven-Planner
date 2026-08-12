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

### Step 6 — Vercel Analysis

Determine Vercel compatibility **separately from portability**:
- Does the frontend build statically or need SSR?
- Does the backend fit Vercel Functions, or does it need a persistent process?
- For monorepos: identify the correct `Root Directory` and `Build Command` per deployable app
- Check for background jobs / WebSockets / persistent state that won't fit serverless

Do not assume `Express = incompatible`. Vercel supports Express via `@vercel/node`.

Report two statuses independently:
- **PORTABILITY STATUS**: `PASS` / `PASS WITH WARNINGS` / `FAIL`
- **VERCEL DEPLOYABILITY**: `READY` / `READY WITH CONFIGURATION` / `BLOCKED`

### Step 7 — Environment Variables

Inventory all env vars. Classify each:

| Dimension | Values |
|---|---|
| Exposure | `public/client-safe` or `server-only` |
| Environment | `development` / `preview` / `production` / `all` |
| Lifecycle | `build-time` / `runtime` / `both` |

Document **names only**. Never expose values. Check `VITE_*` / `NEXT_PUBLIC_*` conventions for client-safe vars.

### Step 8 — Safe Fixes (NORMAL MODE only)

Fix issues that are safe and well-understood. Examples:
- Add/update `.gitignore` entries (`.env*`, `.vercel`, `dist/`, etc.)
- Move Replit-specific dev plugins behind conditional imports
- Fix hardcoded `localhost` in production API calls → use env var
- Add `engines` field to `package.json` if Node version is undeclared
- Create `vercel.json` only when genuinely required and not inferable

For risky changes (replacing auth, changing database, restructuring backend): report and recommend — do NOT automatically rewrite.

### Step 9 — Validate

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

### Step 10 — Vercel Dry Run (if available)

```bash
vercel deploy --dry
```

If Vercel CLI is unavailable, not linked, or not authenticated → report `NOT RUN: <reason>`. Do not treat inability to run as a failure.

### Step 11 — Document (NORMAL MODE only)

Create or update:
- `docs/PORTABILITY.md` — architecture, Replit dev role, GitHub source-of-truth, prod platform, portability risks, handover notes
- `docs/DEPLOYMENT.md` — package manager, Node version, install/build commands, Vercel config, env var names, deployment workflow, external services

See `reference/doc-templates.md` for full templates.

### Step 12 — Report

Return the standardized report. See `reference/report-template.md`.

---

## AUDIT-ONLY MODE

Perform Steps 1–7 only. Run non-destructive validation (typecheck, build) if safe.

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
- Each app may need a separate Vercel project with its own `Root Directory`
- Shared packages (`packages/*`) must be included in the Vercel build
- `pnpm --filter <app> run build` is the typical per-app build command
- Preserve workspace dependencies; do not flatten the monorepo

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
