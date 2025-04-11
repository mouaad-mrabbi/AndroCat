import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { ITEM_PER_PAGE } from "@/utils/constants";
import { verifyToken } from "@/utils/verifyToken";

/**
 *  @method  GET
 *  @route   ~/api/owner/items?pageNumber=1
 *  @desc    Get all items with pageNumber
 *  @access  private only owner can get all Items
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
    if (!["OWNER"].includes(userFromToken.role)) {
      return NextResponse.json(
        { message: "Access denied, only admins allowed" },
        { status: 403 }
      );
    }

    const items = await prisma.item.findMany({
      skip: ITEM_PER_PAGE * (pageNumber - 1),
      take: ITEM_PER_PAGE,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        image: true,
        developer: true,
        isMod:true,
        typeMod:true
      },
    });

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "No items found" }, { status: 404 });
    }

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
