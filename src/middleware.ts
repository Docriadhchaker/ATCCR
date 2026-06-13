import NextAuth from "next-auth";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

import authConfig from "@/auth.config";
import { ADMIN_SHELL_ROLES } from "@/lib/rbac/roles";
import { routing } from "@/i18n/routing";

const { auth } = NextAuth(authConfig);
const intlMiddleware = createMiddleware(routing);

const localePattern = /^\/(fr|en)(\/|$)/;

function extractLocale(pathname: string): string {
  const match = pathname.match(localePattern);
  return match?.[1] ?? routing.defaultLocale;
}

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const locale = extractLocale(pathname);

  const isAdminRoute = pathname.match(/^\/(fr|en)\/admin(\/|$)/);
  const isLoginRoute = pathname.match(/^\/(fr|en)\/login(\/|$)/);
  const isAccessDeniedRoute = pathname.match(/^\/(fr|en)\/access-denied(\/|$)/);

  if (isAdminRoute) {
    const session = request.auth;

    if (!session?.user?.id) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const roles = session.user.roles ?? [];
    const hasAdminAccess = roles.some((role) =>
      ADMIN_SHELL_ROLES.includes(role),
    );

    if (!hasAdminAccess) {
      return NextResponse.redirect(new URL(`/${locale}/access-denied`, request.url));
    }
  }

  if (isLoginRoute && request.auth?.user?.id) {
    const roles = request.auth.user.roles ?? [];
    const hasAdminAccess = roles.some((role) =>
      ADMIN_SHELL_ROLES.includes(role),
    );
    if (hasAdminAccess) {
      return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
    }
  }

  if (isAccessDeniedRoute || isLoginRoute) {
    return intlMiddleware(request);
  }

  return intlMiddleware(request);
});

export const config = {
  matcher: ["/", "/(fr|en)/:path*"],
};
