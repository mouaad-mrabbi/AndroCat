import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { ARTICLE_PER_PAGE } from "@/utils/constants";

/**
 *  @method  GET
 *  @route   ~/api/owner/articles?pageNumber=1
 *  @desc    Get all articles with pageNumber
 *  @access  private only owner can get all articles
 */
export async function GET(request: NextRequest) {
  try {
    const pageNumber = parseInt(
      request.nextUrl.searchParams.get("pageNumber") || "1"
    );
    if (isNaN(pageNumber) || pageNumber < 1) {
      return NextResponse.json(
        { message: "Invalid page number" },
        { status: 400 }
      );
    }

    const filter = request.nextUrl.searchParams.get("filter") || "all";
    if (!["all", "notApproved"].includes(filter)) {
      return NextResponse.json({ message: "Invalid filter" }, { status: 400 });
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
        { message: "Access denied, only admins allowed" },
        { status: 403 }
      );
    }

    const whereCondition =
      filter === "notApproved" ? { isApproved: false } : {};

    const articles = await prisma.article.findMany({
      where: whereCondition,
      skip: ARTICLE_PER_PAGE * (pageNumber - 1),
      take: ARTICLE_PER_PAGE,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        image: true,
        developer: true,
        isMod: true,
        typeMod: true,
        isApproved: true,
      },
    });

    if (!articles || articles.length === 0) {
      return NextResponse.json(
        { message: "No articles found" },
        { status: 404 }
      );
    }

    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
