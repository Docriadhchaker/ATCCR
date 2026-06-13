import Link from "next/link";
import { getTranslations } from "next-intl/server";

type Props = {
  locale: string;
  congressName: string;
};

export async function PublicFooter({ locale, congressName }: Props) {
  const t = await getTranslations("PublicLanding");

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="space-y-2">
          <p className="text-sm font-semibold">{congressName}</p>
          <p className="max-w-md text-sm text-primary-foreground/80">{t("footer.tagline")}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Link
            href={`/${locale}/login`}
            className="inline-flex cursor-pointer items-center justify-center rounded-md border border-primary-foreground/25 px-4 py-2 text-sm font-medium outline-none transition-colors duration-200 hover:bg-primary-foreground/10 focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            {t("footer.adminLogin")}
          </Link>
          <p className="text-xs text-primary-foreground/70">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
