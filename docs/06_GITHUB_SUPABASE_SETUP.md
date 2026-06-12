# 06 — GitHub & Supabase Setup

> Procédures d'initialisation du dépôt et de l'environnement d'essai.

## GitHub — configuration dès le jour 1

### Création du dépôt

1. Créer un dépôt GitHub privé : `atccr-platform` (ou nom validé par l'organisation).
2. Branche par défaut : `main`.
3. Ne pas initialiser avec README si le projet local existe déjà.

### Premier push

```bash
git init
git add .
git commit -m "docs: add project governance and product specification"
git branch -M main
git remote add origin https://github.com/<ORG>/atccr-platform.git
git push -u origin main
```

### Branches

| Branche | Usage |
|---------|-------|
| `main` | Production / stable |
| `develop` | Intégration continue (optionnel Phase 0+) |
| `feature/<phase>-<module>` | Ex. `feature/phase-0-auth` |

### Protection `main` (recommandé)

- Pull request obligatoire.
- Au moins 1 revue (si équipe > 1).
- Pas de push direct avec secrets.

### Fichiers versionnés obligatoires

```
AGENTS.md
PRODUCT_SPEC.md
docs/
.env.example
.gitignore
README.md (après Phase 0)
prisma/schema.prisma (après Phase 0)
```

### Fichiers JAMAIS versionnés

```
.env
.env.local
.env.*.local
storage/
uploads/
node_modules/
.next/
*.pem
secrets/
```

### `.gitignore` minimal (à compléter en Phase 0)

```gitignore
# Dependencies
node_modules/

# Next.js
.next/
out/

# Environment
.env
.env*.local

# Storage local
storage/
uploads/

# IDE
.idea/
.vscode/settings.json

# OS
.DS_Store
Thumbs.db

# Prisma
prisma/*.db
prisma/*.db-journal

# Logs
*.log
npm-debug.log*
```

---

## Supabase — PostgreSQL uniquement (environnement d'essai)

### Rôle de Supabase dans ce projet

| Service Supabase | Utilisé ? | Notes |
|------------------|-----------|-------|
| PostgreSQL hébergé | ✅ Oui | Environnement trial / staging |
| Supabase Auth | ❌ Non | Auth.js en Phase 0 |
| Supabase Storage | ❌ Non | Stockage local via `StoragePort` |
| Supabase Realtime | ❌ Non | — |
| Edge Functions | ❌ Non | — |

### Création du projet Supabase

1. Créer un projet sur [supabase.com](https://supabase.com).
2. Région : la plus proche des utilisateurs (ex. EU si audience européenne).
3. Noter : **Project URL**, **anon key** (non utilisée Phase 0), **database password**.

### Connection string

Dans Supabase → Settings → Database → Connection string → URI :

```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

Pour Prisma migrations, utiliser la connexion **directe** (port 5432) :

```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
```

### Variables d'environnement

Fichier `.env` (local, non commité) :

```env
# Database
DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/atccr?schema=public"
# Supabase direct (migrations)
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@db.[REF].supabase.co:5432/postgres"

# Auth.js
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Storage local (Phase 0)
STORAGE_LOCAL_PATH="./storage"
```

Fichier `.env.example` (commité, sans valeurs réelles) :

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/atccr?schema=public"
DIRECT_URL=""
AUTH_SECRET=""
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
STORAGE_LOCAL_PATH="./storage"
```

### Prisma avec Supabase

Dans `prisma/schema.prisma` :

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### Migrations

```bash
# Local
npx prisma migrate dev --name init

# Supabase (trial)
DATABASE_URL="..." DIRECT_URL="..." npx prisma migrate deploy
npx prisma db seed
```

---

## Docker local (développement)

`docker-compose.yml` — PostgreSQL uniquement :

```yaml
services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: atccr
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

```bash
docker compose up -d
```

---

## Secrets — règles absolues

| Interdit en git | Alternative |
|-----------------|-------------|
| `.env` | `.env.example` avec placeholders |
| `DATABASE_URL` réelle | Documenter la procédure ici |
| `AUTH_SECRET` | Générer localement par développeur |
| Clés API paiement | Variables d'env + provider dashboard |
| Données participants réelles | Données seed fictives uniquement |
| Preuves de paiement réelles | Jamais en dépôt |

Générer `AUTH_SECRET` :

```bash
openssl rand -base64 32
```

---

## CI/CD (futur — post Phase 0)

Recommandation GitHub Actions :

- `lint` + `typecheck` sur chaque PR
- `prisma validate` sur chaque PR
- Déploiement Vercel ou équivalent sur merge `main`
- Variables secrètes dans GitHub Secrets, pas dans le code

---

## Checklist environnement nouveau développeur

- [ ] Clone du dépôt GitHub
- [ ] `cp .env.example .env` et remplir les valeurs
- [ ] `docker compose up -d` OU connexion Supabase trial
- [ ] `npm install`
- [ ] `npx prisma migrate dev`
- [ ] `npx prisma db seed`
- [ ] `npm run dev`
- [ ] Connexion super admin seed
- [ ] Vérifier que `storage/` est créé et gitignored
