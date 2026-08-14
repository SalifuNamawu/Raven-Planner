# Raven Digital — Website Planner

A production-ready website planner for Raven Digital. Built with Vite, React, TypeScript, and Tailwind CSS. Deploys to Vercel with serverless functions.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run serve
```

## Project Structure

```
/
├── api/send-email.ts       # Vercel Serverless Function
├── src/                    # React application
├── public/                 # Static assets
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.base.json
├── vercel.json
└── docs/
    ├── PORTABILITY.md
    └── DEPLOYMENT.md
```

## Tech Stack

- **Frontend:** React 19, Vite 7, TypeScript, Tailwind CSS v4
- **Routing:** wouter
- **State:** @tanstack/react-query
- **Animations:** framer-motion
- **Icons:** lucide-react
- **Email:** nodemailer (Gmail SMTP)

## Deployment

Push to GitHub → Import in Vercel → Add environment variables → Deploy.

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for details.

## Environment Variables

| Variable | Description |
|---|---|
| `GMAIL_USER` | Gmail address for sending emails |
| `GMAIL_APP_PASSWORD` | Gmail App Password (16-char) |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | Google Spreadsheet ID for completed planner forms |
| `GOOGLE_SHEETS_SHEET_NAME` | Worksheet tab name (for example, `Sheet1`) |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Google service-account `client_email` |
| `GOOGLE_PRIVATE_KEY` | Google service-account private key |

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm serve` | Preview build |
| `pnpm typecheck` | TypeScript check |
