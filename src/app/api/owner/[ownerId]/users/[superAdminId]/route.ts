import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

interface Props {
  params: Promise<{ superAdminId: string; ownerId: string }>;
}

/**
 *  @method  GET
 *  @route   ~/api/owner/:ownerId/users/:superAdminId
 *  @desc    Get single user admin & superAdmin & OWNER
 *  @access  private (only superAdmin can get single admin | OWNER can return any users data)
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { superAdminId } = await params;
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
    if (
      userFromToken.id !== ownerId &&
      !["OWNER"].includes(userFromToken.role)
    ) {
      return NextResponse.json(
        { message: "Access denied, you are not authorized" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: superAdminId },
      include: {
        createdItems: {
          select: { id: true },
        },
        validatedItems: {
          select: { id: true },
        },
        pendingItems: {
          select: { id: true },
        },
        rejectedPendingItems: {
          select: { id: true },
        },
      },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
