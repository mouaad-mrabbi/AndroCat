import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { deleteFile } from "@/lib/r2";

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
        secondTitle:true,
        description: true,
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

/**
 *  @method  DELETE
 *  @route   ~/api/owner/articles/:articleId
 *  @desc    Delete my article
 *  @access  private (only user himself can Delete article | OWNER can Delete any data)
 */
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const articleId = Number((await params).articleId);
    if (isNaN(articleId)) {
      return NextResponse.json(
        { message: "Invalid article ID" },
        { status: 400 }
      );
    }

    const userFromToken = verifyToken(request);
    if (!userFromToken) {
      return NextResponse.json(
        { message: "Access denied, you are not authorized" },
        { status: 403 }
      );
    }
    if (!["OWNER"].includes(userFromToken.role)) {
      return NextResponse.json(
        { message: "Access denied, only OWNER allowed" },
        { status: 403 }
      );
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        image: true,
        linkAPK: true,
        linkOBB: true,
        linkScript: true,
        linkOriginalAPK: true,
        appScreens: true,
      },
    });
    if (!article) {
      return NextResponse.json(
        { message: "article not found" },
        { status: 404 }
      );
    }

    const filesToDelete = [
      article.image,
      article.linkAPK,
      article.linkOBB,
      article.linkScript,
      article.linkOriginalAPK,
      ...(article.appScreens || []),
    ].filter(
      (url): url is string => typeof url === "string" && url.trim() !== ""
    );

    await Promise.all(
      filesToDelete.map(async (url) => {
        try {
          await deleteFile(new URL(url).pathname.slice(1));
        } catch (err) {
          console.warn("Failed to delete file:", url, err);
        }
      })
    );

    await prisma.article.delete({ where: { id: articleId } });

    return NextResponse.json({ message: "article deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" ,error},
      { status: 500 }
    );
  }
}
