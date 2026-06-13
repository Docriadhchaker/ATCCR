"use client";

import { useTranslations } from "next-intl";
import { Stethoscope, X } from "lucide-react";

import { AdminNav } from "@/components/admin/admin-nav";
import { cn } from "@/lib/utils";

type Props = {
  locale: string;
  mobileOpen: boolean;
  onClose: () => void;
};

function SidebarBrand({ label }: { label: string }) {
  return (
    <div className="flex h-16 items-center gap-2 border-b border-primary-foreground/10 px-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
        <Stethoscope aria-hidden="true" className="h-5 w-5" />
      </span>
      <span className="text-base font-semibold tracking-tight text-primary-foreground">
        {label}
      </span>
    </div>
  );
}

export function AdminSidebar({ locale, mobileOpen, onClose }: Props) {
  const t = useTranslations("Admin");

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-primary lg:flex">
        <SidebarBrand label={t("brand")} />
        <div className="flex-1 overflow-y-auto py-4">
          <AdminNav locale={locale} />
        </div>
      </aside>

      {/* Mobile overlay */}
      <div
        aria-hidden={!mobileOpen}
        className={cn(
          "fixed inset-0 z-40 bg-foreground/50 transition-opacity duration-200 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-primary transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label={t("nav.ariaLabel")}
      >
        <div className="flex h-16 items-center justify-between border-b border-primary-foreground/10 px-5">
          <span className="text-base font-semibold tracking-tight text-primary-foreground">
            {t("brand")}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("closeMenu")}
            className="flex cursor-pointer items-center justify-center rounded-md p-2 text-primary-foreground/80 outline-none transition-colors duration-200 hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-secondary"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <AdminNav locale={locale} onNavigate={onClose} />
        </div>
      </aside>
    </>
  );
}
