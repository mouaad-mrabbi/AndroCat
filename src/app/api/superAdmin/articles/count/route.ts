import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

/**
 *  @method  GET
 *  @route   ~/api/superAdmin/articles/count
 *  @desc    Get my Count articles
 *  @access  private (only user himself can get his articles | SUPER_ADMIN and OWNER can return any users data)
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

    const userWithPendingCount = await prisma.user.findUnique({
      where: { id: userFromToken.id },
      select: {
        _count: {
          select: { validatedArticles: true },
        },
      },
    });
    if (!userWithPendingCount) {
      return new NextResponse("User not found", { status: 404 });
    }

    const pendingArticlesCount = userWithPendingCount?._count?.validatedArticles || 0;
    if (pendingArticlesCount === 0) {
      return new NextResponse("Pending Articles not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(pendingArticlesCount), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
