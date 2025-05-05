import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { ArticleType } from "@prisma/client";

/**
 *  @method  GET
 *  @route   ~/api/consumer/articles/count?articleType=GAME
 *  @desc    Get article Count
 *  @access  public
 */
export async function GET(request: NextRequest) {
  try {
    const articleType = request.nextUrl.searchParams.get("articleType");
    if (articleType && articleType !== "GAME" && articleType !== "PROGRAM") {
      return NextResponse.json(
        { message: "Invalid articleType. Must be 'GAME' or 'PROGRAM'." },
        { status: 400 }
      );
    }

    const count = await prisma.article.count({
      where: {
        isApproved: true,
        ...(articleType ? { articleType: articleType as ArticleType } : {}),
      },
    });
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
