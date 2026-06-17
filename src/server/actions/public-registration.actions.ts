"use server";

import { redirect } from "next/navigation";

import { parsePublicRegistrationForm } from "@/lib/validation/public-registration.schema";
import {
  createPublicRegistration,
  DuplicateRegistrationError,
  RegistrationValidationError,
} from "@/server/services/public-registration.service";

export type PublicRegistrationActionState = {
  success?: boolean;
  error?:
    | "validation"
    | "duplicate"
    | "congressNotFound"
    | "ticketTypeInvalid"
    | "optionsInvalid"
    | "generic";
  fieldErrors?: Record<string, string>;
  duplicateReference?: string;
};

function mapValidationErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }
  return fieldErrors;
}

export async function submitPublicRegistrationAction(
  locale: string,
  _prevState: PublicRegistrationActionState,
  formData: FormData,
): Promise<PublicRegistrationActionState> {
  const parsed = parsePublicRegistrationForm(formData);
  if (!parsed.success) {
    return {
      error: "validation",
      fieldErrors: mapValidationErrors(parsed.error.issues),
    };
  }

  const typedLocale = locale === "en" ? "en" : "fr";

  try {
    const result = await createPublicRegistration(typedLocale, parsed.data);
    const params = new URLSearchParams({ ref: result.reference });
    redirect(`/${locale}/register/success?${params.toString()}`);
  } catch (error) {
    if (error instanceof DuplicateRegistrationError) {
      return {
        error: "duplicate",
        duplicateReference: error.reference,
      };
    }

    if (error instanceof RegistrationValidationError) {
      if (error.code === "congressNotFound") {
        return { error: "congressNotFound" };
      }
      if (error.code === "ticketTypeInvalid") {
        return { error: "ticketTypeInvalid" };
      }
      if (error.code === "optionsInvalid") {
        return { error: "optionsInvalid" };
      }
    }

  // redirect() throws — rethrow Next.js navigation errors
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      String((error as { digest?: string }).digest ?? "").startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    return { error: "generic" };
  }
}
