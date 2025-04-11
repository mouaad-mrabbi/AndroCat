import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/utils/verifyToken"; // Ensure the import path is correct

export async function POST(request: NextRequest) {
  try {
    
    const user = verifyToken(request);
    if (user === null) {
      return NextResponse.json(
        { message: "Please login again" },
        { status: 403 }
      );
    }

    return NextResponse.json({ valid: true, user: user });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
