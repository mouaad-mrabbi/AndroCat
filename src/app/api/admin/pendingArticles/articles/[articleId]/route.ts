import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { CreateArticleDto } from "@/utils/dtos";
import { createArticleSchema } from "@/utils/validationSchemas";
import { ActionType, ScreenType } from "@prisma/client";

interface Props {
  params: Promise<{ articleId: string }>;
}

/**
 *  @method  POST
 *  @route   ~/api/admin/pendingArticles/articles/:articleId
 *  @desc    Create New Pending article for UPDATE article
 *  @access  private (only user himself can create his articles | OWNER can create any users data)
 */

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const statusType = request.nextUrl.searchParams.get("statusType");
    const allowedStatusTypes = ["UPDATE", "DELETE"];
    if (!statusType || !allowedStatusTypes.includes(statusType)) {
      return NextResponse.json(
        {
          message: `Invalid statusType. Must be one of: ${allowedStatusTypes.join(
            ", "
          )}.`,
        },
        { status: 400 }
      );
    }

    const articleId = Number((await params).articleId);
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
          message: validation.error.errors[0].message,
          field: validation.error.errors[0].path.join("."),
        },
        { status: 400 }
      );
    }

    const baseData = {
      status: statusType as ActionType,
      title: body.title,
      secondTitle: body.secondTitle,
      description: body.description,
      descriptionMeta: body.descriptionMeta,
      image: body.image,
      developer: body.developer,
      version: body.version,
      versionOriginal: body.OriginalAPK ? body.versionOriginal : null,
      androidVer: body.androidVer,
      articleType: body.articleType,
      gameCategory: body.articleType === "GAME" ? body.gameCategory : null,
      programCategory:
        body.articleType === "PROGRAM" ? body.programCategory : null,
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
      sizeFileOriginalAPK: body.OriginalAPK ? body.sizeFileOriginalAPK : null,
      screenType:body.screenType,
      appScreens: body.appScreens,
      keywords: body.keywords,
      isMod: body.isMod,
      typeMod: body.isMod ? body.typeMod : null,
      ratedFor: body.ratedFor,
      installs: body.installs,
      createdById: userFromToken.id,
      articleId: articleId,
    };

    const existingPending = await prisma.pendingArticle.findUnique({
      where: { articleId },
      select: { id: true },
    });

    if (existingPending) {
      const updatedPending = await prisma.pendingArticle.update({
        where: { articleId },
        data: baseData,
      });

      // في حالة UPDATE فقط: حذف الفقرات القديمة وإضافة الجديدة
      if (statusType === "UPDATE") {
        await prisma.pendingArticleParagraph.deleteMany({
          where: { pendingArticleId: updatedPending.id },
        });

        if (Array.isArray(body.paragraphs) && body.paragraphs.length > 0) {
          await prisma.pendingArticleParagraph.createMany({
            data: body.paragraphs.map((p, index) => ({
              pendingArticleId: updatedPending.id,
              title: p.title,
              content: p.content,
              order: index,
            })),
          });
        }
      }

      return NextResponse.json(updatedPending.id, { status: 200 });
    } else {
      // إنشاء جديد
      const createdPending = await prisma.pendingArticle.create({
        data: {
          ...baseData,
          ...(statusType === "UPDATE" && Array.isArray(body.paragraphs)
            ? {
                paragraphs: {
                  create: body.paragraphs.map((p, index) => ({
                    title: p.title,
                    content: p.content,
                    order: index,
                  })),
                },
              }
            : {}),
        },
      });

      return NextResponse.json(createdPending.id, { status: 201 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
