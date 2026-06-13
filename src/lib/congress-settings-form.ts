import type { CongressWithSettings } from "@/server/repositories/congress.repository";

export type CongressSettingsFormValues = {
  slug: string;
  nameFr: string;
  nameEn: string;
  startDate: string;
  endDate: string;
  venue: string;
  city: string;
  country: string;
  format: "onsite" | "hybrid" | "online";
  status: "draft" | "published" | "archived";
  heroTitleFr: string;
  heroTitleEn: string;
  heroSubtitleFr: string;
  heroSubtitleEn: string;
  heroDescriptionFr: string;
  heroDescriptionEn: string;
  primaryColor: string;
  secondaryColor: string;
  registrationOpensAt: string;
  registrationClosesAt: string;
  earlyBirdDeadline: string;
  submissionOpensAt: string;
  submissionClosesAt: string;
  certificateAvailableAt: string;
};

function formatDateInput(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function formatDateTimeLocalInput(value: Date | null | undefined): string {
  if (!value) {
    return "";
  }

  const pad = (part: number) => String(part).padStart(2, "0");
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}`;
}

export function toCongressSettingsFormValues(
  congress: CongressWithSettings,
): CongressSettingsFormValues {
  const settings = congress.settings;

  return {
    slug: congress.slug,
    nameFr: congress.nameFr,
    nameEn: congress.nameEn,
    startDate: formatDateInput(congress.startDate),
    endDate: formatDateInput(congress.endDate),
    venue: congress.venue,
    city: congress.city,
    country: congress.country,
    format: congress.format,
    status: congress.status,
    heroTitleFr: settings?.heroTitleFr ?? "",
    heroTitleEn: settings?.heroTitleEn ?? "",
    heroSubtitleFr: settings?.heroSubtitleFr ?? "",
    heroSubtitleEn: settings?.heroSubtitleEn ?? "",
    heroDescriptionFr: settings?.heroDescriptionFr ?? "",
    heroDescriptionEn: settings?.heroDescriptionEn ?? "",
    primaryColor: settings?.primaryColor ?? "#0F2B5B",
    secondaryColor: settings?.secondaryColor ?? "#0D9488",
    registrationOpensAt: formatDateTimeLocalInput(settings?.registrationOpensAt),
    registrationClosesAt: formatDateTimeLocalInput(settings?.registrationClosesAt),
    earlyBirdDeadline: formatDateTimeLocalInput(settings?.earlyBirdDeadline),
    submissionOpensAt: formatDateTimeLocalInput(settings?.submissionOpensAt),
    submissionClosesAt: formatDateTimeLocalInput(settings?.submissionClosesAt),
    certificateAvailableAt: formatDateTimeLocalInput(settings?.certificateAvailableAt),
  };
}
