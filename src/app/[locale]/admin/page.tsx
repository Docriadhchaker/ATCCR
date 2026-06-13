import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Award,
  CalendarClock,
  CalendarDays,
  CreditCard,
  FileText,
  QrCode,
  Users,
  type LucideIcon,
} from "lucide-react";

import { ModuleCard } from "@/components/admin/module-card";
import { requireAdminShellAccess } from "@/server/policies/auth.policy";

type Props = {
  params: Promise<{ locale: string }>;
};

const MODULE_CARDS: Array<{ key: string; icon: LucideIcon }> = [
  { key: "congressOverview", icon: CalendarDays },
  { key: "registrations", icon: Users },
  { key: "payments", icon: CreditCard },
  { key: "submissions", icon: FileText },
  { key: "program", icon: CalendarClock },
  { key: "checkin", icon: QrCode },
  { key: "certificates", icon: Award },
];

export default async function AdminDashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Admin");
  const user = await requireAdminShellAccess();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {t("dashboardTitle")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("signedInAs", { email: user.email })}
        </p>
      </header>

      <section
        aria-label={t("modulesSectionLabel")}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {MODULE_CARDS.map((module) => (
          <ModuleCard
            key={module.key}
            icon={module.icon}
            title={t(`nav.${module.key}`)}
            description={t(`moduleDescriptions.${module.key}`)}
            comingSoonLabel={t("comingSoonShort")}
          />
        ))}
      </section>

      <p className="text-xs text-muted-foreground">{t("placeholderNote")}</p>
    </div>
  );
}
