import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

interface Props {
  params: Promise<{ itemId: string }>;
}

/**
 *  @method  GET
 *  @route   ~/api/owner/items/:itemId
 *  @desc    Get single item
 *  @access  private only owner can get Item
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
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

    const item = await prisma.item.findUnique({
      where: { id: itemId },
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
        OriginalAPK: true,

        linkAPK: true,
        linkOBB: true,
        linkScript: true,
        linkOriginalAPK: true,
        linkVideo: true,

        sizeFileAPK: true,
        sizeFileOBB: true,
        sizeFileScript: true,
        sizeFileOriginalAPK: true,

        appScreens: true,
        keywords: true,

        isMod: true,
        typeMod: true,

        ratedFor: true,
        installs: true,
        ratingCount: true,
        averageRating: true,
        views: true,
        downloadCount: true,

        isApproved: true,

        createdById: true,
        validatedById: true,

        createdAt: true,
        updatedAt: true,
        createdBy: { select: { profile: true, username: true } },

        validatedAt: true,
        validatedBy: { select: { profile: true, username: true } },

        pendingItem: { select: { id: true } },
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
