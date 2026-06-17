import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CheckCircle2 } from "lucide-react";

import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import type { Locale } from "@/i18n/routing";
import { pickLocalizedText } from "@/lib/public-congress";
import { findPublicRegistrationFormData } from "@/server/repositories/public-registration.repository";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ref?: string; proof?: string }>;
};

export default async function PublicRegistrationSuccessPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { ref, proof } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("PublicRegistration");
  const typedLocale = locale as Locale;

  if (!ref?.trim()) {
    notFound();
  }

  const data = await findPublicRegistrationFormData();
  if (!data) {
    notFound();
  }

  const congressName = pickLocalizedText(
    typedLocale,
    data.congressNameFr,
    data.congressNameEn,
  );
  const requiresProofLater = proof === "1";

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader locale={locale} congressName={congressName} />

      <main id="main-content" className="flex-1 py-10 sm:py-14">
        <div className="mx-auto w-full max-w-2xl space-y-6 px-4 sm:px-6 lg:px-8">
          <section className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-secondary">
                <CheckCircle2 aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  {t("success.title")}
                </h1>
                <p className="text-sm text-muted-foreground">{t("success.description")}</p>
              </div>
            </div>

            <dl className="mt-8 space-y-4 rounded-lg border border-border bg-muted/40 p-4">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("success.referenceLabel")}
                </dt>
                <dd className="mt-1 font-mono text-lg font-semibold text-foreground">{ref}</dd>
              </div>
            </dl>

            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
              <p>{t("success.nextSteps")}</p>
              <p>{t("success.paymentLater")}</p>
              {requiresProofLater ? <p>{t("success.proofLater")}</p> : null}
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                href={`/${locale}`}
                className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground outline-none transition-colors duration-200 hover:bg-secondary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {t("backToLanding")}
              </Link>
            </div>
          </section>
        </div>
      </main>

      <PublicFooter locale={locale} congressName={congressName} />
    </div>
  );
}
