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
