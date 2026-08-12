# Portable — Documentation Templates

Use these when writing `docs/PORTABILITY.md` and `docs/DEPLOYMENT.md` in Step 11.

---

## docs/PORTABILITY.md Template

```markdown
# Portability

## Architecture

```
Replit (develop) → GitHub (source of truth) → Vercel (deploy) → DNS (custom domain)
```

## Development Environment

Replit is used as the development IDE only. It is not required for production.

## GitHub — Source of Truth

The complete application is reproducible from the GitHub repository.
All source, config, migrations, and lockfiles are committed.
Secrets are NOT committed.

## Production Platform

**Vercel** — [link if known]

## Replit-Specific Components

| Component | Classification | Portable Alternative |
|---|---|---|
| @replit/vite-plugin-* | development-only | Not required in production |

## External Production Services

| Service | Provider | Owned By |
|---|---|---|
| Database | | |
| Storage | | |
| Auth | | |
| Email | | |

## Known Portability Limitations

- [list any known issues]

## Handover Checklist

To hand this project to a client or another developer:

- [ ] Transfer GitHub repository ownership
- [ ] Transfer Vercel project
- [ ] Transfer domain / DNS
- [ ] Share database credentials (via secure channel)
- [ ] Share all production secret values (via secure channel, never via Git)
- [ ] Transfer external service accounts (email, storage, auth)
- [ ] Remove original developer's personal accounts from production services
```

---

## docs/DEPLOYMENT.md Template

```markdown
# Deployment Guide

## Stack

- **Package manager:** pnpm [version]
- **Node version:** [version] (see `engines` in package.json)
- **Framework:** [framework]
- **Monorepo:** YES / NO

## Install

```bash
pnpm install
```

## Build

```bash
# Build the frontend app
pnpm --filter @workspace/[app-name] run build

# Or from the app directory
cd artifacts/[app-name] && pnpm run build
```

## Output Directory

`artifacts/[app-name]/dist`

## Vercel Configuration

| Setting | Value |
|---|---|
| Framework Preset | Vite / Next.js / Other |
| Root Directory | `artifacts/[app-name]` |
| Install Command | `pnpm install` |
| Build Command | `pnpm --filter @workspace/[app-name] run build` |
| Output Directory | `dist` |
| Node Version | [version] |
| Production Branch | `main` |

## Environment Variables

Configure all of the following in Vercel → Settings → Environment Variables.

### Server-only (do not expose to browser)

| Variable | Environment | Description |
|---|---|---|
| `SESSION_SECRET` | Production, Preview | Session signing secret |
| `GMAIL_USER` | Production, Preview | Gmail address for outbound email |
| `GMAIL_APP_PASSWORD` | Production, Preview | Gmail App Password (not account password) |
| `DATABASE_URL` | Production, Preview | PostgreSQL connection string |

### Public / client-safe (VITE_ prefix, safe to expose in browser bundle)

| Variable | Environment | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Production, Preview | Base URL of the API server |

## Deployment Workflow

1. Develop in Replit on a feature branch
2. Push branch to GitHub
3. Vercel automatically creates a Preview deployment
4. Review and QA the Preview URL
5. Merge to `main`
6. Vercel automatically deploys to Production
7. Production is live at the custom domain

## Custom Domain / DNS

1. Add domain in Vercel → Settings → Domains
2. Update DNS with your registrar:
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or use Vercel nameservers for full DNS management

## External Services Setup

### Email (Gmail SMTP)

1. Enable 2-Factor Authentication on the Gmail account
2. Go to Google Account → Security → App Passwords
3. Generate an App Password for "Mail"
4. Set `GMAIL_USER` = the Gmail address
5. Set `GMAIL_APP_PASSWORD` = the generated 16-character app password

### Database

[Document database setup steps here]

## Local Development

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm --filter @workspace/raven-digital run dev
pnpm --filter @workspace/api-server run dev
```

Required local env vars: `PORT` (set automatically by Replit)
```
