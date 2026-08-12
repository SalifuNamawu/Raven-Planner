# Portable — Audit Checklist

Use this during Step 4 of the portable skill execution.

## 1. Replit-Specific Dependencies

Search `package.json` (all workspaces) for:
```
@replit/
```

For each match, determine:
- Is it in `dependencies` (production) or `devDependencies` (dev-only)?
- Is it used in production runtime code, or only in `vite.config.ts` / dev tooling?
- Can it be conditionally loaded (dev-only guard)?

Common Replit packages and their typical classification:
| Package | Typical Classification |
|---|---|
| `@replit/vite-plugin-cartographer` | development-only |
| `@replit/vite-plugin-runtime-error-modal` | development-only |
| `@replit/codemirror-*` | depends on use |

## 2. Environment Variable Usage

Search source code for:
```
REPLIT_
REPL_ID
REPL_SLUG
REPL_OWNER
REPL_LANGUAGE
```

Classify each usage:
- Is it used only in dev/logging, or does production behavior depend on it?
- Is there a safe fallback when the var is absent?

## 3. Hardcoded URLs / Domains

Search for:
```
replit.com
replit.dev
.repl.co
localhost
127.0.0.1
```

Determine:
- Is this in dev config only (e.g., `vite.config.ts server.allowedHosts`)?
- Is it in production API calls or OAuth redirect URIs?
- Is it in a comment vs. actual code?

## 4. Replit Services

Search for:
```
@replit/database
replitdb
replit.com/db
Replit Auth
REPLIT_DB_URL
```

These are production blockers if used for persistent data or authentication.

## 5. Hardcoded Ports

Search for hardcoded port numbers in production-critical code:
```
:3000
:8080
:5000
:22591
PORT = 
```

Ports in dev config only (e.g., `vite.config.ts`) are LOW severity. Ports hardcoded in backend production listen calls should use `process.env.PORT`.

## 6. Secrets in Source

Search committed files for patterns like:
```
sk_live_
pk_live_
PRIVATE_KEY=
API_KEY=
password=
token=
SECRET=
```

Also check: `.env*` files tracked by git, `replit.md`, `README.md` for accidentally pasted values.

## 7. Gitignore Hygiene

Check `.gitignore` includes:
```
.env
.env.local
.env*.local
.env.production
node_modules/
dist/
.vercel/
*.log
```

## 8. Uncommitted Required Files

Ask: would a fresh `git clone` + `pnpm install` + `pnpm build` succeed?

Look for:
- Generated files that aren't in the repo but are required at build time
- Migration files not committed
- Config files created manually in Replit but not in source

## 9. Filesystem Persistence

Search for file write operations:
```
fs.writeFile
fs.appendFile
writeFileSync
createWriteStream
```

Determine:
- Is this temp/build-time (acceptable) or persistent user data (needs external storage)?

## 10. In-Memory Production State

Look for:
```
const store = new Map()
let sessions = {}
global.cache
```

If production requires this state to survive restarts, it won't work on serverless or after deploys.

## 11. Background Processes

Look for:
```
setInterval
cron
schedule
worker
spawn
fork
```

Determine if these are expected to run continuously. Serverless environments won't support persistent workers.
