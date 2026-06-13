-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive', 'suspended');

-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('fr', 'en');

-- CreateEnum
CREATE TYPE "RoleCode" AS ENUM ('super_admin', 'congress_admin', 'registration_manager', 'finance_manager', 'scientific_committee_admin', 'scientific_evaluator', 'speaker', 'resident_submitter', 'participant', 'sponsor', 'staff');

-- CreateEnum
CREATE TYPE "CongressStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "CongressFormat" AS ENUM ('onsite', 'hybrid', 'online');

-- CreateEnum
CREATE TYPE "ParticipantCategory" AS ENUM ('specialist', 'resident', 'student', 'paramedical', 'guest', 'speaker', 'scientific_committee', 'sponsor', 'press', 'staff');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('pending', 'confirmed', 'cancelled');

-- CreateEnum
CREATE TYPE "RegistrationPaymentStatus" AS ENUM ('not_paid', 'awaiting_payment', 'awaiting_proof_validation', 'paid_online', 'paid_manually', 'proof_accepted', 'proof_rejected', 'pay_on_site', 'cancelled', 'refunded', 'free_invited', 'exempted');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('TND', 'EUR');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('online', 'bank_transfer', 'manual', 'on_site', 'free', 'exempted');

-- CreateEnum
CREATE TYPE "PaymentRecordStatus" AS ENUM ('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded');

-- CreateEnum
CREATE TYPE "ProofStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateEnum
CREATE TYPE "SubmitterGrade" AS ENUM ('resident', 'intern', 'assistant', 'young_specialist', 'specialist');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('draft', 'submitted', 'pending', 'under_review', 'accepted', 'rejected', 'accepted_with_modifications', 'withdrawn', 'scheduled_in_program', 'certificate_authorized');

-- CreateEnum
CREATE TYPE "SubmissionDecisionType" AS ENUM ('accepted', 'rejected', 'accepted_with_modifications');

-- CreateEnum
CREATE TYPE "EvaluationAssignmentStatus" AS ENUM ('pending', 'in_progress', 'completed');

-- CreateEnum
CREATE TYPE "SessionAccessType" AS ENUM ('included', 'paid_option');

-- CreateEnum
CREATE TYPE "SessionLanguage" AS ENUM ('fr', 'en', 'both');

-- CreateEnum
CREATE TYPE "SpeakerRoleType" AS ENUM ('speaker', 'moderator', 'chairperson', 'trainer', 'international_guest', 'committee_member');

-- CreateEnum
CREATE TYPE "SessionSpeakerRole" AS ENUM ('speaker', 'moderator', 'chairperson');

-- CreateEnum
CREATE TYPE "PresentationType" AS ENUM ('oral', 'poster', 'video', 'case_study');

-- CreateEnum
CREATE TYPE "PresentationStatus" AS ENUM ('scheduled', 'presented', 'cancelled', 'no_show');

-- CreateEnum
CREATE TYPE "BadgePrintStatus" AS ENUM ('not_printed', 'printed', 'reprinted');

-- CreateEnum
CREATE TYPE "CheckInAccessStatus" AS ENUM ('granted', 'denied', 'warning');

-- CreateEnum
CREATE TYPE "CertificateType" AS ENUM ('participation', 'oral_presentation', 'poster', 'video_presentation', 'speaker', 'moderator', 'scientific_committee', 'masterclass_trainer');

-- CreateEnum
CREATE TYPE "CertificateStatus" AS ENUM ('draft', 'authorized', 'generated', 'revoked');

-- CreateEnum
CREATE TYPE "MediaCategory" AS ENUM ('sponsor_logo', 'partner_logo', 'institution_logo', 'speaker_photo', 'committee_photo', 'public_image', 'press_file', 'payment_proof', 'badge_template', 'certificate_template', 'official_poster');

-- CreateEnum
CREATE TYPE "SponsorPaymentStatus" AS ENUM ('not_paid', 'partially_paid', 'paid', 'cancelled', 'refunded', 'in_kind');

-- CreateEnum
CREATE TYPE "SponsorCategory" AS ENUM ('institutional', 'platinum', 'gold', 'silver', 'bronze', 'scientific_partner', 'media_partner', 'exhibitor');

-- CreateEnum
CREATE TYPE "PressItemType" AS ENUM ('article', 'video', 'interview', 'press_release', 'photo', 'publication');

-- CreateEnum
CREATE TYPE "SubmissionFileType" AS ENUM ('pdf', 'poster', 'image', 'video_link', 'video_file');

-- CreateEnum
CREATE TYPE "EmailTemplateCode" AS ENUM ('account_created', 'registration_confirmation', 'payment_pending', 'payment_validated', 'payment_rejected', 'online_payment_received', 'badge_available', 'submission_received', 'submission_under_review', 'submission_accepted', 'submission_rejected', 'modifications_requested', 'presentation_instructions', 'certificate_available', 'event_reminder', 'password_reset');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "locale" "Locale" NOT NULL DEFAULT 'fr',
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "email_verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "user_id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT,
    "specialty" TEXT,
    "professional_grade" TEXT,
    "institution" TEXT,
    "department" TEXT,
    "country" TEXT,
    "city" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "code" "RoleCode" NOT NULL,
    "label_fr" TEXT NOT NULL,
    "label_en" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "congress_id" UUID NOT NULL,
    "assigned_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "congress_id" UUID,
    "actor_id" UUID,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" UUID NOT NULL,
    "metadata" JSONB,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "congresses" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "venue" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "format" "CongressFormat" NOT NULL,
    "status" "CongressStatus" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "congresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "congress_settings" (
    "congress_id" UUID NOT NULL,
    "logo_media_id" UUID,
    "favicon_media_id" UUID,
    "primary_color" TEXT NOT NULL DEFAULT '#0F2B5B',
    "secondary_color" TEXT NOT NULL DEFAULT '#0D9488',
    "hero_title_fr" TEXT,
    "hero_title_en" TEXT,
    "hero_subtitle_fr" TEXT,
    "hero_subtitle_en" TEXT,
    "hero_description_fr" TEXT,
    "hero_description_en" TEXT,
    "hero_image_media_id" UUID,
    "section_visibility" JSONB NOT NULL DEFAULT '{}',
    "key_figures" JSONB NOT NULL DEFAULT '{}',
    "registration_opens_at" TIMESTAMP(3),
    "registration_closes_at" TIMESTAMP(3),
    "early_bird_deadline" TIMESTAMP(3),
    "submission_opens_at" TIMESTAMP(3),
    "submission_closes_at" TIMESTAMP(3),
    "certificate_available_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "congress_settings_pkey" PRIMARY KEY ("congress_id")
);

-- CreateTable
CREATE TABLE "themes" (
    "id" UUID NOT NULL,
    "congress_id" UUID NOT NULL,
    "title_fr" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "description_fr" TEXT,
    "description_en" TEXT,
    "icon" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "navigation_items" (
    "id" UUID NOT NULL,
    "congress_id" UUID NOT NULL,
    "label_fr" TEXT NOT NULL,
    "label_en" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "navigation_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "press_items" (
    "id" UUID NOT NULL,
    "congress_id" UUID NOT NULL,
    "type" "PressItemType" NOT NULL,
    "title" TEXT NOT NULL,
    "source" TEXT,
    "url" TEXT,
    "thumbnail_media_id" UUID,
    "language" "Locale" NOT NULL,
    "published_at" TIMESTAMP(3),
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "press_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_assets" (
    "id" UUID NOT NULL,
    "congress_id" UUID,
    "storage_key" TEXT NOT NULL,
    "original_filename" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "category" "MediaCategory" NOT NULL,
    "tags" TEXT[],
    "linked_entity_type" TEXT,
    "linked_entity_id" UUID,
    "uploaded_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_types" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "label_fr" TEXT NOT NULL,
    "label_en" TEXT NOT NULL,

    CONSTRAINT "session_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "congress_id" UUID NOT NULL,
    "title_fr" TEXT NOT NULL,
    "title_en" TEXT,
    "description_fr" TEXT,
    "description_en" TEXT,
    "day" DATE NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "room" TEXT,
    "session_type_id" UUID NOT NULL,
    "theme_id" UUID,
    "language" "SessionLanguage" NOT NULL DEFAULT 'both',
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "capacity" INTEGER,
    "access_type" "SessionAccessType" NOT NULL DEFAULT 'included',
    "sponsor_id" UUID,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speakers" (
    "id" UUID NOT NULL,
    "congress_id" UUID NOT NULL,
    "user_id" UUID,
    "photo_media_id" UUID,
    "full_name" TEXT NOT NULL,
    "academic_title" TEXT,
    "specialty" TEXT,
    "institution" TEXT,
    "department" TEXT,
    "country" TEXT,
    "city" TEXT,
    "bio_short" TEXT,
    "bio_long" TEXT,
    "linkedin_url" TEXT,
    "orcid" TEXT,
    "researchgate_url" TEXT,
    "website_url" TEXT,
    "role_type" "SpeakerRoleType" NOT NULL DEFAULT 'speaker',
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "speakers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_speakers" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "speaker_id" UUID NOT NULL,
    "role" "SessionSpeakerRole" NOT NULL DEFAULT 'speaker',

    CONSTRAINT "session_speakers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presentations" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "scientific_submission_id" UUID,
    "title" TEXT NOT NULL,
    "presentation_type" "PresentationType" NOT NULL,
    "scheduled_start" TIMESTAMP(3),
    "scheduled_end" TIMESTAMP(3),
    "duration_minutes" INTEGER,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "status" "PresentationStatus" NOT NULL DEFAULT 'scheduled',
    "presented_at" TIMESTAMP(3),
    "presented_validated_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "presentations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_agenda_items" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personal_agenda_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsors" (
    "id" UUID NOT NULL,
    "congress_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "logo_media_id" UUID,
    "category" "SponsorCategory" NOT NULL,
    "website_url" TEXT,
    "description" TEXT,
    "contact_name" TEXT,
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "package_name" TEXT,
    "amount" DECIMAL(12,2),
    "payment_status" "SponsorPaymentStatus" NOT NULL DEFAULT 'not_paid',
    "booth_number" TEXT,
    "contract_media_id" UUID,
    "invoice_media_id" UUID,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sponsors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_types" (
    "id" UUID NOT NULL,
    "congress_id" UUID NOT NULL,
    "name_fr" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "description_fr" TEXT,
    "description_en" TEXT,
    "eligible_categories" "ParticipantCategory"[],
    "currency" "Currency" NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "early_bird_price" DECIMAL(12,2),
    "early_bird_deadline" TIMESTAMP(3),
    "on_site_price" DECIMAL(12,2),
    "quota" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticket_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_options" (
    "id" UUID NOT NULL,
    "ticket_type_id" UUID NOT NULL,
    "name_fr" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "included" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticket_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registrations" (
    "id" UUID NOT NULL,
    "reference" TEXT NOT NULL,
    "congress_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "participant_category" "ParticipantCategory" NOT NULL,
    "ticket_type_id" UUID NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'pending',
    "payment_status" "RegistrationPaymentStatus" NOT NULL DEFAULT 'not_paid',
    "subtotal" DECIMAL(12,2) NOT NULL,
    "vat_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(12,2) NOT NULL,
    "billing_info" JSONB NOT NULL DEFAULT '{}',
    "consent_at" TIMESTAMP(3),
    "terms_accepted_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registration_options" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "ticket_option_id" UUID NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "registration_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentRecordStatus" NOT NULL DEFAULT 'pending',
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" "Currency" NOT NULL,
    "provider" TEXT,
    "provider_reference" TEXT,
    "provider_response" JSONB,
    "validated_by_id" UUID,
    "validated_at" TIMESTAMP(3),
    "internal_comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_proofs" (
    "id" UUID NOT NULL,
    "payment_id" UUID NOT NULL,
    "media_asset_id" UUID NOT NULL,
    "status" "ProofStatus" NOT NULL DEFAULT 'pending',
    "reviewed_by_id" UUID,
    "reviewed_at" TIMESTAMP(3),
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_proofs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_status_history" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "from_status" "RegistrationPaymentStatus",
    "to_status" "RegistrationPaymentStatus" NOT NULL,
    "triggered_by_id" UUID,
    "payment_id" UUID,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_types" (
    "code" TEXT NOT NULL,
    "label_fr" TEXT NOT NULL,
    "label_en" TEXT NOT NULL,

    CONSTRAINT "submission_types_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "scientific_submissions" (
    "id" UUID NOT NULL,
    "reference" TEXT NOT NULL,
    "congress_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "submission_type_code" TEXT NOT NULL,
    "theme_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "abstract" JSONB NOT NULL,
    "keywords" TEXT[],
    "grade" "SubmitterGrade" NOT NULL,
    "residency_year" INTEGER,
    "supervisor_name" TEXT,
    "institution" TEXT NOT NULL,
    "department" TEXT,
    "city" TEXT,
    "country" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'draft',
    "ethics_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "coi_declared" BOOLEAN NOT NULL DEFAULT false,
    "patient_consent_confirmed" BOOLEAN,
    "submitted_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scientific_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_authors" (
    "id" UUID NOT NULL,
    "submission_id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "affiliation" TEXT,
    "is_presenting_author" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "submission_authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_files" (
    "id" UUID NOT NULL,
    "submission_id" UUID NOT NULL,
    "media_asset_id" UUID NOT NULL,
    "file_type" "SubmissionFileType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submission_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_status_history" (
    "id" UUID NOT NULL,
    "submission_id" UUID NOT NULL,
    "from_status" "SubmissionStatus",
    "to_status" "SubmissionStatus" NOT NULL,
    "changed_by_id" UUID,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submission_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation_assignments" (
    "id" UUID NOT NULL,
    "submission_id" UUID NOT NULL,
    "evaluator_id" UUID NOT NULL,
    "assigned_by_id" UUID NOT NULL,
    "status" "EvaluationAssignmentStatus" NOT NULL DEFAULT 'pending',
    "due_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluation_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluations" (
    "id" UUID NOT NULL,
    "assignment_id" UUID NOT NULL,
    "scores" JSONB NOT NULL,
    "total_score" DECIMAL(5,2) NOT NULL,
    "admin_comment" TEXT,
    "submitted_at" TIMESTAMP(3),
    "editable" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_decisions" (
    "id" UUID NOT NULL,
    "submission_id" UUID NOT NULL,
    "decision" "SubmissionDecisionType" NOT NULL,
    "decided_by_id" UUID NOT NULL,
    "decided_at" TIMESTAMP(3) NOT NULL,
    "message_to_author" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submission_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "qr_token" TEXT NOT NULL,
    "category_label" TEXT NOT NULL,
    "color_code" TEXT NOT NULL,
    "print_status" "BadgePrintStatus" NOT NULL DEFAULT 'not_printed',
    "printed_at" TIMESTAMP(3),
    "reprint_count" INTEGER NOT NULL DEFAULT 0,
    "generated_file_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "check_ins" (
    "id" UUID NOT NULL,
    "badge_id" UUID NOT NULL,
    "scanned_by_id" UUID NOT NULL,
    "session_id" UUID,
    "access_status" "CheckInAccessStatus" NOT NULL,
    "scan_number" INTEGER NOT NULL,
    "notes" TEXT,
    "scanned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "check_ins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificate_templates" (
    "id" UUID NOT NULL,
    "congress_id" UUID NOT NULL,
    "certificate_type" "CertificateType" NOT NULL,
    "background_media_id" UUID,
    "signature_media_id" UUID,
    "stamp_media_id" UUID,
    "fields_config" JSONB NOT NULL DEFAULT '{}',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certificate_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" UUID NOT NULL,
    "congress_id" UUID NOT NULL,
    "recipient_user_id" UUID NOT NULL,
    "registration_id" UUID,
    "submission_id" UUID,
    "session_id" UUID,
    "certificate_type" "CertificateType" NOT NULL,
    "status" "CertificateStatus" NOT NULL DEFAULT 'draft',
    "authorized_by_id" UUID,
    "generated_file_id" UUID,
    "verification_code" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "authorized_at" TIMESTAMP(3),
    "generated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_templates" (
    "id" UUID NOT NULL,
    "congress_id" UUID NOT NULL,
    "code" "EmailTemplateCode" NOT NULL,
    "subject_fr" TEXT NOT NULL,
    "subject_en" TEXT NOT NULL,
    "body_fr" TEXT NOT NULL,
    "body_en" TEXT NOT NULL,
    "variables" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");

-- CreateIndex
CREATE INDEX "user_roles_congress_id_idx" ON "user_roles"("congress_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_id_congress_id_key" ON "user_roles"("user_id", "role_id", "congress_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_code_key" ON "permissions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_id_permission_id_key" ON "role_permissions"("role_id", "permission_id");

-- CreateIndex
CREATE INDEX "audit_logs_congress_id_created_at_idx" ON "audit_logs"("congress_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "congresses_slug_key" ON "congresses"("slug");

-- CreateIndex
CREATE INDEX "themes_congress_id_display_order_idx" ON "themes"("congress_id", "display_order");

-- CreateIndex
CREATE INDEX "navigation_items_congress_id_display_order_idx" ON "navigation_items"("congress_id", "display_order");

-- CreateIndex
CREATE INDEX "press_items_congress_id_display_order_idx" ON "press_items"("congress_id", "display_order");

-- CreateIndex
CREATE INDEX "media_assets_congress_id_category_idx" ON "media_assets"("congress_id", "category");

-- CreateIndex
CREATE INDEX "media_assets_linked_entity_type_linked_entity_id_idx" ON "media_assets"("linked_entity_type", "linked_entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_types_code_key" ON "session_types"("code");

-- CreateIndex
CREATE INDEX "sessions_congress_id_day_start_at_idx" ON "sessions"("congress_id", "day", "start_at");

-- CreateIndex
CREATE UNIQUE INDEX "speakers_user_id_key" ON "speakers"("user_id");

-- CreateIndex
CREATE INDEX "speakers_congress_id_display_order_idx" ON "speakers"("congress_id", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "session_speakers_session_id_speaker_id_role_key" ON "session_speakers"("session_id", "speaker_id", "role");

-- CreateIndex
CREATE INDEX "presentations_session_id_display_order_idx" ON "presentations"("session_id", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "personal_agenda_items_user_id_session_id_key" ON "personal_agenda_items"("user_id", "session_id");

-- CreateIndex
CREATE INDEX "sponsors_congress_id_display_order_idx" ON "sponsors"("congress_id", "display_order");

-- CreateIndex
CREATE INDEX "ticket_types_congress_id_active_idx" ON "ticket_types"("congress_id", "active");

-- CreateIndex
CREATE UNIQUE INDEX "registrations_reference_key" ON "registrations"("reference");

-- CreateIndex
CREATE INDEX "registrations_congress_id_payment_status_idx" ON "registrations"("congress_id", "payment_status");

-- CreateIndex
CREATE INDEX "registrations_congress_id_status_idx" ON "registrations"("congress_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "registration_options_registration_id_ticket_option_id_key" ON "registration_options"("registration_id", "ticket_option_id");

-- CreateIndex
CREATE INDEX "payments_registration_id_status_idx" ON "payments"("registration_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "payments_provider_provider_reference_key" ON "payments"("provider", "provider_reference");

-- CreateIndex
CREATE INDEX "payment_proofs_payment_id_status_idx" ON "payment_proofs"("payment_id", "status");

-- CreateIndex
CREATE INDEX "payment_status_history_registration_id_created_at_idx" ON "payment_status_history"("registration_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "scientific_submissions_reference_key" ON "scientific_submissions"("reference");

-- CreateIndex
CREATE INDEX "scientific_submissions_congress_id_status_idx" ON "scientific_submissions"("congress_id", "status");

-- CreateIndex
CREATE INDEX "submission_authors_submission_id_display_order_idx" ON "submission_authors"("submission_id", "display_order");

-- CreateIndex
CREATE INDEX "submission_status_history_submission_id_created_at_idx" ON "submission_status_history"("submission_id", "created_at");

-- CreateIndex
CREATE INDEX "evaluation_assignments_evaluator_id_status_idx" ON "evaluation_assignments"("evaluator_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "evaluation_assignments_submission_id_evaluator_id_key" ON "evaluation_assignments"("submission_id", "evaluator_id");

-- CreateIndex
CREATE UNIQUE INDEX "evaluations_assignment_id_key" ON "evaluations"("assignment_id");

-- CreateIndex
CREATE UNIQUE INDEX "submission_decisions_submission_id_key" ON "submission_decisions"("submission_id");

-- CreateIndex
CREATE UNIQUE INDEX "badges_registration_id_key" ON "badges"("registration_id");

-- CreateIndex
CREATE UNIQUE INDEX "badges_qr_token_key" ON "badges"("qr_token");

-- CreateIndex
CREATE INDEX "check_ins_badge_id_scanned_at_idx" ON "check_ins"("badge_id", "scanned_at");

-- CreateIndex
CREATE UNIQUE INDEX "certificate_templates_congress_id_certificate_type_key" ON "certificate_templates"("congress_id", "certificate_type");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_verification_code_key" ON "certificates"("verification_code");

-- CreateIndex
CREATE INDEX "certificates_recipient_user_id_idx" ON "certificates"("recipient_user_id");

-- CreateIndex
CREATE INDEX "certificates_congress_id_certificate_type_idx" ON "certificates"("congress_id", "certificate_type");

-- CreateIndex
CREATE UNIQUE INDEX "email_templates_congress_id_code_key" ON "email_templates"("congress_id", "code");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_congress_id_fkey" FOREIGN KEY ("congress_id") REFERENCES "congresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_assigned_by_id_fkey" FOREIGN KEY ("assigned_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_congress_id_fkey" FOREIGN KEY ("congress_id") REFERENCES "congresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "congress_settings" ADD CONSTRAINT "congress_settings_congress_id_fkey" FOREIGN KEY ("congress_id") REFERENCES "congresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "congress_settings" ADD CONSTRAINT "congress_settings_logo_media_id_fkey" FOREIGN KEY ("logo_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "congress_settings" ADD CONSTRAINT "congress_settings_favicon_media_id_fkey" FOREIGN KEY ("favicon_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "congress_settings" ADD CONSTRAINT "congress_settings_hero_image_media_id_fkey" FOREIGN KEY ("hero_image_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "themes" ADD CONSTRAINT "themes_congress_id_fkey" FOREIGN KEY ("congress_id") REFERENCES "congresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_congress_id_fkey" FOREIGN KEY ("congress_id") REFERENCES "congresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "press_items" ADD CONSTRAINT "press_items_congress_id_fkey" FOREIGN KEY ("congress_id") REFERENCES "congresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "press_items" ADD CONSTRAINT "press_items_thumbnail_media_id_fkey" FOREIGN KEY ("thumbnail_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_congress_id_fkey" FOREIGN KEY ("congress_id") REFERENCES "congresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_congress_id_fkey" FOREIGN KEY ("congress_id") REFERENCES "congresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_session_type_id_fkey" FOREIGN KEY ("session_type_id") REFERENCES "session_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "themes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_sponsor_id_fkey" FOREIGN KEY ("sponsor_id") REFERENCES "sponsors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speakers" ADD CONSTRAINT "speakers_congress_id_fkey" FOREIGN KEY ("congress_id") REFERENCES "congresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speakers" ADD CONSTRAINT "speakers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speakers" ADD CONSTRAINT "speakers_photo_media_id_fkey" FOREIGN KEY ("photo_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_speakers" ADD CONSTRAINT "session_speakers_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_speakers" ADD CONSTRAINT "session_speakers_speaker_id_fkey" FOREIGN KEY ("speaker_id") REFERENCES "speakers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presentations" ADD CONSTRAINT "presentations_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presentations" ADD CONSTRAINT "presentations_scientific_submission_id_fkey" FOREIGN KEY ("scientific_submission_id") REFERENCES "scientific_submissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presentations" ADD CONSTRAINT "presentations_presented_validated_by_id_fkey" FOREIGN KEY ("presented_validated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_agenda_items" ADD CONSTRAINT "personal_agenda_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_agenda_items" ADD CONSTRAINT "personal_agenda_items_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_congress_id_fkey" FOREIGN KEY ("congress_id") REFERENCES "congresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_logo_media_id_fkey" FOREIGN KEY ("logo_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_contract_media_id_fkey" FOREIGN KEY ("contract_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_invoice_media_id_fkey" FOREIGN KEY ("invoice_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_types" ADD CONSTRAINT "ticket_types_congress_id_fkey" FOREIGN KEY ("congress_id") REFERENCES "congresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_options" ADD CONSTRAINT "ticket_options_ticket_type_id_fkey" FOREIGN KEY ("ticket_type_id") REFERENCES "ticket_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_congress_id_fkey" FOREIGN KEY ("congress_id") REFERENCES "congresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_ticket_type_id_fkey" FOREIGN KEY ("ticket_type_id") REFERENCES "ticket_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registration_options" ADD CONSTRAINT "registration_options_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registration_options" ADD CONSTRAINT "registration_options_ticket_option_id_fkey" FOREIGN KEY ("ticket_option_id") REFERENCES "ticket_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_validated_by_id_fkey" FOREIGN KEY ("validated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_proofs" ADD CONSTRAINT "payment_proofs_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_proofs" ADD CONSTRAINT "payment_proofs_media_asset_id_fkey" FOREIGN KEY ("media_asset_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_proofs" ADD CONSTRAINT "payment_proofs_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_status_history" ADD CONSTRAINT "payment_status_history_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_status_history" ADD CONSTRAINT "payment_status_history_triggered_by_id_fkey" FOREIGN KEY ("triggered_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_status_history" ADD CONSTRAINT "payment_status_history_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scientific_submissions" ADD CONSTRAINT "scientific_submissions_congress_id_fkey" FOREIGN KEY ("congress_id") REFERENCES "congresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scientific_submissions" ADD CONSTRAINT "scientific_submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scientific_submissions" ADD CONSTRAINT "scientific_submissions_submission_type_code_fkey" FOREIGN KEY ("submission_type_code") REFERENCES "submission_types"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scientific_submissions" ADD CONSTRAINT "scientific_submissions_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "themes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_authors" ADD CONSTRAINT "submission_authors_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "scientific_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_files" ADD CONSTRAINT "submission_files_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "scientific_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_files" ADD CONSTRAINT "submission_files_media_asset_id_fkey" FOREIGN KEY ("media_asset_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_status_history" ADD CONSTRAINT "submission_status_history_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "scientific_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_status_history" ADD CONSTRAINT "submission_status_history_changed_by_id_fkey" FOREIGN KEY ("changed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_assignments" ADD CONSTRAINT "evaluation_assignments_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "scientific_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_assignments" ADD CONSTRAINT "evaluation_assignments_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_assignments" ADD CONSTRAINT "evaluation_assignments_assigned_by_id_fkey" FOREIGN KEY ("assigned_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "evaluation_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_decisions" ADD CONSTRAINT "submission_decisions_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "scientific_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_decisions" ADD CONSTRAINT "submission_decisions_decided_by_id_fkey" FOREIGN KEY ("decided_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "badges" ADD CONSTRAINT "badges_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "badges" ADD CONSTRAINT "badges_generated_file_id_fkey" FOREIGN KEY ("generated_file_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_scanned_by_id_fkey" FOREIGN KEY ("scanned_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate_templates" ADD CONSTRAINT "certificate_templates_congress_id_fkey" FOREIGN KEY ("congress_id") REFERENCES "congresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate_templates" ADD CONSTRAINT "certificate_templates_background_media_id_fkey" FOREIGN KEY ("background_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate_templates" ADD CONSTRAINT "certificate_templates_signature_media_id_fkey" FOREIGN KEY ("signature_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate_templates" ADD CONSTRAINT "certificate_templates_stamp_media_id_fkey" FOREIGN KEY ("stamp_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_congress_id_fkey" FOREIGN KEY ("congress_id") REFERENCES "congresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_recipient_user_id_fkey" FOREIGN KEY ("recipient_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "scientific_submissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_authorized_by_id_fkey" FOREIGN KEY ("authorized_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_generated_file_id_fkey" FOREIGN KEY ("generated_file_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_templates" ADD CONSTRAINT "email_templates_congress_id_fkey" FOREIGN KEY ("congress_id") REFERENCES "congresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
