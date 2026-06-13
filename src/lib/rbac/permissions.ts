import type { RoleCode } from "@prisma/client";

import { isSuperAdmin, type SessionUser } from "@/lib/rbac/roles";

/**
 * Permission codes aligned with docs/03_RBAC_PERMISSIONS.md and seed data.
 * Phase 0 implements only the subset listed in ACTIVE_PHASE0_PERMISSIONS.
 */
export const PERMISSION_CODES = [
  "congress.settings.manage",
  "congress.settings.read",
  "users.roles.manage",
  "audit.read",
  "program.sessions.manage",
  "program.sessions.read",
  "program.presentations.manage",
  "speakers.manage",
  "speakers.read.self",
  "sponsors.manage",
  "sponsors.read.self",
  "registrations.list",
  "registrations.manage",
  "registrations.read.self",
  "payments.validate",
  "payments.proofs.review",
  "payments.proofs.upload.self",
  "badges.generate",
  "badges.read.self",
  "checkin.scan",
  "submissions.list",
  "submissions.manage.self",
  "submissions.decide",
  "evaluations.assign",
  "evaluations.submit",
  "evaluations.read.all",
  "certificates.authorize",
  "certificates.read.self",
  "media.manage",
  "media.upload.self",
  "emails.templates.manage",
  "exports.data",
] as const;

export type PermissionCode = (typeof PERMISSION_CODES)[number];

/** Permissions actively enforced in Phase 0. */
export const ACTIVE_PHASE0_PERMISSIONS: readonly PermissionCode[] = [
  "congress.settings.manage",
  "congress.settings.read",
  "users.roles.manage",
  "audit.read",
] as const;

/**
 * Direct role → permission mapping for Phase 0.
 * super_admin inherits all permissions via isSuperAdmin() check.
 */
const ROLE_PERMISSIONS: Partial<Record<RoleCode, readonly PermissionCode[]>> = {
  congress_admin: [
    "congress.settings.manage",
    "congress.settings.read",
  ],
};

export function can(user: SessionUser, permission: PermissionCode): boolean {
  if (isSuperAdmin(user)) {
    return true;
  }

  for (const role of user.roles) {
    const permissions = ROLE_PERMISSIONS[role];
    if (permissions?.includes(permission)) {
      return true;
    }
  }

  return false;
}

export function canAny(
  user: SessionUser,
  permissions: readonly PermissionCode[],
): boolean {
  return permissions.some((permission) => can(user, permission));
}
