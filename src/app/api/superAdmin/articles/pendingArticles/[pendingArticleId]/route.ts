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
      include:{apks:true, xapks:true}
    })) as unknown as CreateArticleDto & { articleId: number };
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
        linkOriginalAPK: true,
        appScreens: true,
        apks: true,
        xapks: true,
      },
    });
    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    const newArticle = await prisma.article.update({
      where: { id: pendingArticle.articleId },
      select: {
        id: true,
        title: true,
        secondTitle: true,
        description: true,
        descriptionMeta: true,
        image: true,
        developer: true,
        version: true,
        versionOriginal: true,
        androidVer: true,

        articleType: true,
        gameCategory: true,
        programCategory: true,

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

        screenType: true,
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

        apks: true,
        xapks: true,
        paragraphs:true
      },
      data: {
        title: pendingArticle.title,
        secondTitle: pendingArticle.secondTitle,
        description: pendingArticle.description,
        descriptionMeta: pendingArticle.descriptionMeta,
        image: pendingArticle.image,
        developer: pendingArticle.developer,
        version: pendingArticle.version,
        versionOriginal: pendingArticle.versionOriginal,
        androidVer: pendingArticle.androidVer,

        articleType: pendingArticle.articleType,
        gameCategory: pendingArticle.gameCategory,
        programCategory: pendingArticle.programCategory,

        OBB: pendingArticle.OBB,
        Script: pendingArticle.Script,
        OriginalAPK: pendingArticle.OriginalAPK,

        linkAPK: pendingArticle.linkAPK,
        linkOBB: pendingArticle.OBB ? pendingArticle.linkOBB : null,
        linkScript: pendingArticle.Script ? pendingArticle.linkScript : null,
        linkOriginalAPK: pendingArticle.OriginalAPK
          ? pendingArticle.linkOriginalAPK
          : null,
        linkVideo: pendingArticle.linkVideo,

        sizeFileAPK: pendingArticle.sizeFileAPK,
        sizeFileOBB: pendingArticle.OBB ? pendingArticle.sizeFileOBB : null,
        sizeFileScript: pendingArticle.Script
          ? pendingArticle.sizeFileScript
          : null,
        sizeFileOriginalAPK: pendingArticle.OriginalAPK
          ? pendingArticle.sizeFileOriginalAPK
          : null,

        screenType: pendingArticle.screenType,
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

        ...(pendingArticle.apks && pendingArticle.apks.length > 0
          ? {
              apks: {
                deleteMany: {},
                createMany: {
                  data: pendingArticle.apks.map((apk, index) => ({
                    version: apk.version,
                    link: apk.link,
                    size: apk.size,
                    isMod: apk.isMod,
                    order: index,
                  })),
                },
              },
            }
          : {}),
        ...(pendingArticle.xapks && pendingArticle.xapks.length > 0
          ? {
              xapks: {
                deleteMany: {},
                createMany: {
                  data: pendingArticle.xapks.map((xapk, index) => ({
                    version: xapk.version,
                    link: xapk.link,
                    size: xapk.size,
                    isMod: xapk.isMod,
                    order: index,
                  })),
                },
              },
            }
          : {}),
        ...(pendingArticle.paragraphs && pendingArticle.paragraphs.length > 0
          ? {
              paragraphs: {
                deleteMany: {},
                createMany: {
                  data: pendingArticle.paragraphs.map((p, index) => ({
                    articleId: pendingArticle.articleId,
                    title: p.title,
                    content: p.content,
                    order: index,
                  })),
                },
              },
            }
          : {}),
      },
    });

    await Promise.all(
      [
        article.image !== newArticle.image && deleteFile(article.image),
        article.linkAPK !== newArticle.linkAPK && deleteFile(article.linkAPK),
        article.linkOBB !== newArticle.linkOBB &&
          article.linkOBB &&
          deleteFile(article.linkOBB),
        article.linkScript !== newArticle.linkScript &&
          article.linkScript &&
          deleteFile(article.linkScript),
        article.linkOriginalAPK !== newArticle.linkOriginalAPK &&
          article.linkOriginalAPK &&
          deleteFile(article.linkOriginalAPK),
        ...article.appScreens.map(
          (screen) =>
            !newArticle.appScreens.includes(screen) &&
            screen &&
            deleteFile(screen)
        ),
        ...article.apks.map(
          (apk) =>
            !newArticle.apks.some((a) => a.link === apk.link) &&
            apk.link &&
            deleteFile(apk.link)
        ),
        ...article.xapks.map(
          (xapk) =>
            !newArticle.xapks.some((a) => a.link === xapk.link) &&
            xapk.link &&
            deleteFile(xapk.link)
        ),
      ].filter(Boolean)
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
