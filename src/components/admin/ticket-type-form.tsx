"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Save, Ticket } from "lucide-react";

import type { TicketTypeFormValues } from "@/lib/ticket-settings-form";
import { PARTICIPANT_CATEGORY_VALUES } from "@/lib/validation/ticket-settings.schema";
import {
  saveTicketTypeAction,
  type TicketSettingsActionState,
} from "@/server/actions/ticket-settings.actions";

import { AdminFormField, AdminFormSection, adminInputClassName, adminTextareaClassName } from "./admin-form-primitives";

type Props = {
  locale: string;
  defaultValues: TicketTypeFormValues;
  mode: "create" | "edit";
};

const initialState: TicketSettingsActionState = {};

export function TicketTypeForm({ locale, defaultValues, mode }: Props) {
  const t = useTranslations("TicketSettings");
  const boundAction = saveTicketTypeAction.bind(null, locale);
  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  const fieldError = (field: string) => {
    const code = state.fieldErrors?.[field];
    if (!code) {
      return undefined;
    }
    if (
      code === "required" ||
      code === "invalidPrice" ||
      code === "eligibleCategoriesRequired"
    ) {
      return t(`errors.${code}`);
    }
    return t("errors.validation");
  };

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {defaultValues.id ? <input type="hidden" name="id" value={defaultValues.id} /> : null}

      {state.success ? (
        <p
          className="rounded-lg border border-secondary/30 bg-accent px-4 py-3 text-sm text-accent-foreground"
          role="status"
        >
          {t("saveSuccess")}
        </p>
      ) : null}

      {state.error && state.error !== "validation" ? (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {t(`errors.${state.error}`)}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AdminFormField id={`${mode}-nameFr`} label={t("fields.nameFr")} error={fieldError("nameFr")}>
          <input
            id={`${mode}-nameFr`}
            name="nameFr"
            defaultValue={defaultValues.nameFr}
            className={adminInputClassName}
            required
          />
        </AdminFormField>

        <AdminFormField id={`${mode}-nameEn`} label={t("fields.nameEn")} error={fieldError("nameEn")}>
          <input
            id={`${mode}-nameEn`}
            name="nameEn"
            defaultValue={defaultValues.nameEn}
            className={adminInputClassName}
            required
          />
        </AdminFormField>

        <AdminFormField id={`${mode}-descriptionFr`} label={t("fields.descriptionFr")}>
          <textarea
            id={`${mode}-descriptionFr`}
            name="descriptionFr"
            defaultValue={defaultValues.descriptionFr}
            className={adminTextareaClassName}
          />
        </AdminFormField>

        <AdminFormField id={`${mode}-descriptionEn`} label={t("fields.descriptionEn")}>
          <textarea
            id={`${mode}-descriptionEn`}
            name="descriptionEn"
            defaultValue={defaultValues.descriptionEn}
            className={adminTextareaClassName}
          />
        </AdminFormField>

        <AdminFormField
          id={`${mode}-currency`}
          label={t("fields.currency")}
          error={fieldError("currency")}
        >
          <select
            id={`${mode}-currency`}
            name="currency"
            defaultValue={defaultValues.currency}
            className={adminInputClassName}
          >
            <option value="TND">{t("currency.TND")}</option>
            <option value="EUR">{t("currency.EUR")}</option>
          </select>
        </AdminFormField>

        <AdminFormField id={`${mode}-price`} label={t("fields.price")} error={fieldError("price")}>
          <input
            id={`${mode}-price`}
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={defaultValues.price}
            className={adminInputClassName}
            required
          />
        </AdminFormField>

        <AdminFormField
          id={`${mode}-earlyBirdPrice`}
          label={t("fields.earlyBirdPrice")}
          error={fieldError("earlyBirdPrice")}
        >
          <input
            id={`${mode}-earlyBirdPrice`}
            name="earlyBirdPrice"
            type="number"
            min="0"
            step="0.01"
            defaultValue={defaultValues.earlyBirdPrice}
            className={adminInputClassName}
          />
        </AdminFormField>

        <AdminFormField
          id={`${mode}-earlyBirdDeadline`}
          label={t("fields.earlyBirdDeadline")}
          error={fieldError("earlyBirdDeadline")}
        >
          <input
            id={`${mode}-earlyBirdDeadline`}
            name="earlyBirdDeadline"
            type="datetime-local"
            defaultValue={defaultValues.earlyBirdDeadline}
            className={adminInputClassName}
          />
        </AdminFormField>

        <AdminFormField
          id={`${mode}-onSitePrice`}
          label={t("fields.onSitePrice")}
          error={fieldError("onSitePrice")}
        >
          <input
            id={`${mode}-onSitePrice`}
            name="onSitePrice"
            type="number"
            min="0"
            step="0.01"
            defaultValue={defaultValues.onSitePrice}
            className={adminInputClassName}
          />
        </AdminFormField>

        <AdminFormField id={`${mode}-quota`} label={t("fields.quota")} error={fieldError("quota")}>
          <input
            id={`${mode}-quota`}
            name="quota"
            type="number"
            min="0"
            step="1"
            defaultValue={defaultValues.quota}
            className={adminInputClassName}
          />
        </AdminFormField>
      </div>

      <AdminFormField
        id={`${mode}-eligibleCategories`}
        label={t("fields.eligibleCategories")}
        hint={t("fields.eligibleCategoriesHint")}
        error={fieldError("eligibleCategories")}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PARTICIPANT_CATEGORY_VALUES.map((category) => (
            <label
              key={category}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors duration-200 hover:bg-muted"
            >
              <input
                type="checkbox"
                name="eligibleCategories"
                value={category}
                defaultChecked={defaultValues.eligibleCategories.includes(category)}
                className="h-4 w-4 rounded border-input text-secondary focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span>{t(`participantCategory.${category}`)}</span>
            </label>
          ))}
        </div>
      </AdminFormField>

      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
        <input
          type="checkbox"
          name="active"
          value="on"
          defaultChecked={defaultValues.active}
          className="h-4 w-4 rounded border-input text-secondary focus-visible:ring-2 focus-visible:ring-ring"
        />
        {t("fields.active")}
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground outline-none transition-colors duration-200 hover:bg-secondary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mode === "create" ? (
            <Plus aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Save aria-hidden="true" className="h-4 w-4" />
          )}
          {mode === "create" ? t("createTicketType") : t("save")}
        </button>
      </div>
    </form>
  );
}

export function TicketTypeFormSection({
  locale,
  defaultValues,
  mode,
  title,
  description,
}: Props & { title: string; description?: string }) {
  return (
    <AdminFormSection title={title} description={description} icon={Ticket}>
      <div className="md:col-span-2">
        <TicketTypeForm locale={locale} defaultValues={defaultValues} mode={mode} />
      </div>
    </AdminFormSection>
  );
}
