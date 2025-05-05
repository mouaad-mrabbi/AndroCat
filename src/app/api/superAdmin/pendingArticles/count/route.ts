import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

/**
 *  @method  GET
 *  @route   ~/api/superAdmin/pendingArticles/count?articleType=GAME
 *  @desc    Get Count pending Articles
 *  @access  public
 */
export async function GET(request: NextRequest) {
  try {
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

    const count = await prisma.pendingArticle.count({
      where: {},
    });
    if (!count) {
      return new NextResponse("Pending Article not found", { status: 404 });
    }

    return new NextResponse(`${count}`, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
