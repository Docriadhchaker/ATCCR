import type { ParticipantCategory, TicketType } from "@prisma/client";

import type { Locale } from "@/i18n/routing";

export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim().replace(/\s+/g, " ");
  const parts = trimmed.split(" ");

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: parts[0] };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

export function deriveParticipantCategory(ticketType: TicketType): ParticipantCategory {
  const [primary] = ticketType.eligibleCategories;
  if (primary) {
    return primary;
  }

  if (ticketType.nameFr === "Interne / étudiant") {
    return "student";
  }

  return "specialist";
}

export function isFreeTicketType(price: { toString(): string }): boolean {
  return Number(price.toString()) === 0;
}

export function pickTicketTypeLabel(
  locale: Locale | string,
  nameFr: string,
  nameEn: string,
): string {
  return locale === "en" && nameEn.trim() ? nameEn : nameFr;
}

export function formatRegistrationAmount(
  amount: number,
  currency: string,
  locale: Locale | string,
): string {
  if (amount === 0) {
    return locale === "fr" ? "0" : "0";
  }

  return new Intl.NumberFormat(locale === "fr" ? "fr-TN" : "en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
