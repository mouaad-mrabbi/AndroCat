import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

interface Props {
  params: Promise<{ articleId: string }>;
}

/**
 *  @method  GET
 *  @route   ~/api/consumer/articles/:articleId
 *  @desc    Get Single article By Id
 *  @access  public
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const articleId = Number((await params).articleId);

    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
        isApproved: true,
      },
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
        updatedAt: true,
      },
    });
    if (!article) {
      return NextResponse.json(
        { message: "No article found" },
        { status: 404 }
      );
    }

    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
