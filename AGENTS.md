# AGENTS.md — ATCCR Congress Platform

> Guide principal pour tout agent IA (Cursor, etc.) travaillant sur ce dépôt.
> Lire ce fichier **avant** toute modification de code.

## Mission du projet

Plateforme web full-stack de **gestion d'un congrès médical scientifique** pour **ATCCR**.

Fonctionnalités cibles : site public, inscriptions, billetterie, paiements, programme scientifique, intervenants, partenaires, soumissions scientifiques (abstracts), évaluation par comité scientifique, badges QR, contrôle d'accès, attestations PDF.

## Ce que ce projet N'EST PAS

- Pas une plateforme de startup, incubateur, concours entrepreneurial ou pitch.
- Pas de logique investisseur, fondateur, classement de projets ou « coup de cœur ».
- La présélection scientifique est un **processus d'évaluation**, pas un concours avec prix.

## Vocabulaire obligatoire

| Utiliser | Ne jamais utiliser |
|----------|-------------------|
| scientific submission | startup, candidature startup |
| abstract | pitch |
| participant | founder |
| resident | — |
| speaker, moderator | — |
| scientific committee | incubator |
| scientific evaluator | investor, jury startup |
| sponsor, partner | — |
| badge, certificate | — |
| congress, session, presentation | business competition |

## Documents de référence (ordre de lecture)

Avant de coder une fonctionnalité, lire :

1. `AGENTS.md` (ce fichier)
2. `PRODUCT_SPEC.md`
3. `docs/01_ARCHITECTURE.md`
4. `docs/02_DATABASE_MODEL.md`
5. `docs/03_RBAC_PERMISSIONS.md`
6. `docs/04_MVP_ROADMAP.md`

Selon le contexte :

- UI/UX → `docs/05_UI_UX_GUIDELINES.md`
- Git / Supabase → `docs/06_GITHUB_SUPABASE_SETUP.md`
- Workflow IA → `docs/07_AI_WORKFLOW_RULES.md`
- Décisions → `docs/08_DECISIONS_LOG.md`

## Décisions techniques figées (ne pas changer sans approbation explicite)

| Domaine | Décision |
|---------|----------|
| Framework | Next.js App Router + TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| ORM | Prisma |
| Base de données | PostgreSQL ; Supabase = hébergement PostgreSQL uniquement (environnement d'essai) |
| Auth | Auth.js — **pas** Supabase Auth en Phase 0 |
| i18n | next-intl (FR / EN) |
| Phase 0 infra | Pas de Redis, BullMQ, S3, MinIO, workers |
| Fichiers Phase 0 | Abstraction `StoragePort` + stockage local |
| Email / PDF Phase 0 | Abstractions `MailPort` / `PdfPort` ; mock ou synchrone |
| Files d'attente | Abstraction `QueuePort` ; `InlineJobRunner` en Phase 0 |
| Versionnement | GitHub dès le jour 1 |
| Secrets | Ne jamais committer `.env`, clés API, mots de passe, URLs Supabase, données réelles |

## Décisions base de données figées

1. Une `registration` → plusieurs `payments` → plusieurs `payment_proofs`.
2. `registrations.payment_status` = statut **résumé** recalculé par service métier.
3. `speakers.user_id` nullable (intervenant public ou lié à un compte).
4. Évaluateurs = `users` avec rôle `scientific_evaluator`.
5. `sessions` = créneaux du programme global.
6. `presentations` = travaux scientifiques acceptés présentés dans une session.
7. `certificates` : `recipient_user_id` + FK nullable (`registration_id`, `submission_id`, `session_id`) + `certificate_type`, `status`, `authorized_by`, `generated_file_id`, `verification_code`.

## Architecture en bref

Monolithe Next.js modulaire :

```
src/app/          → routes (public, admin, espaces connectés)
src/components/   → UI (pas de logique métier lourde)
src/server/       → services, policies, repositories
src/lib/ports/    → abstractions (storage, mail, pdf, queue)
src/lib/adapters/ → implémentations MVP
prisma/           → schéma et migrations
```

## Rôles utilisateur (11)

`super_admin`, `congress_admin`, `registration_manager`, `finance_manager`, `scientific_committee_admin`, `scientific_evaluator`, `speaker`, `resident_submitter`, `participant`, `sponsor`, `staff`

Détail des permissions : `docs/03_RBAC_PERMISSIONS.md`

## Inspiration plateforme existante

Ce projet peut s'inspirer **fonctionnellement** d'une plateforme événementielle interne existante, mais :

- **Ne jamais copier** de code propriétaire, assets de design, textes, logos, captures d'écran privées, ni structure de base de données d'une plateforme interne existante.
- Les captures d'écran ne servent qu'à l'**inspiration fonctionnelle** (parcours, modules, comportements attendus) — pas à la reproduction directe.

## Langue du code

| Contexte | Langue |
|----------|--------|
| Code source, modèles BDD, variables, services, routes, identifiants internes | **Anglais** |
| Messages de commit | **Anglais** |
| Documentation technique (`docs/`, commentaires non triviaux) | **Anglais** |
| Labels UI visibles par l'utilisateur | **Français et anglais** via `messages/fr.json` et `messages/en.json` uniquement |

Ne pas mettre de texte utilisateur en dur dans les composants React.

## Opérations base de données interdites

**Ne jamais exécuter** sans approbation explicite du responsable projet :

- `prisma migrate reset`
- `prisma db push` avec changements destructifs
- `DROP TABLE` / suppression de tables
- `TRUNCATE` / vidage de tables
- Suppression de données seed

En cas de doute sur l'impact d'une migration, demander avant d'exécuter.

## Validation avant fin de tâche

Avant de proposer un commit, **exécuter ou documenter** les vérifications attendues :

| Commande | Quand |
|----------|-------|
| `npm run lint` | Toujours |
| `npm run typecheck` | Toujours |
| `npm run build` | Quand le changement touche le build ou les routes |
| `prisma validate` | Quand `prisma/schema.prisma` est modifié |
| `prisma migrate status` | Quand des migrations sont ajoutées ou modifiées |

Indiquer dans le résumé de tâche le résultat de chaque commande (succès, échec, ou non applicable).

## Données fictives uniquement

Utiliser **uniquement des données de démonstration fictives** dans les seeds, tests, captures d'écran et exemples.

**Ne jamais utiliser** :

- Noms réels de participants
- Emails ou numéros de téléphone réels
- Preuves de paiement réelles
- Abstracts médicaux réels ou données cliniques
- Captures d'écran privées ou données privées du congrès

Exemples acceptables : `demo.participant@example.com`, `Dr. Jean Dupont (fictif)`, contenus lorem ou générés pour la démo.

## Règles de travail

1. **Une phase à la fois** — ne pas implémenter plusieurs phases du roadmap simultanément.
2. **Module demandé uniquement** — rester dans le périmètre de la tâche.
3. **Pas d'invention** — si une exigence est ambiguë, demander avant d'implémenter.
4. **Logique métier** — dans `src/server/services/`, pas dans les composants React.
5. **Mise à jour doc** — toute décision, changement de schéma, permission ou roadmap → mettre à jour le doc concerné.
6. **Fin de tâche** — fournir le résumé structuré défini dans `docs/07_AI_WORKFLOW_RULES.md`, incluant les résultats de validation ci-dessus.

## Phase en cours

**Phase 0 — Fondations** (pas encore démarrée au moment de la rédaction de ce fichier)

Voir `docs/04_MVP_ROADMAP.md` pour le périmètre exact.

## Contacts & contexte

- Organisation : ATCCR (congrès médical scientifique)
- Langues interface : français (principal), anglais
- Devises billetterie : TND, EUR
