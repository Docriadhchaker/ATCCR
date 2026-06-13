# 02 — Modèle de base de données

> Schéma conceptuel PostgreSQL via Prisma. Mettre à jour ce document à chaque migration significative.

## Conventions

- Identifiants : `UUID` (`@id @default(uuid())`).
- Horodatage : `createdAt`, `updatedAt` sur toutes les tables métier.
- Soft delete : `deletedAt` optionnel sur `registrations`, `scientific_submissions`.
- Enums PostgreSQL natifs via Prisma `enum`.
- Noms de tables : `snake_case` en base, modèles Prisma en `PascalCase`.
- **Jamais** de vocabulaire startup dans noms de tables, colonnes ou enums.

## Diagramme relationnel simplifié

```
users ──┬── user_roles ── roles
        ├── user_profiles
        ├── registrations ──┬── payments ── payment_proofs
        │                     └── badges ── check_ins
        ├── scientific_submissions ──┬── submission_authors
        │                              ├── evaluation_assignments ── evaluations
        │                              └── presentations
        ├── evaluation_assignments (as evaluator)
        ├── certificates (as recipient)
        └── speakers (optional user_id)

sessions ──┬── session_speakers ── speakers
           └── presentations

congress ── congress_settings
         ── themes
         ── ticket_types ── ticket_options
         ── sponsors
         ── media_assets
         ── email_templates
         ── audit_logs
```

---

## Identité & accès

### `users`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| email | String | unique |
| password_hash | String | nullable si compte invité futur |
| locale | Enum | `fr`, `en` |
| status | Enum | `active`, `inactive`, `suspended` |
| email_verified_at | DateTime? | |
| created_at | DateTime | |
| updated_at | DateTime | |

### `roles`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| code | String | unique — voir liste RBAC |
| label_fr | String | |
| label_en | String | |

**Codes seed** : `super_admin`, `congress_admin`, `registration_manager`, `finance_manager`, `scientific_committee_admin`, `scientific_evaluator`, `speaker`, `resident_submitter`, `participant`, `sponsor`, `staff`

### `user_roles`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| user_id | UUID | FK → users |
| role_id | UUID | FK → roles |
| congress_id | UUID | FK → congress |
| assigned_by | UUID? | FK → users |
| created_at | DateTime | |

Contrainte unique : `(user_id, role_id, congress_id)`.

### `user_profiles`

| Colonne | Type | Notes |
|---------|------|-------|
| user_id | UUID | PK, FK → users |
| first_name | String | |
| last_name | String | |
| phone | String? | |
| specialty | String? | |
| professional_grade | String? | |
| institution | String? | |
| department | String? | |
| country | String? | |
| city | String? | |

---

## Congrès & contenu public

### `congress`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| slug | String | unique |
| name_fr | String | |
| name_en | String | |
| start_date | Date | |
| end_date | Date | |
| venue | String | |
| city | String | |
| country | String | |
| format | Enum | `onsite`, `hybrid`, `online` |
| status | Enum | `draft`, `published`, `archived` |

### `congress_settings`

| Colonne | Type | Notes |
|---------|------|-------|
| congress_id | UUID | PK, FK |
| logo_media_id | UUID? | FK → media_assets |
| favicon_media_id | UUID? | |
| primary_color | String | hex |
| secondary_color | String | hex |
| hero_title_fr/en | String | |
| hero_subtitle_fr/en | String | |
| hero_description_fr/en | Text | |
| hero_image_media_id | UUID? | |
| section_visibility | Json | `{ about: true, themes: true, ... }` |
| key_figures | Json | participants, speakers, sessions… |
| registration_opens_at | DateTime? | |
| registration_closes_at | DateTime? | |
| early_bird_deadline | DateTime? | |
| submission_opens_at | DateTime? | |
| submission_closes_at | DateTime? | |
| certificate_available_at | DateTime? | |

### `themes`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| congress_id | UUID | FK |
| title_fr/en | String | |
| description_fr/en | Text | |
| icon | String? | nom icône ou media_id |
| display_order | Int | |
| visible | Boolean | default true |

### `navigation_items`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| congress_id | UUID | FK |
| label_fr/en | String | |
| path | String | |
| display_order | Int | |
| visible | Boolean | |

### `press_items`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| congress_id | UUID | FK |
| type | Enum | article, video, interview, press_release, photo, publication |
| title | String | |
| source | String? | |
| url | String? | |
| thumbnail_media_id | UUID? | |
| language | Enum | `fr`, `en` |
| published_at | DateTime? | |
| visible | Boolean | |
| display_order | Int | |

---

## Programme & intervenants

### `session_types`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| code | String | unique |
| label_fr/en | String | |

Exemples : `plenary`, `conference`, `symposium`, `round_table`, `oral_presentation`, `poster_session`, `video_session`, `masterclass`, `workshop`, `coffee_break`, `lunch`, `dinner`, `ceremony`, `sponsored_session`, etc.

### `sessions`

Créneau global du programme scientifique.

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| congress_id | UUID | FK |
| title_fr | String | titre officiel (FR) |
| title_en | String? | titre officiel (EN) |
| description_fr | Text? | description (FR) |
| description_en | Text? | description (EN) |
| day | Date | |
| start_at | DateTime | |
| end_at | DateTime | |
| room | String? | |
| session_type_id | UUID | FK |
| theme_id | UUID? | FK → themes |
| language | Enum | `fr`, `en`, `both` |
| is_public | Boolean | |
| capacity | Int? | |
| access_type | Enum | `included`, `paid_option` |
| sponsor_id | UUID? | FK → sponsors |
| display_order | Int | |

### `speakers`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| congress_id | UUID | FK |
| **user_id** | UUID? | **FK → users, nullable** |
| photo_media_id | UUID? | |
| full_name | String | |
| academic_title | String? | |
| specialty | String? | |
| institution | String? | |
| department | String? | |
| country | String? | |
| city | String? | |
| bio_short | Text? | |
| bio_long | Text? | |
| linkedin_url | String? | |
| orcid | String? | |
| researchgate_url | String? | |
| website_url | String? | |
| role_type | Enum | speaker, moderator, chairperson, trainer, international_guest, committee_member |
| visible | Boolean | |
| display_order | Int | |

### `session_speakers`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| session_id | UUID | FK |
| speaker_id | UUID | FK |
| role | Enum | `speaker`, `moderator`, `chairperson` |

### `presentations`

Travail scientifique accepté présenté dans une session.

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| session_id | UUID | FK → sessions |
| scientific_submission_id | UUID? | FK → scientific_submissions |
| title | String | |
| presentation_type | Enum | oral, poster, video, case_study |
| scheduled_start | DateTime? | |
| scheduled_end | DateTime? | |
| duration_minutes | Int? | |
| display_order | Int | |
| status | Enum | `scheduled`, `presented`, `cancelled`, `no_show` |
| presented_at | DateTime? | |
| presented_validated_by | UUID? | FK → users |

### `personal_agenda`

| Colonne | Type | Notes |
|---------|------|-------|
| user_id | UUID | FK |
| session_id | UUID | FK |
| created_at | DateTime | |

Contrainte unique : `(user_id, session_id)`.

---

## Partenaires & médias

### `sponsors`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| congress_id | UUID | FK |
| name | String | |
| logo_media_id | UUID? | |
| category | Enum | institutional, platinum, gold, silver, bronze, scientific_partner, media_partner, exhibitor |
| website_url | String? | |
| description | Text? | |
| contact_name | String? | |
| contact_email | String? | |
| contact_phone | String? | |
| package_name | String? | |
| amount | Decimal? | |
| payment_status | Enum `SponsorPaymentStatus` | not_paid, partially_paid, paid, cancelled, refunded, in_kind |
| booth_number | String? | |
| contract_media_id | UUID? | |
| invoice_media_id | UUID? | |
| visible | Boolean | |
| display_order | Int | |

### `media_assets`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| congress_id | UUID? | FK |
| storage_key | String | chemin relatif ou clé S3 future |
| original_filename | String | |
| mime_type | String | |
| size_bytes | Int | |
| category | Enum | sponsor_logo, speaker_photo, public_image, payment_proof, badge_template, certificate_template, press_file, … |
| tags | String[] | |
| linked_entity_type | String? | polymorphisme léger : `speaker`, `sponsor`, `session` |
| linked_entity_id | UUID? | |
| uploaded_by | UUID? | FK → users |
| created_at | DateTime | |

---

## Billetterie & inscriptions

### `ticket_types`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| congress_id | UUID | FK |
| name_fr/en | String | |
| description_fr/en | Text? | |
| eligible_categories | String[] | catégories participants |
| currency | Enum | `TND`, `EUR` |
| price | Decimal | |
| early_bird_price | Decimal? | |
| early_bird_deadline | DateTime? | |
| on_site_price | Decimal? | |
| quota | Int? | |
| active | Boolean | |

### `ticket_options`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| ticket_type_id | UUID | FK → `ticket_types` (appartient à TicketType, onDelete: Cascade) |
| name_fr/en | String | |
| price | Decimal | |
| included | Boolean | |

### `registrations`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| reference | String | unique, ex. `ATCCR-2026-00042` |
| congress_id | UUID | FK |
| user_id | UUID | FK → users |
| participant_category | Enum | médecin spécialiste, résident, étudiant, etc. |
| ticket_type_id | UUID | FK |
| status | Enum | pending, confirmed, cancelled |
| **payment_status** | Enum | **statut résumé** — voir ci-dessous |
| subtotal | Decimal | |
| vat_amount | Decimal | default 0 |
| total_amount | Decimal | |
| billing_info | Json | |
| consent_at | DateTime | |
| terms_accepted_at | DateTime | |
| deleted_at | DateTime? | |

#### Enum `registration_payment_status` (résumé)

`not_paid`, `awaiting_payment`, `awaiting_proof_validation`, `paid_online`, `paid_manually`, `proof_accepted`, `proof_rejected`, `pay_on_site`, `cancelled`, `refunded`, `free_invited`, `exempted`

### `registration_options`

| Colonne | Type | Notes |
|---------|------|-------|
| registration_id | UUID | FK |
| ticket_option_id | UUID | FK |
| price | Decimal | |

### `payments`

**Plusieurs enregistrements par inscription.**

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| registration_id | UUID | FK → registrations |
| method | Enum | `online`, `bank_transfer`, `manual`, `on_site`, `free`, `exempted` |
| status | Enum | `pending`, `processing`, `succeeded`, `failed`, `cancelled`, `refunded` |
| amount | Decimal | |
| currency | Enum | `TND`, `EUR` |
| provider | String? | ex. konnect, stripe |
| provider_reference | String? | |
| provider_response | Json? | |
| validated_by | UUID? | FK → users |
| validated_at | DateTime? | |
| internal_comment | Text? | |
| created_at | DateTime | |

### `payment_proofs`

**Plusieurs preuves par paiement** (rejets, re-soumissions).

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| payment_id | UUID | FK → payments |
| media_asset_id | UUID | FK → media_assets |
| status | Enum | `pending`, `accepted`, `rejected` |
| reviewed_by | UUID? | FK → users |
| reviewed_at | DateTime? | |
| rejection_reason | Text? | |
| created_at | DateTime | |

### `payment_status_history`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| registration_id | UUID | FK |
| from_status | Enum? | |
| to_status | Enum | |
| triggered_by | UUID? | FK → users |
| payment_id | UUID? | FK → payments |
| note | Text? | |
| created_at | DateTime | |

---

## Soumissions scientifiques

### `submission_types`

| Colonne | Type | Notes |
|---------|------|-------|
| code | String | PK |
| label_fr/en | String | |

### `scientific_submissions`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| reference | String | unique |
| congress_id | UUID | FK |
| user_id | UUID | FK → users (déposant) |
| submission_type_id | String | FK |
| theme_id | UUID | FK |
| title | String | |
| abstract | Json | `{ introduction, objective, methods, results, conclusion }` |
| keywords | String[] | |
| grade | Enum | resident, intern, assistant, young_specialist, specialist |
| residency_year | Int? | |
| supervisor_name | String? | |
| institution | String | |
| department | String? | |
| city | String? | |
| country | String? | |
| status | Enum | draft, submitted, pending, under_review, accepted, rejected, accepted_with_modifications, withdrawn, scheduled_in_program, certificate_authorized |
| ethics_confirmed | Boolean | |
| coi_declared | Boolean | |
| patient_consent_confirmed | Boolean? | |
| submitted_at | DateTime? | |
| deleted_at | DateTime? | |

### `submission_authors`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| submission_id | UUID | FK |
| full_name | String | |
| affiliation | String? | |
| is_presenting_author | Boolean | |
| display_order | Int | |

### `submission_files`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| submission_id | UUID | FK |
| media_asset_id | UUID | FK |
| file_type | Enum | pdf, poster, image, video_link, video_file |

### `submission_status_history`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| submission_id | UUID | FK |
| from_status | Enum? | |
| to_status | Enum | |
| changed_by | UUID? | FK → users |
| note | Text? | |
| created_at | DateTime | |

---

## Évaluation scientifique

Les évaluateurs sont des **users** avec rôle `scientific_evaluator`.

### `evaluation_assignments`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| submission_id | UUID | FK |
| **evaluator_id** | UUID | **FK → users** |
| assigned_by | UUID | FK → users |
| status | Enum | `pending`, `in_progress`, `completed` |
| due_at | DateTime? | |
| created_at | DateTime | |

Contrainte unique : `(submission_id, evaluator_id)`.

### `evaluations`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| assignment_id | UUID | FK → evaluation_assignments, unique |
| scores | Json | 7 critères 0–10 |
| total_score | Decimal | |
| admin_comment | Text? | confidentiel |
| submitted_at | DateTime? | |
| editable | Boolean | default false |

**Critères** : scientific_relevance, originality, methodological_quality, clinical_interest, abstract_clarity, presentation_quality, ethical_compliance.

### `submission_decisions`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| submission_id | UUID | FK, unique |
| decision | Enum | accepted, rejected, accepted_with_modifications |
| decided_by | UUID | FK → users |
| decided_at | DateTime | |
| message_to_author | Text? | |

---

## Badges & présence

### `badges`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| registration_id | UUID | FK, unique |
| qr_token | String | unique |
| category_label | String | Participant, Speaker, Resident, etc. |
| color_code | String | hex |
| printed_at | DateTime? | |
| reprint_count | Int | default 0 |
| generated_file_id | UUID? | FK → media_assets |

### `check_ins`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| badge_id | UUID | FK |
| scanned_by | UUID | FK → users (staff) |
| session_id | UUID? | FK → sessions |
| access_granted | Boolean | |
| scan_number | Int | |
| notes | Text? | |
| scanned_at | DateTime | |

---

## Attestations

### `certificate_templates`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| congress_id | UUID | FK |
| certificate_type | Enum | voir types spec |
| background_media_id | UUID? | |
| signature_media_id | UUID? | |
| stamp_media_id | UUID? | |
| fields_config | Json | |
| active | Boolean | |

### `certificates`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| congress_id | UUID | FK |
| **recipient_user_id** | UUID | **FK → users, obligatoire** |
| **registration_id** | UUID? | FK → registrations |
| **submission_id** | UUID? | FK → scientific_submissions |
| **session_id** | UUID? | FK → sessions |
| **certificate_type** | Enum | participation, oral_presentation, poster, video_presentation, speaker, moderator, scientific_committee, masterclass_trainer |
| **status** | Enum | `draft`, `authorized`, `generated`, `revoked` |
| **authorized_by** | UUID? | FK → users |
| **generated_file_id** | UUID? | FK → media_assets |
| **verification_code** | String | unique |
| metadata | Json | titre travail, dates snapshot |
| authorized_at | DateTime? | |
| generated_at | DateTime? | |
| created_at | DateTime | |

**Règle métier** : selon `certificate_type`, au moins une FK contextuelle doit être renseignée (validée en service).

---

## Système

### `email_templates`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| congress_id | UUID | FK |
| code | String | unique par congrès |
| subject_fr/en | String | |
| body_fr/en | Text | HTML autorisé |
| variables | String[] | |

### `audit_logs`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID | PK |
| congress_id | UUID? | FK |
| actor_id | UUID? | FK → users |
| action | String | ex. `payment.validated` |
| entity_type | String | |
| entity_id | UUID | |
| metadata | Json? | |
| ip_address | String? | |
| created_at | DateTime | |

---

## Index recommandés

```sql
-- Unicité métier
UNIQUE registrations(reference)
UNIQUE scientific_submissions(reference)
UNIQUE badges(qr_token)
UNIQUE certificates(verification_code)

-- Performance
INDEX registrations(congress_id, payment_status)
INDEX registrations(congress_id, status)
INDEX payments(registration_id, status)
INDEX payment_proofs(payment_id, status)
INDEX scientific_submissions(congress_id, status)
INDEX evaluation_assignments(evaluator_id, status)
INDEX sessions(congress_id, day)
INDEX presentations(session_id)
```

---

## Service de recalcul paiement

`PaymentStatusService.recompute(registrationId)` :

1. Charger tous les `payments` triés par `created_at`.
2. Appliquer les règles métier (dernier paiement réussi, preuve en attente, remboursement, etc.).
3. Mettre à jour `registrations.payment_status`.
4. Insérer une ligne `payment_status_history` si changement.

Ne jamais mettre à jour `payment_status` manuellement dans l'UI sans passer par ce service.
