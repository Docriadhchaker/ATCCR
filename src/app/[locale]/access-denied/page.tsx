import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AccessDeniedPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Auth");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("accessDeniedTitle")}
        </h1>
        <p className="text-muted-foreground">{t("accessDeniedMessage")}</p>
        <Link
          href={`/${locale}/login`}
          className="inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("backToLogin")}
        </Link>
      </div>
    </main>
  );
}
