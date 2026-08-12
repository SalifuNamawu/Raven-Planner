# Portable — Required Final Report Template

Return this report at the end of every `portable` or `portable audit` invocation.
Fill in all sections. Never fabricate PASS results.

---

```
════════════════════════════════════════════
PORTABLE SKILL REPORT
════════════════════════════════════════════

PORTABILITY STATUS:    PASS / PASS WITH WARNINGS / FAIL
VERCEL DEPLOYABILITY:  READY / READY WITH CONFIGURATION / BLOCKED

────────────────────────────────────────────
PROJECT DETECTED
────────────────────────────────────────────
Framework:
Package manager:
Package manager version:
Runtime / Node:
Project root:
Frontend:
Backend:
Database:
Storage:
Authentication:
Email:
Monorepo:              YES / NO

────────────────────────────────────────────
REPLIT DEPENDENCIES
────────────────────────────────────────────
[package] — [development-only / optional / production-critical / unknown]
[package] — [classification]
None found.

────────────────────────────────────────────
PORTABILITY ISSUES
────────────────────────────────────────────
[CRITICAL] description
[HIGH]     description
[MEDIUM]   description
[LOW]      description
[INFO]     description
None found.

────────────────────────────────────────────
VERCEL ISSUES
────────────────────────────────────────────
[CRITICAL] description
[HIGH]     description
[MEDIUM]   description
[LOW]      description
None found.

────────────────────────────────────────────
CHANGES MADE  (NORMAL MODE only; "None" in audit-only mode)
────────────────────────────────────────────
- description of change
- description of change
None.

────────────────────────────────────────────
ENVIRONMENT VARIABLES
────────────────────────────────────────────
Build-time (public):
  VITE_*

Build-time (server):
  (none)

Runtime (server-only):
  SESSION_SECRET
  GMAIL_USER
  GMAIL_APP_PASSWORD
  DATABASE_URL

Runtime (public/client):
  VITE_API_BASE_URL

Development only:
  PORT

Preview + Production:
  (all runtime vars above)

────────────────────────────────────────────
VERCEL CONFIGURATION
────────────────────────────────────────────
Framework preset:
Root Directory:
Install Command:
Build Command:
Output Directory:
Runtime / Node:
Production branch:       main
vercel.json required:    YES / NO

────────────────────────────────────────────
EXTERNAL SERVICES
────────────────────────────────────────────
Database:      (none / Neon / Supabase / PlanetScale / other)
Storage:       (none / S3 / Cloudflare R2 / other)
Authentication:(none / Clerk / Auth.js / Supabase Auth / other)
Email:         (none / Gmail SMTP / Resend / SendGrid / Postmark)
Other:         (WhatsApp API, etc.)

────────────────────────────────────────────
REPRODUCIBILITY
────────────────────────────────────────────
Fresh install:              PASS / FAIL / NOT RUN
Production build:           PASS / FAIL / NOT RUN
Replit-independent build:   PASS / FAIL / NOT RUN

────────────────────────────────────────────
VALIDATION
────────────────────────────────────────────
typecheck:        PASS / FAIL / NOT AVAILABLE / NOT RUN
lint:             PASS / FAIL / NOT AVAILABLE / NOT RUN
tests:            PASS / FAIL / NOT AVAILABLE / NOT RUN
build:            PASS / FAIL / NOT AVAILABLE / NOT RUN
vercel dry-run:   PASS / FAIL / NOT RUN — [reason if NOT RUN]

────────────────────────────────────────────
REMAINING RISKS
────────────────────────────────────────────
- description
- description
None.

────────────────────────────────────────────
HANDOVER READINESS:  READY / ACTION REQUIRED
────────────────────────────────────────────
[If ACTION REQUIRED, list what must be done before handover]
════════════════════════════════════════════
```
