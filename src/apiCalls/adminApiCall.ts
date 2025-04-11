import { DOMAIN } from "@/utils/constants";
import { CreateItemDto } from "@/utils/dtos";
import { allItem } from "@/utils/types";
import { ActionType, ItemCategories, ItemType, User } from "@prisma/client";
import axios from "axios";

interface PendingItem {
  id: string;
  status: ActionType;
  checking: boolean;
  title: string;
  description: string;
  image: string;
  developer: string;
  version: string;
  androidVer: string;

  itemType: ItemType;
  categories: ItemCategories;

  OBB: boolean;
  Script: boolean;
  linkAPK: string;
  linkOBB?: string;
  linkVideo?: string;
  linkScript?: string;
  sizeFileAPK: string;
  sizeFileOBB?: string;
  sizeFileScript?: string;
  appScreens: string[];
  keywords: string[];
  isMod: boolean;
  typeMod?: string;
  ratedFor: number;
  installs: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  createdBy: User;
  itemId?: string | null;
}

//create pending item (CREATE)
export async function createPendingItems(formData: CreateItemDto) {
  const response = await axios.post(
    `${DOMAIN}/api/admin/pendingItems`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.status;
}

// Get all Pending items for user
export async function getMyPendingItems(
  pageNumber: number
): Promise<allItem[]> {
  try {
    const response = await axios.get(`${DOMAIN}/api/admin/pendingItems`, {
      params: { pageNumber },
      withCredentials: true,
    });

    return response.data;
  } catch {
    throw new Error("Failed to fetch count Pending items");
  }
}

// Get Count Pending items for user
export async function getMyPendingItemsCount(): Promise<number> {
  try {
    const response = await axios.get(`${DOMAIN}/api/admin/pendingItems/count`, {
      headers: { "Cache-Control": "no-store" },
    });

    return response.data;
  } catch {
    throw new Error("Failed to fetch count Pending items");
  }
}

// Get single Pending items for user
export async function getMyPendingItem(
  pendingItemId: string
): Promise<PendingItem> {
  try {
    const response = await axios.get(
      `${DOMAIN}/api/admin/pendingItems/${pendingItemId}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch Pending item";

    throw new Error(errorMessage);
  }
}

//
export async function updateMyPendingItem(
  pendingItemId: string,
  formData: CreateItemDto
) {
  const response = await axios.put(
    `${DOMAIN}/api/admin/pendingItems/${pendingItemId}`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.status;
}

//create pending item (UPDATE)
export async function createPendingUpdateItem(
  itemId:string,
  formData: CreateItemDto,
  statusType: "UPDATE" | "DELETE"
) {
  const response = await axios.post(
    `${DOMAIN}/api/admin/pendingItems/items/${itemId}`,
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

//Get single item created by user.
export async function getItemCreateBy(itemId: string): Promise<PendingItem> {
  try {
    const response = await axios.get(`${DOMAIN}/api/admin/items/${itemId}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch Pending item";

    throw new Error(errorMessage);
  }
}
