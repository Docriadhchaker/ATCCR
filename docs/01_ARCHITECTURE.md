# 01 — Architecture technique

> Source de vérité architecture. Toute déviation requiert une entrée dans `08_DECISIONS_LOG.md`.

## Vue d'ensemble

Application **monolithique** Next.js servant :

- le **site public** du congrès (FR/EN),
- les **espaces connectés** (participant, résident déposant, intervenant, évaluateur, staff),
- le **back-office administratif**,
- l'**API interne** (Server Actions + routes API).

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js (App Router)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐ │
│  │  Public  │  │  Admin   │  │ Espaces  │  │   Staff    │ │
│  │  [locale]│  │  /admin  │  │ connectés│  │  /scanner  │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬──────┘ │
│       └─────────────┴─────────────┴──────────────┘        │
│                         │                                    │
│              Middleware (locale, auth, RBAC)                 │
│                         │                                    │
│       ┌─────────────────┴─────────────────┐                 │
│       │         Server Layer               │                 │
│       │  services · policies · repositories│                 │
│       └─────────────────┬─────────────────┘                 │
│                         │                                    │
│       ┌─────────┬───────┴───────┬─────────────┐             │
│       │ Prisma  │  Port adapters │  Auth.js    │             │
│       └────┬────┘       │        └─────────────┘             │
└────────────┼────────────┼───────────────────────────────────┘
             │            │
      ┌──────▼──────┐  ┌──▼──────────────┐
      │ PostgreSQL  │  │ Stockage local   │
      │ (Supabase   │  │ (Phase 0)        │
      │  en trial)  │  └─────────────────┘
      └─────────────┘
```

## Stack validée

| Couche | Technologie | Version cible |
|--------|-------------|---------------|
| Runtime | Node.js | LTS |
| Framework | Next.js App Router | 14+ |
| Langage | TypeScript | strict |
| Styles | Tailwind CSS | 3+ |
| Composants | shadcn/ui | — |
| ORM | Prisma | 5+ |
| Base | PostgreSQL | 15+ |
| Auth | Auth.js (NextAuth v5) | — |
| i18n | next-intl | — |

## Ce qui est explicitement exclu en Phase 0

| Technologie | Statut Phase 0 | Migration future |
|-------------|----------------|------------------|
| Redis | Non installé | Cache, sessions optionnelles |
| BullMQ | Non installé | Via `QueuePort` |
| S3 / MinIO | Non installé | Via `StoragePort` |
| Workers dédiés | Non | `InlineJobRunner` |
| Supabase Auth | Non | Auth.js uniquement |
| Express séparé | Non | API dans Next.js |
| MongoDB | Non | PostgreSQL uniquement |

## Couche d'abstraction (ports)

Tous les adapters sont injectés via factories dans `src/lib/adapters/`.

### StoragePort

```typescript
// Contrat conceptuel
interface StoragePort {
  save(file: Buffer, meta: FileMeta): Promise<StoredFile>
  getLocalPath(key: string): string
  delete(key: string): Promise<void>
  getSignedUrl?(key: string): Promise<string>  // implémenté plus tard (S3)
}
```

**Phase 0** : `LocalFileStorage` → répertoire `storage/` (gitignored).

### MailPort

**Phase 0** : `ConsoleMailer` — log structuré en console / fichier dev.

### PdfPort

**Phase 0** : `SyncPdfGenerator` — stub ou génération synchrone minimale.

### QueuePort

**Phase 0** : `InlineJobRunner` — exécute la tâche immédiatement dans le même processus.

## Organisation du code

### Routes (`src/app/`)

| Zone | Chemin | Rendu |
|------|--------|-------|
| Public | `/[locale]/*` | SSG/ISR quand possible |
| Admin | `/[locale]/admin/*` | Dynamique, RBAC |
| Participant | `/[locale]/mon-compte/*` | Dynamique, auth |
| Évaluateur | `/[locale]/evaluations/*` | Dynamique, rôle |
| Staff | `/[locale]/scanner` | Dynamique, mobile-first |

### Services métier (`src/server/services/`)

Un service par domaine :

- `congress-settings.service.ts`
- `registration.service.ts`
- `payment.service.ts` + `payment-status.service.ts`
- `submission.service.ts`
- `evaluation.service.ts`
- `program.service.ts` (sessions + presentations)
- `speaker.service.ts`
- `sponsor.service.ts`
- `badge.service.ts`
- `certificate.service.ts`
- `check-in.service.ts`
- `notification.service.ts`
- `media.service.ts`

### Policies (`src/server/policies/`)

Règles d'autorisation par action (`canValidatePayment`, `canDecideSubmission`, etc.).

### Repositories (`src/server/repositories/`)

Accès Prisma encapsulé ; les services ne appellent pas Prisma directement dans les composants.

## Modèle programme scientifique

```
Session (créneau global du programme)
  ├── session_speakers → Speaker (user_id nullable)
  └── Presentation (travail présenté)
        └── scientific_submission_id (nullable si saisie manuelle)
```

- **Session** : plénière, symposium, session posters, pause-café, etc.
- **Presentation** : communication orale, poster, vidéo liée à un abstract accepté.

## Modèle paiements

```
Registration
  ├── payment_status (résumé)
  └── Payment[] (historique)
        └── PaymentProof[] (preuves multiples par tentative)
```

Le service `PaymentStatusService.recompute(registrationId)` met à jour le statut résumé après chaque événement.

## Modèle attestations

```
Certificate
  ├── recipient_user_id (obligatoire)
  ├── registration_id? | submission_id? | session_id?
  ├── certificate_type
  ├── status (draft → authorized → generated → revoked)
  ├── authorized_by
  ├── generated_file_id → MediaAsset
  └── verification_code (unique)
```

## Sécurité

- Mots de passe hashés (bcrypt ou argon2).
- Sessions httpOnly via Auth.js.
- RBAC middleware + policies par action.
- Commentaires évaluateurs : admin/comité uniquement.
- Identité évaluateur : jamais exposée au déposant.
- Fichiers sensibles : chemins non publics ; servis via route contrôlée.
- Audit log : paiements, décisions scientifiques, attestations, badges, changements de rôles.

## Environnements

| Env | Base | Stockage | Email |
|-----|------|----------|-------|
| local | Docker PostgreSQL ou Supabase | `storage/` local | Console |
| trial (Supabase) | Supabase PostgreSQL | `storage/` ou volume | Console / SMTP plus tard |
| production | PostgreSQL managé | S3 (futur) | SMTP / provider |

## Dépendances externes futures (hors Phase 0)

- Passerelle paiement en ligne (connecteur abstrait).
- SMTP transactionnel.
- Stockage objet cloud.
- File d'attente pour exports massifs et emails.
