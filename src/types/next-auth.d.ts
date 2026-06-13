import type { DefaultSession } from "next-auth";
import type { RoleCode } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      roles: RoleCode[];
      congressId: string | null;
      locale: "fr" | "en";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    roles: RoleCode[];
    congressId: string | null;
    locale: "fr" | "en";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    roles: RoleCode[];
    congressId: string | null;
    locale: "fr" | "en";
  }
}
