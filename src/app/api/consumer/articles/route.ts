import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { ARTICLE_PER_PAGE } from "@/utils/constants";
import { ArticleType } from "@prisma/client";

/**
 *  @method  GET
 *  @route   ~/api/consumer/articles?pageNumber=1&articleType={GAME|PROGRAM}  Get articles of the specified type.  
 *  @desc    Get all article By Page Number
 *  @access  public
 */
export async function GET(request: NextRequest) {
  try {
    const pageNumber = parseInt(
      request.nextUrl.searchParams.get("pageNumber") || "1"
    );
    const articleType = request.nextUrl.searchParams.get("articleType");

    if (isNaN(pageNumber) || pageNumber < 1) {
      return NextResponse.json(
        { message: "Invalid page number" },
        { status: 400 }
      );
    }

    if (articleType && articleType !== "GAME" && articleType !== "PROGRAM") {
      return NextResponse.json(
        { message: "Invalid articleType. Must be 'GAME' or 'PROGRAM'." },
        { status: 400 }
      );
    }

    const articles = await prisma.article.findMany({
      skip: ARTICLE_PER_PAGE * (pageNumber - 1),
      take: ARTICLE_PER_PAGE,
      where: {
        isApproved: true,
        ...(articleType ? { articleType: articleType as ArticleType } : {}), // تحويل articleType إلى النوع الصحيح
      },
      orderBy: { updatedAt: 'desc'},
      select: {
        id: true,
        title: true,
        image: true,
        developer: true,
        averageRating: true,
        isMod:true,
        typeMod:true
      },
    });

    if (!articles || articles.length === 0) {
      return NextResponse.json({ message: "No articles found" }, { status: 404 });
    }

    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
