"use server";

import { revalidatePath } from "next/cache";

import { parseCongressSettingsForm } from "@/lib/validation/congress-settings.schema";
import {
  DEMO_CONGRESS_SLUG,
  findDemoCongressWithSettings,
} from "@/server/repositories/congress.repository";
import { AuthPolicyError, requirePermission } from "@/server/policies/auth.policy";
import { updateCongressSettings } from "@/server/services/congress-settings.service";

export type CongressSettingsActionState = {
  success?: boolean;
  error?: "forbidden" | "notFound" | "validation" | "generic";
  fieldErrors?: Record<string, string>;
};

export async function updateCongressSettingsAction(
  locale: string,
  _prevState: CongressSettingsActionState,
  formData: FormData,
): Promise<CongressSettingsActionState> {
  try {
    await requirePermission("congress.settings.manage");
  } catch (error) {
    if (error instanceof AuthPolicyError) {
      return { error: "forbidden" };
    }
    return { error: "generic" };
  }

  const congress = await findDemoCongressWithSettings();
  if (!congress || congress.slug !== DEMO_CONGRESS_SLUG) {
    return { error: "notFound" };
  }

  const parsed = parseCongressSettingsForm(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return { error: "validation", fieldErrors };
  }

  try {
    await updateCongressSettings(congress.id, parsed.data);
    revalidatePath(`/${locale}/admin/congress`);
    return { success: true };
  } catch {
    return { error: "generic" };
  }
}
