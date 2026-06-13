import type { RoleCode } from "@prisma/client";

/** All role codes defined in the RBAC model (11 roles). */
export const ALL_ROLES: readonly RoleCode[] = [
  "super_admin",
  "congress_admin",
  "registration_manager",
  "finance_manager",
  "scientific_committee_admin",
  "scientific_evaluator",
  "speaker",
  "resident_submitter",
  "participant",
  "sponsor",
  "staff",
] as const;

/** Roles that can access the admin shell in Phase 0. */
export const ADMIN_SHELL_ROLES: readonly RoleCode[] = [
  "super_admin",
  "congress_admin",
] as const;

export type SessionUser = {
  id: string;
  email: string;
  roles: RoleCode[];
  congressId: string | null;
  locale: "fr" | "en";
};

export function hasRole(user: SessionUser, role: RoleCode): boolean {
  return user.roles.includes(role);
}

export function hasAnyRole(user: SessionUser, roles: readonly RoleCode[]): boolean {
  return roles.some((role) => user.roles.includes(role));
}

export function isSuperAdmin(user: SessionUser): boolean {
  return hasRole(user, "super_admin");
}

export function canAccessAdminShell(user: SessionUser): boolean {
  return hasAnyRole(user, ADMIN_SHELL_ROLES);
}
