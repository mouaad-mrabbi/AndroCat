import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

/**
 *  @method  GET
 *  @route   ~/api/consumer/articles/topArticles?articleType=GAME
 *  @desc    Get top 15 articles by type (GAME or PROGRAM)
 *  @query   articleType (GAME or PROGRAM)
 *  @access  public
 */
export async function GET(request: NextRequest) {
  try {
    const articleType = request.nextUrl.searchParams.get("articleType");
    if (articleType && articleType !== "GAME" && articleType !== "PROGRAM") {
      return NextResponse.json(
        { message: "Invalid articleType. Must be 'GAME' or 'PROGRAM'." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("Article")
      .select("id ,title ,image ,developer ,averageRating ,isMod ,typeMod ")
      .eq("isApproved", true)
      .eq("articleType", articleType)
      .order("updatedAt", { ascending: false })
      .limit(15);

    if (error) {
      return NextResponse.json({ message:"articles not found",error}, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
