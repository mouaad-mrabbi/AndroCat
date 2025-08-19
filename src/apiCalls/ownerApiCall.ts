import { DOMAIN } from "@/utils/constants";
import { allArticle, ArticleAndObjects } from "@/utils/types";
import axios from "axios";

//get all Articles
export async function fetchArticles(
  pageNumber: number,
  filter: "all" | "notApproved"
): Promise<allArticle[]> {
  try {
    const response = await axios.get(`${DOMAIN}/api/owner/articles`, {
      params: { pageNumber, filter },
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error || "Failed to get all Articles");
  }
}

// Get Count Articles
export async function fetchArticlesCount(
  filter: "all" | "notApproved"
): Promise<number> {
  try {
    const response = await axios.get(`${DOMAIN}/api/owner/articles/count`, {
      params: { filter },
      headers: { "Cache-Control": "no-store" },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error || "Failed to get Articles count");
  }
}

// Get single Article
export async function fetchArticle(
  articleId: string
): Promise<ArticleAndObjects> {
  try {
    const response = await axios.get(
      `${DOMAIN}/api/owner/articles/${articleId}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error || "Failed to get all articles");
  }
}

// Approved article
export async function approvedArticle(articleId: number, approved: string) {
  try {
    const response = await axios.put(
      `${DOMAIN}/api/owner/articles/${articleId}/approved`,
      {},
      {
        params: { approved },
        withCredentials: true,
      }
    );

    return response;
  } catch (error: any) {
    throw error || "Failed to Approved article";
  }
}

//delete my pending article
export async function deleteArticle(articleId: number): Promise<string> {
  try {
    const response = await axios.delete(
      `${DOMAIN}/api/owner/articles/${articleId}`,
      {
        withCredentials: true,
      }
    );

    return response.data.message;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete Article";

    throw new Error(errorMessage);
  }
}
