import { z } from "zod";

const optionalText = z
  .string()
  .max(5000)
  .optional()
  .transform((value) => value?.trim() ?? "");

const optionalDateTime = z
  .string()
  .optional()
  .transform((value) => {
    const trimmed = value?.trim() ?? "";
    if (!trimmed) {
      return null;
    }
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  });

const hexColor = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, { message: "invalidColor" });

export const congressSettingsFormSchema = z
  .object({
    nameFr: z.string().trim().min(1, { message: "required" }).max(255),
    nameEn: z.string().trim().min(1, { message: "required" }).max(255),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "invalidDate" }),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "invalidDate" }),
    venue: z.string().trim().min(1, { message: "required" }).max(255),
    city: z.string().trim().min(1, { message: "required" }).max(255),
    country: z.string().trim().min(1, { message: "required" }).max(100),
    format: z.enum(["onsite", "hybrid", "online"]),
    status: z.enum(["draft", "published", "archived"]),
    heroTitleFr: optionalText,
    heroTitleEn: optionalText,
    heroSubtitleFr: optionalText,
    heroSubtitleEn: optionalText,
    heroDescriptionFr: optionalText,
    heroDescriptionEn: optionalText,
    primaryColor: hexColor,
    secondaryColor: hexColor,
    registrationOpensAt: optionalDateTime,
    registrationClosesAt: optionalDateTime,
    earlyBirdDeadline: optionalDateTime,
    submissionOpensAt: optionalDateTime,
    submissionClosesAt: optionalDateTime,
    certificateAvailableAt: optionalDateTime,
  })
  .superRefine((data, ctx) => {
    if (new Date(data.startDate) > new Date(data.endDate)) {
      ctx.addIssue({
        code: "custom",
        message: "endDateBeforeStart",
        path: ["endDate"],
      });
    }

    const datePairs: Array<[Date | null, Date | null, keyof typeof data]> = [
      [data.registrationOpensAt, data.registrationClosesAt, "registrationClosesAt"],
      [data.submissionOpensAt, data.submissionClosesAt, "submissionClosesAt"],
    ];

    for (const [opensAt, closesAt, path] of datePairs) {
      if (opensAt && closesAt && opensAt > closesAt) {
        ctx.addIssue({
          code: "custom",
          message: "closesBeforeOpens",
          path: [path],
        });
      }
    }
  });

export type CongressSettingsFormInput = z.infer<typeof congressSettingsFormSchema>;

export function parseCongressSettingsForm(formData: FormData) {
  const raw = {
    nameFr: String(formData.get("nameFr") ?? ""),
    nameEn: String(formData.get("nameEn") ?? ""),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    venue: String(formData.get("venue") ?? ""),
    city: String(formData.get("city") ?? ""),
    country: String(formData.get("country") ?? ""),
    format: String(formData.get("format") ?? ""),
    status: String(formData.get("status") ?? ""),
    heroTitleFr: String(formData.get("heroTitleFr") ?? ""),
    heroTitleEn: String(formData.get("heroTitleEn") ?? ""),
    heroSubtitleFr: String(formData.get("heroSubtitleFr") ?? ""),
    heroSubtitleEn: String(formData.get("heroSubtitleEn") ?? ""),
    heroDescriptionFr: String(formData.get("heroDescriptionFr") ?? ""),
    heroDescriptionEn: String(formData.get("heroDescriptionEn") ?? ""),
    primaryColor: String(formData.get("primaryColor") ?? ""),
    secondaryColor: String(formData.get("secondaryColor") ?? ""),
    registrationOpensAt: String(formData.get("registrationOpensAt") ?? ""),
    registrationClosesAt: String(formData.get("registrationClosesAt") ?? ""),
    earlyBirdDeadline: String(formData.get("earlyBirdDeadline") ?? ""),
    submissionOpensAt: String(formData.get("submissionOpensAt") ?? ""),
    submissionClosesAt: String(formData.get("submissionClosesAt") ?? ""),
    certificateAvailableAt: String(formData.get("certificateAvailableAt") ?? ""),
  };

  return congressSettingsFormSchema.safeParse(raw);
}
