import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { ARTICLE_PER_PAGE } from "@/utils/constants";

/**
 *  @method  GET
 *  @route   ~/api/superAdmin/articles?pageNumber=1
 *  @desc    Get all my articles validated
 *  @access  private (only user himself can get his articles | OWNER can return any users data)
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

    const userFromToken = verifyToken(request);
    if (!userFromToken) {
      return NextResponse.json(
        { message: "Access denied, you are not authorized" },
        { status: 403 }
      );
    }
    if (!["SUPER_ADMIN", "OWNER"].includes(userFromToken.role)) {
      return NextResponse.json(
        { message: "Access denied, only admins allowed" },
        { status: 403 }
      );
    }

    const userWithArticles = await prisma.user.findUnique({
      where: { id: userFromToken.id },
      include: {
        validatedArticles: {
          skip: ARTICLE_PER_PAGE * (pageNumber - 1),
          take: ARTICLE_PER_PAGE,
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!userWithArticles) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (
      !userWithArticles.validatedArticles ||
      userWithArticles.validatedArticles.length === 0
    ) {
      return NextResponse.json({ message: "No Articles found" }, { status: 404 });
    }

    return NextResponse.json(userWithArticles.validatedArticles, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}