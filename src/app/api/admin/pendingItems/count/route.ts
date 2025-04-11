import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

/**
 *  @method  GET
 *  @route   ~/api/admin/pendingItems/count
 *  @desc    Get my Count pending Items
 *  @access  private (only user himself can get his items | SUPER_ADMIN and OWNER can return any users data)
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
    if (!["ADMIN", "SUPER_ADMIN", "OWNER"].includes(userFromToken.role)) {
      return NextResponse.json(
        { message: "Access denied, only admins allowed" },
        { status: 403 }
      );
    }

    const userWithPendingCount = await prisma.user.findUnique({
      where: { id: userFromToken.id },
      select: {
        _count: {
          select: { pendingItems: true },
        },
      },
    });
    if (!userWithPendingCount) {
      return new NextResponse("User not found", { status: 404 });
    }

    const pendingItemsCount = userWithPendingCount?._count?.pendingItems || 0;
    if (pendingItemsCount===0) {
        return new NextResponse("Pending Items not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(pendingItemsCount), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
