import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { ITEM_PER_PAGE } from "@/utils/constants";

interface Props {
  params: Promise<{ superAdminId: string }>;
}

/**
 *  @method  GET
 *  @route   ~/api/superAdmin/:superAdminId/items?pageNumber=1
 *  @desc    Get all items validated for one user
 *  @access  private (only user himself can get his items | OWNER can return any users data)
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

    const { superAdminId } = await params;

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
    if (
      userFromToken.id !== superAdminId &&
      !["OWNER"].includes(userFromToken.role)
    ) {
      return NextResponse.json(
        { message: "Access denied, you are not authorized" },
        { status: 403 }
      );
    }

    const userWithItems = await prisma.user.findUnique({
      where: { id: superAdminId },
      include: {
        validatedItems: {
          skip: ITEM_PER_PAGE * (pageNumber - 1),
          take: ITEM_PER_PAGE,
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!userWithItems) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (
      !userWithItems.validatedItems ||
      userWithItems.validatedItems.length === 0
    ) {
      return NextResponse.json({ message: "No items found" }, { status: 404 });
    }

    return NextResponse.json(userWithItems.validatedItems, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}