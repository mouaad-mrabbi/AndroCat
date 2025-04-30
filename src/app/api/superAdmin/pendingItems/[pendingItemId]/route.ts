import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { createItemSchema } from "@/utils/validationSchemas";
import { CreateItemDto } from "@/utils/dtos";
import { renameFile } from "@/lib/r2";

interface Props {
  params: Promise<{ pendingItemId: string }>;
}

/**
 *  @method  GET
 *  @route   ~/api/superAdmin/pendingItems/:pendingItemId
 *  @desc    Get single pending item
 *  @access  private (only SUPER_ADMIN and OWNER can return any users data)
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const pendingItemId = Number((await params).pendingItemId);

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

    const pendingItem = await prisma.pendingItem.findUnique({
      where: {
        id: pendingItemId,
      },
      include: {
        createdBy: {
          select: { username: true, profile: true },
        },
      },
    });
    if (!pendingItem) {
      return NextResponse.json(
        { message: "Pending Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(pendingItem, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 *  @method  POST
 *  @route   ~/api/superAdmin/pendingItems/:pendingItemId
 *  @desc    Create item from pending item by ID.
 *  @access  private (only user himself can create his items | OWNER can create any users data)
 */
export async function POST(request: NextRequest, { params }: Props) {
  try {
    const pendingItemId = Number((await params).pendingItemId);

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
    })) as CreateItemDto & { itemId: number };
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
          message:
            validation.error.errors[0].path.join(".") +
            " " +
            validation.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const newItem = await prisma.item.create({
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
    await renameFile(
      new URL(newItem.image).pathname.slice(1),
      `posts/${newItem.id}/${newItem.image.split("/").pop()}`
    );
    await renameFile(
      new URL(newItem.linkAPK).pathname.slice(1),
      `apks/${newItem.id}/${newItem.linkAPK.split("/").pop()}`
    );
    if (newItem.OBB && newItem.linkOBB) {
      await renameFile(
        new URL(newItem.linkOBB).pathname.slice(1),
        `obbs/${newItem.id}/${newItem.linkOBB.split("/").pop()}`
      );
    }
    if (newItem.Script && newItem.linkScript) {
      await renameFile(
        new URL(newItem.linkScript).pathname.slice(1),
        `scripts/${newItem.id}/${newItem.linkScript.split("/").pop()}`
      );
    }
    await Promise.all(
      newItem.appScreens.map((screen) =>
        renameFile(
          new URL(screen).pathname.slice(1),
          `screenshots/${newItem.id}/${screen.split("/").pop()}`
        )
      )
    );

    return NextResponse.json(
      { id: newItem.id, message: "New items added" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
