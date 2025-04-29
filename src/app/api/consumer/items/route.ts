import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { ITEM_PER_PAGE } from "@/utils/constants";
import { ItemType } from "@prisma/client";

/**
 *  @method  GET
 *  @route   ~/api/consumer/items?pageNumber=1&itemType={GAME|PROGRAM}  Get items of the specified type.  
 *  @desc    Get all item By Page Number
 *  @access  public
 */
export async function GET(request: NextRequest) {
  try {
    const pageNumber = parseInt(
      request.nextUrl.searchParams.get("pageNumber") || "1"
    );
    const itemType = request.nextUrl.searchParams.get("itemType");

    // التحقق من صحة pageNumber
    if (isNaN(pageNumber) || pageNumber < 1) {
      return NextResponse.json(
        { message: "Invalid page number" },
        { status: 400 }
      );
    }

    // التحقق من صحة itemType (يجب أن يكون "GAME" أو "PROGRAM" فقط)
    if (itemType && itemType !== "GAME" && itemType !== "PROGRAM") {
      return NextResponse.json(
        { message: "Invalid itemType. Must be 'GAME' or 'PROGRAM'." },
        { status: 400 }
      );
    }

    const items = await prisma.item.findMany({
      skip: ITEM_PER_PAGE * (pageNumber - 1),
      take: ITEM_PER_PAGE,
      where: {
        isApproved: true,
        ...(itemType ? { itemType: itemType as ItemType } : {}), // تحويل itemType إلى النوع الصحيح
      },
      orderBy: { updatedAt: 'desc'},
      select: {
        id: true,
        title: true,
        image: true,
        developer: true,
        averageRating: true,
        isMod:true,
        typeMod:true
      },
    });

    // تحقق إذا كانت items فارغة
    if (!items || items.length === 0) {
      return NextResponse.json({ message: "No items found" }, { status: 404 });
    }

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
