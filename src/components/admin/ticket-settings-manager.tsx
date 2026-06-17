"use client";

import { useTranslations } from "next-intl";
import { Info } from "lucide-react";

import { toTicketTypeFormValues } from "@/lib/ticket-settings-form";
import type { TicketTypeWithOptions } from "@/server/repositories/ticket.repository";

import { TicketOptionsPanel } from "./ticket-option-form";
import { TicketSettingsTable } from "./ticket-settings-table";
import { TicketTypeFormSection } from "./ticket-type-form";

type Props = {
  locale: string;
  ticketTypes: TicketTypeWithOptions[];
};

export function TicketSettingsManager({ locale, ticketTypes }: Props) {
  const t = useTranslations("TicketSettings");

  return (
    <div className="space-y-6">
      <aside
        className="flex gap-3 rounded-xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground"
        role="note"
      >
        <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
        <p>{t("participantListComingSoon")}</p>
      </aside>

      <TicketTypeFormSection
        locale={locale}
        mode="create"
        title={t("createTicketType")}
        description={t("createTicketTypeDescription")}
        defaultValues={toTicketTypeFormValues()}
      />

      <section className="space-y-3">
        <header className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">{t("ticketTypes")}</h2>
          <p className="text-sm text-muted-foreground">{t("ticketTypesDescription")}</p>
        </header>
        <TicketSettingsTable locale={locale} ticketTypes={ticketTypes} />
      </section>

      {ticketTypes.map((ticketType) => (
        <article key={ticketType.id} className="space-y-4">
          <TicketTypeFormSection
            locale={locale}
            mode="edit"
            title={t("editTicketType", { name: ticketType.nameFr })}
            description={t("editTicketTypeDescription")}
            defaultValues={toTicketTypeFormValues(ticketType)}
          />
          <TicketOptionsPanel
            locale={locale}
            ticketTypeId={ticketType.id}
            options={ticketType.options}
          />
        </article>
      ))}

      {ticketTypes.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noDeleteNote")}</p>
      ) : null}
    </div>
  );
}
