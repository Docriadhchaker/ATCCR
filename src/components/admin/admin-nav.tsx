"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Award,
  CalendarClock,
  CalendarDays,
  CreditCard,
  FileText,
  LayoutDashboard,
  QrCode,
  Users,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type NavItem = {
  /** i18n key under Admin.nav */
  key: string;
  icon: LucideIcon;
  /** Relative admin path segment, or null for the dashboard root. */
  segment: string | null;
  /** Future module not yet implemented in Phase 0. */
  comingSoon: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", icon: LayoutDashboard, segment: null, comingSoon: false },
  { key: "congressOverview", icon: CalendarDays, segment: "congress", comingSoon: false },
  { key: "registrations", icon: Users, segment: "registrations", comingSoon: true },
  { key: "payments", icon: CreditCard, segment: "payments", comingSoon: true },
  { key: "submissions", icon: FileText, segment: "submissions", comingSoon: true },
  { key: "program", icon: CalendarClock, segment: "program", comingSoon: true },
  { key: "checkin", icon: QrCode, segment: "checkin", comingSoon: true },
  { key: "certificates", icon: Award, segment: "certificates", comingSoon: true },
];

type Props = {
  locale: string;
  onNavigate?: () => void;
};

export function AdminNav({ locale, onNavigate }: Props) {
  const t = useTranslations("Admin");
  const pathname = usePathname();
  const adminRoot = `/${locale}/admin`;

  return (
    <nav aria-label={t("nav.ariaLabel")} className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const href = item.segment ? `${adminRoot}/${item.segment}` : adminRoot;
        const isActive = item.segment
          ? pathname === href || pathname.startsWith(`${href}/`)
          : pathname === adminRoot;

        if (item.comingSoon) {
          return (
            <span
              key={item.key}
              aria-disabled="true"
              title={t("comingSoon")}
              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary-foreground/55"
            >
              <span className="flex items-center gap-3">
                <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                {t(`nav.${item.key}`)}
              </span>
              <span className="rounded-full bg-primary-foreground/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground/70">
                {t("comingSoonShort")}
              </span>
            </span>
          );
        }

        return (
          <Link
            key={item.key}
            href={href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium outline-none transition-colors duration-200",
              "focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary",
              isActive
                ? "bg-secondary text-secondary-foreground"
                : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground",
            )}
          >
            <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
            {t(`nav.${item.key}`)}
          </Link>
        );
      })}
    </nav>
  );
}
