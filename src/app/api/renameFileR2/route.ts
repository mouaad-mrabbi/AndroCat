import { renameFile } from "@/lib/r2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { oldKey, newKey } = await req.json();

  if (!oldKey || !newKey) {
    return NextResponse.json(
      { error: "Both oldKey and newKey are required." },
      { status: 400 }
    );
  }

  try {
    await renameFile(oldKey, newKey); // <-- ضروري

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Rename file error:", error);
    return NextResponse.json(
      { error: "Failed to rename file." },
      { status: 500 }
    );
  }
}
