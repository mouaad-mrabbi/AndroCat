import { DOMAIN } from "@/utils/constants";
import { CreateArticleDto } from "@/utils/dtos";
import { allArticle } from "@/utils/types";
import {
  ActionType,
  ArticleType,
  GameCategories,
  ProgramCategories,
  User,
} from "@prisma/client";
import axios from "axios";

interface PendingArticle {
  id: number;
  status: ActionType;
  checking: boolean;
  title: string;
  secondTitle?: string;
  description: string;
  descriptionMeta: string;
  image: string;
  developer: string;
  version: string;
  versionOriginal: string;
  androidVer: string;

  articleType: ArticleType;
  gameCategory: GameCategories;
  programCategory: ProgramCategories;

  OBB: boolean;
  Script: boolean;
  OriginalAPK: boolean;

  linkAPK: string;
  linkOBB?: string;
  linkVideo?: string;
  linkScript?: string;
  linkOriginalAPK?: string;
  sizeFileAPK: string;
  sizeFileOBB?: string;
  sizeFileScript?: string;
  sizeFileOriginalAPK?: string;
  appScreens: string[];
  keywords: string[];
  isMod: boolean;
  typeMod?: string;
  ratedFor: number;
  installs: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: number;
  createdBy: User;
  atricleId?: number | null;
  paragraphs: []
}

//create pending Article (CREATE)
export async function createPendingArticles(formData: CreateArticleDto) {
  const response = await axios.post(
    `${DOMAIN}/api/admin/pendingArticles`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.status;
}

// Get all Pending Articles for user
export async function getMyPendingArticles(
  pageNumber: number
): Promise<allArticle[]> {
  try {
    const response = await axios.get(`${DOMAIN}/api/admin/pendingArticles`, {
      params: { pageNumber },
      withCredentials: true,
    });

    return response.data;
  } catch {
    throw new Error("Failed to fetch count Pending Articles");
  }
}

// Get Count Pending Articles for user
export async function getMyPendingArticlesCount(): Promise<number> {
  try {
    const response = await axios.get(
      `${DOMAIN}/api/admin/pendingArticles/count`,
      {
        headers: { "Cache-Control": "no-store" },
      }
    );

    return response.data;
  } catch {
    throw new Error("Failed to fetch count Pending Articles");
  }
}

// Get single Pending Articles for user
export async function getMyPendingArticle(pendingArticleId: number) {
  try {
    const response = await axios.get(
      `${DOMAIN}/api/admin/pendingArticles/${pendingArticleId}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch Pending Article";

    throw new Error(errorMessage);
  }
}

//
export async function updateMyPendingArticle(
  pendingArticleId: number,
  formData: CreateArticleDto
) {
  const response = await axios.put(
    `${DOMAIN}/api/admin/pendingArticles/${pendingArticleId}`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.status;
}

//create pending Article (UPDATE)
export async function createPendingUpdateArticle(
  articleId: number,
  formData: CreateArticleDto,
  statusType: "UPDATE" | "DELETE"
) {
  console.log(formData);
  const response = await axios.post(
    `${DOMAIN}/api/admin/pendingArticles/articles/${articleId}`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
      params: { statusType },
    }
  );
  return response;
}

//Get single Article created by user.
export async function getArticleCreateBy(
  articleId: number
): Promise<PendingArticle> {
  try {
    const response = await axios.get(
      `${DOMAIN}/api/admin/articles/${articleId}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch Pending Article";

    throw new Error(errorMessage);
  }
}

//delete my pending article
export async function deleteArticleCreatedBy(
  pendingArticleId: number
): Promise<string> {
  try {
    const response = await axios.delete(
      `${DOMAIN}/api/admin/pendingArticles/${pendingArticleId}`,
      {
        withCredentials: true,
      }
    );

    return response.data.message;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete Pending Article";

    throw new Error(errorMessage);
  }
}
