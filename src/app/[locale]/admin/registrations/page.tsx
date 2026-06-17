import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";

import { TicketSettingsManager } from "@/components/admin/ticket-settings-manager";
import { AuthPolicyError, requirePermission } from "@/server/policies/auth.policy";
import { findDemoCongressTicketSettings } from "@/server/repositories/ticket.repository";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TicketSettingsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("TicketSettings");

  try {
    await requirePermission("registrations.list");
  } catch (error) {
    if (error instanceof AuthPolicyError && error.code === "FORBIDDEN") {
      redirect(`/${locale}/access-denied`);
    }
    throw error;
  }

  const data = await findDemoCongressTicketSettings();
  if (!data) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header className="space-y-3">
        <Link
          href={`/${locale}/admin`}
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground outline-none transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          {t("backToDashboard")}
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {t("pageTitle")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("pageDescription")}</p>
        </div>
      </header>

      <TicketSettingsManager locale={locale} ticketTypes={data.ticketTypes} />
    </div>
  );
}
