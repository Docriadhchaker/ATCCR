import type { Locale } from "@/i18n/routing";

export function pickLocalizedText(
  locale: string,
  fr: string,
  en?: string | null,
): string {
  if (locale === "en" && en?.trim()) {
    return en.trim();
  }
  return fr;
}

export function pickOptionalLocalizedText(
  locale: string,
  fr?: string | null,
  en?: string | null,
): string | null {
  const value = locale === "en" ? en : fr;
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function formatCongressDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "2-digit",
    month: locale === "fr" ? "2-digit" : "short",
    year: "numeric",
  }).format(date);
}

export function formatCongressDateRange(
  start: Date,
  end: Date,
  locale: Locale,
): string {
  const startLabel = formatCongressDate(start, locale);
  const endLabel = formatCongressDate(end, locale);
  return `${startLabel} – ${endLabel}`;
}

export function formatSessionTime(startAt: Date, endAt: Date, locale: Locale): string {
  const formatter = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${formatter.format(startAt)} – ${formatter.format(endAt)}`;
}

export function formatLocation(city: string, country: string): string {
  return `${city}, ${country}`;
}
