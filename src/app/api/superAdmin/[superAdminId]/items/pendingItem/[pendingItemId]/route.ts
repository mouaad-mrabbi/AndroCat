import { NextRequest, NextResponse } from "next/server";
import { createItemSchema } from "@/utils/validationSchemas";
import { CreateItemDto } from "@/utils/dtos";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { Item } from "@prisma/client";

interface Props {
  params: Promise<{ superAdminId: string; pendingItemId: string }>;
}

/**
 *  @method  POST
 *  @route   ~/api/superAdmin/:superAdmin/items/pendingItem/:pendingItemId
 *  @desc    Create New item
 *  @access  private (only user himself can create his items | OWNER can create any users data)
 */
export async function POST(request: NextRequest, { params }: Props) {
  try {
    const { pendingItemId } = await params;
    const { superAdminId } = await params;

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

    const pendingItem = (await prisma.pendingItem.findUnique({
      where: { id: pendingItemId },
    })) as CreateItemDto;
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

    const newArticle: Item = await prisma.item.create({
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

        createdById: pendingItem.createdById ?? "default-user-id",
        createdAt: pendingItem.createdAt
          ? new Date(pendingItem.createdAt)
          : new Date(),
      },
    });

    // delete `pendingItem`
    await prisma.pendingItem.delete({
      where: { id: pendingItemId },
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
