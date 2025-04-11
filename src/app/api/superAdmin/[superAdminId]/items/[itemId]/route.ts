import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

interface Props {
  params: Promise<{ superAdminId: string; itemId: string }>;
}

/**
 *  @method  GET
 *  @route   ~/api/superAdmin/:superAdminId/items/:itemId
 *  @desc    Get single item validated for user
 *  @access  private (only user himself can get his item | OWNER can return any users data)
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { superAdminId } = await params;
    const { itemId } = await params;

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
    if (userFromToken.id !== superAdminId&&
      !["OWNER"].includes(userFromToken.role)) {
      return NextResponse.json(
        { message: "Access denied, you are not authorized" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: superAdminId },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const item = await prisma.item.findFirst({
      where: {
        id: itemId,
        createdById: superAdminId, // تأكد أن العنصر يخص هذا المستخدم
      },
      include: {
        createdBy: {
          select: { username: true },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ message: "item not found" }, { status: 404 });
    }

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 *  @method  DELETE
 *  @route   ~/api/superAdmin/:superAdminId/items/:itemId
 *  @desc    Delete Item
 *  @access  private (only user himself can Delete item | OWNER can Delete any data)
 */
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { superAdminId } = await params;
    const { itemId } = await params;

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
    if (
      userFromToken.id !== superAdminId &&
      !["OWNER"].includes(userFromToken.role)
    ) {
      return NextResponse.json(
        { message: "Access denied, you are not authorized" },
        { status: 403 }
      );
    }

    const pendingItem = await prisma.item.findUnique({
      where: { id: itemId },
    });
    if (!pendingItem) {
      return NextResponse.json(
        { message: "Item not found" },
        { status: 404 }
      );
    }

    await prisma.item.delete({ where: { id: itemId } });

    return NextResponse.json(
      { message: "Item deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}