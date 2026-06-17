import type { TicketOption, TicketType } from "@prisma/client";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type {
  TicketOptionFormInput,
  TicketTypeFormInput,
} from "@/lib/validation/ticket-settings.schema";
import {
  findDemoCongressTicketSettings,
  findTicketOptionByIdForDemoCongress,
  findTicketTypeByIdForDemoCongress,
} from "@/server/repositories/ticket.repository";

function emptyToNull(value: string): string | null {
  return value.trim() === "" ? null : value.trim();
}

function toDecimal(value: number): Prisma.Decimal {
  return new Prisma.Decimal(value);
}

export async function upsertTicketType(
  congressId: string,
  input: TicketTypeFormInput,
): Promise<TicketType> {
  const data = {
    nameFr: input.nameFr,
    nameEn: input.nameEn,
    descriptionFr: emptyToNull(input.descriptionFr),
    descriptionEn: emptyToNull(input.descriptionEn),
    eligibleCategories: input.eligibleCategories,
    currency: input.currency,
    price: toDecimal(input.price),
    earlyBirdPrice:
      input.earlyBirdPrice !== null ? toDecimal(input.earlyBirdPrice) : null,
    earlyBirdDeadline: input.earlyBirdDeadline,
    onSitePrice: input.onSitePrice !== null ? toDecimal(input.onSitePrice) : null,
    quota: input.quota,
    active: input.active,
  };

  if (input.id) {
    const existing = await findTicketTypeByIdForDemoCongress(input.id);
    if (!existing || existing.congressId !== congressId) {
      throw new Error("Ticket type not found");
    }

    return prisma.ticketType.update({
      where: { id: input.id },
      data,
    });
  }

  return prisma.ticketType.create({
    data: {
      congressId,
      ...data,
    },
  });
}

export async function upsertTicketOption(
  input: TicketOptionFormInput,
): Promise<TicketOption> {
  const ticketType = await findTicketTypeByIdForDemoCongress(input.ticketTypeId);
  if (!ticketType) {
    throw new Error("Ticket type not found");
  }

  const data = {
    nameFr: input.nameFr,
    nameEn: input.nameEn,
    price: toDecimal(input.price),
    included: input.included,
  };

  if (input.id) {
    const existing = await findTicketOptionByIdForDemoCongress(input.id);
    if (!existing || existing.ticketTypeId !== input.ticketTypeId) {
      throw new Error("Ticket option not found");
    }

    return prisma.ticketOption.update({
      where: { id: input.id },
      data,
    });
  }

  return prisma.ticketOption.create({
    data: {
      ticketTypeId: input.ticketTypeId,
      ...data,
    },
  });
}

export async function loadDemoTicketSettings() {
  return findDemoCongressTicketSettings();
}
