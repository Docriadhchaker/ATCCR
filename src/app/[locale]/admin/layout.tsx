import { setRequestLocale } from "next-intl/server";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminShellAccess } from "@/server/policies/auth.policy";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await requireAdminShellAccess();

  return (
    <AdminShell locale={locale} userEmail={user.email}>
      {children}
    </AdminShell>
  );
}
