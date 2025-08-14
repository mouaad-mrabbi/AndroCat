import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

interface Props {
  params: Promise<{ articleId: string }>;
}

/**
 *  @method  GET
 *  @route   ~/api/admin/articles/:articleId
 *  @desc    Get single article created by user.
 *  @access  private (only user himself can get his article | OWNER can return any users data)
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
    if (!["ADMIN", "SUPER_ADMIN", "OWNER"].includes(userFromToken.role)) {
      return NextResponse.json(
        { message: "Access denied, only admins allowed" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userFromToken.id },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
        createdById: userFromToken.id, // تأكد أن العنصر يخص هذا المستخدم
      },
      select: {
        id: true,
        title: true,
        secondTitle: true,
        description: true,
        descriptionMeta: true,
        image: true,
        developer: true,
        version: true,
        versionOriginal: true,
        androidVer: true,
        articleType: true,
        gameCategory: true,
        programCategory: true,

        OBB: true,
        Script: true,
        OriginalAPK: true,

        linkOBB: true,
        linkVideo: true,
        linkScript: true,
        linkOriginalAPK: true,

        sizeFileOBB: true,
        sizeFileScript: true,
        sizeFileOriginalAPK: true,

        screenType: true,
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

        pendingArticle: true,
        paragraphs: { select: { title: true, content: true } },
        apks: {
          select: { link: true, size: true, version: true, isMod: true },
        },
        xapks: {
          select: { link: true, size: true, version: true, isMod: true },
        },
      },
    });
    if (!article) {
      return NextResponse.json(
        { message: "article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
