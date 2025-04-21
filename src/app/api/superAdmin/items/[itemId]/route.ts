import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

interface Props {
  params: Promise<{ itemId: string }>;
}

/**
 *  @method  GET
 *  @route   ~/api/superAdmin/items/:itemId
 *  @desc    Get my single item validated
 *  @access  private (only user himself can get his item | OWNER can return any users data)
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
    if (!["SUPER_ADMIN", "OWNER"].includes(userFromToken.role)) {
      return NextResponse.json(
        { message: "Access denied, only admins allowed" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userFromToken.id },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const item = await prisma.item.findUnique({
      where: {
        id: itemId,
        validatedById: userFromToken.id, // تأكد أن العنصر يخص هذا المستخدم
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
        views: true,
        downloadCount: true,

        isApproved: true,

        createdById: true,
        validatedById: true,

        createdAt: true,
        updatedAt: true,
        createdBy: {select:{profile:true,username:true}},

        validatedAt: true,
        validatedBy: {select:{profile:true,username:true}},

        pendingItem: true,
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
 *  @route   ~/api/superAdmin/items/:itemId
 *  @desc    Delete my Item
 *  @access  private (only user himself can Delete item | OWNER can Delete any data)
 */
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const itemId = Number((await params).itemId);

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

    const pendingItem = await prisma.item.findUnique({
      where: { id: itemId ,validatedById: userFromToken.id,},
    });
    if (!pendingItem) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    await prisma.item.delete({ where: { id: itemId } });

    return NextResponse.json({ message: "Item deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}