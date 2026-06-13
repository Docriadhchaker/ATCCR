import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

import authConfig from "@/auth.config";
import { prisma } from "@/lib/prisma";
import type { RoleCode } from "@prisma/client";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

async function loadUserRoles(userId: string): Promise<{
  roles: RoleCode[];
  congressId: string | null;
}> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true },
    orderBy: { createdAt: "asc" },
  });

  if (userRoles.length === 0) {
    return { roles: [], congressId: null };
  }

  const congressId = userRoles[0].congressId;
  const roles = userRoles
    .filter((entry) => entry.congressId === congressId)
    .map((entry) => entry.role.code);

  return { roles, congressId };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) {
          return null;
        }

        const email = parsed.data.email.toLowerCase().trim();
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user?.passwordHash || user.status !== "active") {
          return null;
        }

        const passwordValid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );
        if (!passwordValid) {
          return null;
        }

        const { roles, congressId } = await loadUserRoles(user.id);

        return {
          id: user.id,
          email: user.email,
          roles,
          congressId,
          locale: user.locale,
        };
      },
    }),
  ],
});
