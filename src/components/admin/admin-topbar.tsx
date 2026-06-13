"use client";

import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";

import { UserMenu } from "@/components/admin/user-menu";

type Props = {
  locale: string;
  userEmail: string;
  onMenuClick: () => void;
};

export function AdminTopbar({ locale, userEmail, onMenuClick }: Props) {
  const t = useTranslations("Admin");

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label={t("openMenu")}
          className="flex cursor-pointer items-center justify-center rounded-md p-2 text-foreground outline-none transition-colors duration-200 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        >
          <Menu aria-hidden="true" className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold text-foreground sm:text-base">
          {t("title")}
        </span>
      </div>

      <UserMenu locale={locale} userEmail={userEmail} />
    </header>
  );
}
