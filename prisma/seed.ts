import { PrismaClient, RoleCode } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 12;

function requireDemoAdminPassword(): string {
  const password = process.env.DEMO_ADMIN_PASSWORD?.trim();
  if (!password) {
    console.error(
      "Seed failed: DEMO_ADMIN_PASSWORD is missing or empty. Set it in your local .env file.",
    );
    process.exit(1);
  }
  return password;
}

const ROLES: Array<{ code: RoleCode; labelFr: string; labelEn: string }> = [
  { code: "super_admin", labelFr: "Super administrateur", labelEn: "Super Admin" },
  { code: "congress_admin", labelFr: "Administrateur congrès", labelEn: "Congress Admin" },
  { code: "registration_manager", labelFr: "Responsable inscriptions", labelEn: "Registration Manager" },
  { code: "finance_manager", labelFr: "Responsable finances", labelEn: "Finance Manager" },
  {
    code: "scientific_committee_admin",
    labelFr: "Admin comité scientifique",
    labelEn: "Scientific Committee Admin",
  },
  { code: "scientific_evaluator", labelFr: "Évaluateur scientifique", labelEn: "Scientific Evaluator" },
  { code: "speaker", labelFr: "Intervenant", labelEn: "Speaker" },
  { code: "resident_submitter", labelFr: "Résident / déposant", labelEn: "Resident Submitter" },
  { code: "participant", labelFr: "Participant", labelEn: "Participant" },
  { code: "sponsor", labelFr: "Partenaire / exposant", labelEn: "Sponsor" },
  { code: "staff", labelFr: "Agent accueil", labelEn: "Staff" },
];

const PERMISSIONS: Array<{ code: string; module: string; description: string }> = [
  { code: "congress.settings.manage", module: "congress", description: "Manage congress settings" },
  { code: "congress.settings.read", module: "congress", description: "Read congress settings" },
  { code: "users.roles.manage", module: "users", description: "Assign and revoke user roles" },
  { code: "audit.read", module: "audit", description: "Read audit logs" },
  { code: "program.sessions.manage", module: "program", description: "Manage program sessions" },
  { code: "program.sessions.read", module: "program", description: "Read program sessions" },
  { code: "program.presentations.manage", module: "program", description: "Manage presentations" },
  { code: "speakers.manage", module: "speakers", description: "Manage speakers" },
  { code: "speakers.read.self", module: "speakers", description: "Read own speaker profile" },
  { code: "sponsors.manage", module: "sponsors", description: "Manage sponsors" },
  { code: "sponsors.read.self", module: "sponsors", description: "Read own sponsor profile" },
  { code: "registrations.list", module: "registrations", description: "List registrations" },
  { code: "registrations.manage", module: "registrations", description: "Manage registrations" },
  { code: "registrations.read.self", module: "registrations", description: "Read own registration" },
  { code: "payments.validate", module: "payments", description: "Validate payments" },
  { code: "payments.proofs.review", module: "payments", description: "Review payment proofs" },
  { code: "payments.proofs.upload.self", module: "payments", description: "Upload own payment proof" },
  { code: "badges.generate", module: "badges", description: "Generate badges" },
  { code: "badges.read.self", module: "badges", description: "Read own badge" },
  { code: "checkin.scan", module: "checkin", description: "Scan badges at check-in" },
  { code: "submissions.list", module: "submissions", description: "List scientific submissions" },
  { code: "submissions.manage.self", module: "submissions", description: "Manage own submissions" },
  { code: "submissions.decide", module: "submissions", description: "Make submission decisions" },
  { code: "evaluations.assign", module: "evaluations", description: "Assign evaluators" },
  { code: "evaluations.submit", module: "evaluations", description: "Submit evaluations" },
  { code: "evaluations.read.all", module: "evaluations", description: "Read all evaluations" },
  { code: "certificates.authorize", module: "certificates", description: "Authorize certificates" },
  { code: "certificates.read.self", module: "certificates", description: "Read own certificates" },
  { code: "media.manage", module: "media", description: "Manage media library" },
  { code: "media.upload.self", module: "media", description: "Upload own media" },
  { code: "emails.templates.manage", module: "emails", description: "Manage email templates" },
  { code: "exports.data", module: "exports", description: "Export data" },
];

const SESSION_TYPES: Array<{ code: string; labelFr: string; labelEn: string }> = [
  { code: "plenary", labelFr: "Plénière", labelEn: "Plenary" },
  { code: "conference", labelFr: "Conférence", labelEn: "Conference" },
  { code: "symposium", labelFr: "Symposium", labelEn: "Symposium" },
  { code: "round_table", labelFr: "Table ronde", labelEn: "Round Table" },
  { code: "oral_presentation", labelFr: "Communication orale", labelEn: "Oral Presentation" },
  { code: "poster_session", labelFr: "Session posters", labelEn: "Poster Session" },
  { code: "video_session", labelFr: "Session vidéo", labelEn: "Video Session" },
  { code: "masterclass", labelFr: "Masterclass", labelEn: "Masterclass" },
  { code: "workshop", labelFr: "Workshop pratique", labelEn: "Practical Workshop" },
  { code: "coffee_break", labelFr: "Pause-café", labelEn: "Coffee Break" },
  { code: "lunch", labelFr: "Déjeuner", labelEn: "Lunch" },
  { code: "dinner", labelFr: "Dîner", labelEn: "Dinner" },
  { code: "ceremony", labelFr: "Cérémonie", labelEn: "Ceremony" },
  { code: "sponsored_session", labelFr: "Session sponsorisée", labelEn: "Sponsored Session" },
];

const SUBMISSION_TYPES: Array<{ code: string; labelFr: string; labelEn: string }> = [
  { code: "oral_presentation", labelFr: "Communication orale", labelEn: "Oral Presentation" },
  { code: "scientific_poster", labelFr: "Poster scientifique", labelEn: "Scientific Poster" },
  { code: "clinical_case", labelFr: "Cas clinique", labelEn: "Clinical Case" },
  { code: "case_series", labelFr: "Série de cas", labelEn: "Case Series" },
  { code: "operative_video", labelFr: "Vidéo opératoire", labelEn: "Operative Video" },
  { code: "research_work", labelFr: "Travail de recherche", labelEn: "Research Work" },
  { code: "training_thesis", labelFr: "Mémoire / travail de fin de formation", labelEn: "Training Thesis" },
  {
    code: "surgical_innovation",
    labelFr: "Projet d'innovation chirurgicale",
    labelEn: "Surgical Innovation Project",
  },
];

async function seedRoles() {
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: { labelFr: role.labelFr, labelEn: role.labelEn },
      create: role,
    });
  }
}

async function seedPermissions() {
  for (const permission of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: permission.code },
      update: {
        module: permission.module,
        description: permission.description,
      },
      create: permission,
    });
  }
}

async function seedSessionTypes() {
  for (const sessionType of SESSION_TYPES) {
    await prisma.sessionType.upsert({
      where: { code: sessionType.code },
      update: { labelFr: sessionType.labelFr, labelEn: sessionType.labelEn },
      create: sessionType,
    });
  }
}

async function seedSubmissionTypes() {
  for (const submissionType of SUBMISSION_TYPES) {
    await prisma.submissionType.upsert({
      where: { code: submissionType.code },
      update: { labelFr: submissionType.labelFr, labelEn: submissionType.labelEn },
      create: submissionType,
    });
  }
}

async function seedDemoCongress() {
  const congress = await prisma.congress.upsert({
    where: { slug: "atccr-demo-2026" },
    update: {},
    create: {
      slug: "atccr-demo-2026",
      nameFr: "Congrès ATCCR — Démo 2026",
      nameEn: "ATCCR Congress — Demo 2026",
      startDate: new Date("2026-11-15"),
      endDate: new Date("2026-11-17"),
      venue: "Centre de congrès démo",
      city: "Demo City",
      country: "TN",
      format: "hybrid",
      status: "draft",
      settings: {
        create: {
          heroTitleFr: "Congrès médical scientifique ATCCR",
          heroTitleEn: "ATCCR Medical Scientific Congress",
          heroSubtitleFr: "Environnement de démonstration",
          heroSubtitleEn: "Demonstration environment",
          sectionVisibility: {
            about: true,
            themes: true,
            program: true,
            speakers: true,
            partners: true,
          },
          keyFigures: {
            participants: 0,
            speakers: 0,
            sessions: 0,
            sponsors: 0,
          },
        },
      },
    },
  });

  return congress;
}

/**
 * Ticket categories mirrored from the ATCCR Google Form registration reference (D5.1).
 * Demo/congress configuration only — not participant data. No payment/upload logic.
 */
type ParticipantCategoryCode =
  | "specialist"
  | "resident"
  | "student"
  | "paramedical";

const GOOGLE_FORM_TICKET_TYPES: Array<{
  nameFr: string;
  nameEn: string;
  price: number;
  eligibleCategories: ParticipantCategoryCode[];
  descriptionFr?: string;
  descriptionEn?: string;
}> = [
  {
    nameFr: "Médecin spécialiste",
    nameEn: "Specialist physician",
    price: 400,
    eligibleCategories: ["specialist"],
  },
  {
    nameFr: "Résident",
    nameEn: "Resident",
    price: 200,
    eligibleCategories: ["resident"],
  },
  {
    nameFr: "Technicien supérieur",
    nameEn: "Senior technician",
    price: 100,
    eligibleCategories: ["paramedical"],
  },
  {
    nameFr: "Biologiste / Doctorant",
    nameEn: "Biologist / PhD candidate",
    price: 200,
    eligibleCategories: ["paramedical", "student"],
  },
  {
    nameFr: "Interne / étudiant",
    nameEn: "Intern / student",
    price: 0,
    eligibleCategories: ["student", "resident"],
    descriptionFr:
      "Tarif gratuit. Un justificatif sera demandé ultérieurement lors de l'inscription publique.",
    descriptionEn:
      "Free of charge. Supporting proof will be required later during public registration.",
  },
];

/**
 * Accommodation/travel options from the Google Form. The current schema ties
 * TicketOption to a single TicketType (no global option model), so these shared
 * options are attached to every ticket category. See docs/09_REGISTRATION_FORM_MAPPING.md
 * for the documented limitation. Prices are 0 — the partner agency contacts
 * participants later; no booking/payment logic is implemented here.
 */
const GOOGLE_FORM_TICKET_OPTIONS: Array<{ nameFr: string; nameEn: string }> = [
  { nameFr: "Chambre double (LPD)", nameEn: "Double room (bed & breakfast)" },
  { nameFr: "Chambre single (LPD)", nameEn: "Single room (bed & breakfast)" },
  {
    nameFr: "Déplacement par Bus Depuis Tunis / Sousse / Sfax vers Djerba",
    nameEn: "Bus transfer from Tunis / Sousse / Sfax to Djerba",
  },
  {
    nameFr: "Déplacement Vol Interne Depuis Tunis Vers Djerba",
    nameEn: "Domestic flight transfer from Tunis to Djerba",
  },
];

/** Legacy D5 demo artifacts to remove (no real data, no registrations exist). */
const LEGACY_TICKET_TYPE_NAMES_EN = ["Demo specialist ticket"];
const LEGACY_TICKET_TYPE_NAMES_FR = ["Billet démo spécialiste"];
const LEGACY_TICKET_OPTION_NAMES_EN = ["Gala dinner"];
const LEGACY_TICKET_OPTION_NAMES_FR = ["Dîner de gala"];

async function cleanupLegacyD5TestData(congressId: string) {
  await prisma.ticketOption.deleteMany({
    where: {
      ticketType: { congressId },
      OR: [
        { nameEn: { in: LEGACY_TICKET_OPTION_NAMES_EN } },
        { nameFr: { in: LEGACY_TICKET_OPTION_NAMES_FR } },
      ],
    },
  });

  await prisma.ticketType.deleteMany({
    where: {
      congressId,
      registrations: { none: {} },
      OR: [
        { nameEn: { in: LEGACY_TICKET_TYPE_NAMES_EN } },
        { nameFr: { in: LEGACY_TICKET_TYPE_NAMES_FR } },
      ],
    },
  });
}

async function seedDemoTicketSettings(congressId: string) {
  await cleanupLegacyD5TestData(congressId);

  for (const ticket of GOOGLE_FORM_TICKET_TYPES) {
    const data = {
      nameFr: ticket.nameFr,
      nameEn: ticket.nameEn,
      descriptionFr: ticket.descriptionFr ?? null,
      descriptionEn: ticket.descriptionEn ?? null,
      eligibleCategories: ticket.eligibleCategories,
      currency: "TND" as const,
      price: ticket.price,
      active: true,
    };

    const existingType = await prisma.ticketType.findFirst({
      where: { congressId, nameFr: ticket.nameFr },
    });

    const ticketType = existingType
      ? await prisma.ticketType.update({ where: { id: existingType.id }, data })
      : await prisma.ticketType.create({ data: { congressId, ...data } });

    for (const option of GOOGLE_FORM_TICKET_OPTIONS) {
      const existingOption = await prisma.ticketOption.findFirst({
        where: { ticketTypeId: ticketType.id, nameFr: option.nameFr },
      });

      const optionData = {
        nameFr: option.nameFr,
        nameEn: option.nameEn,
        price: 0,
        included: false,
      };

      if (existingOption) {
        await prisma.ticketOption.update({
          where: { id: existingOption.id },
          data: optionData,
        });
      } else {
        await prisma.ticketOption.create({
          data: { ticketTypeId: ticketType.id, ...optionData },
        });
      }
    }
  }
}

async function seedDemoSuperAdmin(congressId: string) {
  const demoEmail = "demo.superadmin@example.com";
  const passwordHash = await bcrypt.hash(requireDemoAdminPassword(), BCRYPT_ROUNDS);

  const user = await prisma.user.upsert({
    where: { email: demoEmail },
    update: { passwordHash },
    create: {
      email: demoEmail,
      passwordHash,
      locale: "fr",
      status: "active",
      profile: {
        create: {
          firstName: "Demo",
          lastName: "SuperAdmin",
          institution: "Demo Hospital",
          country: "TN",
          city: "Demo City",
        },
      },
    },
  });

  const superAdminRole = await prisma.role.findUniqueOrThrow({
    where: { code: "super_admin" },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId_congressId: {
        userId: user.id,
        roleId: superAdminRole.id,
        congressId,
      },
    },
    update: {},
    create: {
      userId: user.id,
      roleId: superAdminRole.id,
      congressId,
    },
  });

  return user;
}

async function main() {
  console.log("Seeding ATCCR demo data (fake data only)...");

  await seedRoles();
  await seedPermissions();
  await seedSessionTypes();
  await seedSubmissionTypes();

  const congress = await seedDemoCongress();
  await seedDemoSuperAdmin(congress.id);
  await seedDemoTicketSettings(congress.id);

  // TODO (Step B2+): map role permissions, email templates, demo themes
  console.log("Seed completed.");
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
