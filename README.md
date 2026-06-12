# ATCCR Congress Platform

Medical scientific congress management platform for **ATCCR**.

Public website, participant registration, scientific abstract submissions, scientific committee evaluation, badges, check-in, and certificates.

## Prerequisites

- **Node.js** 20 LTS or newer
- **npm** 10+
- **PostgreSQL** 15+ (local Docker or [Supabase](https://supabase.com) trial for hosted PostgreSQL)

> Supabase is used **only as PostgreSQL hosting** in the trial environment. Auth.js will handle authentication (not Supabase Auth).

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template (never commit .env)
cp .env.example .env

# 3. Fill in .env with your local or Supabase PostgreSQL credentials
#    Generate AUTH_SECRET: openssl rand -base64 32

# 4. Validate Prisma schema (after Step B migrations are added)
npm run prisma:validate

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/fr` or `/en`.

## Environment variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (pooler URL for Supabase app queries) |
| `DIRECT_URL` | Direct PostgreSQL URL for Prisma migrations (Supabase port 5432) |
| `AUTH_SECRET` | Secret for Auth.js sessions (required in later Phase 0 steps) |
| `NEXT_PUBLIC_APP_URL` | Public app URL, e.g. `http://localhost:3000` |
| `STORAGE_LOCAL_PATH` | Local file storage directory, default `./storage` |

See `.env.example` for placeholders. **Never commit real credentials.**

## Development commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript check without emit |
| `npm run prisma:validate` | Validate `prisma/schema.prisma` |

## Project structure

```
src/
  app/              Next.js App Router
  components/       UI components (shadcn/ui)
  lib/              Shared utilities, ports, adapters
  server/           Services, policies, repositories
  i18n/             next-intl routing and request config
messages/           fr.json, en.json — user-facing strings only
prisma/             Prisma schema and migrations
docs/               Architecture and governance documentation
```

## Security

- Never commit `.env`, API keys, Supabase passwords, or real participant data.
- Use fake demo data only in seeds, tests, and examples.
- See `AGENTS.md` and `docs/` for full governance rules.

## Documentation

| File | Purpose |
|------|---------|
| `AGENTS.md` | AI agent and developer guide |
| `PRODUCT_SPEC.md` | Product requirements |
| `docs/01_ARCHITECTURE.md` | Technical architecture |
| `docs/04_MVP_ROADMAP.md` | Implementation phases |
| `docs/06_GITHUB_SUPABASE_SETUP.md` | Git and Supabase setup |

## License

Private — ATCCR organization.
