import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

/**
 *  @method  GET
 *  @route   ~/api/superAdmin/pendingItems/count?itemType=GAME
 *  @desc    Get Count pending Items
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

    const count = await prisma.pendingItem.count({
      where: {},
    });
    if (!count) {
      return new NextResponse("Pending Item not found", { status: 404 });
    }

    return new NextResponse(`${count}`, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
