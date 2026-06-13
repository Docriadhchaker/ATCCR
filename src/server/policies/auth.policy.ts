import { auth } from "@/auth";
import { can, type PermissionCode } from "@/lib/rbac/permissions";
import {
  canAccessAdminShell,
  hasAnyRole,
  hasRole,
  type SessionUser,
} from "@/lib/rbac/roles";
import type { RoleCode } from "@prisma/client";

export class AuthPolicyError extends Error {
  constructor(
    public readonly code: "UNAUTHENTICATED" | "FORBIDDEN",
    message?: string,
  ) {
    super(message ?? code);
    this.name = "AuthPolicyError";
  }
}

function toSessionUser(sessionUser: {
  id: string;
  email: string;
  roles: RoleCode[];
  congressId: string | null;
  locale: "fr" | "en";
}): SessionUser {
  return {
    id: sessionUser.id,
    email: sessionUser.email,
    roles: sessionUser.roles,
    congressId: sessionUser.congressId,
    locale: sessionUser.locale,
  };
}

export async function getAuthenticatedUser(): Promise<SessionUser | null> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return null;
  }
  return toSessionUser(session.user);
}

export async function requireAuthenticatedUser(): Promise<SessionUser> {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new AuthPolicyError("UNAUTHENTICATED");
  }
  return user;
}

export async function requireRole(role: RoleCode): Promise<SessionUser> {
  const user = await requireAuthenticatedUser();
  if (!hasRole(user, role)) {
    throw new AuthPolicyError("FORBIDDEN");
  }
  return user;
}

export async function requireAnyRole(
  roles: readonly RoleCode[],
): Promise<SessionUser> {
  const user = await requireAuthenticatedUser();
  if (!hasAnyRole(user, roles)) {
    throw new AuthPolicyError("FORBIDDEN");
  }
  return user;
}

export async function requireAdminShellAccess(): Promise<SessionUser> {
  const user = await requireAuthenticatedUser();
  if (!canAccessAdminShell(user)) {
    throw new AuthPolicyError("FORBIDDEN");
  }
  return user;
}

export async function requirePermission(
  permission: PermissionCode,
): Promise<SessionUser> {
  const user = await requireAuthenticatedUser();
  if (!can(user, permission)) {
    throw new AuthPolicyError("FORBIDDEN");
  }
  return user;
}

export { can, hasRole, hasAnyRole, canAccessAdminShell };
