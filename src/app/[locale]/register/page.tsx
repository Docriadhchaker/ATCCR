import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";

import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { RegistrationForm } from "@/components/public/registration-form";
import type { Locale } from "@/i18n/routing";
import { pickLocalizedText } from "@/lib/public-congress";
import { findPublicRegistrationFormData } from "@/server/repositories/public-registration.repository";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PublicRegistrationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("PublicRegistration");
  const typedLocale = locale as Locale;

  const data = await findPublicRegistrationFormData();
  if (!data) {
    notFound();
  }

  const congressName = pickLocalizedText(
    typedLocale,
    data.congressNameFr,
    data.congressNameEn,
  );

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader locale={locale} congressName={congressName} />

      <main id="main-content" className="flex-1 py-10 sm:py-14">
        <div className="mx-auto w-full max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
          <header className="space-y-3">
            <Link
              href={`/${locale}`}
              className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground outline-none transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              {t("backToLanding")}
            </Link>
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {t("pageTitle")}
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">{t("pageDescription")}</p>
            </div>
          </header>

          <aside
            className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground"
            role="note"
          >
            {t("futureStepsNotice")}
          </aside>

          <RegistrationForm
            locale={locale}
            congressName={congressName}
            ticketTypes={data.ticketTypes}
          />
        </div>
      </main>

      <PublicFooter locale={locale} congressName={congressName} />
    </div>
  );
}
