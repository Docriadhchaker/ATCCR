import type { Congress, CongressSettings } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const DEMO_CONGRESS_SLUG = "atccr-demo-2026";

export type CongressWithSettings = Congress & {
  settings: CongressSettings | null;
};

export async function findDemoCongressWithSettings(): Promise<CongressWithSettings | null> {
  return prisma.congress.findUnique({
    where: { slug: DEMO_CONGRESS_SLUG },
    include: { settings: true },
  });
}

export async function findCongressWithSettingsById(
  congressId: string,
): Promise<CongressWithSettings | null> {
  return prisma.congress.findUnique({
    where: { id: congressId },
    include: { settings: true },
  });
}
