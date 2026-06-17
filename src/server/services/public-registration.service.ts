import { Prisma } from "@prisma/client";

import {
  deriveParticipantCategory,
  isFreeTicketType,
  splitFullName,
} from "@/lib/public-registration";
import type { PublicRegistrationFormInput } from "@/lib/validation/public-registration.schema";
import { prisma } from "@/lib/prisma";
import { getMailer } from "@/lib/mail";
import { DEMO_CONGRESS_SLUG } from "@/server/repositories/congress.repository";
import { isRegistrationReferenceTaken } from "@/server/repositories/public-registration.repository";

export class DuplicateRegistrationError extends Error {
  constructor(public readonly reference?: string) {
    super("Duplicate registration");
    this.name = "DuplicateRegistrationError";
  }
}

export class RegistrationValidationError extends Error {
  constructor(public readonly code: "congressNotFound" | "ticketTypeInvalid" | "optionsInvalid") {
    super(code);
    this.name = "RegistrationValidationError";
  }
}

async function generateUniqueReference(): Promise<string> {
  const prefix = "ATCCR-2026";

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
    const reference = `${prefix}-${suffix}`;
    const taken = await isRegistrationReferenceTaken(reference);
    if (!taken) {
      return reference;
    }
  }

  throw new Error("Failed to generate registration reference");
}

export type CreatePublicRegistrationResult = {
  reference: string;
  requiresProofLater: boolean;
  isFreeRegistration: boolean;
};

export async function createPublicRegistration(
  locale: "fr" | "en",
  input: PublicRegistrationFormInput,
): Promise<CreatePublicRegistrationResult> {
  const congress = await prisma.congress.findUnique({
    where: { slug: DEMO_CONGRESS_SLUG },
    include: {
      ticketTypes: {
        where: { id: input.ticketTypeId, active: true },
        include: { options: true },
      },
    },
  });

  if (!congress) {
    throw new RegistrationValidationError("congressNotFound");
  }

  const ticketType = congress.ticketTypes[0];
  if (!ticketType) {
    throw new RegistrationValidationError("ticketTypeInvalid");
  }

  const selectedOptions = ticketType.options.filter((option) =>
    input.ticketOptionIds.includes(option.id),
  );

  if (selectedOptions.length !== input.ticketOptionIds.length) {
    throw new RegistrationValidationError("optionsInvalid");
  }

  const ticketPrice = Number(ticketType.price.toString());
  const optionsTotal = selectedOptions.reduce(
    (sum, option) => sum + Number(option.price.toString()),
    0,
  );
  const subtotal = ticketPrice + optionsTotal;
  const participantCategory = deriveParticipantCategory(ticketType);
  const isFree = isFreeTicketType(ticketType.price);
  const paymentStatus = isFree ? "exempted" : "not_paid";
  const { firstName, lastName } = splitFullName(input.fullName);
  const normalizedEmail = input.email.trim().toLowerCase();
  const now = new Date();

  const result = await prisma.$transaction(async (tx) => {
    const existingUser = await tx.user.findUnique({
      where: { email: normalizedEmail },
      include: { profile: true },
    });

    if (existingUser) {
      const duplicate = await tx.registration.findFirst({
        where: {
          userId: existingUser.id,
          congressId: congress.id,
          deletedAt: null,
        },
        select: { reference: true },
      });
      if (duplicate) {
        throw new DuplicateRegistrationError(duplicate.reference);
      }
    }

    const user =
      existingUser ??
      (await tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash: null,
          locale,
          status: "active",
        },
      }));

    if (existingUser) {
      await tx.user.update({
        where: { id: user.id },
        data: { locale },
      });
    }

    const hasProfile = Boolean(existingUser?.profile);

    if (hasProfile) {
      await tx.userProfile.update({
        where: { userId: user.id },
        data: {
          firstName,
          lastName,
          specialty: input.specialty,
          institution: input.institution,
          phone: input.phone,
        },
      });
    } else {
      await tx.userProfile.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          specialty: input.specialty,
          institution: input.institution,
          phone: input.phone,
        },
      });
    }

    const participantRole = await tx.role.findUniqueOrThrow({
      where: { code: "participant" },
    });

    await tx.userRole.upsert({
      where: {
        userId_roleId_congressId: {
          userId: user.id,
          roleId: participantRole.id,
          congressId: congress.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        roleId: participantRole.id,
        congressId: congress.id,
      },
    });

    const reference = await generateUniqueReference();

    const registration = await tx.registration.create({
      data: {
        reference,
        congressId: congress.id,
        userId: user.id,
        participantCategory,
        ticketTypeId: ticketType.id,
        status: "pending",
        paymentStatus,
        subtotal: new Prisma.Decimal(subtotal),
        vatAmount: new Prisma.Decimal(0),
        totalAmount: new Prisma.Decimal(subtotal),
        consentAt: now,
        termsAcceptedAt: now,
        options: {
          create: selectedOptions.map((option) => ({
            ticketOptionId: option.id,
            price: option.price,
          })),
        },
      },
    });

    await tx.auditLog.create({
      data: {
        congressId: congress.id,
        actorId: user.id,
        action: "registration.created",
        entityType: "registration",
        entityId: registration.id,
        metadata: {
          reference,
          ticketTypeId: ticketType.id,
          publicRegistration: true,
        },
      },
    });

    return {
      reference,
      email: normalizedEmail,
      requiresProofLater: isFree,
      isFreeRegistration: isFree,
    };
  });

  const mailer = getMailer();
  await mailer.sendMail({
    to: { email: result.email },
    subject:
      locale === "fr"
        ? `Confirmation d'inscription — ${result.reference}`
        : `Registration confirmation — ${result.reference}`,
    text:
      locale === "fr"
        ? `Votre demande d'inscription au congrès a été enregistrée. Référence : ${result.reference}.`
        : `Your congress registration request has been recorded. Reference: ${result.reference}.`,
    templateId: "registration.confirmation",
  });

  return {
    reference: result.reference,
    requiresProofLater: result.requiresProofLater,
    isFreeRegistration: result.isFreeRegistration,
  };
}
