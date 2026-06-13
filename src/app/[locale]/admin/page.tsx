import { getTranslations, setRequestLocale } from "next-intl/server";

import { requireAdminShellAccess } from "@/server/policies/auth.policy";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Admin");
  const user = await requireAdminShellAccess();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="max-w-lg space-y-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("protectedMessage")}</p>
        <p className="text-sm text-muted-foreground">
          {t("signedInAs", { email: user.email })}
        </p>
      </div>
    </main>
  );
}
