import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient"; 
import { ITEM_PER_PAGE } from "@/utils/constants";

export async function GET(request: NextRequest) {
  try {
    const pageNumber = parseInt(
      request.nextUrl.searchParams.get("pageNumber") || "1"
    );

    if (isNaN(pageNumber) || pageNumber < 1) {
      return NextResponse.json({ message: "Invalid page number" }, { status: 400 });
    }

    const jwtToken = request.cookies.get("jwtToken")?.value || "";

/*     const supabase = createSupabaseWithToken(jwtToken); */

    const { data: items, error } = await supabase
      .from("Item")
      .select("*")
      .range(ITEM_PER_PAGE * (pageNumber - 1), ITEM_PER_PAGE * pageNumber - 1)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "No items found" }, { status: 404 });
    }

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
