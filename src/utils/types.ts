import { Prisma } from "@prisma/client";

export type JWTPayload = {
  id: number;
  username: string;
  role: string;
};

export type allArticle = {
  id: number;
  image: string;
  title: string;
  developer: string;
  averageRating?: number;
  isMod: boolean;
  typeMod: string | null;
};

export type ArticleAndObjects = Prisma.ArticleGetPayload<{
  select: {
    createdBy: { select: { profile: true; username: true } };
    validatedBy: { select: { profile: true; username: true } };
    paragraphs: { select: { title: true; content: true } };
    pendingArticle: true;
    apks: true;
    xapks: true;

    id: true;
    title: true;
    secondTitle: true;
    description: true;
    descriptionMeta: true;
    image: true;
    developer: true;
    version: true;
    versionOriginal: true;
    androidVer: true;

    articleType: true;
    gameCategory: true;
    programCategory: true;

    OBB: true;
    Script: true;
    OriginalAPK: true;

    linkAPK: true;
    linkOBB: true;
    linkVideo: true;
    linkScript: true;
    linkOriginalAPK: true;

    sizeFileAPK: true;
    sizeFileOBB: true;
    sizeFileScript: true;
    sizeFileOriginalAPK: true;

    screenType: true;
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

export type PendingArticleAndObjects = Prisma.PendingArticleGetPayload<{
  select: {
    createdBy: { select: { profile: true; username: true } };
    paragraphs: { select: { title: true; content: true } };
    apks: true;
    xapks: true;

    id: true;
    status: true;
    title: true;
    secondTitle: true;
    description: true;
    image: true;
    developer: true;
    version: true;
    versionOriginal: true;
    androidVer: true;

    articleType: true;
    gameCategory: true;
    programCategory: true;

    OBB: true;
    Script: true;
    OriginalAPK: true;

    linkAPK: true;
    linkOBB: true;
    linkVideo: true;
    linkScript: true;
    linkOriginalAPK: true;

    sizeFileAPK: true;
    sizeFileOBB: true;
    sizeFileScript: true;
    sizeFileOriginalAPK: true;

    screenType: true;
    appScreens: true;
    keywords: true;
    isMod: true;
    typeMod: true;
    ratedFor: true;
    installs: true;

    createdById: true;
    createdAt: true;
    updatedAt: true;
    articleId: true;
  };
}>;
