import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

/**
 *  @method  GET
 *  @route   ~/api/owner/articles/count
 *  @desc    Get Count articles
 *  @access  private only owner can get count articles 
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
    if (!["OWNER"].includes(userFromToken.role)) {
      return NextResponse.json(
        { message: "Access denied, only admins allowed" },
        { status: 403 }
      );
    }

    const count = await prisma.article.count({});
    if (!count) {
      return new NextResponse("Pending article not found", { status: 404 });
    }

    return new NextResponse(`${count}`, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
