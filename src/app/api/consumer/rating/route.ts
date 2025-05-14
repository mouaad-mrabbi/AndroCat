import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { headers } from "next/headers";
import { LRUCache } from "lru-cache";

// Setting the cache to set the limit (5 requests within 5 minutes)
const rateLimit = new LRUCache({
  max: 1000, // Large number to cache
  ttl: 60 * 1000 * 5, // 5 min
});

/**
 *  @method POST
 *  @route  ~/api/consumer/rating?articleId=articleId&rate=rate
 *  @query  articleId (string) - The ID of the article.
 *          rate   (number) - The rating value.
 *  @desc   Creates or updates an article rating.
 *  @access public (IP-based rate limiting applied)
 */
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const articleId = Number(searchParams.get("articleId"));
    const rate = parseFloat(searchParams.get("rate") || "");

    if (!articleId) {
      return NextResponse.json(
        { error: "Invalid article ID" },
        { status: 400 }
      );
    }

    if (isNaN(rate) || rate < 1 || rate > 5) {
      return NextResponse.json(
        { error: "Invalid rate (must be between 1 and 5)" },
        { status: 400 }
      );
    }

    // Get the user's IP address
    const ipAddress = (await headers()).get("x-forwarded-for") || "unknown";
/*     const ipAddress = "198.51.240.44";  */

    // Rate limiting
    const key = `rate-limit:${ipAddress}`;
    const requestCount = (rateLimit.get(key) || 0) as number;
    if (requestCount >= 5) {
      return NextResponse.json(
        { message: "Too Many Rating. Try again later." },
        { status: 429 }
      );
    }
    rateLimit.set(key, requestCount + 1);

    // Check if article is approved
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { isApproved: true },
    });
    if (!article || !article.isApproved) {
      return NextResponse.json(
        { message: "article is not approved for rating" },
        { status: 400 }
      );
    }

    // Check if user already rated
    const existingRating = await prisma.articleRating.findUnique({
      where: { articleId_ipAddress: { articleId, ipAddress } },
      select: { rate: true, id: true },
    });

    if (existingRating) {
      if (existingRating.rate === rate) {
        return NextResponse.json(
          { message: "You've already rated this article." },
          { status: 400 }
        );
      }

      await prisma.articleRating.update({
        where: { id: existingRating.id },
        data: { rate, updatedAt: new Date() },
      });
    } else {
      await prisma.articleRating.create({
        data: { articleId, ipAddress, rate },
      });
    }

    // Get new rating stats
    const ratingStats = await prisma.articleRating.aggregate({
      _count: { articleId: true },
      _avg: { rate: true },
      where: { articleId },
    });

    const ratingCount = ratingStats._count.articleId;
    const averageRating = ratingStats._avg.rate
      ? Number(ratingStats._avg.rate.toFixed(1))
      : 0;

    // ✅ Update article rating data without touching updatedAt
    await prisma.$executeRawUnsafe(`
      UPDATE "Article"
      SET "ratingCount" = ${ratingCount}, "averageRating" = ${averageRating}
      WHERE "id" = ${articleId}
    `);

    return NextResponse.json(
      { message: "Rating submitted successfully!" },
      { status: existingRating ? 200 : 201 }
    );
  } catch (error) {
    console.error("Rating error:", error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
