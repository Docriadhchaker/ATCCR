"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { CalendarDays, Palette, Save, Sparkles } from "lucide-react";

import type { CongressSettingsFormValues } from "@/lib/congress-settings-form";
import {
  updateCongressSettingsAction,
  type CongressSettingsActionState,
} from "@/server/actions/congress-settings.actions";

type Props = {
  locale: string;
  defaultValues: CongressSettingsFormValues;
};

const initialState: CongressSettingsActionState = {};

const inputClassName =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring";

const textareaClassName =
  "min-h-[96px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
};

function FormField({ id, label, error, children, hint }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type SectionProps = {
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
};

function FormSection({ title, description, icon: Icon, children }: SectionProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <header className="mb-5 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

export function CongressSettingsForm({ locale, defaultValues }: Props) {
  const t = useTranslations("CongressSettings");
  const boundAction = updateCongressSettingsAction.bind(null, locale);
  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  const fieldError = (field: string) => {
    const code = state.fieldErrors?.[field];
    if (!code) {
      return undefined;
    }
    if (code === "required" || code === "invalidDate" || code === "invalidColor") {
      return t(`errors.${code}`);
    }
    if (code === "endDateBeforeStart" || code === "closesBeforeOpens") {
      return t(`errors.${code}`);
    }
    return t("errors.validation");
  };

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state.success ? (
        <p
          className="rounded-lg border border-secondary/30 bg-accent px-4 py-3 text-sm text-accent-foreground"
          role="status"
        >
          {t("saveSuccess")}
        </p>
      ) : null}

      {state.error && state.error !== "validation" ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
          {t(`errors.${state.error}`)}
        </p>
      ) : null}

      <FormSection
        title={t("sections.general")}
        description={t("sections.generalDescription")}
        icon={CalendarDays}
      >
        <FormField id="slug" label={t("fields.slug")} hint={t("slugReadOnlyHelper")}>
          <input
            id="slug"
            name="slug"
            type="text"
            readOnly
            value={defaultValues.slug}
            className={`${inputClassName} cursor-not-allowed bg-muted text-muted-foreground`}
          />
        </FormField>

        <FormField id="status" label={t("fields.status")} error={fieldError("status")}>
          <select id="status" name="status" defaultValue={defaultValues.status} className={inputClassName}>
            <option value="draft">{t("status.draft")}</option>
            <option value="published">{t("status.published")}</option>
            <option value="archived">{t("status.archived")}</option>
          </select>
        </FormField>

        <FormField id="nameFr" label={t("fields.nameFr")} error={fieldError("nameFr")}>
          <input
            id="nameFr"
            name="nameFr"
            type="text"
            required
            defaultValue={defaultValues.nameFr}
            className={inputClassName}
          />
        </FormField>

        <FormField id="nameEn" label={t("fields.nameEn")} error={fieldError("nameEn")}>
          <input
            id="nameEn"
            name="nameEn"
            type="text"
            required
            defaultValue={defaultValues.nameEn}
            className={inputClassName}
          />
        </FormField>

        <FormField id="startDate" label={t("fields.startDate")} error={fieldError("startDate")}>
          <input
            id="startDate"
            name="startDate"
            type="date"
            required
            defaultValue={defaultValues.startDate}
            className={inputClassName}
          />
        </FormField>

        <FormField id="endDate" label={t("fields.endDate")} error={fieldError("endDate")}>
          <input
            id="endDate"
            name="endDate"
            type="date"
            required
            defaultValue={defaultValues.endDate}
            className={inputClassName}
          />
        </FormField>

        <FormField id="format" label={t("fields.format")} error={fieldError("format")}>
          <select id="format" name="format" defaultValue={defaultValues.format} className={inputClassName}>
            <option value="onsite">{t("format.onsite")}</option>
            <option value="hybrid">{t("format.hybrid")}</option>
            <option value="online">{t("format.online")}</option>
          </select>
        </FormField>

        <FormField id="venue" label={t("fields.venue")} error={fieldError("venue")}>
          <input
            id="venue"
            name="venue"
            type="text"
            required
            defaultValue={defaultValues.venue}
            className={inputClassName}
          />
        </FormField>

        <FormField id="city" label={t("fields.city")} error={fieldError("city")}>
          <input
            id="city"
            name="city"
            type="text"
            required
            defaultValue={defaultValues.city}
            className={inputClassName}
          />
        </FormField>

        <FormField id="country" label={t("fields.country")} error={fieldError("country")}>
          <input
            id="country"
            name="country"
            type="text"
            required
            defaultValue={defaultValues.country}
            className={inputClassName}
          />
        </FormField>
      </FormSection>

      <FormSection
        title={t("sections.hero")}
        description={t("sections.heroDescription")}
        icon={Sparkles}
      >
        <FormField id="heroTitleFr" label={t("fields.heroTitleFr")}>
          <input
            id="heroTitleFr"
            name="heroTitleFr"
            type="text"
            defaultValue={defaultValues.heroTitleFr}
            className={inputClassName}
          />
        </FormField>

        <FormField id="heroTitleEn" label={t("fields.heroTitleEn")}>
          <input
            id="heroTitleEn"
            name="heroTitleEn"
            type="text"
            defaultValue={defaultValues.heroTitleEn}
            className={inputClassName}
          />
        </FormField>

        <FormField id="heroSubtitleFr" label={t("fields.heroSubtitleFr")}>
          <input
            id="heroSubtitleFr"
            name="heroSubtitleFr"
            type="text"
            defaultValue={defaultValues.heroSubtitleFr}
            className={inputClassName}
          />
        </FormField>

        <FormField id="heroSubtitleEn" label={t("fields.heroSubtitleEn")}>
          <input
            id="heroSubtitleEn"
            name="heroSubtitleEn"
            type="text"
            defaultValue={defaultValues.heroSubtitleEn}
            className={inputClassName}
          />
        </FormField>

        <div className="md:col-span-2">
          <FormField id="heroDescriptionFr" label={t("fields.heroDescriptionFr")}>
            <textarea
              id="heroDescriptionFr"
              name="heroDescriptionFr"
              defaultValue={defaultValues.heroDescriptionFr}
              className={textareaClassName}
            />
          </FormField>
        </div>

        <div className="md:col-span-2">
          <FormField id="heroDescriptionEn" label={t("fields.heroDescriptionEn")}>
            <textarea
              id="heroDescriptionEn"
              name="heroDescriptionEn"
              defaultValue={defaultValues.heroDescriptionEn}
              className={textareaClassName}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title={t("sections.schedule")}
        description={t("sections.scheduleDescription")}
        icon={CalendarDays}
      >
        <FormField
          id="registrationOpensAt"
          label={t("fields.registrationOpensAt")}
          error={fieldError("registrationOpensAt")}
        >
          <input
            id="registrationOpensAt"
            name="registrationOpensAt"
            type="datetime-local"
            defaultValue={defaultValues.registrationOpensAt}
            className={inputClassName}
          />
        </FormField>

        <FormField
          id="registrationClosesAt"
          label={t("fields.registrationClosesAt")}
          error={fieldError("registrationClosesAt")}
        >
          <input
            id="registrationClosesAt"
            name="registrationClosesAt"
            type="datetime-local"
            defaultValue={defaultValues.registrationClosesAt}
            className={inputClassName}
          />
        </FormField>

        <FormField id="earlyBirdDeadline" label={t("fields.earlyBirdDeadline")}>
          <input
            id="earlyBirdDeadline"
            name="earlyBirdDeadline"
            type="datetime-local"
            defaultValue={defaultValues.earlyBirdDeadline}
            className={inputClassName}
          />
        </FormField>

        <FormField
          id="submissionOpensAt"
          label={t("fields.submissionOpensAt")}
          error={fieldError("submissionOpensAt")}
        >
          <input
            id="submissionOpensAt"
            name="submissionOpensAt"
            type="datetime-local"
            defaultValue={defaultValues.submissionOpensAt}
            className={inputClassName}
          />
        </FormField>

        <FormField
          id="submissionClosesAt"
          label={t("fields.submissionClosesAt")}
          error={fieldError("submissionClosesAt")}
        >
          <input
            id="submissionClosesAt"
            name="submissionClosesAt"
            type="datetime-local"
            defaultValue={defaultValues.submissionClosesAt}
            className={inputClassName}
          />
        </FormField>

        <FormField id="certificateAvailableAt" label={t("fields.certificateAvailableAt")}>
          <input
            id="certificateAvailableAt"
            name="certificateAvailableAt"
            type="datetime-local"
            defaultValue={defaultValues.certificateAvailableAt}
            className={inputClassName}
          />
        </FormField>
      </FormSection>

      <FormSection
        title={t("sections.branding")}
        description={t("sections.brandingDescription")}
        icon={Palette}
      >
        <FormField id="primaryColor" label={t("fields.primaryColor")} error={fieldError("primaryColor")}>
          <input
            id="primaryColor"
            name="primaryColor"
            type="text"
            required
            defaultValue={defaultValues.primaryColor}
            className={inputClassName}
            pattern="#[0-9A-Fa-f]{6}"
          />
        </FormField>

        <FormField id="secondaryColor" label={t("fields.secondaryColor")} error={fieldError("secondaryColor")}>
          <input
            id="secondaryColor"
            name="secondaryColor"
            type="text"
            required
            defaultValue={defaultValues.secondaryColor}
            className={inputClassName}
            pattern="#[0-9A-Fa-f]{6}"
          />
        </FormField>
      </FormSection>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">{t("saveHint")}</p>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground outline-none transition-colors duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save aria-hidden="true" className="h-4 w-4" />
          {isPending ? t("saving") : t("save")}
        </button>
      </div>
    </form>
  );
}
