import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

interface Props {
  params: Promise<{ itemId: string }>;
}

/**
 *  @method  GET
 *  @route   ~/api/consumer/items/:itemId
 *  @desc    Get Single item By Id
 *  @access  public
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { itemId } = await params;

    const item = await prisma.item.findUnique({
      where: {
        id: itemId,
        isApproved: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        developer: true,
        version: true,
        androidVer: true,
        itemType: true,
        categories: true,
        OBB: true,
        Script: true,
        linkAPK: true,
        linkOBB: true,
        linkVideo: true,
        linkScript: true,
        sizeFileAPK: true,
        sizeFileOBB: true,
        sizeFileScript: true,
        appScreens: true,
        keywords: true,
        isMod: true,
        typeMod: true,
        ratedFor: true,
        installs: true,
        ratingCount: true,
        averageRating: true,
        updatedAt: true,
      },
    });
    if (!item) {
      return NextResponse.json({ message: "No item found" }, { status: 404 });
    }

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
