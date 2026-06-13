import type { CongressSettingsFormInput } from "@/lib/validation/congress-settings.schema";
import { prisma } from "@/lib/prisma";
import {
  findCongressWithSettingsById,
  type CongressWithSettings,
} from "@/server/repositories/congress.repository";

function parseCongressDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function emptyToNull(value: string): string | null {
  return value.trim() === "" ? null : value.trim();
}

async function ensureCongressSettings(congressId: string) {
  const existing = await prisma.congressSettings.findUnique({
    where: { congressId },
  });

  if (existing) {
    return existing;
  }

  return prisma.congressSettings.create({
    data: { congressId },
  });
}

export async function updateCongressSettings(
  congressId: string,
  input: CongressSettingsFormInput,
): Promise<CongressWithSettings> {
  await ensureCongressSettings(congressId);

  await prisma.$transaction([
    prisma.congress.update({
      where: { id: congressId },
      data: {
        nameFr: input.nameFr,
        nameEn: input.nameEn,
        startDate: parseCongressDate(input.startDate),
        endDate: parseCongressDate(input.endDate),
        venue: input.venue,
        city: input.city,
        country: input.country,
        format: input.format,
        status: input.status,
      },
    }),
    prisma.congressSettings.update({
      where: { congressId },
      data: {
        heroTitleFr: emptyToNull(input.heroTitleFr),
        heroTitleEn: emptyToNull(input.heroTitleEn),
        heroSubtitleFr: emptyToNull(input.heroSubtitleFr),
        heroSubtitleEn: emptyToNull(input.heroSubtitleEn),
        heroDescriptionFr: emptyToNull(input.heroDescriptionFr),
        heroDescriptionEn: emptyToNull(input.heroDescriptionEn),
        primaryColor: input.primaryColor,
        secondaryColor: input.secondaryColor,
        registrationOpensAt: input.registrationOpensAt,
        registrationClosesAt: input.registrationClosesAt,
        earlyBirdDeadline: input.earlyBirdDeadline,
        submissionOpensAt: input.submissionOpensAt,
        submissionClosesAt: input.submissionClosesAt,
        certificateAvailableAt: input.certificateAvailableAt,
      },
    }),
  ]);

  const updated = await findCongressWithSettingsById(congressId);
  if (!updated) {
    throw new Error("Congress not found after update");
  }

  return updated;
}
