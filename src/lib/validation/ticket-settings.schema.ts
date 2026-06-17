import { z } from "zod";

const PARTICIPANT_CATEGORIES = [
  "specialist",
  "resident",
  "student",
  "paramedical",
  "guest",
  "speaker",
  "scientific_committee",
  "sponsor",
  "press",
  "staff",
] as const;

const optionalText = z
  .string()
  .max(5000)
  .optional()
  .transform((value) => value?.trim() ?? "");

const optionalDecimal = z
  .string()
  .optional()
  .transform((value) => {
    const trimmed = value?.trim() ?? "";
    if (!trimmed) {
      return null;
    }
    const parsed = Number(trimmed.replace(",", "."));
    if (Number.isNaN(parsed) || parsed < 0) {
      return null;
    }
    return parsed;
  });

const requiredDecimal = z
  .string()
  .trim()
  .min(1, { message: "required" })
  .transform((value) => Number(value.replace(",", ".")))
  .refine((value) => !Number.isNaN(value) && value >= 0, { message: "invalidPrice" });

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

const optionalPositiveInt = z
  .string()
  .optional()
  .transform((value) => {
    const trimmed = value?.trim() ?? "";
    if (!trimmed) {
      return null;
    }
    const parsed = Number.parseInt(trimmed, 10);
    if (Number.isNaN(parsed) || parsed < 0) {
      return null;
    }
    return parsed;
  });

export const ticketTypeFormSchema = z.object({
  id: z.string().uuid().optional(),
  nameFr: z.string().trim().min(1, { message: "required" }).max(255),
  nameEn: z.string().trim().min(1, { message: "required" }).max(255),
  descriptionFr: optionalText,
  descriptionEn: optionalText,
  eligibleCategories: z
    .array(z.enum(PARTICIPANT_CATEGORIES))
    .min(1, { message: "eligibleCategoriesRequired" }),
  currency: z.enum(["TND", "EUR"]),
  price: requiredDecimal,
  earlyBirdPrice: optionalDecimal,
  earlyBirdDeadline: optionalDateTime,
  onSitePrice: optionalDecimal,
  quota: optionalPositiveInt,
  active: z
    .string()
    .optional()
    .transform((value) => value === "on" || value === "true"),
});

export const ticketOptionFormSchema = z.object({
  id: z.string().uuid().optional(),
  ticketTypeId: z.string().uuid({ message: "required" }),
  nameFr: z.string().trim().min(1, { message: "required" }).max(255),
  nameEn: z.string().trim().min(1, { message: "required" }).max(255),
  price: requiredDecimal,
  included: z
    .string()
    .optional()
    .transform((value) => value === "on" || value === "true"),
});

export type TicketTypeFormInput = z.infer<typeof ticketTypeFormSchema>;
export type TicketOptionFormInput = z.infer<typeof ticketOptionFormSchema>;

export function parseTicketTypeForm(formData: FormData) {
  const raw = {
    id: String(formData.get("id") ?? "").trim() || undefined,
    nameFr: String(formData.get("nameFr") ?? ""),
    nameEn: String(formData.get("nameEn") ?? ""),
    descriptionFr: String(formData.get("descriptionFr") ?? ""),
    descriptionEn: String(formData.get("descriptionEn") ?? ""),
    eligibleCategories: formData.getAll("eligibleCategories").map(String),
    currency: String(formData.get("currency") ?? ""),
    price: String(formData.get("price") ?? ""),
    earlyBirdPrice: String(formData.get("earlyBirdPrice") ?? ""),
    earlyBirdDeadline: String(formData.get("earlyBirdDeadline") ?? ""),
    onSitePrice: String(formData.get("onSitePrice") ?? ""),
    quota: String(formData.get("quota") ?? ""),
    active: String(formData.get("active") ?? ""),
  };

  return ticketTypeFormSchema.safeParse(raw);
}

export function parseTicketOptionForm(formData: FormData) {
  const raw = {
    id: String(formData.get("id") ?? "").trim() || undefined,
    ticketTypeId: String(formData.get("ticketTypeId") ?? ""),
    nameFr: String(formData.get("nameFr") ?? ""),
    nameEn: String(formData.get("nameEn") ?? ""),
    price: String(formData.get("price") ?? ""),
    included: String(formData.get("included") ?? ""),
  };

  return ticketOptionFormSchema.safeParse(raw);
}

export const PARTICIPANT_CATEGORY_VALUES = PARTICIPANT_CATEGORIES;
