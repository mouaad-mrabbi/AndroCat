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
 *  @route  ~/api/consumer/rating?itemId=itemId&rate=rate
 *  @query  itemId (string) - The ID of the item.
 *          rate   (number) - The rating value.
 *  @desc   Creates or updates an item rating.
 *  @access public (IP-based rate limiting applied)
 */
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId");
    const rate = parseFloat(searchParams.get("rate") || "");

    if (!itemId) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    if (isNaN(rate) || rate < 1 || rate > 5) {
      return NextResponse.json(
        { error: "Invalid rate (must be between 1 and 5)" },
        { status: 400 }
      );
    }

    // Get the user's IP address
    const ipAddress = (await headers()).get("x-forwarded-for") || "unknown";

    /*  const ipAddress = "198.51.210.46"; */

    // Check the request limit for this IP
    const key = `rate-limit:${ipAddress}`;
    const requestCount = (rateLimit.get(key) || 0) as number;

    if (requestCount >= 5) {
      return NextResponse.json(
        { message: "Too Many Rating. Try again later." },
        { status: 429 }
      );
    }

    // زيادة عدد الطلبات لهذا المستخدم
    rateLimit.set(key, requestCount + 1);

    // Check if item is approved
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: { isApproved: true },
    });
    if (!item || !item.isApproved) {
      return NextResponse.json(
        { message: "Item is not approved for rating" },
        { status: 400 }
      );
    }

    // البحث عن التقييم الحالي لنفس المستخدم على نفس العنصر
    const existingRating = await prisma.itemRating.findUnique({
      where: { itemId_ipAddress: { itemId, ipAddress } },
      select: { rate: true, id: true },
    });

    // Update the rating if it already exists
    if (existingRating) {
      if (existingRating.rate === rate) {
        return NextResponse.json(
          {
            message: "You've already rated this article.",
          },
          { status: 400 }
        );
      }
      const updatedRating = await prisma.itemRating.update({
        where: { id: existingRating.id },
        data: { rate, updatedAt: new Date() },
      });

      // Update rating accounts on the Item
      const ratingStats = await prisma.itemRating.aggregate({
        _count: { itemId: true },
        _avg: { rate: true },
        where: { itemId },
      });

      const ratingCount = ratingStats._count.itemId;
      const averageRating = ratingStats._avg.rate
        ? Number(ratingStats._avg.rate.toFixed(1))
        : 0;

      // تحديث العنصر بعد التحقق من القيم
      await prisma.item.update({
        where: { id: itemId },
        select: { ratingCount: true, averageRating: true },
        data: { ratingCount, averageRating },
      });

      return NextResponse.json(
        { message: "Rating submitted successfully!" },
        { status: 200 }
      );
    }

    // Create a new rating if none exists
    const newRating = await prisma.itemRating.create({
      data: { itemId, ipAddress, rate },
    });

    // Update rating accounts on the Item
    const ratingStats = await prisma.itemRating.aggregate({
      _count: {
        itemId: true, // هذا يعطيك عدد التقييمات
      },
      _avg: {
        rate: true, // هذا يحسب المتوسط
      },
      where: { itemId },
    });

    const ratingCount = ratingStats._count.itemId;
    const averageRating = ratingStats._avg.rate
      ? Number(ratingStats._avg.rate.toFixed(1))
      : 0;

    await prisma.item.update({
      where: { id: itemId },
      select: { ratingCount: true, averageRating: true },
      data: { ratingCount, averageRating },
    });

    return NextResponse.json(
      { message: "Rating submitted successfully!" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
