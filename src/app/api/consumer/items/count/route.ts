import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { ItemType } from "@prisma/client";

/**
 *  @method  GET
 *  @route   ~/api/consumer/items/count?itemType=GAME
 *  @desc    Get item Count
 *  @access  public
 */
export async function GET(request: NextRequest) {
  try {
    const itemType = request.nextUrl.searchParams.get("itemType");
    if (itemType && itemType !== "GAME" && itemType !== "PROGRAM") {
      return NextResponse.json(
        { message: "Invalid itemType. Must be 'GAME' or 'PROGRAM'." },
        { status: 400 }
      );
    }

    const count = await prisma.item.count({
      where: {
        isApproved: true,
        ...(itemType ? { itemType: itemType as ItemType } : {}),
      },
    });
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
