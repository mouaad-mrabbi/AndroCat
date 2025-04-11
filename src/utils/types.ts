import { Prisma } from "@prisma/client";

export type JWTPayload = {
  id: string;
  username: string;
  role: string;
};

export type allItem = {
  id: string;
  image: string;
  title: string;
  developer: string;
  averageRating?: number;
  isMod: boolean;
  typeMod: string | null;
};

export type ItemAndObjects = Prisma.ItemGetPayload<{
  select: {
    createdBy: { select: { profile: true; username: true } };
    validatedBy: { select: { profile: true; username: true } };
    pendingItem: { select: { id: true } };
    id: true;
    title: true;
    description: true;
    image: true;
    developer: true;
    version: true;
    androidVer: true;
    itemType: true;
    categories: true;
    OBB: true;
    Script: true;
    linkAPK: true;
    linkOBB: true;
    linkVideo: true;
    linkScript: true;
    sizeFileAPK: true;
    sizeFileOBB: true;
    sizeFileScript: true;
    appScreens: true;
    keywords: true;
    isMod: true;
    typeMod: true;
    ratedFor: true;
    installs: true;
    ratingCount: true;
    averageRating: true;
    views: true;
    downloadCount: true;
    isApproved: true;
    createdById: true;
    validatedById: true;
    createdAt: true;
    updatedAt: true;
    validatedAt: true;
  };
}>;
