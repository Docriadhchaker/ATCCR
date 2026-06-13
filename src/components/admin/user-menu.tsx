"use client";

import { useTranslations } from "next-intl";
import { LogOut, UserRound } from "lucide-react";

import { logoutAction } from "@/server/actions/auth.actions";

type Props = {
  locale: string;
  userEmail: string;
};

export function UserMenu({ locale, userEmail }: Props) {
  const t = useTranslations("Admin");
  const boundLogout = logoutAction.bind(null, locale);

  return (
    <div className="flex items-center gap-3">
      <div className="hidden items-center gap-2 sm:flex">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <UserRound aria-hidden="true" className="h-4 w-4" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-xs text-muted-foreground">{t("signedInAsLabel")}</span>
          <span className="text-sm font-medium text-foreground">{userEmail}</span>
        </span>
      </div>

      <form action={boundLogout}>
        <button
          type="submit"
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground outline-none transition-colors duration-200 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <LogOut aria-hidden="true" className="h-4 w-4" />
          <span className="hidden sm:inline">{t("logout")}</span>
        </button>
      </form>
    </div>
  );
}
