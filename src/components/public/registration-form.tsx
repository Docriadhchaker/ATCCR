"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { ClipboardList, Ticket, User } from "lucide-react";

import {
  formatRegistrationAmount,
  pickTicketTypeLabel,
} from "@/lib/public-registration";
import type { PublicRegistrationTicketType } from "@/server/repositories/public-registration.repository";
import {
  submitPublicRegistrationAction,
  type PublicRegistrationActionState,
} from "@/server/actions/public-registration.actions";

type Props = {
  locale: string;
  congressName: string;
  ticketTypes: PublicRegistrationTicketType[];
};

const initialState: PublicRegistrationActionState = {};

const inputClassName =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring";

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

export function RegistrationForm({ locale, congressName, ticketTypes }: Props) {
  const t = useTranslations("PublicRegistration");
  const boundAction = submitPublicRegistrationAction.bind(null, locale);
  const [state, formAction, isPending] = useActionState(boundAction, initialState);
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState(
    ticketTypes[0]?.id ?? "",
  );

  const selectedTicketType = useMemo(
    () => ticketTypes.find((type) => type.id === selectedTicketTypeId) ?? null,
    [ticketTypes, selectedTicketTypeId],
  );

  const fieldError = (field: string) => {
    const code = state.fieldErrors?.[field];
    if (!code) {
      return undefined;
    }
    if (
      code === "required" ||
      code === "invalidEmail" ||
      code === "termsRequired" ||
      code === "consentRequired"
    ) {
      return t(`errors.${code}`);
    }
    return t("errors.validation");
  };

  const ticketPrice = selectedTicketType ? Number(selectedTicketType.price.toString()) : 0;
  const totalLabel =
    ticketPrice === 0
      ? t("totalFree")
      : t("totalAmount", {
          amount: formatRegistrationAmount(
            ticketPrice,
            selectedTicketType?.currency ?? "TND",
            locale,
          ),
        });

  if (ticketTypes.length === 0) {
    return (
      <p className="rounded-lg border border-border bg-muted/50 px-4 py-6 text-center text-sm text-muted-foreground">
        {t("noTicketTypes")}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state.error === "duplicate" ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
          {t("errors.duplicate", {
            reference: state.duplicateReference ?? "",
          })}
        </p>
      ) : null}

      {state.error &&
      state.error !== "validation" &&
      state.error !== "duplicate" ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
          {t(`errors.${state.error}`)}
        </p>
      ) : null}

      <FormSection
        title={t("sections.participant")}
        description={t("sections.participantDescription")}
        icon={User}
      >
        <FormField id="email" label={t("fields.email")} error={fieldError("email")}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={inputClassName}
            required
          />
        </FormField>

        <FormField id="fullName" label={t("fields.fullName")} error={fieldError("fullName")}>
          <input id="fullName" name="fullName" type="text" autoComplete="name" className={inputClassName} required />
        </FormField>

        <FormField id="specialty" label={t("fields.specialty")} error={fieldError("specialty")}>
          <input id="specialty" name="specialty" type="text" className={inputClassName} required />
        </FormField>

        <FormField
          id="institution"
          label={t("fields.institution")}
          error={fieldError("institution")}
        >
          <input id="institution" name="institution" type="text" className={inputClassName} required />
        </FormField>

        <div className="md:col-span-2">
          <FormField id="phone" label={t("fields.phone")} error={fieldError("phone")}>
            <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClassName} required />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title={t("sections.ticket")}
        description={t("sections.ticketDescription", { congress: congressName })}
        icon={Ticket}
      >
        <div className="md:col-span-2 space-y-4">
          <FormField
            id="ticketTypeId"
            label={t("fields.ticketCategory")}
            error={fieldError("ticketTypeId")}
          >
            <select
              id="ticketTypeId"
              name="ticketTypeId"
              value={selectedTicketTypeId}
              onChange={(event) => setSelectedTicketTypeId(event.target.value)}
              className={inputClassName}
              required
            >
              {ticketTypes.map((type) => {
                const label = pickTicketTypeLabel(locale, type.nameFr, type.nameEn);
                const price = Number(type.price.toString());
                const priceLabel =
                  price === 0
                    ? t("free")
                    : formatRegistrationAmount(price, type.currency, locale);
                return (
                  <option key={type.id} value={type.id}>
                    {label} — {priceLabel}
                  </option>
                );
              })}
            </select>
          </FormField>

          {selectedTicketType?.descriptionFr || selectedTicketType?.descriptionEn ? (
            <p className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              {locale === "en" && selectedTicketType.descriptionEn
                ? selectedTicketType.descriptionEn
                : selectedTicketType.descriptionFr}
            </p>
          ) : null}

          <p className="text-sm font-medium text-foreground">{totalLabel}</p>
        </div>
      </FormSection>

      {selectedTicketType && selectedTicketType.options.length > 0 ? (
        <FormSection
          title={t("sections.options")}
          description={t("sections.optionsDescription")}
          icon={ClipboardList}
        >
          <div className="md:col-span-2 space-y-3">
            <fieldset>
              <legend className="sr-only">{t("fields.options")}</legend>
              <ul className="space-y-2">
                {selectedTicketType.options.map((option) => {
                  const label = pickTicketTypeLabel(locale, option.nameFr, option.nameEn);
                  return (
                    <li key={option.id}>
                      <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border px-3 py-3 transition-colors duration-200 hover:bg-muted">
                        <input
                          type="checkbox"
                          name="ticketOptionIds"
                          value={option.id}
                          className="mt-1 h-4 w-4 rounded border-input text-secondary focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        <span className="text-sm text-foreground">{label}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
            <p className="text-xs text-muted-foreground">{t("optionsAgencyNote")}</p>
          </div>
        </FormSection>
      ) : null}

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="space-y-4">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
            <input
              type="checkbox"
              name="termsAccepted"
              value="on"
              required
              className="mt-1 h-4 w-4 rounded border-input text-secondary focus-visible:ring-2 focus-visible:ring-ring"
            />
            <span>{t("fields.terms")}</span>
          </label>
          {fieldError("termsAccepted") ? (
            <p className="text-sm text-destructive" role="alert">
              {fieldError("termsAccepted")}
            </p>
          ) : null}

          <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
            <input
              type="checkbox"
              name="consentAccepted"
              value="on"
              required
              className="mt-1 h-4 w-4 rounded border-input text-secondary focus-visible:ring-2 focus-visible:ring-ring"
            />
            <span>{t("fields.consent")}</span>
          </label>
          {fieldError("consentAccepted") ? (
            <p className="text-sm text-destructive" role="alert">
              {fieldError("consentAccepted")}
            </p>
          ) : null}
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={`/${locale}`}
          className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground outline-none transition-colors duration-200 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {t("backToLanding")}
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground outline-none transition-colors duration-200 hover:bg-secondary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? t("submitting") : t("submit")}
        </button>
      </div>
    </form>
  );
}
