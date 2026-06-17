import type { TicketOption, TicketType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { DEMO_CONGRESS_SLUG } from "@/server/repositories/congress.repository";

export type PublicRegistrationTicketType = TicketType & {
  options: TicketOption[];
};

export type PublicRegistrationFormData = {
  congressId: string;
  congressNameFr: string;
  congressNameEn: string;
  ticketTypes: PublicRegistrationTicketType[];
};

export async function findPublicRegistrationFormData(): Promise<PublicRegistrationFormData | null> {
  const congress = await prisma.congress.findUnique({
    where: { slug: DEMO_CONGRESS_SLUG },
    select: {
      id: true,
      nameFr: true,
      nameEn: true,
      ticketTypes: {
        where: { active: true },
        orderBy: { price: "desc" },
        include: {
          options: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  if (!congress) {
    return null;
  }

  return {
    congressId: congress.id,
    congressNameFr: congress.nameFr,
    congressNameEn: congress.nameEn,
    ticketTypes: congress.ticketTypes,
  };
}

export async function findActiveRegistrationByUserAndCongress(
  userId: string,
  congressId: string,
) {
  return prisma.registration.findFirst({
    where: {
      userId,
      congressId,
      deletedAt: null,
    },
    select: { id: true, reference: true },
  });
}

export async function isRegistrationReferenceTaken(reference: string): Promise<boolean> {
  const existing = await prisma.registration.findUnique({
    where: { reference },
    select: { id: true },
  });
  return Boolean(existing);
}

export type RegistrationConfirmation = {
  reference: string;
  participantName: string | null;
  ticketTypeNameFr: string;
  ticketTypeNameEn: string;
  totalAmount: number;
  currency: string;
  requiresProofLater: boolean;
};

export async function findRegistrationConfirmationByReference(
  reference: string,
): Promise<RegistrationConfirmation | null> {
  const normalized = reference.trim();
  if (!normalized) {
    return null;
  }

  const registration = await prisma.registration.findFirst({
    where: { reference: normalized, deletedAt: null },
    select: {
      reference: true,
      totalAmount: true,
      participantCategory: true,
      ticketType: {
        select: { nameFr: true, nameEn: true, currency: true, price: true },
      },
      user: {
        select: {
          profile: { select: { firstName: true, lastName: true } },
        },
      },
    },
  });

  if (!registration) {
    return null;
  }

  const profile = registration.user.profile;
  const participantName = profile
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : null;

  return {
    reference: registration.reference,
    participantName: participantName || null,
    ticketTypeNameFr: registration.ticketType.nameFr,
    ticketTypeNameEn: registration.ticketType.nameEn,
    totalAmount: Number(registration.totalAmount.toString()),
    currency: registration.ticketType.currency,
    requiresProofLater: registration.participantCategory === "student",
  };
}
