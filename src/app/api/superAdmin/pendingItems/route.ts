import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { ITEM_PER_PAGE } from "@/utils/constants";

/**
 *  @method  GET
 *  @route   ~/api/superAdmin/pendingItems?pageNumber=1
 *  @desc    Get all pending items
 *  @access  private (only SUPER_ADMIN and OWNER can return any users data)
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

    const pendingItems = await prisma.pendingItem.findMany({
      skip: ITEM_PER_PAGE * (pageNumber - 1),
      take: ITEM_PER_PAGE,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        image: true,
        developer: true,
        isMod:true,
        typeMod:true
      },
    });

    if (!pendingItems) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!pendingItems || pendingItems.length === 0) {
      return NextResponse.json({ message: "No items found" }, { status: 404 });
    }

    return NextResponse.json(pendingItems, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
