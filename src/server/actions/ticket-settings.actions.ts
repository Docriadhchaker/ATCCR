"use server";

import { revalidatePath } from "next/cache";

import {
  parseTicketOptionForm,
  parseTicketTypeForm,
} from "@/lib/validation/ticket-settings.schema";
import { findDemoCongressTicketSettings } from "@/server/repositories/ticket.repository";
import { AuthPolicyError, requirePermission } from "@/server/policies/auth.policy";
import {
  upsertTicketOption,
  upsertTicketType,
} from "@/server/services/ticket-settings.service";

export type TicketSettingsActionState = {
  success?: boolean;
  error?: "forbidden" | "notFound" | "validation" | "generic";
  fieldErrors?: Record<string, string>;
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

async function getDemoCongressId(): Promise<string | null> {
  const data = await findDemoCongressTicketSettings();
  if (!data) {
    return null;
  }
  return data.congressId;
}

export async function saveTicketTypeAction(
  locale: string,
  _prevState: TicketSettingsActionState,
  formData: FormData,
): Promise<TicketSettingsActionState> {
  try {
    await requirePermission("registrations.manage");
  } catch (error) {
    if (error instanceof AuthPolicyError) {
      return { error: "forbidden" };
    }
    return { error: "generic" };
  }

  const congressId = await getDemoCongressId();
  if (!congressId) {
    return { error: "notFound" };
  }

  const parsed = parseTicketTypeForm(formData);
  if (!parsed.success) {
    return {
      error: "validation",
      fieldErrors: mapValidationErrors(parsed.error.issues),
    };
  }

  try {
    await upsertTicketType(congressId, parsed.data);
    revalidatePath(`/${locale}/admin/registrations`);
    return { success: true };
  } catch {
    return { error: "generic" };
  }
}

export async function saveTicketOptionAction(
  locale: string,
  _prevState: TicketSettingsActionState,
  formData: FormData,
): Promise<TicketSettingsActionState> {
  try {
    await requirePermission("registrations.manage");
  } catch (error) {
    if (error instanceof AuthPolicyError) {
      return { error: "forbidden" };
    }
    return { error: "generic" };
  }

  const data = await findDemoCongressTicketSettings();
  if (!data) {
    return { error: "notFound" };
  }

  const parsed = parseTicketOptionForm(formData);
  if (!parsed.success) {
    return {
      error: "validation",
      fieldErrors: mapValidationErrors(parsed.error.issues),
    };
  }

  const ticketType = data.ticketTypes.find((type) => type.id === parsed.data.ticketTypeId);
  if (!ticketType) {
    return { error: "notFound" };
  }

  try {
    await upsertTicketOption(parsed.data);
    revalidatePath(`/${locale}/admin/registrations`);
    return { success: true };
  } catch {
    return { error: "generic" };
  }
}
