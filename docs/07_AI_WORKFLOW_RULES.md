# 07 — Règles de workflow IA

> Procédure obligatoire pour tout agent Cursor travaillant sur ce dépôt.

## Avant de coder

### Lecture obligatoire

Lire dans cet ordre :

1. `AGENTS.md`
2. `PRODUCT_SPEC.md`
3. `docs/01_ARCHITECTURE.md`
4. `docs/02_DATABASE_MODEL.md`
5. `docs/03_RBAC_PERMISSIONS.md`
6. `docs/04_MVP_ROADMAP.md`

Lire en complément selon la tâche :

| Tâche | Document additionnel |
|-------|---------------------|
| UI / composants | `docs/05_UI_UX_GUIDELINES.md` |
| Git / env / Supabase | `docs/06_GITHUB_SUPABASE_SETUP.md` |
| Décision passée | `docs/08_DECISIONS_LOG.md` |

### Vérifications pré-codage

- [ ] Identifier la **phase** et le **module** demandés.
- [ ] Confirmer que la phase précédente est terminée (ou que la tâche est dans le périmètre actuel).
- [ ] Vérifier qu'aucune décision figée n'est contredite.
- [ ] Si exigence ambiguë → **demander** avant d'implémenter.

## Règles d'exécution

### Périmètre

1. **Une phase à la fois** — ne pas implémenter Phase 2 pendant Phase 0.
2. **Un module à la fois** — rester dans la tâche demandée.
3. **Pas d'invention** — comportement non spécifié = question, pas supposition.
4. **Pas de vocabulaire interdit** — voir `AGENTS.md`.

### Qualité code

1. Logique métier dans `src/server/services/` — **pas** dans les composants React.
2. Autorisation via `src/server/policies/` — vérification serveur systématique.
3. Accès données via repositories ou services — pas de Prisma dans les composants.
4. Chaînes UI via `next-intl` — pas de texte en dur.
5. Diff minimal — ne pas refactorer hors périmètre.
6. Conventions existantes — lire le code environnant avant d'ajouter.

### Interdictions Phase 0

- Installer Redis, BullMQ, S3, MinIO, workers.
- Utiliser Supabase Auth.
- Implémenter inscriptions, paiements UI, soumissions, badges, scanner.
- Committer `.env`, secrets, données réelles.

### Abstractions obligatoires

Utiliser les ports dès Phase 0 :

```typescript
getStorage()   // LocalFileStorage
getMailer()    // ConsoleMailer
getPdfGenerator() // SyncPdfGenerator (stub)
getJobRunner() // InlineJobRunner
```

## Pendant le codage

### Ordre recommandé par feature

1. Schéma Prisma (si changement BDD) + migration
2. Mettre à jour `docs/02_DATABASE_MODEL.md`
3. Service métier
4. Policy RBAC (si nouvelle action)
5. Mettre à jour `docs/03_RBAC_PERMISSIONS.md` (si changement)
6. Route / Server Action / API
7. Composants UI
8. Traductions `messages/fr.json` + `messages/en.json`
9. Tests unitaires ciblés (si logique critique)

### Changements de schéma

1. Modifier `prisma/schema.prisma`
2. `npx prisma migrate dev --name <description>`
3. Mettre à jour `docs/02_DATABASE_MODEL.md`
4. Ajouter entrée `docs/08_DECISIONS_LOG.md` si décision structurante

### Nouvelles décisions

Toute décision non couverte par la spec → entrée dans `docs/08_DECISIONS_LOG.md` :

```markdown
## DEC-XXX — Titre court

**Date** : YYYY-MM-DD
**Contexte** : ...
**Décision** : ...
**Conséquences** : ...
```

## Après chaque tâche de codage

Fournir ce résumé structuré à l'utilisateur :

```markdown
## Résumé de tâche

### Fichiers créés
- chemin/fichier

### Fichiers modifiés
- chemin/fichier

### Changements base de données
- Migration : `YYYYMMDDHHMMSS_nom`
- Tables / colonnes affectées
- (ou « Aucun »)

### Variables d'environnement
- `NOUVELLE_VAR` — description
- (ou « Aucune nouvelle »)

### Checklist de test manuel
- [ ] ...
- [ ] ...

### Message de commit git recommandé
```
type(scope): description courte

Corps optionnel.
```
```

### Types de commit recommandés

| Type | Usage |
|------|-------|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction bug |
| `docs` | Documentation seule |
| `chore` | Config, deps, tooling |
| `refactor` | Refactoring sans changement comportement |
| `test` | Tests |

Exemples :

```
feat(phase-0): add Auth.js credentials provider and RBAC middleware
docs: update database model for payment proofs
chore: add docker-compose postgres only
```

## Gestion des conflits spec / code

Si le code existant contredit la spec ou les docs de gouvernance :

1. Signaler le conflit à l'utilisateur.
2. Ne pas « corriger silencieusement » sans confirmation.
3. La spec et les docs de gouvernance priment sur le code existant.

## Revue avant livraison

- [ ] Pas de vocabulaire interdit dans code, UI, routes, seed.
- [ ] RBAC vérifié côté serveur.
- [ ] Pas de secret dans le diff.
- [ ] Docs mises à jour si schéma / permissions / roadmap changés.
- [ ] `npm run build` ou `tsc --noEmit` sans erreur (si applicable).
- [ ] Résumé de tâche fourni.

## Escalade

Demander confirmation utilisateur avant :

- Changer une décision technique figée.
- Ajouter une dépendance majeure non listée dans l'architecture.
- Modifier l'ordre des phases MVP.
- Introduire une entité BDD non documentée.
- Exposer des données sensibles (commentaires évaluateurs, identité évaluateur).
