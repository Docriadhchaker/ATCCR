import type { TicketOption, TicketType } from "@prisma/client";

import type { ParticipantCategory } from "@prisma/client";

export type TicketTypeFormValues = {
  id?: string;
  nameFr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionEn: string;
  eligibleCategories: ParticipantCategory[];
  currency: "TND" | "EUR";
  price: string;
  earlyBirdPrice: string;
  earlyBirdDeadline: string;
  onSitePrice: string;
  quota: string;
  active: boolean;
};

export type TicketOptionFormValues = {
  id?: string;
  ticketTypeId: string;
  nameFr: string;
  nameEn: string;
  price: string;
  included: boolean;
};

function formatDecimal(value: { toString(): string } | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }
  return value.toString();
}

function formatDateTimeLocalInput(value: Date | null | undefined): string {
  if (!value) {
    return "";
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${value.getUTCFullYear()}-${pad(value.getUTCMonth() + 1)}-${pad(value.getUTCDate())}T${pad(value.getUTCHours())}:${pad(value.getUTCMinutes())}`;
}

export function toTicketTypeFormValues(ticketType?: TicketType): TicketTypeFormValues {
  if (!ticketType) {
    return {
      nameFr: "",
      nameEn: "",
      descriptionFr: "",
      descriptionEn: "",
      eligibleCategories: [],
      currency: "TND",
      price: "",
      earlyBirdPrice: "",
      earlyBirdDeadline: "",
      onSitePrice: "",
      quota: "",
      active: true,
    };
  }

  return {
    id: ticketType.id,
    nameFr: ticketType.nameFr,
    nameEn: ticketType.nameEn,
    descriptionFr: ticketType.descriptionFr ?? "",
    descriptionEn: ticketType.descriptionEn ?? "",
    eligibleCategories: ticketType.eligibleCategories,
    currency: ticketType.currency,
    price: formatDecimal(ticketType.price),
    earlyBirdPrice: formatDecimal(ticketType.earlyBirdPrice),
    earlyBirdDeadline: formatDateTimeLocalInput(ticketType.earlyBirdDeadline),
    onSitePrice: formatDecimal(ticketType.onSitePrice),
    quota: ticketType.quota !== null ? String(ticketType.quota) : "",
    active: ticketType.active,
  };
}

export function toTicketOptionFormValues(
  ticketTypeId: string,
  option?: TicketOption,
): TicketOptionFormValues {
  if (!option) {
    return {
      ticketTypeId,
      nameFr: "",
      nameEn: "",
      price: "",
      included: false,
    };
  }

  return {
    id: option.id,
    ticketTypeId: option.ticketTypeId,
    nameFr: option.nameFr,
    nameEn: option.nameEn,
    price: formatDecimal(option.price),
    included: option.included,
  };
}

export function formatPriceDisplay(
  value: { toString(): string },
  currency: string,
  locale: string,
): string {
  const amount = Number(value.toString());
  return new Intl.NumberFormat(locale === "fr" ? "fr-TN" : "en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
