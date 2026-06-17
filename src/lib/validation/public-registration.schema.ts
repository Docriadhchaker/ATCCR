import { z } from "zod";

export const publicRegistrationFormSchema = z.object({
  email: z.string().trim().email({ message: "invalidEmail" }).max(255),
  fullName: z.string().trim().min(2, { message: "required" }).max(255),
  specialty: z.string().trim().min(1, { message: "required" }).max(255),
  institution: z.string().trim().min(1, { message: "required" }).max(255),
  phone: z.string().trim().min(6, { message: "required" }).max(50),
  ticketTypeId: z.string().uuid({ message: "required" }),
  ticketOptionIds: z.array(z.string().uuid()).default([]),
  termsAccepted: z
    .string()
    .optional()
    .transform((value) => value === "on" || value === "true")
    .refine((value) => value === true, { message: "termsRequired" }),
  consentAccepted: z
    .string()
    .optional()
    .transform((value) => value === "on" || value === "true")
    .refine((value) => value === true, { message: "consentRequired" }),
});

export type PublicRegistrationFormInput = z.infer<typeof publicRegistrationFormSchema>;

export function parsePublicRegistrationForm(formData: FormData) {
  const raw = {
    email: String(formData.get("email") ?? ""),
    fullName: String(formData.get("fullName") ?? ""),
    specialty: String(formData.get("specialty") ?? ""),
    institution: String(formData.get("institution") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    ticketTypeId: String(formData.get("ticketTypeId") ?? ""),
    ticketOptionIds: formData.getAll("ticketOptionIds").map(String),
    termsAccepted: String(formData.get("termsAccepted") ?? ""),
    consentAccepted: String(formData.get("consentAccepted") ?? ""),
  };

  return publicRegistrationFormSchema.safeParse(raw);
}
