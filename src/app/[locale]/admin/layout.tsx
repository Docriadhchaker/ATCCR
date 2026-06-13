import { getMessages, setRequestLocale } from "next-intl/server";

import { AdminIntlShell } from "@/components/admin/admin-intl-shell";
import { requireAdminShellAccess } from "@/server/policies/auth.policy";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await requireAdminShellAccess();
  const messages = await getMessages();

  return (
    <AdminIntlShell locale={locale} messages={messages} userEmail={user.email}>
      {children}
    </AdminIntlShell>
  );
}
