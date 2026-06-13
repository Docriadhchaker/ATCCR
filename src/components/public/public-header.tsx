"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  locale: string;
  congressName: string;
};

const NAV_ITEMS = [
  { key: "about", href: "#about" },
  { key: "themes", href: "#themes" },
  { key: "program", href: "#program" },
  { key: "speakers", href: "#speakers" },
  { key: "sponsors", href: "#sponsors" },
  { key: "cta", href: "#cta" },
] as const;

export function PublicHeader({ locale, congressName }: Props) {
  const t = useTranslations("PublicLanding");
  const otherLocale = locale === "fr" ? "en" : "fr";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}`}
          className="truncate text-sm font-semibold text-primary outline-none transition-colors duration-200 hover:text-primary/90 focus-visible:ring-2 focus-visible:ring-ring sm:text-base"
        >
          {congressName}
        </Link>

        <nav
          aria-label={t("nav.ariaLabel")}
          className="hidden items-center gap-1 lg:flex"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-muted-foreground outline-none transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t(`nav.${item.key}`)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={`/${otherLocale}`}
            className="cursor-pointer rounded-md border border-border px-3 py-2 text-xs font-medium uppercase tracking-wide text-foreground outline-none transition-colors duration-200 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring sm:text-sm"
          >
            {t("nav.languageSwitch", { locale: otherLocale.toUpperCase() })}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="public-mobile-nav"
            aria-label={mobileOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            className="flex cursor-pointer items-center justify-center rounded-md p-2 text-foreground outline-none transition-colors duration-200 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          >
            {mobileOpen ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <nav
        id="public-mobile-nav"
        aria-label={t("nav.mobileAriaLabel")}
        className={cn(
          "border-t border-border bg-background px-4 py-3 transition-opacity duration-200 motion-reduce:transition-none lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none hidden opacity-0",
        )}
      >
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.key}>
              <a
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-foreground outline-none transition-colors duration-200 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                {t(`nav.${item.key}`)}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
