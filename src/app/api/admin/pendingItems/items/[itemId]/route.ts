import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { PendingItem } from "@prisma/client";
import { CreateItemDto } from "@/utils/dtos";
import { createItemSchema } from "@/utils/validationSchemas";

interface Props {
  params: Promise<{ itemId: string }>;
}

/**
 *  @method  POST
 *  @route   ~/api/admin/pendingItems/items/:itemId
 *  @desc    Create New Pending Item for UPDATE item
 *  @access  private (only user himself can create his items | OWNER can create any users data)
 */
export async function POST(request: NextRequest, { params }: Props) {
  try {
    const statusType = request.nextUrl.searchParams.get("statusType");
    const allowedStatusTypes = ["UPDATE", "DELETE"];
    if (statusType && !allowedStatusTypes.includes(statusType)) {
      return NextResponse.json(
        {
          message: `Invalid statusType. Must be one of: ${allowedStatusTypes.join(
            ", "
          )}.`,
        },
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
    if (!["ADMIN", "SUPER_ADMIN", "OWNER"].includes(userFromToken.role)) {
      return NextResponse.json(
        { message: "Access denied, only admins allowed" },
        { status: 403 }
      );
    }

    const body = (await request.json()) as CreateItemDto;
    const validation = createItemSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: validation.error.errors[0].message,
          field: validation.error.errors[0].path.join("."),
        },
        { status: 400 }
      );
    }

    const pendingItem = await prisma.pendingItem.findUnique({
      where: { itemId: itemId },
      select: { itemId: true },
    });
    if (pendingItem) {
      if (statusType === "UPDATE") {
        const newPendingItem: PendingItem = await prisma.pendingItem.update({
          where: { itemId: itemId },
          data: {
            status: "UPDATE",
            title: body.title,
            description: body.description,
            image: body.image,
            developer: body.developer,
            version: body.version,
            androidVer: body.androidVer,

            itemType: body.itemType,
            categories: body.categories,

            OBB: body.OBB,
            Script: body.Script,
            OriginalAPK: body.OriginalAPK,

            linkAPK: body.linkAPK,
            linkOBB: body.OBB ? body.linkOBB : null,
            linkScript: body.Script ? body.linkScript : null,
            linkOriginalAPK: body.OriginalAPK ? body.linkOriginalAPK : null,
            linkVideo: body.linkVideo,

            sizeFileAPK: body.sizeFileAPK,
            sizeFileOBB: body.OBB ? body.sizeFileOBB : null,
            sizeFileScript: body.Script ? body.sizeFileScript : null,
            sizeFileOriginalAPK: body.OriginalAPK
              ? body.sizeFileOriginalAPK
              : null,

            appScreens: body.appScreens,
            keywords: body.keywords,

            isMod: body.isMod,
            typeMod: body.isMod ? body.typeMod : null,

            ratedFor: body.ratedFor,
            installs: body.installs,

            createdById: userFromToken.id,
            itemId: itemId,
          },
        });
        return NextResponse.json(newPendingItem.id, { status: 200 });
      } else if (statusType === "DELETE") {
        const newPendingItem: PendingItem = await prisma.pendingItem.update({
          where: { itemId: itemId },
          data: {
            status: "DELETE",
            title: body.title,
            description: body.description,
            image: body.image,
            developer: body.developer,
            version: body.version,
            androidVer: body.androidVer,

            itemType: body.itemType,
            categories: body.categories,

            OBB: body.OBB,
            Script: body.Script,
            OriginalAPK: body.OriginalAPK,

            linkAPK: body.linkAPK,
            linkOBB: body.OBB ? body.linkOBB : null,
            linkScript: body.Script ? body.linkScript : null,
            linkOriginalAPK: body.OriginalAPK ? body.linkOriginalAPK : null,
            linkVideo: body.linkVideo,

            sizeFileAPK: body.sizeFileAPK,
            sizeFileOBB: body.OBB ? body.sizeFileOBB : null,
            sizeFileScript: body.Script ? body.sizeFileScript : null,
            sizeFileOriginalAPK: body.OriginalAPK
              ? body.sizeFileOriginalAPK
              : null,

            appScreens: body.appScreens,
            keywords: body.keywords,

            isMod: body.isMod,
            typeMod: body.isMod ? body.typeMod : null,

            ratedFor: body.ratedFor,
            installs: body.installs,

            createdById: userFromToken.id,
            itemId: itemId,
          },
        });
        return NextResponse.json(newPendingItem.id, { status: 200 });
      }
    } else {
      if (statusType === "UPDATE") {
        const newPendingItem: PendingItem = await prisma.pendingItem.create({
          data: {
            status: "UPDATE",
            title: body.title,
            description: body.description,
            image: body.image,
            developer: body.developer,
            version: body.version,
            androidVer: body.androidVer,

            itemType: body.itemType,
            categories: body.categories,

            OBB: body.OBB,
            Script: body.Script,
            OriginalAPK:body.OriginalAPK,

            linkAPK: body.linkAPK,
            linkOBB: body.OBB ? body.linkOBB : null,
            linkScript: body.Script ? body.linkScript : null,
            linkOriginalAPK: body.OriginalAPK ? body.linkOriginalAPK : null,
            linkVideo: body.linkVideo,

            sizeFileAPK: body.sizeFileAPK,
            sizeFileOBB: body.OBB ? body.sizeFileOBB : null,
            sizeFileScript: body.Script ? body.sizeFileScript : null,
            sizeFileOriginalAPK: body.OriginalAPK ? body.sizeFileOriginalAPK : null,

            appScreens: body.appScreens,
            keywords: body.keywords,

            isMod: body.isMod,
            typeMod: body.isMod ? body.typeMod : null,

            ratedFor: body.ratedFor,
            installs: body.installs,

            createdById: userFromToken.id,
            itemId: itemId,
          },
        });
        return NextResponse.json(newPendingItem.id, { status: 201 });
      } else if (statusType === "DELETE") {
        const newPendingItem: PendingItem = await prisma.pendingItem.create({
          data: {
            status: "DELETE",
            title: body.title,
            description: body.description,
            image: body.image,
            developer: body.developer,
            version: body.version,
            androidVer: body.androidVer,

            itemType: body.itemType,
            categories: body.categories,

            OBB: body.OBB,
            Script: body.Script,
            OriginalAPK:body.OriginalAPK,

            linkAPK: body.linkAPK,
            linkOBB: body.OBB ? body.linkOBB : null,
            linkScript: body.Script ? body.linkScript : null,
            linkOriginalAPK: body.OriginalAPK ? body.linkOriginalAPK : null,
            linkVideo: body.linkVideo,

            sizeFileAPK: body.sizeFileAPK,
            sizeFileOBB: body.OBB ? body.sizeFileOBB : null,
            sizeFileScript: body.Script ? body.sizeFileScript : null,
            sizeFileOriginalAPK: body.OriginalAPK ? body.sizeFileOriginalAPK : null,
            
            appScreens: body.appScreens,
            keywords: body.keywords,

            isMod: body.isMod,
            typeMod: body.isMod ? body.typeMod : null,

            ratedFor: body.ratedFor,
            installs: body.installs,

            createdById: userFromToken.id,
            itemId: itemId,
          },
        });
        return NextResponse.json(newPendingItem.id, { status: 201 });
      }
    }
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
