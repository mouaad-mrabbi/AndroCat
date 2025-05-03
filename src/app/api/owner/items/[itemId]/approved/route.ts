import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

interface Props {
  params: Promise<{ itemId: string }>;
}

/**
 *  @method  PUT
 *  @route   ~/api/owner/items/:itemId/approved?approved=true
 *  @desc    Approves or disapproves an item
 *  @query   approved=true | approved=false
 *  @access  private (only owners can approve or disapprove items)
 */

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const approved = request.nextUrl.searchParams.get("approved");
    if (!["true", "false"].includes(approved ?? "")) {
      return NextResponse.json(
        { message: "Invalid approved value. Must be 'true' or 'false'." },
        { status: 400 }
      );
    }

    const itemId = Number((await params).itemId);

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
      where: { id: userFromToken.id, role: "OWNER" },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json(
        { message: "Access denied, only admins allowed" },
        { status: 403 }
      );
    }

    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      select: { id: true, isApproved: true },
      data: { isApproved: approved === "true" },
    });
    if (!updatedItem) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        updatedItem,
        message: approved === "true" ? "Approves item" : "Disapproves item",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
