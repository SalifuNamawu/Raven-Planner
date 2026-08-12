# Portability Audit Checklist

Use this checklist when auditing a project for portability.

---

## 1. REPOSITORY STRUCTURE

- [ ] Single production application (not workspace, not multiple apps)
- [ ] Understandable in 5 minutes
- [ ] No historical experiments or dead code

---

## 2. ENTRY POINTS

- [ ] Frontend: `index.html` + `src/main.tsx` (or equivalent)
- [ ] API: `api/` directory with function entry points
- [ ] Each entry point has clear purpose

---

## 3. PACKAGE MANAGER

- [ ] `pnpm` used
- [ ] Single `package.json` at root
- [ ] `packageManager` field present (e.g., `"pnpm@10.x"`)
- [ ] `engines.node` present (e.g., `"24.x"`)
- [ ] `engines.pnpm` present (e.g., `"10.x"`)
- [ ] No `pnpm-workspace.yaml` unless monorepo

---

## 4. DEPENDENCIES

- [ ] All deps in root `package.json`
- [ ] No workspace-only packages
- [ ] No dev-only packages in production bundle
- [ ] No unused dependencies (verify with `pnpm why <pkg>`)
- [ ] No `@replit/*` packages in production deps
- [ ] `@vercel/node` for Vercel Function types (if applicable)

---

## 5. BUILD PIPELINE

- [ ] `pnpm run build` produces deployable artifact
- [ ] Frontend: `vite build` → `dist/`
- [ ] API: Auto-detected by Vercel from `api/`
- [ ] No custom build scripts replacing standard tooling
- [ ] Build output matches deployment expectations

---

## 6. ENVIRONMENT VARIABLES

- [ ] No secrets in committed files
- [ ] `.env` for local dev (gitignored)
- [ ] Vercel Environment Variables for production
- [ ] Required variables documented in `docs/DEPLOYMENT.md`
- [ ] No `REPLIT_*`, `REPL_ID` in production

---

## 7. DEPLOYMENT CONFIGURATION

- [ ] `vercel.json` minimal or absent
- [ ] Vercel auto-detects framework
- [ ] Every field in `vercel.json` explained in docs
- [ ] One Vercel project per repo
- [ ] Root directory = repo root (blank in Vercel)

---

## 8. TYPESCRIPT CONFIGURATION

- [ ] Correct architecture for runtimes present
- [ ] If multi-runtime: project references or multiple tsconfigs
- [ ] Browser config: `jsx`, `dom` lib, `bundler` resolution, `vite/client` types
- [ ] Server config: `nodenext` module/resolution, `node` types, no JSX
- [ ] No shared incompatible options
- [ ] Each runtime typechecks independently

---

## 9. NO REPLIT DEPENDENCIES

- [ ] No `@replit/*` packages in production
- [ ] No `.replit` file
- [ ] No `.replitignore` file
- [ ] No `replit.md` file
- [ ] No Replit artifacts directory
- [ ] Replit dev plugins conditionally loaded (dev only) or removed

---

## 10. NO HARDCODED LOCALHOST

- [ ] No `localhost` URLs in production code
- [ ] No hardcoded ports
- [ ] Frontend calls API via relative paths (`/api/...`)
- [ ] Vite proxy only in dev config

---

## 11. NO DEAD CODE

- [ ] No unused imports
- [ ] No unused components
- [ ] No unused utilities/hooks
- [ ] No unused API routes
- [ ] No dead files/folders
- [ ] No commented-out code
- [ ] No `TODO`/`FIXME` without linked issues

---

## 11. DOCUMENTATION

- [ ] `README.md` — Quick start
- [ ] `docs/DEPLOYMENT.md` — Deployment guide
- [ ] `docs/PORTABILITY.md` — Portability status with runtime inventory
- [ ] `PRODUCTION_READINESS_REPORT.md` — After validation

---

## 12. VALIDATION

- [ ] `pnpm install` succeeds
- [ ] `pnpm run typecheck` succeeds (all runtimes)
- [ ] `pnpm run build` succeeds
- [ ] `npx vercel build` succeeds (if Vercel)

---

## 13. VERCEL INTEGRATION

- [ ] Deploys to Vercel without manual config
- [ ] One repo → One Vercel project → One domain
- [ ] `api/` functions auto-deploy
- [ ] No CORS issues (same domain)

---

## 14. PRODUCTION READINESS REPORT

- [ ] Project structure documented
- [ ] Removed files listed
- [ ] Removed dependencies listed
- [ ] Removed configuration listed
- [ ] Deployment changes documented
- [ ] Portability improvements listed
- [ ] Remaining risks identified
- [ ] Vercel settings recommended
- [ ] Expected build output documented
- [ ] Root/output directories specified
- [ ] Environment variables listed

---

## 15. GIT HYGIENE

- [ ] `.gitignore` excludes: `node_modules`, `dist`, `.vercel`, `.env*`, IDE files, build artifacts
- [ ] `pnpm-lock.yaml` committed
- [ ] No large binaries in repo

---

## 16. NO EXPRESS IN PRODUCTION

- [ ] If stateless backend: serverless functions only
- [ ] No persistent Express server in production
- [ ] Local Express only for dev proxy (optional)

---

## 17. NO DATABASE UNLESS REQUIRED

- [ ] No database if no server-side storage
- [ ] No "future use" databases

---

## 18. SINGLE RESPONSIBILITY PER RUNTIME

- [ ] Frontend: UI, routing, state, API calls
- [ ] API: Stateless request handling, external integrations
- [ ] No shared business logic across runtimes without explicit package

---

## 19. CROSS-PLATFORM SCRIPTS

- [ ] All `package.json` scripts work on Windows/macOS/Linux
- [ ] No `sh`, `bash`, `rm -rf` in scripts
- [ ] Node.js used for cross-platform operations

---

## 20. BUNDLE SIZE AWARENESS

- [ ] JS bundle monitored
- [ ] Warning if > 500 kB gzipped
- [ ] Code-splitting recommended if exceeded

---

## 21. LOCKFILE INTEGRITY

- [ ] `pnpm-lock.yaml` committed
- [ ] `pnpm install --frozen-lockfile` in CI
- [ ] Supply-chain policy passes

---

## 22. MULTI-RUNTIME SPECIFIC

- [ ] Each runtime documented in `docs/PORTABILITY.md`
- [ ] Runtime inventory complete
- [ ] TypeScript validation runs per runtime
- [ ] Deployment validation runs per runtime
- [ ] No single tsconfig serving multiple runtimes
- [ ] No frontend options in server config
- [ ] No server options in frontend config
- [ ] No mixed aliases
- [ ] Correct moduleResolution per runtime
- [ ] Correct noEmit usage