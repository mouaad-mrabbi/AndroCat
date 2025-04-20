import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

/**
 *  @method  GET
 *  @route   ~/api/consumer/items/topItems?itemType=GAME
 *  @desc    Get top 15 items by type (GAME or PROGRAM)
 *  @query   itemType (GAME or PROGRAM)
 *  @access  public
 */
export async function GET(request: NextRequest) {
  try {
    const itemType = request.nextUrl.searchParams.get("itemType");
    if (itemType && itemType !== "GAME" && itemType !== "PROGRAM") {
      return NextResponse.json(
        { message: "Invalid itemType. Must be 'GAME' or 'PROGRAM'." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("Item")
      .select("id ,title ,image ,developer ,averageRating ,isMod ,typeMod ")
      .eq("isApproved", true)
      .eq("itemType", itemType)
      .order("updatedAt", { ascending: false })
      .limit(15);

    if (error) {
      return NextResponse.json({ message:"Items not found"}, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
