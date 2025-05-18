import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { CreateArticleDto } from "@/utils/dtos";
import { createArticleSchema } from "@/utils/validationSchemas";
import { ARTICLE_PER_PAGE } from "@/utils/constants";
import { PendingArticle } from "@prisma/client";

/**
 *  @method  GET
 *  @route   ~/api/admin/pendingArticles?pageNumber=1
 *  @desc    Get all my pending Articles
 *  @access  private (only user himself can get his Articles | SUPER_ADMIN and OWNER can return any users data)
 */
export async function GET(request: NextRequest) {
  try {
    const pageNumber = parseInt(
      request.nextUrl.searchParams.get("pageNumber") || "1"
    );
    if (isNaN(pageNumber) || pageNumber < 1) {
      return NextResponse.json(
        { message: "Invalid page number" },
        { status: 400 }
      );
    }

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

    const userWithArticles = await prisma.user.findUnique({
      where: { id: userFromToken.id },
      include: {
        pendingArticles: {
          skip: ARTICLE_PER_PAGE * (pageNumber - 1),
          take: ARTICLE_PER_PAGE,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            image: true,
            developer: true,
            isMod:true,
            typeMod:true
          },
        },
      },
    });
    if (!userWithArticles) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (
      !userWithArticles.pendingArticles ||
      userWithArticles.pendingArticles.length === 0
    ) {
      return NextResponse.json({ message: "No Articles found" }, { status: 404 });
    }

    return NextResponse.json(userWithArticles.pendingArticles, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 *  @method  POST
 *  @route   ~/api/admin/pendingArticles
 *  @desc    Create New Article
 *  @access  private (only user himself can create his Articles | OWNER can create any users data)
 */
export async function POST(request: NextRequest) {
  try {
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

    const body = (await request.json()) as CreateArticleDto;
    const validation = createArticleSchema.safeParse(body);
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

    const newPendingArticle: PendingArticle = await prisma.pendingArticle.create({
      data: {
        status: "CREATE",
        title: body.title,
        secondTitle:body.secondTitle,
        description: body.description,
        descriptionMeta:body.descriptionMeta,
        image: body.image,
        developer: body.developer,
        version: body.version,
        versionOriginal: body.OriginalAPK ? body.versionOriginal : null,
        androidVer: body.androidVer,

        articleType: body.articleType,
        gameCategory:body.articleType==="GAME"? body.gameCategory:null,
        programCategory:body.articleType==="PROGRAM"? body.programCategory:null,

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
      },
    });

    return NextResponse.json(newPendingArticle, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error",error },
      { status: 500 }
    );
  }
}
