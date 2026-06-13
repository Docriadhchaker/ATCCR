import type {
  Congress,
  CongressSettings,
  Session,
  SessionType,
  Speaker,
  Sponsor,
  Theme,
} from "@prisma/client";

import { DEMO_CONGRESS_SLUG } from "@/server/repositories/congress.repository";
import { prisma } from "@/lib/prisma";

export type PublicSessionPreview = Session & {
  sessionType: SessionType;
};

export type PublicSponsorPreview = Pick<
  Sponsor,
  "id" | "name" | "category" | "websiteUrl" | "description" | "displayOrder"
>;

export type PublicCongressLandingData = Congress & {
  settings: CongressSettings | null;
  themes: Theme[];
  sessions: PublicSessionPreview[];
  speakers: Speaker[];
  sponsors: PublicSponsorPreview[];
};

const PREVIEW_LIMIT = 6;

export async function findPublicCongressLandingData(): Promise<PublicCongressLandingData | null> {
  const congress = await prisma.congress.findUnique({
    where: { slug: DEMO_CONGRESS_SLUG },
    include: {
      settings: true,
      themes: {
        where: { visible: true },
        orderBy: { displayOrder: "asc" },
        take: PREVIEW_LIMIT,
      },
      sessions: {
        where: { isPublic: true },
        orderBy: [{ day: "asc" }, { startAt: "asc" }],
        take: PREVIEW_LIMIT,
        include: { sessionType: true },
      },
      speakers: {
        where: { visible: true },
        orderBy: { displayOrder: "asc" },
        take: PREVIEW_LIMIT,
      },
      sponsors: {
        where: { visible: true },
        orderBy: { displayOrder: "asc" },
        take: PREVIEW_LIMIT,
        select: {
          id: true,
          name: true,
          category: true,
          websiteUrl: true,
          description: true,
          displayOrder: true,
        },
      },
    },
  });

  return congress;
}
