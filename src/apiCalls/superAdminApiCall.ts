import { DOMAIN } from "@/utils/constants";
import { allArticle, ArticleAndObjects, PendingArticleAndObjects } from "@/utils/types";
import axios from "axios";
import { ActionType, ArticleType, GameCategories, PendingArticle, ProgramCategories, User } from "@prisma/client";


// Get my all Articles for user
export async function fetchArticles(pageNumber: number): Promise<allArticle[]> {
  try {
    const response = await axios.get(`${DOMAIN}/api/superAdmin/articles`, {
      params: { pageNumber },
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Status code:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else {
      console.error("Request error:", error.message);
    }
    throw error;
  }
}

// Get my Count Articles for user
export async function fetchArticlesCount(): Promise<number> {
  try {
    const response = await axios.get(`${DOMAIN}/api/superAdmin/articles/count`, {
      headers: { "Cache-Control": "no-store" },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to get articles count:", error);
    throw new Error("Failed to get articles count");
  }
}

// Get my single Article for user
export async function fetchArticle(articleId: string): Promise<ArticleAndObjects> {
  try {
    const response = await axios.get(
      `${DOMAIN}/api/superAdmin/articles/${articleId}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch {
    throw new Error("Failed to fetch Article");
  }
}

// Get all Pending Articles
export async function fetchPendingArticles(
  pageNumber: number
): Promise<allArticle[]> {
  try {
    const response = await axios.get(`${DOMAIN}/api/superAdmin/pendingArticles`, {
      params: { pageNumber },
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Status code:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else {
      console.error("Request error:", error.message);
    }
    throw error;
  }
}

// Get Count Pending Articles
export async function fetchPendingArticlesCount(): Promise<number> {
  try {
    const response = await axios.get(
      `${DOMAIN}/api/superAdmin/pendingArticles/count`,
      {
        headers: { "Cache-Control": "no-store" },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to get articles count:", error);
    throw new Error("Failed to get articles count");
  }
}

// Get single Pending Article for user
export async function fetchPendingArticle(
  pendingArticleId: string
): Promise<PendingArticleAndObjects> {
  try {
    const response = await axios.get(
      `${DOMAIN}/api/superAdmin/pendingArticles/${pendingArticleId}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch {
    throw new Error("Failed to fetch Pending Article");
  }
}

//creat new Article (move Pending Article to Article)
export async function creatArticle(pendingArticleId: number) {
  try {
    const response = await axios.post(
      `${DOMAIN}/api/superAdmin/pendingArticles/${pendingArticleId}`,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
}


//update new Article (move Pending Article to Article)
export async function updateArticle(pendingArticleId: number) {
  try {
    const response = await axios.put(
      `${DOMAIN}/api/superAdmin/articles/pendingArticles/${pendingArticleId}`,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
}