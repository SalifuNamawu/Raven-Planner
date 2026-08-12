# Portability Audit Report Template

## Project: {{PROJECT_NAME}}

## Date: {{DATE}}

## Auditor: {{AUDITOR}}

---

## EXECUTIVE SUMMARY

**Overall Status:** {{PASS|FAIL}}

**Runtimes Detected:** {{RUNTIME_COUNT}}

**Critical Issues:** {{CRITICAL_COUNT}}

**Warnings:** {{WARNING_COUNT}}

---

## RUNTIME INVENTORY

| Runtime | Purpose | Entry Point | Deploy Target | Build Tool | TS Config |
|---|---|---|---|---|---|
| {{RUNTIME_1}} | {{PURPOSE_1}} | {{ENTRY_1}} | {{TARGET_1}} | {{TOOL_1}} | {{TSCONFIG_1}} |
| {{RUNTIME_2}} | {{PURPOSE_2}} | {{ENTRY_2}} | {{TARGET_2}} | {{TOOL_2}} | {{TSCONFIG_2}} |

---

## ARCHITECTURE ASSESSMENT

### TypeScript Configuration

- [ ] Correct architecture (single / project references / multiple)
- [ ] No browser settings in server config
- [ ] No server settings in browser config
- [ ] Project references valid (if used)
- [ ] Each runtime typechecks independently

### Dependencies

- [ ] Single package.json at root
- [ ] No workspace packages
- [ ] No dead dependencies
- [ ] packageManager field present
- [ ] engines.node and engines.pnpm present

### Build Pipeline

- [ ] pnpm run build succeeds
- [ ] Frontend produces correct output
- [ ] API functions compile
- [ ] No custom build scripts replacing standard tooling

### Deployment

- [ ] vercel.json minimal or absent
- [ ] Vercel auto-detects framework
- [ ] One Vercel project
- [ ] Environment variables documented

### Portability

- [ ] No Replit-specific code/config
- [ ] No hardcoded localhost/ports
- [ ] No secrets in repo
- [ ] Cross-platform scripts
- [ ] Clean .gitignore

---

## CRITICAL ISSUES

| # | Runtime | Issue | Impact | Fix |
|---|---|---|---|---|
| 1 | {{RUNTIME}} | {{ISSUE}} | {{IMPACT}} | {{FIX}} |

---

## WARNINGS

| # | Runtime | Issue | Recommendation |
|---|---|---|---|
| 1 | {{RUNTIME}} | {{ISSUE}} | {{REC}} |

---

## VALIDATION RESULTS

| Check | Command | Status | Output |
|---|---|---|---|
| Install | `pnpm install` | {{PASS/FAIL}} | {{OUTPUT}} |
| Frontend Build | `pnpm run build` | {{PASS/FAIL}} | {{OUTPUT}} |
| Frontend Typecheck | `tsc -p tsconfig.app.json --noEmit` | {{PASS/FAIL}} | {{OUTPUT}} |
| Backend Typecheck | `tsc -p tsconfig.api.json --noEmit` | {{PASS/FAIL}} | {{OUTPUT}} |
| Vercel Build | `npx vercel build` | {{PASS/FAIL}} | {{OUTPUT}} |

---

## RECOMMENDATIONS

1. {{REC_1}}
2. {{REC_2}}
3. {{REC_3}}

---

## HANDOVER CHECKLIST

- [ ] GitHub repository ownership transferred
- [ ] Vercel project transferred
- [ ] Domain/DNS transferred
- [ ] Environment variables shared securely
- [ ] Personal accounts removed from production services