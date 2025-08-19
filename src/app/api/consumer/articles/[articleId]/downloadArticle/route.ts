import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

interface Props {
  params: Promise<{ articleId: string }>;
}

/**
 *  @method  GET
 *  @route   ~/api/consumer/articles/:articleId/downloadArticle?downloadType=
 *  @query   downloadType - The type of the download (apk, obb, script, or original).
 *  @desc    get Article download details (APK, OBB, Script, or Original).
 *  @access  public
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const orderValue = searchParams.get("order");
    const orderParams = parseInt(orderValue ?? "", 10);
    if (!orderValue || isNaN(orderParams) || orderParams < 1) {
      return NextResponse.json(
        { error: "Invalid or missing 'order' parameter" },
        { status: 400 }
      );
    }

    const downloadType = (searchParams.get("downloadType") || "").toLowerCase();
    const validTypes = ["apk", "xapk", "obb", "script", "original-apk"];
    if (!validTypes.includes(downloadType)) {
      return NextResponse.json(
        {
          message: `Invalid download Type. Must be one of: ${validTypes.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    const articleId = Number((await params).articleId);
    if (!articleId) {
      return NextResponse.json(
        { message: "article ID is required" },
        { status: 400 }
      );
    }

    if (downloadType === "apk") {
      const article = await prisma.article.findUnique({
        where: { id: articleId, isApproved: true },
        select: {
          id: true,
          title: true,
          secondTitle: true,
          image: true,
          androidVer: true,
          typeMod: true,
          apks: true,
        },
      });
      if (!article) {
        return NextResponse.json(
          { message: "article not found" },
          { status: 404 }
        );
      }
      if (article.apks.length < orderParams) {
        return NextResponse.json({ message: "apk not found" }, { status: 404 });
      }

      const result = {
        id: article.id,
        title: article.title,
        secondTitle: article.secondTitle,
        image: article.image,
        androidVer: article.androidVer,
        typeMod: article.typeMod,

        version: article.apks[orderParams - 1].version,
        isMod: article.apks[orderParams - 1].isMod,
        link: article.apks[orderParams - 1].link,
        size: article.apks[orderParams - 1].size,
      };

      return NextResponse.json(result, { status: 200 });
    }else if (downloadType === "xapk") {
      const article = await prisma.article.findUnique({
        where: { id: articleId, isApproved: true },
        select: {
          id: true,
          title: true,
          secondTitle: true,
          image: true,
          androidVer: true,
          typeMod: true,
          xapks: true,
        },
      });
      if (!article) {
        return NextResponse.json(
          { message: "article not found" },
          { status: 404 }
        );
      }
      if (article.xapks.length < orderParams) {
        return NextResponse.json({ message: "xapk not found" }, { status: 404 });
      }

      const result = {
        id: article.id,
        title: article.title,
        secondTitle: article.secondTitle,
        image: article.image,
        androidVer: article.androidVer,
        typeMod: article.typeMod,

        version: article.xapks[orderParams - 1].version,
        isMod: article.xapks[orderParams - 1].isMod,
        link: article.xapks[orderParams - 1].link,
        size: article.xapks[orderParams - 1].size,
      };

      return NextResponse.json(result, { status: 200 });
    } else if (downloadType === "obb") {
      const article = await prisma.article.findUnique({
        where: { id: articleId, isApproved: true, OBB: true },
        select: {
          id: true,
          title: true,
          secondTitle: true,
          image: true,
          version: true,
          androidVer: true,
          linkOBB: true,
          sizeFileOBB: true,
          isMod: true,
          typeMod: true,
        },
      });

      if (!article) {
        return NextResponse.json(
          { message: "article not found" },
          { status: 404 }
        );
      }

      const result = {
        id: article.id,
        title: article.title,
        secondTitle: article.secondTitle,
        image: article.image,
        version: article.version,
        androidVer: article.androidVer,
        isMod: article.isMod,
        typeMod: article.typeMod,
        link: article.linkOBB,
        size: article.sizeFileOBB,
      };

      return NextResponse.json(result, { status: 200 });
    } else if (downloadType === "script") {
      const article = await prisma.article.findUnique({
        where: { id: articleId, isApproved: true, Script: true },
        select: {
          id: true,
          title: true,
          secondTitle: true,
          image: true,
          version: true,
          androidVer: true,
          linkScript: true,
          sizeFileScript: true,
          isMod: true,
          typeMod: true,
        },
      });

      if (!article) {
        return NextResponse.json(
          { message: "article not found" },
          { status: 404 }
        );
      }

      const result = {
        id: article.id,
        title: article.title,
        secondTitle: article.secondTitle,
        image: article.image,
        version: article.version,
        androidVer: article.androidVer,
        isMod: article.isMod,
        typeMod: article.typeMod,
        link: article.linkScript,
        size: article.sizeFileScript,
      };

      return NextResponse.json(result, { status: 200 });
    } else if (downloadType === "original-apk") {
      const article = await prisma.article.findUnique({
        where: { id: articleId, isApproved: true, OriginalAPK: true },
        select: {
          id: true,
          title: true,
          secondTitle: true,
          image: true,
          androidVer: true,
          versionOriginal: true,
          linkOriginalAPK: true,
          sizeFileOriginalAPK: true,
        },
      });

      if (!article) {
        return NextResponse.json(
          { message: "article not found" },
          { status: 404 }
        );
      }

      const result = {
        id: article.id,
        title: article.title,
        secondTitle: article.secondTitle,
        image: article.image,
        androidVer: article.androidVer,
        version: article.versionOriginal,
        link: article.linkOriginalAPK,
        size: article.sizeFileOriginalAPK,
      };

      return NextResponse.json(result, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
