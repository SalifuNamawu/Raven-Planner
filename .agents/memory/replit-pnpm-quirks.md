---
name: Replit pnpm quirks
description: Two environment-specific issues that break pnpm in Replit — packageManager corepack enforcement and ENOSPC file watcher exhaustion.
---

## 1. `packageManager` field breaks pnpm in Replit

**Rule:** Do NOT include a `packageManager: pnpm@x.y.z` field in `package.json` for Replit projects.

**Why:** Replit uses corepack to intercept the `pnpm` binary. When `packageManager` specifies an exact version (e.g. `pnpm@10.28.0`) that differs from the one in the Nix store (e.g. `pnpm@10.26.1`), corepack tries to install the specified version via `pnpm add pnpm@10.28.0 ...`. This fails with `SIGABRT` due to Replit's system resource constraints (`pthread_create: Resource temporarily unavailable`). The result: every `pnpm` command in the shell fails — install, run, build, typecheck.

**How to apply:** Remove `packageManager` from `package.json` in Replit projects. Keep `engines.pnpm: ">=9"` as a loose range instead.

**Recovery:** Use the direct Nix store binary to bypass corepack — find it with `find /nix/store -name "pnpm" -type f | head -1` — then edit `package.json` to remove `packageManager`, and normal `pnpm` invocations resume working.

---

## 2. `ENOSPC` — Vite file watcher exhausts inotify limit

**Rule:** Always include `server.watch.ignored` in `vite.config.ts` for Replit projects.

**Why:** Replit puts the pnpm store inside the workspace at `.local/share/pnpm/store/`. Without explicit ignore rules, Vite's chokidar watcher attempts to watch every file in the store, quickly hitting the OS `inotify` limit (`ENOSPC: System limit for number of file watchers reached`). This crashes the dev server immediately after startup.

**How to apply:**
```ts
server: {
  watch: {
    ignored: ['**/node_modules/**', '**/.local/**', '**/dist/**', '**/.cache/**'],
  },
  ...
}
```

---

## 3. Workflow port must be explicit

**Rule:** Always set `PORT=<n>` in the workflow command and match `waitForPort` to the same number.

**Why:** The vite config reads `PORT` from env and only sets `server.port` if it's defined — otherwise Vite uses its default (5173). The workflow manager waits on `waitForPort` and times out if the app binds to a different port.

**How to apply:** `command: "PORT=3000 pnpm run dev"` + `waitForPort: 3000`.
