import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

interface Props {
  params: Promise<{ articleId: string }>;
}

/**
 *  @method  PUT
 *  @route   ~/api/owner/articles/:articleId/approved?approved=true
 *  @desc    Approves or disapproves an article
 *  @query   approved=true | approved=false
 *  @access  private (only owners can approve or disapprove articles)
 */

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const approved = request.nextUrl.searchParams.get("approved");
    if (!["true", "false"].includes(approved ?? "")) {
      return NextResponse.json(
        { message: "Invalid approved value. Must be 'true' or 'false'." },
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
    if (!["OWNER"].includes(userFromToken.role)) {
      return NextResponse.json(
        { message: "Access denied, only admins allowed" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userFromToken.id, role: "OWNER" },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json(
        { message: "Access denied, only admins allowed" },
        { status: 403 }
      );
    }

    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      select: { id: true, isApproved: true },
      data: { isApproved: approved === "true" },
    });
    if (!updatedArticle) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        updatedArticle,
        message: approved === "true" ? "Approves Article" : "Disapproves Article",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
