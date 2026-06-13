import type { NextAuthConfig } from "next-auth";
import type { RoleCode } from "@prisma/client";

/**
 * Edge-safe Auth.js configuration (no Prisma / Node-only imports).
 * Used by middleware; providers and authorize live in auth.ts.
 */
export default {
  providers: [],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.roles = user.roles;
        token.congressId = user.congressId;
        token.locale = user.locale;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.roles = token.roles as RoleCode[];
      session.user.congressId = token.congressId as string | null;
      session.user.locale = token.locale as "fr" | "en";
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
