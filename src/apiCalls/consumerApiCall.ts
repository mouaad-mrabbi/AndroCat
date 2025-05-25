import { DOMAIN } from "@/utils/constants";
import { Article } from "@prisma/client";
import prisma from "@/utils/db";
import axios from "axios";
import { allArticle } from "@/utils/types";

export async function fetchArticles(
  pageNumber: number,
  articleType?: "GAME" | "PROGRAM"
) {
  try {
    const response = await axios.get(`${DOMAIN}/api/consumer/articles`, {
      params: { pageNumber, articleType },
    });

    return response.data && Array.isArray(response.data) ? response.data : [];
  } catch /* (error: any) */ {
    throw new Error(
      /* error.response?.data?.message || */ "Failed to fetch articles"
    );
  }
}

export async function fetchArticlesCount(articleType?: "GAME" | "PROGRAM") {
  try {
    const response = await axios.get<{ count: number }>(
      `${DOMAIN}/api/consumer/articles/count`,
      {
        params: { articleType },
      }
    );

    return response.data.count;
  } catch /* (error: any) */ {
    throw new Error(
      /* error.response?.data?.message || */ "Failed to fetch count"
    );
  }
}

export async function fetchArticleById(articleId: number): Promise<Article> {
  try {
    const response = await axios.get<Article>(
      `${DOMAIN}/api/consumer/articles/${articleId}`
    );
    return response.data;
  } catch /* (error: any)  */ {
    throw new Error(
      /* error.response?.data?.message || */ "Failed to fetch Article by id"
    );
  }
}

export async function fetchMetadata(articleId: number) {
  if (!articleId) {
    throw { status: 400, message: "ID is required." };
  }

  try {
    const article = await prisma.article.findUnique({
      where: { id: articleId, isApproved: true },
      select: {
        id: true,
        title: true,
        descriptionMeta: true,
        keywords: true,
        image: true,
        articleType: true,
        gameCategory:true,
        programCategory:true,
        developer: true,
        version: true,
        averageRating: true,
        ratingCount: true,
        isMod:true,
        typeMod:true,
        createdAt:true,
        updatedAt:true
      },
    });
    if (!article) {
      throw { status: 404, message: `article not found.` };
    }

    return article;
  } catch (error: any) {
    throw {
      status: 500,
      message: "internal server error.",
    };
  }
}

async function getIPAddress() {
  try {
    const response = await axios.get("https://api64.ipify.org?format=json");
    return response.data.ip;
  } catch (error) {
    console.error("Failed to get IP address");
    return "unknown"; // في حال الفشل
  }
}

export async function sendRatingToAPI(value: number, articleId: number) {
  try {
    const ipAddress = await getIPAddress();

    const response = await axios.post(
      `${DOMAIN}/api/consumer/rating?articleId=${articleId}&rate=${value}`,
      {},
      {
        headers: {
          "x-forwarded-for": ipAddress, // إرسال عنوان الـ IP كـ header
        },
      }
    );

    return response;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to Approved article";
  }
}

//Download Details
export async function getDownloadData(
  articleId: string,
  downloadType: "apk" | "obb" | "script"|"original-apk"
) {
  try {
    const response = await axios.get(
      `${DOMAIN}/api/consumer/articles/${articleId}/downloadArticle`,
      {
        params: { downloadType },
      }
    );

    return response.data;
  } catch {
    throw "Failed to get article data Download";
  }
}

//get top articles
export async function getTopArticles(
  articleType: "GAME" | "PROGRAM"
): Promise<allArticle[]> {
  try {
    const response = await axios.get(`${DOMAIN}/api/consumer/articles/topArticles`, {
      params: { articleType },
    });

    return response.data;
  } catch /* (error: any) */ {
    throw new Error(
      /* error.response?.data?.message || */ "Failed to fetch articles"
    );
  }
}
