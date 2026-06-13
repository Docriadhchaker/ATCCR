# 08 — Journal des décisions (ADR)

> Architecture Decision Records. Toute décision structurante non triviale est consignée ici.

## Format

```markdown
## DEC-XXX — Titre

**Date** : YYYY-MM-DD
**Statut** : accepté | remplacé par DEC-YYY | déprécié
**Contexte** : ...
**Décision** : ...
**Alternatives écartées** : ...
**Conséquences** : ...
```

---

## DEC-001 — Plateforme congrès médical scientifique ATCCR

**Date** : 2026-06-12
**Statut** : accepté

**Contexte** : Le projet s'inspire d'une plateforme événementielle interne existante mais doit être adapté au contexte d'un congrès médical scientifique.

**Décision** : Construire une plateforme de gestion de congrès médical scientifique. Remplacer toute logique de type concours entrepreneurial par la logique de soumissions scientifiques et d'évaluation par comité.

**Alternatives écartées** : Réutilisation directe de la plateforme startup/incubateur sans adaptation.

**Conséquences** : Vocabulaire, modules et UX orientés congrès. Voir `AGENTS.md` pour termes interdits.

---

## DEC-002 — Stack monolithe Next.js

**Date** : 2026-06-12
**Statut** : accepté

**Contexte** : Besoin d'un MVP rapide avec site public, back-office et API.

**Décision** : Monolithe Next.js App Router + TypeScript + Tailwind + shadcn/ui + Prisma + PostgreSQL + Auth.js + next-intl.

**Alternatives écartées** : Backend Express séparé ; MongoDB ; frontend Vite découplé.

**Conséquences** : Un seul dépôt, déploiement simplifié. API via Server Actions et routes API Next.js.

---

## DEC-003 — Supabase PostgreSQL uniquement (pas Supabase Auth)

**Date** : 2026-06-12
**Statut** : accepté

**Contexte** : Environnement d'essai hébergé nécessaire sans complexifier l'auth.

**Décision** : Utiliser Supabase uniquement comme hébergeur PostgreSQL pour l'environnement trial. Auth.js pour l'authentification. Pas de Supabase Auth, Storage, ni Realtime en Phase 0.

**Alternatives écartées** : Supabase Auth (couplage) ; base locale uniquement.

**Conséquences** : `DATABASE_URL` + `DIRECT_URL` pour Prisma. Auth entièrement gérée dans l'application.

---

## DEC-004 — Pas d'infra async en Phase 0

**Date** : 2026-06-12
**Statut** : accepté

**Contexte** : Réduire la complexité opérationnelle au démarrage.

**Décision** : Phase 0 sans Redis, BullMQ, S3, MinIO, ni workers. Abstractions `StoragePort`, `MailPort`, `PdfPort`, `QueuePort` avec implémentations locales / synchrones / mockées.

**Alternatives écartées** : Installer Redis et S3 dès le départ.

**Conséquences** : PDF et emails synchrones ou loggés. Migration future par swap d'adapter sans refonte métier.

---

## DEC-005 — Modèle paiements multi-enregistrements

**Date** : 2026-06-12
**Statut** : accepté

**Contexte** : Une inscription peut avoir plusieurs tentatives de paiement, preuves rejetées, remboursements.

**Décision** :
- `registrations` → plusieurs `payments`
- `payments` → plusieurs `payment_proofs`
- `registrations.payment_status` = statut résumé recalculé par `PaymentStatusService`

**Alternatives écartées** : Un seul enregistrement `payment` par inscription.

**Conséquences** : Historique complet. Service de recalcul obligatoire. Table `payment_status_history` recommandée.

---

## DEC-006 — Modèle attestations explicite

**Date** : 2026-06-12
**Statut** : accepté

**Contexte** : Éviter un modèle polymorphe informel difficile à requêter.

**Décision** : Table `certificates` avec `recipient_user_id` obligatoire et FK nullable `registration_id`, `submission_id`, `session_id`, plus `certificate_type`, `status`, `authorized_by`, `generated_file_id`, `verification_code`.

**Alternatives écartées** : Colonne unique `entity_type` + `entity_id` sans FK typées.

**Conséquences** : Validation métier par type d'attestation. Intégrité référentielle PostgreSQL.

---

## DEC-007 — Intervenants liés optionnellement aux utilisateurs

**Date** : 2026-06-12
**Statut** : accepté

**Contexte** : Certains intervenants ont un compte, d'autres sont des fiches publiques uniquement.

**Décision** : `speakers.user_id` nullable. Espace connecté via `user_id` + rôle `speaker`.

**Alternatives écartées** : Table intervenants toujours liée à un user ; intervenants sans table dédiée.

**Conséquences** : CRUD intervenants indépendant des comptes. Lien manuel ou automatique à la création de compte.

---

## DEC-008 — Évaluateurs = utilisateurs avec rôle

**Date** : 2026-06-12
**Statut** : accepté

**Contexte** : Cohérence auth et traçabilité.

**Décision** : Pas de table `evaluators`. `evaluation_assignments.evaluator_id` → `users.id`. Rôle requis : `scientific_evaluator`.

**Alternatives écartées** : Entité évaluateur séparée déconnectée des users.

**Conséquences** : Attribution limitée aux users avec le bon rôle. Anonymat côté déposant préservé.

---

## DEC-009 — Sessions vs présentations

**Date** : 2026-06-12
**Statut** : accepté

**Contexte** : Clarifier le lien entre programme global et travaux scientifiques acceptés.

**Décision** :
- `sessions` = créneaux du programme global (plénière, symposium, session posters…)
- `presentations` = travaux individuels présentés dans une session, liés optionnellement à `scientific_submissions`

**Alternatives écartées** : Table `program_slots` non définie ; fusion session/travail en une seule entité.

**Conséquences** : Une session posters contient N présentations. Une communication orale acceptée devient une `presentation` planifiée.

---

## DEC-010 — Documentation de gouvernance préalable au code

**Date** : 2026-06-12
**Statut** : accepté

**Contexte** : Éviter la dérive d'implémentation entre sessions Cursor.

**Décision** : Créer `AGENTS.md`, `docs/01–08`, et `.cursor/rules/atccr-platform.mdc` avant toute implémentation Phase 0.

**Alternatives écartées** : Coder d'abord, documenter plus tard.

**Conséquences** : Chaque tâche IA commence par lire la gouvernance. Mises à jour doc obligatoires sur changements structurants.

---

## DEC-011 — Sessions de programme bilingues au niveau base de données

**Date** : 2026-06-13
**Statut** : accepté

**Contexte** : Le congrès est bilingue FR/EN. Les sessions officielles du programme doivent être affichables dans les deux langues sans table de traduction séparée pour le MVP.

**Décision** : Le modèle `Session` stocke des champs bilingues : `titleFr` (obligatoire), `titleEn` (optionnel), `descriptionFr` (optionnel), `descriptionEn` (optionnel). Mapping base : `title_fr`, `title_en`, `description_fr`, `description_en`.

**Alternatives écartées** : Champ `title`/`description` unilingue ; table de traduction dédiée (surdimensionnée pour le MVP).

**Conséquences** : Cohérent avec les autres entités bilingues (`Congress`, `Theme`, `TicketType`). `Presentation.title` reste un champ unique (titre du travail scientifique dans sa langue d'origine, voir DEC-009).

---

## DEC-012 — Statut de paiement sponsor dédié

**Date** : 2026-06-13
**Statut** : accepté

**Contexte** : Le statut de paiement d'un sponsor suit un cycle distinct de celui d'une inscription participant (acomptes, contributions en nature).

**Décision** : `Sponsor.paymentStatus` utilise un enum dédié `SponsorPaymentStatus` (`not_paid`, `partially_paid`, `paid`, `cancelled`, `refunded`, `in_kind`), séparé de `RegistrationPaymentStatus`.

**Alternatives écartées** : Réutiliser `RegistrationPaymentStatus` (sémantiquement inadapté aux partenariats).

**Conséquences** : Les deux cycles de paiement évoluent indépendamment. Pas d'impact sur le `PaymentStatusService` des inscriptions.

---

## DEC-013 — Auth.js credentials + session JWT (Phase 0)

**Date** : 2026-06-13
**Statut** : accepté

**Contexte** : Phase 0 Step D1 requiert une fondation auth sans Supabase Auth, sans inscription publique, et compatible avec le middleware Next.js (Edge).

**Décision** : Auth.js v5 avec provider `Credentials` (email/mot de passe), vérification bcrypt côté serveur, stratégie de session **JWT** (pas de table Session Prisma). La session inclut `user.id`, `user.email`, `user.roles`, `user.congressId`, `user.locale`. Le hash mot de passe n'est jamais exposé en session. Mot de passe demo via `DEMO_ADMIN_PASSWORD` (local, seed uniquement).

**Alternatives écartées** : Supabase Auth ; adapter Prisma Session (complexité Phase 0) ; OAuth providers (hors périmètre).

**Conséquences** : RBAC minimal côté middleware (JWT) + policies serveur. Re-seed met à jour le hash demo. Migration vers sessions DB possible en phase ultérieure si requis.

---

## DEC-014 — `ui-ux-pro-max` comme source du design system UI

**Date** : 2026-06-13
**Statut** : accepté

**Contexte** : Phase 0 Step D2 construit le shell admin et prépare les interfaces admin/publiques. Besoin d'une référence design cohérente et réutilisable.

**Décision** : Utiliser la compétence Cursor `ui-ux-pro-max` pour générer et persister le design system sous `design-system/atccr-platform/` (`MASTER.md` + overrides par page). Ces fichiers servent de référence UI. La palette reste celle de `docs/05_UI_UX_GUIDELINES.md` (navy `#0F2B5B`, teal) déjà définie dans `globals.css` ; le design system complète sans remplacer la charte médicale validée. Icônes Lucide uniquement, pas d'emoji.

**Alternatives écartées** : Concevoir l'UI sans référence formalisée ; adopter intégralement la palette teal proposée par le générateur (s'écarterait de la charte médicale figée).

**Conséquences** : Toute nouvelle page UI consulte `design-system/atccr-platform/pages/[page].md` puis `MASTER.md`. Cohérence visuelle et accessibilité (WCAG, focus, responsive) systématisées.

---

## DEC-015 — Admin shell : navy ATCCR, teal accent, typographie design system

**Date** : 2026-06-13
**Statut** : accepté

**Contexte** : Phase 0 Step D2.1 stabilise le shell admin après audit. Le générateur `ui-ux-pro-max` (`MASTER.md`) propose un primary teal `#0891B2`, tandis que `docs/05_UI_UX_GUIDELINES.md` et `globals.css` définissent déjà le navy ATCCR `#0F2B5B` avec teal `#0D9488` en accent. L'audit signale aussi des erreurs `MISSING_MESSAGE` en dev sur les composants client admin.

**Décision** :
- Conserver le **navy `#0F2B5B`** comme couleur primary du shell admin (sidebar, topbar titres) et le **teal `#0D9488`** comme secondary/accent (liens actifs, ring, badges) — conforme à `docs/05`, pas au teal primary du MASTER généré.
- Largeur contenu dashboard : `max-w-6xl` (~1152px), plus proche de la cible admin-shell (1200px) que `max-w-7xl`.
- Typographie via `next/font/google` : **Figtree** (titres) + **Noto Sans** (corps), conforme au design system généré.
- i18n admin : boundary dédiée `AdminIntlShell` avec `NextIntlClientProvider locale={locale} messages={messages}` alimentée par le layout serveur, plus `locale` explicite sur le provider racine `[locale]/layout.tsx`.

**Alternatives écartées** : Adopter le primary teal du MASTER (écart charte médicale validée) ; fallbacks texte en dur dans les composants admin.

**Conséquences** : Cohérence visuelle ATCCR préservée. Composants client admin reçoivent messages + locale de façon stable en dev/HMR. `MASTER.md` reste référence complémentaire ; la palette authoritative reste `docs/05`.

---

## DEC-016 — Paramètres congrès admin sans migration schéma (Phase 0 D3)

**Date** : 2026-06-13
**Statut** : accepté

**Contexte** : Phase 0 Step D3 requiert une page admin minimale pour consulter et modifier les paramètres généraux du congrès, sans démarrer le site public ni les modules métier.

**Décision** : Implémenter `/[locale]/admin/congress` avec formulaire d'édition limité aux champs existants des modèles Prisma `Congress` et `CongressSettings`. Aucune migration schéma. Chargement du congrès seed `atccr-demo-2026`. RBAC via `congress.settings.read` (lecture) et `congress.settings.manage` (écriture) pour `super_admin` et `congress_admin`. Slug en lecture seule ; pas d'upload média ; pas de synchronisation site public.

**Alternatives écartées** : Nouveaux champs BDD (contact email, etc.) ; page publique couplée ; CRUD multi-congrès.

**Conséquences** : Fondation admin settings prête pour phases ultérieures. Design system page override persisté sous `design-system/atccr-platform/pages/congress-settings.md`.

---

## DEC-017 — Landing publique read-only sans workflows publics (Phase 0 D4)

**Date** : 2026-06-13
**Statut** : accepté

**Contexte** : Phase 0 Step D4 requiert une page publique professionnelle pour le congrès actif, alimentée par les données existantes (paramètres admin D3), sans démarrer inscription, soumissions scientifiques, paiements ni CRUD public.

**Décision** : Implémenter `/[locale]` comme landing read-only pour le congrès seed `atccr-demo-2026`. Source de données : modèles Prisma existants (`Congress`, `CongressSettings`, aperçus optionnels `Theme`, `Session`, `Speaker`, `Sponsor`). CTAs inscription et soumission affichées en **coming soon** (désactivées). Lien connexion admin vers `/[locale]/login`. Aucune migration schéma ; pas de modification Auth.js. Palette navy/teal DEC-015 via `docs/05` et `globals.css` ; override page `public-landing.md`.

**Alternatives écartées** : Formulaires inscription/soumission ; métriques fictives ; champs BDD inventés ; Supabase Auth.

**Conséquences** : Site public visible sans authentification. Workflows participant et scientifique reportés aux phases ultérieures. Design system page override persisté sous `design-system/atccr-platform/pages/public-landing.md`.

---

## Index des décisions

| ID | Titre | Statut |
|----|-------|--------|
| DEC-001 | Plateforme congrès médical scientifique | accepté |
| DEC-002 | Stack monolithe Next.js | accepté |
| DEC-003 | Supabase PostgreSQL uniquement | accepté |
| DEC-004 | Pas d'infra async Phase 0 | accepté |
| DEC-005 | Paiements multi-enregistrements | accepté |
| DEC-006 | Attestations explicites | accepté |
| DEC-007 | Speakers.user_id nullable | accepté |
| DEC-008 | Évaluateurs = users + rôle | accepté |
| DEC-009 | Sessions vs présentations | accepté |
| DEC-010 | Gouvernance avant code | accepté |
| DEC-011 | Sessions de programme bilingues | accepté |
| DEC-012 | Statut de paiement sponsor dédié | accepté |
| DEC-013 | Auth.js credentials + session JWT | accepté |
| DEC-014 | ui-ux-pro-max source du design system | accepté |
| DEC-015 | Admin shell navy/teal + typographie + i18n boundary | accepté |
| DEC-016 | Paramètres congrès admin sans migration schéma | accepté |
| DEC-017 | Landing publique read-only sans workflows publics | accepté |
