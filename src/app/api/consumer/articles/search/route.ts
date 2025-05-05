import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { ARTICLE_SEARCH_PER_PAGE } from "@/utils/constants";

/**
 *  @method  GET
 *  @route   ~/api/consumer/articles/search?searchText=value&pageNumber=1
 *  @query   searchText (string) - Required (min: 3 chars)
 *           pageNumber (number) - Default: 1
 *  @desc    get articles by search text with pagination
 *  @access  public
 */
export async function GET(request: NextRequest) {
  try {
    const searchText = request.nextUrl.searchParams.get("searchText");
    if (!searchText) {
      return NextResponse.json(
        { message: "Search text is required" },
        { status: 400 }
      );
    }
    if (searchText.length < 3) {
      return NextResponse.json(
        {
          message:
            "Search is suspended! Search string is empty or contains less than 3 characters.",
        },
        { status: 400 }
      );
    }

    const pageNumber = parseInt(
      request.nextUrl.searchParams.get("pageNumber") || "1"
    );
    if (isNaN(pageNumber) || pageNumber < 1) {
      return NextResponse.json(
        { message: "Invalid page number" },
        { status: 400 }
      );
    }

    const offset = (pageNumber - 1) * ARTICLE_SEARCH_PER_PAGE;

    // fetch data with search_articles
    const { data, error } = await supabase
      .rpc("search_articles", { search_text: searchText })
      .range(offset, offset + ARTICLE_SEARCH_PER_PAGE - 1);
      
    if (error || data.length === 0) {
      return NextResponse.json(
        {
          message:
            "Unfortunately, we couldn't find any results. Try changing or shortening your search terms.",
        },
        { status: 404 }
      );
    }

    const count=data.length

    return NextResponse.json({ data, count, pageNumber }, { status: 200 });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
