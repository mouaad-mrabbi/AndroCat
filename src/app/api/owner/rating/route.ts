import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyToken";
import prisma from "@/utils/db";

function generateRandomIP() {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join(
    "."
  );
}

function getRandomRate(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { itemId, count, minRate, maxRate } = body;

    if (!itemId || !count || isNaN(minRate) || isNaN(maxRate)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (minRate < 1 || maxRate > 5 || minRate > maxRate) {
      return NextResponse.json(
        { error: "Invalid rate range" },
        { status: 400 }
      );
    }

    const userFromToken = verifyToken(req);
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

    const fakeRatings = Array.from({ length: count }).map(() => ({
      itemId,
      ipAddress: generateRandomIP(),
      rate: getRandomRate(minRate, maxRate),
    }));

    await prisma.itemRating.createMany({
      data: fakeRatings,
    });

    const ratingStats = await prisma.itemRating.aggregate({
      _count: { itemId: true },
      _avg: { rate: true },
      where: { itemId },
    });

    const ratingCount = ratingStats._count.itemId;
    const averageRating = ratingStats._avg.rate
      ? Number(ratingStats._avg.rate.toFixed(1))
      : 0;

    await prisma.item.update({
      where: { id: itemId },
      data: { ratingCount, averageRating },
    });

    return NextResponse.json(
      { message: `Successfully created ${count} fake ratings.` },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}
