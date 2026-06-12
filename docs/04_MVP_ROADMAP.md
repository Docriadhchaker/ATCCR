# 04 — Feuille de route MVP

> Ordre d'implémentation validé. **Ne pas sauter de phase ni coder plusieurs phases simultanément.**

## Vue d'ensemble

| Phase | Nom | Durée estimée | Statut |
|-------|-----|---------------|--------|
| 0 | Fondations | 2 sem. | 🔲 Non démarrée |
| 1 | Site public | 2 sem. | 🔲 |
| 2 | Inscriptions & paiements | 3 sem. | 🔲 |
| 3 | Badges & check-in | 1–2 sem. | 🔲 |
| 4 | Programme & intervenants | 2 sem. | 🔲 |
| 5 | Soumissions & évaluation | 3 sem. | 🔲 |
| 6 | Attestations & finition | 2 sem. | 🔲 |

---

## Phase 0 — Fondations

**Objectif** : socle technique, auth, RBAC, paramètres congrès, abstractions ports.

### Inclus

- [ ] Initialisation Next.js + TypeScript + Tailwind + shadcn/ui + next-intl
- [ ] Prisma + PostgreSQL (Docker local ; Supabase en trial)
- [ ] Schéma Prisma complet (tables Phase 0 + structures futures)
- [ ] Migration initiale + seed (rôles, congrès, super admin)
- [ ] Auth.js (credentials, sessions)
- [ ] RBAC middleware + helpers + policies Phase 0
- [ ] Ports : `StoragePort`, `MailPort`, `PdfPort`, `QueuePort`
- [ ] Adapters : local storage, console mailer, PDF stub, inline runner
- [ ] `CongressSettingsService` + page admin paramètres
- [ ] Gestion rôles utilisateurs (super admin)
- [ ] Layout admin (sidebar) + tableau de bord placeholder
- [ ] Landing publique minimale bilingue (hero depuis paramètres)
- [ ] `AuditLog` sur changements de rôles
- [ ] `PaymentStatusService` squelette (logique documentée, tests unitaires)
- [ ] `docker-compose.yml` : PostgreSQL uniquement
- [ ] `.env.example`, README développeur

### Exclu

- Redis, BullMQ, S3, MinIO, workers
- Supabase Auth
- Inscriptions, paiements UI, soumissions, badges, scanner
- Génération PDF réelle, envoi email réel
- Paiement en ligne (même placeholder webhook)

### Critères de fin

1. Super admin connecté via Auth.js
2. Paramètres congrès persistés et éditables
3. Logo uploadé via stockage local
4. Rôles assignables avec audit
5. Routes `/admin` protégées
6. Site `/fr` et `/en` avec hero dynamique
7. `prisma migrate` + `prisma db seed` reproductibles

---

## Phase 1 — Site public

**Objectif** : site vitrine administrable du congrès.

### Livrables

- [ ] Sections : À propos, Thématiques, Programme (lecture), Intervenants, Partenaires
- [ ] CMS léger via `congress_settings` + tables dédiées
- [ ] Navigation bilingue éditable
- [ ] Visibilité sections configurable
- [ ] Pages presse / médias (affichage)
- [ ] SEO de base, métadonnées

### Dépendances

Phase 0 complète.

---

## Phase 2 — Inscriptions & paiements

**Objectif** : parcours inscription complet avec gestion financière.

### Livrables

- [ ] Types de billets et options
- [ ] Formulaire inscription public
- [ ] Logique early bird / sur place
- [ ] Modèle paiements multi-enregistrements + preuves
- [ ] `PaymentStatusService` complet
- [ ] Upload preuve de virement
- [ ] Validation / rejet finance
- [ ] Placeholder paiement en ligne
- [ ] Tableau de bord inscriptions (filtres, recherche)
- [ ] Détail inscription (onglets spec)
- [ ] Import / export CSV
- [ ] Historique `payment_status_history`

### Dépendances

Phase 0, Phase 1 (billetterie lien public).

---

## Phase 3 — Badges & check-in

**Objectif** : contrôle d'accès le jour du congrès.

### Livrables

- [ ] Génération badge PDF/PNG + QR
- [ ] Couleurs par catégorie
- [ ] Impression unitaire et en masse
- [ ] Page scanner staff (caméra + saisie manuelle)
- [ ] Règles d'accès selon `payment_status`
- [ ] Check-in et compteur de scans
- [ ] Validation accès masterclass (option payante)

### Dépendances

Phase 2 (inscriptions confirmées).

---

## Phase 4 — Programme & intervenants

**Objectif** : programme scientifique consultable et administrable.

### Livrables

- [ ] CRUD `sessions` (tous types spec)
- [ ] CRUD `speakers` (user_id nullable)
- [ ] Liaison `session_speakers`
- [ ] Affichage public filtrable (jour, type, salle, intervenant)
- [ ] Agenda personnel
- [ ] CRUD partenaires (affichage public)
- [ ] Structure `presentations` (sans lien soumission pour l'instant)

### Dépendances

Phase 1 (affichage public).

---

## Phase 5 — Soumissions & évaluation

**Objectif** : cycle appel à communications → présélection.

### Livrables

- [ ] Formulaire dépôt abstract structuré
- [ ] Statuts soumission + brouillon
- [ ] Espace déposant (suivi statut)
- [ ] Attribution évaluateurs (users `scientific_evaluator`)
- [ ] Grille évaluation 7 critères
- [ ] Tableau de bord comité scientifique
- [ ] Décisions + notifications (console mailer)
- [ ] Lien soumission acceptée → `presentation` dans session
- [ ] Export Excel soumissions

### Dépendances

Phase 4 (sessions pour planification).

---

## Phase 6 — Attestations & finition

**Objectif** : plateforme utilisable de bout en bout.

### Livrables

- [ ] Modèles attestations uploadables
- [ ] Génération PDF synchrone (`PdfPort`)
- [ ] Règles : check-in, présentation validée, autorisation admin
- [ ] Modèle `certificates` complet
- [ ] Code de vérification public
- [ ] Médiathèque admin
- [ ] Modèles email bilingues éditables
- [ ] Tableau de bord KPI consolidé
- [ ] i18n complet back-office

### Dépendances

Phases 3, 4, 5.

---

## Post-MVP (hors périmètre initial)

- Connecteur paiement en ligne réel
- Migration `StoragePort` → S3
- Migration `MailPort` → SMTP / provider
- Migration `QueuePort` → BullMQ + Redis
- Multi-éditions congrès (historique)
- Upload vidéo lourd
- Application mobile scanner dédiée

---

## Ordre strict — rappel spec produit

L'ordre validé correspond à `PRODUCT_SPEC.md` section MVP PRIORITY :

1. Auth & rôles
2. Landing publique
3. Inscriptions & billetterie
4. Paiements (statuts, preuves, placeholder en ligne)
5. Dashboard inscriptions
6. Badges QR
7. Scanner & check-in
8. Programme
9. Intervenants
10. Partenaires
11. Soumissions scientifiques
12. Évaluation scientifique
13. Attestations
14. Médiathèque
15. Modèles email
16. Interface bilingue complète

---

## Règle de changement

Toute modification de cet ordre doit être :

1. Justifiée dans `docs/08_DECISIONS_LOG.md`
2. Approuvée explicitement par le responsable projet
3. Reflétée dans ce document
