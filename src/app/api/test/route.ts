import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient"; 
import { ARTICLE_PER_PAGE } from "@/utils/constants";

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

    const { data: articles, error } = await supabase
      .from("Article")
      .select("*")
      .range(ARTICLE_PER_PAGE * (pageNumber - 1), ARTICLE_PER_PAGE * pageNumber - 1)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    if (!articles || articles.length === 0) {
      return NextResponse.json({ message: "No articles found" }, { status: 404 });
    }

    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
