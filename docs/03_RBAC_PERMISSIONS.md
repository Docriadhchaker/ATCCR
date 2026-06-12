# 03 — RBAC & Permissions

> Matrice d'autorisation. Mettre à jour ce document si les permissions changent.

## Principes

1. **Auth.js** gère l'authentification (sessions).
2. **Rôles** stockés en base (`user_roles`) — un utilisateur peut cumuler plusieurs rôles.
3. **Middleware** protège les zones de routes.
4. **Policies** (`src/server/policies/`) valident chaque action métier côté serveur.
5. Ne jamais se fier au seul masquage UI — toujours vérifier côté serveur.

## Rôles (11)

| Code | Label FR | Description |
|------|----------|-------------|
| `super_admin` | Super administrateur | Accès total, paramètres système, gestion des rôles |
| `congress_admin` | Administrateur congrès | Contenu, inscriptions, programme, partenaires, attestations |
| `registration_manager` | Responsable inscriptions | Participants, badges, check-in |
| `finance_manager` | Responsable finances | Validation paiements, preuves, reçus, exports |
| `scientific_committee_admin` | Admin comité scientifique | Soumissions, attribution évaluateurs, décisions |
| `scientific_evaluator` | Évaluateur scientifique | Évalue uniquement les soumissions assignées |
| `speaker` | Intervenant | Profil, sessions, attestations personnelles |
| `resident_submitter` | Résident / déposant | Soumissions scientifiques, suivi statut |
| `participant` | Participant | Inscription, badge, programme, attestation participation |
| `sponsor` | Partenaire / exposant | Espace partenaire (logo, informations package) |
| `staff` | Agent accueil | Scanner QR uniquement |

## Hiérarchie d'accès admin

```
super_admin
  └── congress_admin
        ├── registration_manager
        ├── finance_manager
        ├── scientific_committee_admin
        └── (lecture seule croisée selon module)
```

`super_admin` hérite de toutes les permissions. `congress_admin` hérite de la plupart sauf paramètres système réservés au super admin.

## Matrice par module

Légende : ✅ complet · 👁 lecture · ✏️ soi uniquement · ➖ aucun accès

| Module / Action | super | congress | registration | finance | sci_admin | evaluator | speaker | resident | participant | sponsor | staff |
|-----------------|:-----:|:--------:|:------------:|:-------:|:---------:|:---------:|:-------:|:--------:|:-----------:|:-------:|:-----:|
| **Paramètres système** | ✅ | 👁 | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Gestion des rôles** | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Contenu site public** | ✅ | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Thématiques / navigation** | ✅ | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Programme (sessions)** | ✅ | ✅ | ➖ | ➖ | 👁 | ➖ | 👁 | 👁 | 👁 | ➖ | ➖ |
| **Présentations** | ✅ | ✅ | ➖ | ➖ | ✅ | ➖ | 👁 | ➖ | ➖ | ➖ | ➖ |
| **Intervenants** | ✅ | ✅ | ➖ | ➖ | ➖ | ➖ | ✏️ | ➖ | ➖ | ➖ | ➖ |
| **Partenaires** | ✅ | ✅ | ➖ | 👁 | ➖ | ➖ | ➖ | ➖ | ➖ | ✏️ | ➖ |
| **Inscriptions — liste** | ✅ | ✅ | ✅ | 👁 | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Inscriptions — soi** | ✅ | ✅ | ✅ | 👁 | ➖ | ➖ | ✏️ | ✏️ | ✏️ | ➖ | ➖ |
| **Inscriptions — édition** | ✅ | ✅ | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Paiements — validation** | ✅ | ✅ | ➖ | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Preuves — upload** | ✅ | ✅ | ✅ | ✅ | ➖ | ➖ | ➖ | ✏️ | ✏️ | ➖ | ➖ |
| **Preuves — relecture** | ✅ | ✅ | 👁 | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Badges — génération** | ✅ | ✅ | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Badges — téléchargement soi** | ✅ | ✅ | ✅ | ➖ | ➖ | ✏️ | ✏️ | ✏️ | ✏️ | ✏️ | ➖ |
| **Scanner / check-in** | ✅ | ✅ | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ✅ |
| **Soumissions — liste** | ✅ | ✅ | ➖ | ➖ | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Soumissions — déposer** | ✅ | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ✏️ | ✏️* | ➖ | ➖ |
| **Soumissions — décision** | ✅ | ✅ | ➖ | ➖ | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Évaluations — assigner** | ✅ | ✅ | ➖ | ➖ | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Évaluations — noter** | ✅ | 👁 | ➖ | ➖ | 👁 | ✅** | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Commentaires évaluateur** | ✅ | ✅ | ➖ | ➖ | ✅ | ✏️*** | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Attestations — autoriser** | ✅ | ✅ | ✅ | ➖ | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Attestations — télécharger soi** | ✅ | ✅ | ✅ | ➖ | ➖ | ✏️ | ✏️ | ✏️ | ✏️ | ➖ | ➖ |
| **Médiathèque** | ✅ | ✅ | ➖ | ➖ | 👁 | ➖ | ➖ | ➖ | ➖ | ✏️ | ➖ |
| **Modèles email** | ✅ | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Exports CSV/Excel** | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Audit logs** | ✅ | 👁 | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |

\* Participant : soumission si catégorie éligible et période ouverte.
\*\* Évaluateur : uniquement soumissions assignées (`evaluation_assignments.evaluator_id = user.id`).
\*\*\* Évaluateur : voit ses propres commentaires ; admin/comité voit tout.

## Règles d'anonymat scientifique

| Donnée | Visible déposant | Visible évaluateur | Visible admin/comité |
|--------|:----------------:|:------------------:|:--------------------:|
| Identité évaluateur | ➖ | soi | ✅ |
| Scores individuels | ➖ | ses propres | ✅ |
| Commentaires confidentiels | ➖ | ➖ | ✅ |
| Décision finale | ✅ | ➖ | ✅ |
| Moyenne des scores | ➖ | ➖ | ✅ |

## Évaluateurs = utilisateurs

- Pas de table `evaluators` séparée.
- Un évaluateur est un `user` avec rôle `scientific_evaluator`.
- L'attribution se fait via `evaluation_assignments.evaluator_id → users.id`.
- Seuls les users ayant ce rôle peuvent être assignés (validé en service).

## Intervenants = profil optionnel lié

- `speakers.user_id` nullable.
- Intervenant public sans compte : fiche `speakers` seule.
- Intervenant avec compte : `speakers.user_id` + rôle `speaker`.
- Espace connecté intervenant : accès via `user_id` ou rôle `speaker`.

## Permissions techniques (codes)

Utiliser ces codes dans `src/server/policies/` :

```
congress.settings.manage
congress.settings.read
users.roles.manage
content.public.manage
program.sessions.manage
program.sessions.read
program.presentations.manage
speakers.manage
speakers.read.self
sponsors.manage
sponsors.read.self
registrations.list
registrations.manage
registrations.read.self
payments.validate
payments.proofs.review
payments.proofs.upload.self
badges.generate
badges.read.self
checkin.scan
submissions.list
submissions.manage.self
submissions.decide
evaluations.assign
evaluations.submit
evaluations.read.all
certificates.authorize
certificates.read.self
media.manage
media.upload.self
emails.templates.manage
exports.data
audit.read
```

## Middleware — zones protégées

| Préfixe route | Rôles minimum |
|---------------|---------------|
| `/[locale]/admin` | `congress_admin` ou supérieur* |
| `/[locale]/admin/parametres/systeme` | `super_admin` |
| `/[locale]/admin/utilisateurs` | `super_admin` |
| `/[locale]/admin/finances` | `finance_manager`, `congress_admin`, `super_admin` |
| `/[locale]/admin/soumissions` | `scientific_committee_admin`, `congress_admin`, `super_admin` |
| `/[locale]/evaluations` | `scientific_evaluator` |
| `/[locale]/scanner` | `staff`, `registration_manager`, `congress_admin`, `super_admin` |
| `/[locale]/mon-compte` | authentifié |

\* « ou supérieur » = hiérarchie héritée côté policy.

## Phase 0 — permissions actives

En Phase 0, seules ces permissions sont implémentées :

- `congress.settings.manage` / `read`
- `users.roles.manage`
- `audit.read` (super_admin)
- Accès admin shell (congress_admin+)

Les autres policies sont déclarées mais retournent `501` ou sont absentes jusqu'à leur phase.

## Session Auth.js enrichie

```typescript
// Structure cible session.user
{
  id: string
  email: string
  locale: 'fr' | 'en'
  roles: string[]        // codes rôles pour congress actif
  congressId: string
}
```

## Audit obligatoire

Actions déclenchant un `audit_logs` :

- `users.roles.assigned` / `users.roles.revoked`
- `payments.validated` / `payments.rejected`
- `submissions.decided`
- `certificates.authorized` / `certificates.generated`
- `badges.generated`
- `checkin.access_denied` (optionnel, configurable)
