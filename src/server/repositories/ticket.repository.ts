import type { TicketOption, TicketType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { DEMO_CONGRESS_SLUG } from "@/server/repositories/congress.repository";

export type TicketTypeWithOptions = TicketType & {
  options: TicketOption[];
};

export async function findDemoCongressTicketSettings(): Promise<{
  congressId: string;
  ticketTypes: TicketTypeWithOptions[];
} | null> {
  const congress = await prisma.congress.findUnique({
    where: { slug: DEMO_CONGRESS_SLUG },
    select: {
      id: true,
      ticketTypes: {
        orderBy: [{ active: "desc" }, { createdAt: "asc" }],
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
    ticketTypes: congress.ticketTypes,
  };
}

export async function findTicketTypeByIdForDemoCongress(
  ticketTypeId: string,
): Promise<TicketType | null> {
  return prisma.ticketType.findFirst({
    where: {
      id: ticketTypeId,
      congress: { slug: DEMO_CONGRESS_SLUG },
    },
  });
}

export async function findTicketOptionByIdForDemoCongress(
  ticketOptionId: string,
): Promise<(TicketOption & { ticketType: TicketType }) | null> {
  return prisma.ticketOption.findFirst({
    where: {
      id: ticketOptionId,
      ticketType: { congress: { slug: DEMO_CONGRESS_SLUG } },
    },
    include: { ticketType: true },
  });
}
