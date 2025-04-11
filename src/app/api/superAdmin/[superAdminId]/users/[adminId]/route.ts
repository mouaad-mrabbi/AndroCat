import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

interface Props {
  params: Promise<{ superAdminId: string; adminId: string }>;
}

/**
 *  @method  GET
 *  @route   ~/api/superAdmin/:superAdminId/users/:adminId
 *  @desc    Get single user admin
 *  @access  private (only superAdmin can get single admin | OWNER can return any users data)
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { superAdminId } = await params;
    const { adminId } = await params;

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

    const user = await prisma.user.findUnique({
      where: { id: adminId },
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
