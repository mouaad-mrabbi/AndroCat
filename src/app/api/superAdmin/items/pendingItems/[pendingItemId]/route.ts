import { NextRequest, NextResponse } from "next/server";
import { createItemSchema } from "@/utils/validationSchemas";
import { CreateItemDto } from "@/utils/dtos";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

interface Props {
  params: Promise<{ pendingItemId: string }>;
}

/**
 *  @method  PUT
 *  @route   ~/api/superAdmin/items/pendingItems/:pendingItemId
 *  @desc    update item for pendingItemId
 *  @access  private (only user himself can create his items | OWNER can create any users data)
 */
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { pendingItemId } = await params;

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

    const pendingItem = (await prisma.pendingItem.findUnique({
      where: { id: pendingItemId },
    })) as CreateItemDto & { itemId: string };
    if (!pendingItem) {
      return NextResponse.json(
        { message: "Pending Item not found" },
        { status: 404 }
      );
    }

    const validation = createItemSchema.safeParse(pendingItem);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: validation.error.errors[0].message,
          field: validation.error.errors[0].path.join("."),
        },
        { status: 400 }
      );
    }

    const newItem = await prisma.item.update({
      where: { id: pendingItem.itemId },
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
        validatedById: true,
        createdById: true,
        createdAt: true,
        isApproved: true,
      },
      data: {
        title: pendingItem.title,
        description: pendingItem.description,
        image: pendingItem.image,
        developer: pendingItem.developer,
        version: pendingItem.version,
        androidVer: pendingItem.androidVer,

        itemType: pendingItem.itemType,
        categories: pendingItem.categories,

        OBB: pendingItem.OBB,
        Script: pendingItem.Script,

        linkAPK: pendingItem.linkAPK,
        linkOBB: pendingItem.OBB ? pendingItem.linkOBB : null,
        linkVideo: pendingItem.linkVideo,
        linkScript: pendingItem.Script ? pendingItem.linkScript : null,

        sizeFileAPK: pendingItem.sizeFileAPK,
        sizeFileOBB: pendingItem.OBB ? pendingItem.sizeFileOBB : null,
        sizeFileScript: pendingItem.Script ? pendingItem.sizeFileScript : null,

        appScreens: pendingItem.appScreens,
        keywords: pendingItem.keywords,

        isMod: pendingItem.isMod,
        typeMod: pendingItem.isMod ? pendingItem.typeMod : null,

        ratedFor: pendingItem.ratedFor,
        installs: pendingItem.installs,

        validatedById: userFromToken.id,

        createdById: pendingItem.createdById,
        createdAt: pendingItem.createdAt
          ? new Date(pendingItem.createdAt)
          : new Date(),

        isApproved: false,
      },
    });

    await prisma.pendingItem.delete({ where: { id: pendingItemId } });

    return NextResponse.json(newItem.id, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
