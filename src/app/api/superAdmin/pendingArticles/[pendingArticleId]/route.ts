import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { renameFile } from "@/lib/r2";
import { CreateArticleDto } from "@/utils/dtos";
import { createArticleSchema } from "@/utils/validationSchemas";

interface Props {
  params: Promise<{ pendingArticleId: string }>;
}

/**
 *  @method  GET
 *  @route   ~/api/superAdmin/pendingArticles/:pendingArticleId
 *  @desc    Get single pending Article
 *  @access  private (only SUPER_ADMIN and OWNER can return any users data)
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
    if (!["SUPER_ADMIN", "OWNER"].includes(userFromToken.role)) {
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
      },
      include: {
        createdBy: {
          select: { username: true, profile: true },
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
 *  @method  POST
 *  @route   ~/api/superAdmin/pendingArticles/:pendingArticleId
 *  @desc    Create Article from pending Article by ID.
 *  @access  private (only user himself can create his Articles | OWNER can create any users data)
 */
export async function POST(request: NextRequest, { params }: Props) {
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
          message:
            validation.error.errors[0].path.join(".") +
            " " +
            validation.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const newArticle = await prisma.article.create({
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
        linkVideo: true,
        linkScript: true,
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
        linkVideo: pendingArticle.linkVideo,
        linkScript: pendingArticle.Script ? pendingArticle.linkScript : null,
        linkOriginalAPK: pendingArticle.OriginalAPK
          ? pendingArticle.linkOriginalAPK
          : null,

        sizeFileAPK: pendingArticle.sizeFileAPK,
        sizeFileOBB: pendingArticle.OBB ? pendingArticle.sizeFileOBB : null,
        sizeFileScript: pendingArticle.Script
          ? pendingArticle.sizeFileScript
          : null,
        sizeFileOriginalAPK: pendingArticle.OriginalAPK
          ? pendingArticle.sizeFileOriginalAPK
          : null,

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

    const pendingParagraphs = await prisma.pendingArticleParagraph.findMany({
      where: { pendingArticleId },
    });

    if (pendingParagraphs.length > 0) {
      await prisma.articleParagraph.createMany({
        data: pendingParagraphs.map((p,index) => ({
          articleId: newArticle.id,
          title: p.title,
          content: p.content,
          order: index,
        })),
      });
    }

    await prisma.pendingArticle.delete({ where: { id: pendingArticleId } });

    await renameFile(
      newArticle.image,
      `posts/${newArticle.id}/${newArticle.image.split("/").pop()}`
    );
    await renameFile(
      newArticle.linkAPK,
      `apks/${newArticle.id}/${newArticle.linkAPK.split("/").pop()}`
    );
    await prisma.article.update({
      where: { id: newArticle.id },
      data: {
        image: `posts/${newArticle.id}/${newArticle.image.split("/").pop()}`,
        linkAPK: `apks/${newArticle.id}/${newArticle.linkAPK.split("/").pop()}`,
      },
      select: { id: true, image: true, linkAPK: true },
    });

    if (newArticle.OBB && newArticle.linkOBB) {
      await renameFile(
        newArticle.linkOBB,
        `obbs/${newArticle.id}/${newArticle.linkOBB.split("/").pop()}`
      );
      await prisma.article.update({
        where: { id: newArticle.id },
        data: {
          linkOBB: `obbs/${newArticle.id}/${newArticle.linkOBB
            .split("/")
            .pop()}`,
        },
        select: { id: true, linkOBB: true },
      });
    }
    if (newArticle.Script && newArticle.linkScript) {
      await renameFile(
        newArticle.linkScript,
        `scripts/${newArticle.id}/${newArticle.linkScript.split("/").pop()}`
      );
      await prisma.article.update({
        where: { id: newArticle.id },
        data: {
          linkScript: `scripts/${newArticle.id}/${newArticle.linkScript
            .split("/")
            .pop()}`,
        },
        select: { id: true, linkScript: true },
      });
    }
    if (newArticle.OriginalAPK && newArticle.linkOriginalAPK) {
      await renameFile(
        newArticle.linkOriginalAPK,
        `original-apks/${newArticle.id}/${newArticle.linkOriginalAPK
          .split("/")
          .pop()}`
      );
      await prisma.article.update({
        where: { id: newArticle.id },
        data: {
          linkOriginalAPK: `original-apks/${
            newArticle.id
          }/${newArticle.linkOriginalAPK.split("/").pop()}`,
        },
        select: { id: true, linkOriginalAPK: true },
      });
    }

    await Promise.all(
      newArticle.appScreens.map((screen) =>
        renameFile(
          screen,
          `screenshots/${newArticle.id}/${screen.split("/").pop()}`
        )
      )
    );
    const updatedScreens = newArticle.appScreens.map((screen) => {
      const fileName = screen.split("/").pop();
      return `screenshots/${newArticle.id}/${fileName}`;
    });
    await prisma.article.update({
      where: { id: newArticle.id },
      data: {
        appScreens: updatedScreens,
      },
    });

    return NextResponse.json(
      { id: newArticle.id, message: "New Articles added" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
