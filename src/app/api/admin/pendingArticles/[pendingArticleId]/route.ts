import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { UpdateArticleDto } from "@/utils/dtos";
import { updateArticleSchema } from "@/utils/validationSchemas";
import { deleteFile } from "@/lib/r2";

interface Props {
  params: Promise<{ pendingArticleId: string }>;
}

/**
 *  @method  GET
 *  @route   ~/api/admin/pendingArticles/:pendingArticleId
 *  @desc    Get my single pending Article
 *  @access  private (only user himself can get his Article | SUPER_ADMIN and OWNER can return any users data)
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const pendingArticleId = Number((await params).pendingArticleId);

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

    const pendingArticle = await prisma.pendingArticle.findUnique({
      where: {
        id: pendingArticleId,
        createdById: userFromToken.id,
      },
      include: {
        createdBy: {
          select: { username: true, profile: true },
        },
        paragraphs: {
          select: { title: true, content: true },
        },
        apks: {
          select: { link: true, size: true, version: true, isMod: true },
        },
        xapks: {
          select: { link: true, size: true, version: true, isMod: true },
        },
      },
    });
    if (!pendingArticle) {
      return NextResponse.json(
        { message: "Pending Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(pendingArticle, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 *  @method  PUT
 *  @route   ~/api/admin/pendingArticles/:pendingArticleId
 *  @desc    Update my Pending Article
 *  @access  private (only user himself can update Article | and OWNER can update any data)
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
    if (!["ADMIN", "SUPER_ADMIN", "OWNER"].includes(userFromToken.role)) {
      return NextResponse.json(
        { message: "Access denied, only admins allowed" },
        { status: 403 }
      );
    }

    const pendingArticle = await prisma.pendingArticle.findUnique({
      where: { id: pendingArticleId, createdById: userFromToken.id },
      select: {
        id: true,
        createdById: true,

        OBB: true,
        Script: true,
        OriginalAPK: true,

        linkOBB: true,
        linkScript: true,
        linkOriginalAPK: true,
        sizeFileOBB: true,
        sizeFileScript: true,
        sizeFileOriginalAPK: true,

        isMod: true,
        typeMod: true,
      },
    });
    if (!pendingArticle) {
      return NextResponse.json(
        { message: "Pending Article not found" },
        { status: 404 }
      );
    }

    const body = (await request.json()) as UpdateArticleDto;
    const validation = updateArticleSchema.safeParse(body);
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

    const updatedPendingArticle = await prisma.pendingArticle.update({
      where: { id: pendingArticleId },
      data: {
        title: body.title,
        secondTitle: body.secondTitle,
        description: body.description,
        descriptionMeta: body.descriptionMeta,
        image: body.image,
        developer: body.developer,
        version: body.version,
        versionOriginal: body.versionOriginal,
        androidVer: body.androidVer,

        articleType: body.articleType,
        gameCategory: body.articleType === "GAME" ? body.gameCategory : null,
        programCategory:
          body.articleType === "PROGRAM" ? body.programCategory : null,

        OBB: body.OBB ?? pendingArticle.OBB,
        Script: body.Script ?? pendingArticle.Script,
        OriginalAPK: body.OriginalAPK ?? pendingArticle.OriginalAPK,

        linkOBB:
          body.OBB ?? pendingArticle.OBB
            ? body.linkOBB ?? pendingArticle.linkOBB
            : null,
        linkScript:
          body.Script ?? pendingArticle.Script
            ? body.linkScript ?? pendingArticle.linkScript
            : null,
        linkOriginalAPK:
          body.OriginalAPK ?? pendingArticle.OriginalAPK
            ? body.linkOriginalAPK ?? pendingArticle.linkOriginalAPK
            : null,
        linkVideo: body.linkVideo,

        sizeFileOBB:
          body.OBB ?? pendingArticle.OBB
            ? body.sizeFileOBB ?? pendingArticle.sizeFileOBB
            : null,
        sizeFileScript:
          body.Script ?? pendingArticle.Script
            ? body.sizeFileScript ?? pendingArticle.sizeFileScript
            : null,
        sizeFileOriginalAPK:
          body.OriginalAPK ?? pendingArticle.OriginalAPK
            ? body.sizeFileOriginalAPK ?? pendingArticle.sizeFileOriginalAPK
            : null,

        screenType: body.screenType,
        appScreens: body.appScreens,
        keywords: body.keywords,

        isMod: body.isMod ?? pendingArticle.isMod,
        typeMod:
          body.isMod ?? pendingArticle.isMod
            ? body.typeMod ?? pendingArticle.typeMod
            : null,

        ratedFor: body.ratedFor,
        installs: body.installs,

        // ———————————— هنا نضع العلاقات ————————————
        apks: {
          // 1) احذف القديم (إن أردت استبدالًا كليًا):
          deleteMany: {},
          // 2) أضف الجديد دفعة واحدة:
          createMany: {
            data:
              body.apks?.map((apk,index) => ({
                version: apk.version,
                link: apk.link,
                size: apk.size,
                isMod: apk.isMod,
                order: index,
              })) ?? [],
          },
        },

        xapks: {
          deleteMany: {},
          createMany: {
            data:
              body.xapks?.map((xapk,index) => ({
                version: xapk.version,
                link: xapk.link,
                size: xapk.size,
                isMod: xapk.isMod,
                order: index,
              })) ?? [],
          },
        },
      },
      include: {
        apks: true,
        xapks: true,
      },
    });

    await prisma.pendingArticleParagraph.deleteMany({
      where: {
        pendingArticleId,
      },
    });

    if (body.paragraphs && body.paragraphs.length > 0) {
      await prisma.pendingArticleParagraph.createMany({
        data: body.paragraphs.map((p, index) => ({
          pendingArticleId,
          title: p.title,
          content: p.content,
          order: index,
        })),
      });
    }

    return NextResponse.json(updatedPendingArticle, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}

/**
 *  @method  DELETE
 *  @route   ~/api/admin/pendingArticles/:pendingArticleId
 *  @desc    Delete my Pending Article
 *  @access  private (only user himself can Delete Article | OWNER can Delete any data)
 */
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const pendingArticleId = Number((await params).pendingArticleId);

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

    const pendingArticle = await prisma.pendingArticle.findUnique({
      where: { id: pendingArticleId, createdById: userFromToken.id },
      select: {
        id: true,
        createdById: true,
        linkOBB: true,
        linkOriginalAPK: true,
        linkScript: true,
        image: true,
        appScreens: true,
        apks: true,
        xapks: true,
        article: {
          select: {
            linkOBB: true,
            linkOriginalAPK: true,
            linkScript: true,
            image: true,
            appScreens: true,
            apks: { select: { link: true } },
            xapks: true,
          },
        },
      },
    });
    if (!pendingArticle) {
      return NextResponse.json(
        { message: "Pending Article not found" },
        { status: 404 }
      );
    }

    await prisma.pendingArticle.delete({ where: { id: pendingArticleId } });

    if (pendingArticle.article) {
      const { article } = pendingArticle;

      const fileComparisons = [
        ["image", pendingArticle.image, article.image],
        ["linkOBB", pendingArticle.linkOBB, article.linkOBB],
        [
          "linkOriginalAPK",
          pendingArticle.linkOriginalAPK,
          article.linkOriginalAPK,
        ],
        ["linkScript", pendingArticle.linkScript, article.linkScript],
      ];

      for (const [, newVal, oldVal] of fileComparisons) {
        if (newVal !== oldVal && newVal) {
          await deleteFile(newVal);
        }
      }

      const screensToDelete = pendingArticle.appScreens.filter(
        (screen) => !article.appScreens.includes(screen)
      );

      await Promise.all(screensToDelete.map((screen) => deleteFile(screen)));

      // apks
      const articleApks = article.apks.map((apk) => apk.link);
      const pArticleApks = pendingArticle.apks.map((apk) => apk.link);

      const apksToDelete = pArticleApks.filter(
        (apk) => !articleApks.includes(apk)
      );
      await Promise.all(apksToDelete.map((apk) => deleteFile(apk)));

      // xapks
      const articleXapks = article.xapks.map((xapk) => xapk.link);
      const pArticleXapks = pendingArticle.xapks.map((xapk) => xapk.link);

      const xapksToDelete = pArticleXapks.filter(
        (xapk) => !articleXapks.includes(xapk)
      );
      await Promise.all(xapksToDelete.map((xapk) => deleteFile(xapk)));
    } else {
      const pArticleApks = pendingArticle.apks.map((apk) => apk.link);
      const pArticleXapks = pendingArticle.xapks.map((xapk) => xapk.link);

      const fileLinks = [
        pendingArticle.image,
        pendingArticle.linkOBB,
        pendingArticle.linkOriginalAPK,
        pendingArticle.linkScript,
        ...pendingArticle.appScreens,
        ...pArticleApks,
        ...pArticleXapks,
      ].filter((url): url is string => !!url);

      await Promise.all(fileLinks.map((url) => deleteFile(url)));
    }

    return NextResponse.json(
      { message: "Pending Article deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
