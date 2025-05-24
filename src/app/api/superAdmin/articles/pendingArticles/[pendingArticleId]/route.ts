import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { deleteFile } from "@/lib/r2";
import { createArticleSchema } from "@/utils/validationSchemas";
import { CreateArticleDto } from "@/utils/dtos";

interface Props {
  params: Promise<{ pendingArticleId: string }>;
}

/**
 *  @method  PUT
 *  @route   ~/api/superAdmin/articles/pendingArticles/:pendingArticleId
 *  @desc    update Article for pendingArticleId
 *  @access  private (only user himself can create his Articles | OWNER can create any users data)
 */
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const pendingArticleId = Number((await params).pendingArticleId);

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

    const pendingArticle = (await prisma.pendingArticle.findUnique({
      where: { id: pendingArticleId },
    })) as CreateArticleDto & { articleId: number };
    if (!pendingArticle) {
      return NextResponse.json(
        { message: "Pending Article not found" },
        { status: 404 }
      );
    }

    const validation = createArticleSchema.safeParse(pendingArticle);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: validation.error.errors[0].message,
          field: validation.error.errors[0].path.join("."),
        },
        { status: 400 }
      );
    }

    const article = await prisma.article.findUnique({
      where: { id: pendingArticle.articleId },
      select: {
        image: true,
        linkAPK: true,
        linkOBB: true,
        linkScript: true,
        linkOriginalAPK:true,
        appScreens: true,
      },
    });
    if (!article) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 });
    }

    const newArticle = await prisma.article.update({
      where: { id: pendingArticle.articleId },
      select: {
        id: true,
        title: true,
        secondTitle:true,
        description: true,
        descriptionMeta:true,
        image: true,
        developer: true,
        version: true,
        versionOriginal:true,
        androidVer: true,

        articleType: true,
        gameCategory: true,
        programCategory:true,

        OBB: true,
        Script: true,
        OriginalAPK: true,

        linkAPK: true,
        linkOBB: true,
        linkScript: true,
        linkVideo: true,
        linkOriginalAPK: true,

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
        validatedById: true,
        createdById: true,
        createdAt: true,
        isApproved: true,
      },
      data: {
        title: pendingArticle.title,
        secondTitle:pendingArticle.secondTitle,
        description: pendingArticle.description,
        descriptionMeta:pendingArticle.descriptionMeta,
        image: pendingArticle.image,
        developer: pendingArticle.developer,
        version: pendingArticle.version,
        versionOriginal:pendingArticle.versionOriginal,
        androidVer: pendingArticle.androidVer,

        articleType: pendingArticle.articleType,
        gameCategory: pendingArticle.gameCategory,
        programCategory: pendingArticle.programCategory,

        OBB: pendingArticle.OBB,
        Script: pendingArticle.Script,
        OriginalAPK:pendingArticle.OriginalAPK,

        linkAPK: pendingArticle.linkAPK,
        linkOBB: pendingArticle.OBB ? pendingArticle.linkOBB : null,
        linkScript: pendingArticle.Script ? pendingArticle.linkScript : null,
        linkOriginalAPK: pendingArticle.OriginalAPK ? pendingArticle.linkOriginalAPK : null,
        linkVideo: pendingArticle.linkVideo,

        sizeFileAPK: pendingArticle.sizeFileAPK,
        sizeFileOBB: pendingArticle.OBB ? pendingArticle.sizeFileOBB : null,
        sizeFileScript: pendingArticle.Script ? pendingArticle.sizeFileScript : null,
        sizeFileOriginalAPK: pendingArticle.OriginalAPK ? pendingArticle.sizeFileOriginalAPK : null,

        appScreens: pendingArticle.appScreens,
        keywords: pendingArticle.keywords,

        isMod: pendingArticle.isMod,
        typeMod: pendingArticle.isMod ? pendingArticle.typeMod : null,

        ratedFor: pendingArticle.ratedFor,
        installs: pendingArticle.installs,

        validatedById: userFromToken.id,

        createdById: pendingArticle.createdById,
        createdAt: pendingArticle.createdAt
          ? new Date(pendingArticle.createdAt)
          : new Date(),

        isApproved: false,
      },
    });

    if (article.image !== newArticle.image) {
      await deleteFile(article.image);
    }
    if (article.linkAPK !== newArticle.linkAPK) {
      await deleteFile(article.linkAPK);
    }
    if (article.linkOBB !== newArticle.linkOBB && article.linkOBB) {
      await deleteFile(article.linkOBB);
    }
    if (article.linkScript !== newArticle.linkScript && article.linkScript) {
      await deleteFile(article.linkScript);
    }   
     if (article.linkOriginalAPK !== newArticle.linkOriginalAPK && article.linkOriginalAPK) {
      await deleteFile(article.linkOriginalAPK);
    }
    await Promise.all(
      article.appScreens.map(async (screen) => {
        if (!newArticle.appScreens.includes(screen) && screen) {
          try {
            await deleteFile(screen);
          } catch (error) {
            console.error("Failed to delete screen:", screen, error);
          }
        }
      })
    );

    await prisma.pendingArticle.delete({ where: { id: pendingArticleId } });

    return NextResponse.json(newArticle.id, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
