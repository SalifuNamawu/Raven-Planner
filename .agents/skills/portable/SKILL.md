# Portable Skill

## Purpose

Audits and enforces production portability for any project. Ensures the app can be developed in any IDE, owned in GitHub, deployed independently to Vercel, and handed over to a client without depending on a specific development platform.

---

## RULE 1 — REPOSITORY STRUCTURE

The repository must represent ONE production application.

Not multiple applications.
Not an old workspace.
Not historical experiments.

The repository should be understandable to another engineer within five minutes.

---

## RULE 2 — ENTRY POINTS

Every deployable target must have an explicit entry point.

| Target | Entry Point | Build Output |
|---|---|---|
| Frontend | `index.html` + `src/main.tsx` | `dist/` |
| API | `api/` | Vercel Functions |

If no entry point exists for a target, the target does not exist.

---

## RULE 3 — PACKAGE MANAGER

Use `pnpm`.

Single `package.json` at repo root.
No workspaces unless explicitly required.
`packageManager` field must be present in `package.json`.
`engines.node` and `engines.pnpm` must be present.

---

## RULE 4 — DEPENDENCIES

All dependencies must be in the root `package.json`.

No workspace-only packages.
No dev-only packages that leak into production bundles.
Remove packages not imported anywhere.

---

## RULE 5 — BUILD PIPELINE

`pnpm run build` must produce a deployable artifact.

Frontend: `vite build` → `dist/`
API: Auto-detected by Vercel from `api/`

No custom build scripts that replace standard tooling.

---

## RULE 6 — ENVIRONMENT VARIABLES

No secrets in committed files.
Development: `.env` (gitignored)
Production: Vercel Environment Variables

Document required variables in `docs/DEPLOYMENT.md`.

---

## RULE 7 — DEPLOYMENT CONFIGURATION

Prefer Vercel auto-detection.

Only keep `vercel.json` if it provides necessary configuration.
Explain every field in `vercel.json` in `docs/DEPLOYMENT.md`.

---

## RULE 8 — TYPESCRIPT CONFIGURATION

TypeScript must be configured for the actual runtime(s) in use.

If the project has multiple runtimes (browser, Node, serverless, edge), each must have its own TypeScript configuration.

---

## RULE 9 — NO REPLIT DEPENDENCIES

No Replit-specific code, configuration, or plugins in production paths.

| Item | Action |
|---|---|
| `@replit/*` packages | Remove or conditionally load (dev only) |
| `REPL_ID` | Remove or conditionally load (dev only) |
| `.replit` | Remove |
| `.replitignore` | Remove |
| `replit.md` | Remove |
| Replit artifacts | Remove |

---

## RULE 10 — NO HARDCODED LOCALHOST

No `localhost` URLs in production code.
No hardcoded ports.
Frontend calls API via relative paths (`/api/...`).

---

## RULE 11 — NO DEAD CODE

Remove:
- Unused imports
- Unused components
- Unused utilities
- Unused hooks
- Unused API routes
- Dead files
- Dead folders
- Commented-out code
- `TODO`/`FIXME` without linked issues

---

## RULE 12 — DOCUMENTATION

Required files:
- `README.md` — Quick start
- `docs/DEPLOYMENT.md` — Deployment guide
- `docs/PORTABILITY.md` — Portability status

---

## RULE 13 — VALIDATION

Before reporting PASS, all must succeed:

```
pnpm install
pnpm run typecheck
pnpm run build
```

If any fails, do not report PASS.

---

## RULE 14 — VERCEL INTEGRATION

The project must deploy to Vercel without manual configuration.

One repository → One Vercel project → One domain.

---

## RULE 15 — PRODUCTION READINESS REPORT

After validation, produce `PRODUCTION_READINESS_REPORT.md` with:

- Project structure
- Removed files
- Removed dependencies
- Removed configuration
- Deployment changes
- Portability improvements
- Remaining risks
- Recommended Vercel settings
- Expected build output
- Expected root directory
- Expected output directory
- Environment variables

---

## RULE 16 — GIT HYGIENE

`.gitignore` must exclude:
- `node_modules`
- `dist`
- `.vercel`
- `.env*`
- IDE files
- Build artifacts

---

## RULE 17 — NO EXPRESS IN PRODUCTION

If the only backend operation is stateless (email, webhooks, transformations), use serverless functions.
No persistent Express server in production.

---

## RULE 18 — NO DATABASE UNLESS REQUIRED

If no data is stored server-side, no database is needed.
Do not add a database "for future use."

---

## RULE 19 — SINGLE RESPONSIBILITY PER RUNTIME

Each runtime has one responsibility.

Frontend: UI, routing, state, API calls.
API: Stateless request handling, external integrations.

---

## RULE 20 — CROSS-PLATFORM SCRIPTS

All `package.json` scripts must work on Windows, macOS, Linux.
No `sh`, `bash`, `rm -rf` in scripts.
Use Node.js for cross-platform operations.

---

## RULE 21 — BUNDLE SIZE AWARENESS

Monitor bundle size.
Warn if JS bundle exceeds 500 kB gzipped.
Recommend code-splitting if exceeded.

---

## RULE 22 — LOCKFILE INTEGRITY

`pnpm-lock.yaml` must be committed.
`pnpm install --frozen-lockfile` in CI.
Supply-chain policy must pass.

---

## RULE 23 — MULTI-RUNTIME ARCHITECTURE

### RUNTIME DETECTION

Before making ANY portability changes, inspect the repository.

Identify every runtime independently.

Possible runtimes include:

| Runtime | Examples |
|---|---|
| Browser | React, Vue, Svelte, vanilla JS |
| Node | Express, Fastify, Hono, Nest, CLI tools, scripts |
| Serverless | Vercel Functions, Netlify Functions, AWS Lambda |
| Edge | Vercel Edge Functions, Cloudflare Workers, Deno Deploy |
| Background | Cron jobs, queue workers, scheduled functions |
| Build-time | Vite, esbuild, webpack, TypeScript, linters |

**Do not assume the repository contains only one runtime.**

### RUNTIME CLASSIFICATION

For every runtime determine:

- **purpose** — what it does
- **entry point** — where execution starts
- **deployment target** — where it runs in production
- **build tool** — how it's compiled/bundled
- **TypeScript configuration** — which tsconfig governs it
- **package requirements** — runtime-specific dependencies
- **environment variables** — what it needs at runtime
- **production platform** — Vercel, AWS, Cloudflare, etc.

Document each runtime in `docs/PORTABILITY.md`.

### TYPESCRIPT DETECTION

Before modifying ANY tsconfig:

Determine:

How many independent TypeScript projects exist.

Determine whether:

- **single tsconfig** — one runtime, one compilation target
- **project references** — multiple runtimes with shared base config
- **multiple tsconfig files** — multiple runtimes with no shared compilation

is the correct architecture.

**Never force browser code and server code through the same configuration unless that is actually appropriate.**

### FRONTEND DETECTION

If Vite, React, Vue or another frontend exists:

Determine:

- browser entry (`index.html`, `src/main.tsx`)
- build output (`dist/`)
- frontend aliases (`@/*` → `src/*`)
- frontend compiler options (`jsx`, `lib`, `moduleResolution`, `types`)

**Do not copy frontend compiler settings into backend code.**

### SERVER DETECTION

If server code exists:

Determine the framework:

- Express
- Fastify
- Hono
- Nest
- Vercel Functions
- Node scripts
- API routes
- Worker processes

Treat server code independently from frontend code.

### VERCEL DETECTION

If Vercel Functions exist:

Detect:

- `api/` directory
- `functions/` directory
- Framework API routes (Next.js, SvelteKit, etc.)

Determine whether the function requires:

- Node runtime
- Edge runtime
- Streaming
- Background execution
- Cron

**Do not configure them using frontend compiler assumptions.**

### TYPESCRIPT VALIDATION

Run validation independently for each runtime.

Examples:

```bash
# Frontend
pnpm build

# Frontend TypeScript
tsc -p tsconfig.app.json --noEmit

# Server Functions
tsc -p tsconfig.api.json --noEmit

# Shared packages
tsc -p tsconfig.shared.json --noEmit
```

Only after every runtime validates independently should the project be considered portable.

### DEPLOYMENT VALIDATION

Do not stop after `vite build`.

Continue validating:

- server functions
- TypeScript
- deployment configuration
- `vercel build`

until every runtime passes.

### VERCEL RULES

The skill should automatically recognise:

`Vite + api/`

as:

**One Vercel application.**

Do NOT recommend splitting into two deployments unless technically required.

Prefer:

- One repository
- One Vercel project
- One domain
- One deployment

when architecture allows.

### PORTABILITY AUDIT IMPROVEMENTS

The audit should additionally detect:

| Issue | Description |
|---|---|
| Single tsconfig serving multiple runtimes | Browser and Node code forced through one config |
| Incorrect project references | Missing or broken references in tsconfig.json |
| Frontend compiler options applied to server code | `jsx`, `dom` lib, `vite/client` types in Node config |
| Server compiler options applied to browser code | `nodenext` moduleResolution in browser config |
| Incorrect include/exclude | Source files not covered or wrongly excluded |
| Incorrect noEmit usage | `noEmit: false` for library builds only |
| Incorrect moduleResolution | `bundler` for Node, `nodenext` for browser |
| Incorrect runtime assumptions | Assuming one runtime when multiple exist |
| Mixed browser/server aliases | `@/*` alias leaking into server code |
| Incorrect packageManager declarations | Missing or wrong `packageManager` field |
| Missing packageManager field | No `packageManager` in package.json |
| Incorrect Node engine constraints | Too loose or too strict |
| Multiple runtimes sharing incompatible compiler options | Shared base config with conflicting options |

Report these separately from ordinary portability issues.

### VALIDATION

Before reporting PASS the portable skill must successfully validate:

1. **Repository reproduction** — Clean clone works
2. **Package installation** — `pnpm install` succeeds
3. **Frontend build** — `pnpm run build` produces `dist/`
4. **Frontend typecheck** — `tsc -p tsconfig.app.json --noEmit` passes
5. **Backend typecheck** — `tsc -p tsconfig.api.json --noEmit` passes
6. **Serverless function compilation** — API TypeScript compiles
7. **Deployment configuration** — `vercel.json` is valid
8. **vercel build** — `npx vercel build` succeeds

If any runtime fails:

**Do not report PASS.**

Continue investigating until the root cause is identified.

---

## FINAL OBJECTIVE

The portable skill should become architecture-aware.

It should understand that one repository may contain multiple independent runtimes with different compilation requirements.

The skill should optimise for:

**Correct architecture**

rather than

**Minimal configuration.**

Future Raven Digital projects should deploy to Vercel without requiring manual debugging of TypeScript project structure or runtime separation.