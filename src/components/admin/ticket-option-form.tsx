"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Save, SlidersHorizontal } from "lucide-react";

import type { TicketOptionFormValues } from "@/lib/ticket-settings-form";
import {
  saveTicketOptionAction,
  type TicketSettingsActionState,
} from "@/server/actions/ticket-settings.actions";

import { AdminFormField, adminInputClassName } from "./admin-form-primitives";

type Props = {
  locale: string;
  defaultValues: TicketOptionFormValues;
  mode: "create" | "edit";
};

const initialState: TicketSettingsActionState = {};

export function TicketOptionForm({ locale, defaultValues, mode }: Props) {
  const t = useTranslations("TicketSettings");
  const boundAction = saveTicketOptionAction.bind(null, locale);
  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  const fieldError = (field: string) => {
    const code = state.fieldErrors?.[field];
    if (!code) {
      return undefined;
    }
    if (code === "required" || code === "invalidPrice") {
      return t(`errors.${code}`);
    }
    return t("errors.validation");
  };

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="ticketTypeId" value={defaultValues.ticketTypeId} />
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
        <AdminFormField
          id={`${mode}-${defaultValues.ticketTypeId}-option-nameFr`}
          label={t("fields.optionNameFr")}
          error={fieldError("nameFr")}
        >
          <input
            id={`${mode}-${defaultValues.ticketTypeId}-option-nameFr`}
            name="nameFr"
            defaultValue={defaultValues.nameFr}
            className={adminInputClassName}
            required
          />
        </AdminFormField>

        <AdminFormField
          id={`${mode}-${defaultValues.ticketTypeId}-option-nameEn`}
          label={t("fields.optionNameEn")}
          error={fieldError("nameEn")}
        >
          <input
            id={`${mode}-${defaultValues.ticketTypeId}-option-nameEn`}
            name="nameEn"
            defaultValue={defaultValues.nameEn}
            className={adminInputClassName}
            required
          />
        </AdminFormField>

        <AdminFormField
          id={`${mode}-${defaultValues.ticketTypeId}-option-price`}
          label={t("fields.optionPrice")}
          error={fieldError("price")}
        >
          <input
            id={`${mode}-${defaultValues.ticketTypeId}-option-price`}
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={defaultValues.price}
            className={adminInputClassName}
            required
          />
        </AdminFormField>

        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
            <input
              type="checkbox"
              name="included"
              value="on"
              defaultChecked={defaultValues.included}
              className="h-4 w-4 rounded border-input text-secondary focus-visible:ring-2 focus-visible:ring-ring"
            />
            {t("fields.included")}
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground outline-none transition-colors duration-200 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mode === "create" ? (
          <Plus aria-hidden="true" className="h-4 w-4" />
        ) : (
          <Save aria-hidden="true" className="h-4 w-4" />
        )}
        {mode === "create" ? t("createOption") : t("save")}
      </button>
    </form>
  );
}

type PanelProps = {
  locale: string;
  ticketTypeId: string;
  options: Array<{
    id: string;
    nameFr: string;
    nameEn: string;
    price: { toString(): string };
    included: boolean;
  }>;
};

export function TicketOptionsPanel({ locale, ticketTypeId, options }: PanelProps) {
  const t = useTranslations("TicketSettings");

  return (
    <section className="space-y-4 rounded-lg border border-border bg-muted/40 p-4">
      <header className="flex items-center gap-2">
        <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-secondary" />
        <h3 className="text-sm font-semibold text-foreground">{t("registrationOptions")}</h3>
      </header>

      {options.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("optionsEmpty")}</p>
      ) : (
        <ul className="space-y-3">
          {options.map((option) => (
            <li
              key={option.id}
              className="rounded-lg border border-border bg-card p-4 shadow-sm"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{option.nameFr}</p>
                  <p className="text-xs text-muted-foreground">{option.nameEn}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                    {option.price.toString()} {t("priceSuffix")}
                  </span>
                  {option.included ? (
                    <span className="rounded-full bg-secondary/15 px-2 py-0.5 text-xs font-medium text-secondary">
                      {t("includedBadge")}
                    </span>
                  ) : null}
                </div>
              </div>
              <TicketOptionForm
                locale={locale}
                mode="edit"
                defaultValues={{
                  id: option.id,
                  ticketTypeId,
                  nameFr: option.nameFr,
                  nameEn: option.nameEn,
                  price: option.price.toString(),
                  included: option.included,
                }}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="rounded-lg border border-dashed border-border bg-background p-4">
        <h4 className="mb-3 text-sm font-medium text-foreground">{t("addOption")}</h4>
        <TicketOptionForm
          locale={locale}
          mode="create"
          defaultValues={{
            ticketTypeId,
            nameFr: "",
            nameEn: "",
            price: "",
            included: false,
          }}
        />
      </div>

      <p className="text-xs text-muted-foreground">{t("noDeleteNote")}</p>
    </section>
  );
}
