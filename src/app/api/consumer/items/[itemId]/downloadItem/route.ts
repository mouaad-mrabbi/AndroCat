import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

interface Props {
  params: Promise<{ itemId: string }>;
}

/**
 *  @method  GET
 *  @route   ~/api/consumer/items/:itemId/downloadItem
 *  @query   downloadType - The type of the download (apk, obb, or script).
 *  @desc    get item download details (APK, OBB, or Script).
 *  @access  public
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const downloadType = (
      request.nextUrl.searchParams.get("downloadType") || ""
    ).toLowerCase();
    const validTypes = ["apk", "obb", "script"];
    if (!validTypes.includes(downloadType)) {
      return NextResponse.json(
        {
          message: `Invalid itemType. Must be one of: ${validTypes.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const { itemId } = await params;
    if (!itemId) {
      return NextResponse.json(
        { message: "Item ID is required" },
        { status: 400 }
      );
    }

    if (downloadType === "apk") {
      const item = await prisma.item.findUnique({
        where: { id: itemId, isApproved: true },
        select: {
          id: true,
          title: true,
          image: true,
          androidVer: true,
          linkAPK: true,
          sizeFileAPK: true,
        },
      });
      if (!item) {
        return NextResponse.json(
          { message: "item not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(item, { status: 200 });
    } else if (downloadType === "obb") {
      const item = await prisma.item.findUnique({
        where: { id: itemId, isApproved: true, OBB: true },
        select: {
          id: true,
          title: true,
          image: true,
          androidVer: true,
          linkOBB: true,
          sizeFileOBB: true,
        },
      });
      if (!item) {
        return NextResponse.json(
          { message: "item not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(item, { status: 200 });
    } else if (downloadType === "script") {
      const item = await prisma.item.findUnique({
        where: { id: itemId, isApproved: true, Script: true },
        select: {
          id: true,
          title: true,
          image: true,
          androidVer: true,
          linkScript: true,
          sizeFileScript: true,
        },
      });
      if (!item) {
        return NextResponse.json(
          { message: "item not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(item, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
