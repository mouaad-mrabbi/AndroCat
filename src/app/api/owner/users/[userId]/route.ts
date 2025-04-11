import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

interface Props {
  params: Promise<{ userId: string}>;
}

/**
 *  @method  GET
 *  @route   ~/api/owner/users/:userId
 *  @desc    Get single user
 *  @access  private only owner can get single user 
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { userId } = await params;

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

    const user = await prisma.user.findUnique({
      where: { id: userFromToken.id },
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
