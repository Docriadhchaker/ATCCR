"use client";

import { useTranslations } from "next-intl";

import { formatPriceDisplay } from "@/lib/ticket-settings-form";
import type { TicketTypeWithOptions } from "@/server/repositories/ticket.repository";

type Props = {
  locale: string;
  ticketTypes: TicketTypeWithOptions[];
};

export function TicketSettingsTable({ locale, ticketTypes }: Props) {
  const t = useTranslations("TicketSettings");

  if (ticketTypes.length === 0) {
    return (
      <p className="rounded-lg border border-border bg-muted/50 px-4 py-6 text-center text-sm text-muted-foreground">
        {t("ticketTypesEmpty")}
      </p>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-muted/60">
            <tr>
              <th className="px-4 py-3 font-semibold text-foreground">{t("table.name")}</th>
              <th className="px-4 py-3 font-semibold text-foreground">{t("table.price")}</th>
              <th className="px-4 py-3 font-semibold text-foreground">{t("table.earlyBird")}</th>
              <th className="px-4 py-3 font-semibold text-foreground">{t("table.quota")}</th>
              <th className="px-4 py-3 font-semibold text-foreground">{t("table.options")}</th>
              <th className="px-4 py-3 font-semibold text-foreground">{t("table.status")}</th>
            </tr>
          </thead>
          <tbody>
            {ticketTypes.map((ticketType) => (
              <tr key={ticketType.id} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{ticketType.nameFr}</p>
                  <p className="text-xs text-muted-foreground">{ticketType.nameEn}</p>
                </td>
                <td className="px-4 py-3 text-foreground">
                  {formatPriceDisplay(ticketType.price, ticketType.currency, locale)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {ticketType.earlyBirdPrice
                    ? formatPriceDisplay(
                        ticketType.earlyBirdPrice,
                        ticketType.currency,
                        locale,
                      )
                    : t("notSet")}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {ticketType.quota ?? t("notSet")}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{ticketType.options.length}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      ticketType.active
                        ? "rounded-full bg-secondary/15 px-2 py-0.5 text-xs font-medium text-secondary"
                        : "rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                    }
                  >
                    {ticketType.active ? t("status.active") : t("status.inactive")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {ticketTypes.map((ticketType) => (
          <li
            key={ticketType.id}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-foreground">{ticketType.nameFr}</p>
                <p className="text-xs text-muted-foreground">{ticketType.nameEn}</p>
              </div>
              <span
                className={
                  ticketType.active
                    ? "rounded-full bg-secondary/15 px-2 py-0.5 text-xs font-medium text-secondary"
                    : "rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                }
              >
                {ticketType.active ? t("status.active") : t("status.inactive")}
              </span>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-muted-foreground">{t("table.price")}</dt>
                <dd className="font-medium text-foreground">
                  {formatPriceDisplay(ticketType.price, ticketType.currency, locale)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t("table.options")}</dt>
                <dd className="font-medium text-foreground">{ticketType.options.length}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
