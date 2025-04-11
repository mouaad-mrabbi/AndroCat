import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

interface Props {
  params: Promise<{ ownerId: string; itemId: string }>;
}

/**
 *  @method  PUT
 *  @route   ~/api/owner/:ownerId/items/:itemId/approved
 *  @desc    approved item
 *  @access  private (only owner can approved item)
 */
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { ownerId } = await params;
    const { itemId } = await params;

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

    const user = await prisma.user.findUnique({
      where: { id: userFromToken.id, role: "OWNER" },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json(
        { message: "Access denied, only admins allowed" },
        { status: 403 }
      );
    }

    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });
    if (!item) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: { isApproved: true },
    });
    if (!updatedItem) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
