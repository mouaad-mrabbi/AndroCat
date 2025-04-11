import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { ITEM_PER_PAGE } from "@/utils/constants";
import { verifyToken } from "@/utils/verifyToken";

interface Props {
  params: Promise<{ ownerId: string }>;
}

/**
 *  @method  GET
 *  @route   ~/api/owner/:owner/pendingItems?pageNumber=1
 *  @desc    Get all Pending Item with pageNumber
 *  @access  private only owner can get all Pending Item
 */
export async function GET(request: NextRequest, { params }: Props) {
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

    const { ownerId } = await params;

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
    if (userFromToken.id !== ownerId) {
      return NextResponse.json(
        { message: "Access denied, you are not authorized" },
        { status: 403 }
      );
    }

    const pendingItems = await prisma.pendingItem.findMany({
      skip: ITEM_PER_PAGE * (pageNumber - 1),
      take: ITEM_PER_PAGE,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        image: true,
        developer: true,
      },
    });

    if (!pendingItems || pendingItems.length === 0) {
      return NextResponse.json({ message: "No items found" }, { status: 404 });
    }

    return NextResponse.json(pendingItems, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}