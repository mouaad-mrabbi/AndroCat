import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 *  @method  GET
 *  @route   ~/api/users/logout
 *  @desc    Logout User
 *  @access  public
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies(); // Await the cookies promise
    cookieStore.delete("jwtToken"); // Now you can safely call delete

    return NextResponse.json({ message: "logout" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
