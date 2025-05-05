import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

interface Props {
  params: Promise<{ articleId: string }>;
}

/**
 *  @method  GET
 *  @route   ~/api/owner/articles/:articleId
 *  @desc    Get single article
 *  @access  private only owner can get article
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const articleId = Number((await params).articleId);

    const userFromToken = verifyToken(request);
    if (!userFromToken) {
      return NextResponse.json(
        { message: "Access denied, you are not authorized" },
        { status: 403 }
      );
    }
    if (!["OWNER"].includes(userFromToken.role)) {
      return NextResponse.json(
        { message: "Access denied, only admins allowed" },
        { status: 403 }
      );
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        developer: true,
        version: true,
        versionOriginal:true,
        androidVer: true,

        articleType: true,
        gameCategory: true,
        programCategory:true,

        OBB: true,
        Script: true,
        OriginalAPK: true,

        linkAPK: true,
        linkOBB: true,
        linkScript: true,
        linkOriginalAPK: true,
        linkVideo: true,

        sizeFileAPK: true,
        sizeFileOBB: true,
        sizeFileScript: true,
        sizeFileOriginalAPK: true,

        appScreens: true,
        keywords: true,

        isMod: true,
        typeMod: true,

        ratedFor: true,
        installs: true,
        ratingCount: true,
        averageRating: true,
        views: true,
        downloadCount: true,

        isApproved: true,

        createdById: true,
        validatedById: true,

        createdAt: true,
        updatedAt: true,
        createdBy: { select: { profile: true, username: true } },

        validatedAt: true,
        validatedBy: { select: { profile: true, username: true } },

        pendingArticle: { select: { id: true } },
      },
    });
    if (!article) {
      return NextResponse.json({ message: "article not found" }, { status: 404 });
    }

    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
