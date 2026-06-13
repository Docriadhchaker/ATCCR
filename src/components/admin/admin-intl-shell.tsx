"use client";

import { NextIntlClientProvider } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";

import { AdminShell } from "@/components/admin/admin-shell";

type Props = {
  locale: string;
  messages: AbstractIntlMessages;
  userEmail: string;
  children: React.ReactNode;
};

/**
 * Dedicated i18n boundary for admin client components.
 * Receives messages as serializable props from the server layout so
 * useTranslations("Admin") stays stable across Turbopack HMR reconnects.
 */
export function AdminIntlShell({ locale, messages, userEmail, children }: Props) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AdminShell locale={locale} userEmail={userEmail}>
        {children}
      </AdminShell>
    </NextIntlClientProvider>
  );
}
