import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { UpdateItemDto } from "@/utils/dtos";
import { updateItemSchema } from "@/utils/validationSchemas";

interface Props {
  params: Promise<{ pendingItemId: string }>;
}

/**
 *  @method  GET
 *  @route   ~/api/admin/pendingItems/:pendingItemId
 *  @desc    Get my single pending item
 *  @access  private (only user himself can get his item | SUPER_ADMIN and OWNER can return any users data)
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { pendingItemId } = await params;

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

    const user = await prisma.user.findUnique({
      where: { id: userFromToken.id },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const pendingItem = await prisma.pendingItem.findUnique({
      where: {
        id: pendingItemId,
        createdById: userFromToken.id, // تأكد أن العنصر يخص هذا المستخدم
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
 *  @method  PUT
 *  @route   ~/api/admin/pendingItems/:pendingItemId
 *  @desc    Update my Pending Item
 *  @access  private (only user himself can update item | and OWNER can update any data)
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
    if (!["ADMIN", "SUPER_ADMIN", "OWNER"].includes(userFromToken.role)) {
      return NextResponse.json(
        { message: "Access denied, only admins allowed" },
        { status: 403 }
      );
    }

    const pendingItem = await prisma.pendingItem.findUnique({
      where: { id: pendingItemId, createdById: userFromToken.id },
    });
    if (!pendingItem) {
      return NextResponse.json(
        { message: "Pending Item not found" },
        { status: 404 }
      );
    }

    const body = (await request.json()) as UpdateItemDto;
    const validation = updateItemSchema.safeParse(body);
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

    const updatedPendingItem = await prisma.pendingItem.update({
      where: { id: pendingItemId },
      data: {
        title: body.title,
        description: body.description,
        image: body.image,
        developer: body.developer,
        version: body.version,
        androidVer: body.androidVer,

        itemType: body.itemType,
        categories: body.categories,

        OBB: body.OBB ?? pendingItem.OBB,
        Script: body.Script ?? pendingItem.Script, // احتفظ بالقيمة القديمة إذا لم يتم إرسال Script

        linkAPK: body.linkAPK,
        linkOBB:
          body.OBB ?? pendingItem.OBB
            ? body.linkOBB ?? pendingItem.linkOBB
            : null,
        linkVideo: body.linkVideo,
        linkScript:
          body.Script ?? pendingItem.Script
            ? body.linkScript ?? pendingItem.linkScript
            : null, // لا تغير linkScript إلا إذا كان Script = false بشكل صريح

        sizeFileAPK: body.sizeFileAPK,
        sizeFileOBB:
          body.OBB ?? pendingItem.OBB
            ? body.sizeFileOBB ?? pendingItem.sizeFileOBB
            : null,
        sizeFileScript:
          body.Script ?? pendingItem.Script
            ? body.sizeFileScript ?? pendingItem.sizeFileScript
            : null, // احتفظ بالقيمة القديمة

        appScreens: body.appScreens,
        keywords: body.keywords,

        isMod: body.isMod ?? pendingItem.isMod,
        typeMod:
          body.isMod ?? pendingItem.isMod
            ? body.typeMod ?? pendingItem.typeMod
            : null, // احتفظ بالقيمة السابقة إذا لم يتم إرسال isMod

        ratedFor: body.ratedFor,
        installs: body.installs,
      },
    });

    return NextResponse.json(updatedPendingItem, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}

/**
 *  @method  DELETE
 *  @route   ~/api/admin/pendingItems/:pendingItemId
 *  @desc    Delete my Pending Item
 *  @access  private (only user himself can Delete item | OWNER can Delete any data)
 */
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { pendingItemId } = await params;

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

    const pendingItem = await prisma.pendingItem.findUnique({
      where: { id: pendingItemId, createdById: userFromToken.id },
    });
    if (!pendingItem) {
      return NextResponse.json(
        { message: "Pending Item not found" },
        { status: 404 }
      );
    }

    await prisma.pendingItem.delete({ where: { id: pendingItemId } });

    return NextResponse.json(
      { message: "Pending Item deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
