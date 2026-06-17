import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  CalendarDays,
  Globe,
  MapPin,
  Mic2,
  Presentation,
  Sparkles,
  Users,
} from "lucide-react";

import { InfoCard } from "@/components/public/info-card";
import { LandingCta } from "@/components/public/landing-cta";
import { LandingHero } from "@/components/public/landing-hero";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { SectionHeading } from "@/components/public/section-heading";
import type { Locale } from "@/i18n/routing";
import {
  formatCongressDateRange,
  formatLocation,
  formatSessionTime,
  pickLocalizedText,
  pickOptionalLocalizedText,
} from "@/lib/public-congress";
import { findPublicCongressLandingData } from "@/server/repositories/public-congress.repository";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PublicLandingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("PublicLanding");
  const typedLocale = locale as Locale;

  const congress = await findPublicCongressLandingData();
  if (!congress) {
    notFound();
  }

  const settings = congress.settings;
  const congressName = pickLocalizedText(typedLocale, congress.nameFr, congress.nameEn);
  const heroTitle =
    pickOptionalLocalizedText(typedLocale, settings?.heroTitleFr, settings?.heroTitleEn) ??
    congressName;
  const heroSubtitle =
    pickOptionalLocalizedText(typedLocale, settings?.heroSubtitleFr, settings?.heroSubtitleEn) ??
    t("hero.defaultSubtitle");
  const heroDescription = pickOptionalLocalizedText(
    typedLocale,
    settings?.heroDescriptionFr,
    settings?.heroDescriptionEn,
  );
  const aboutText =
    heroDescription ??
    pickOptionalLocalizedText(typedLocale, settings?.heroSubtitleFr, settings?.heroSubtitleEn) ??
    t("about.fallback");

  const dateRange = formatCongressDateRange(congress.startDate, congress.endDate, typedLocale);
  const locationLine = formatLocation(congress.city, congress.country);
  const venueLine = `${congress.venue}, ${locationLine}`;

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader locale={locale} congressName={congressName} />

      <main id="main-content">
        <LandingHero
          title={heroTitle}
          subtitle={heroSubtitle}
          description={heroDescription}
          dateRange={dateRange}
          location={venueLine}
          registerLabel={t("hero.register")}
          registerHref={`/${locale}/register`}
          programLabel={t("hero.viewProgram")}
          programHref="#program"
        />

        <section aria-labelledby="info-cards-title" className="py-12 sm:py-16">
          <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
            <h2 id="info-cards-title" className="sr-only">
              {t("info.sectionLabel")}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <InfoCard icon={CalendarDays} label={t("info.dates")} value={dateRange} />
              <InfoCard icon={MapPin} label={t("info.venue")} value={congress.venue} />
              <InfoCard
                icon={Globe}
                label={t("info.location")}
                value={locationLine}
              />
              <InfoCard
                icon={Sparkles}
                label={t("info.format")}
                value={t(`format.${congress.format}`)}
              />
            </div>
          </div>
        </section>

        <section id="about" aria-labelledby="about-title" className="bg-muted py-16 sm:py-20">
          <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
            <SectionHeading title={t("about.title")} description={t("about.description")} />
            <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-muted-foreground">
              {aboutText}
            </p>
          </div>
        </section>

        <section id="themes" aria-labelledby="themes-title" className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
            <SectionHeading
              id="themes-title"
              title={t("themes.title")}
              description={t("themes.description")}
            />
            {congress.themes.length > 0 ? (
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {congress.themes.map((theme) => {
                  const title = pickLocalizedText(typedLocale, theme.titleFr, theme.titleEn);
                  const description = pickOptionalLocalizedText(
                    typedLocale,
                    theme.descriptionFr,
                    theme.descriptionEn,
                  );
                  return (
                    <li
                      key={theme.id}
                      className="rounded-xl border border-border bg-card p-5 shadow-sm"
                    >
                      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                      {description ? (
                        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-center text-sm text-muted-foreground">{t("themes.empty")}</p>
            )}
          </div>
        </section>

        <section id="program" aria-labelledby="program-title" className="bg-muted py-16 sm:py-20">
          <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
            <SectionHeading
              id="program-title"
              title={t("program.title")}
              description={t("program.description")}
            />
            {congress.sessions.length > 0 ? (
              <ul className="space-y-4">
                {congress.sessions.map((session) => {
                  const title = pickLocalizedText(typedLocale, session.titleFr, session.titleEn);
                  const typeLabel = pickLocalizedText(
                    typedLocale,
                    session.sessionType.labelFr,
                    session.sessionType.labelEn,
                  );
                  return (
                    <li
                      key={session.id}
                      className="rounded-xl border border-border bg-card p-5 shadow-sm"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1">
                          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                          <p className="text-xs font-medium uppercase tracking-wide text-secondary">
                            {typeLabel}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatSessionTime(session.startAt, session.endAt, typedLocale)}
                          {session.room ? ` · ${session.room}` : ""}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center">
                <Presentation aria-hidden="true" className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t("program.empty")}</p>
              </div>
            )}
          </div>
        </section>

        <section id="speakers" aria-labelledby="speakers-title" className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
            <SectionHeading
              id="speakers-title"
              title={t("speakers.title")}
              description={t("speakers.description")}
            />
            {congress.speakers.length > 0 ? (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {congress.speakers.map((speaker) => (
                  <li
                    key={speaker.id}
                    className="rounded-xl border border-border bg-card p-5 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                        <Mic2 aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-foreground">{speaker.fullName}</h3>
                        {speaker.academicTitle ? (
                          <p className="text-xs text-muted-foreground">{speaker.academicTitle}</p>
                        ) : null}
                        {speaker.institution ? (
                          <p className="text-sm text-muted-foreground">{speaker.institution}</p>
                        ) : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center">
                <Users aria-hidden="true" className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t("speakers.empty")}</p>
              </div>
            )}
          </div>
        </section>

        <section id="sponsors" aria-labelledby="sponsors-title" className="bg-muted py-16 sm:py-20">
          <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
            <SectionHeading
              id="sponsors-title"
              title={t("sponsors.title")}
              description={t("sponsors.description")}
            />
            {congress.sponsors.length > 0 ? (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {congress.sponsors.map((sponsor) => (
                  <li
                    key={sponsor.id}
                    className="rounded-xl border border-border bg-card p-5 shadow-sm"
                  >
                    <h3 className="text-sm font-semibold text-foreground">{sponsor.name}</h3>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {t(`sponsorCategory.${sponsor.category}`)}
                    </p>
                    {sponsor.description ? (
                      <p className="mt-2 text-sm text-muted-foreground">{sponsor.description}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-sm text-muted-foreground">{t("sponsors.empty")}</p>
            )}
          </div>
        </section>

        <LandingCta
          locale={locale}
          title={t("cta.title")}
          description={t("cta.description")}
          registrationLabel={t("cta.register")}
          registrationHint={t("cta.registrationHint")}
          submissionLabel={t("cta.submissionComingSoon")}
          submissionHint={t("cta.submissionHint")}
          adminLoginLabel={t("cta.adminLogin")}
        />
      </main>

      <PublicFooter locale={locale} congressName={congressName} />
    </div>
  );
}
