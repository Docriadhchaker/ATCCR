"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

type Props = {
  locale: string;
  userEmail: string;
  children: React.ReactNode;
};

export function AdminShell({ locale, userEmail, children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("Admin");

  return (
    <div className="min-h-screen bg-muted">
      <a
        href="#admin-main"
        className="sr-only z-50 rounded-md bg-background px-4 py-2 text-sm font-medium text-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:ring-2 focus:ring-ring"
      >
        {t("skipToContent")}
      </a>

      <AdminSidebar
        locale={locale}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="lg:pl-64">
        <AdminTopbar
          locale={locale}
          userEmail={userEmail}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main id="admin-main" className="px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
