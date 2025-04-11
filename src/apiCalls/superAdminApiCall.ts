import { DOMAIN } from "@/utils/constants";
import { allItem, ItemAndObjects } from "@/utils/types";
import { Item } from "@prisma/client";
import axios from "axios";
import { ActionType, ItemCategories, ItemType, User } from "@prisma/client";

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

// Get my all items for user   app/admin/[id]/items/page.tsx
export async function fetchItems(pageNumber: number): Promise<allItem[]> {
  try {
    const response = await axios.get(`${DOMAIN}/api/superAdmin/items`, {
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

// Get my Count items for user
export async function fetchItemsCount(): Promise<number> {
  try {
    const response = await axios.get(`${DOMAIN}/api/superAdmin/items/count`, {
      headers: { "Cache-Control": "no-store" },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to get articles count:", error);
    throw new Error("Failed to get articles count");
  }
}

// Get my single item for user   app/admin/[id]/items/page.tsx
export async function fetchItem(itemId: string): Promise<ItemAndObjects> {
  try {
    const response = await axios.get(
      `${DOMAIN}/api/superAdmin/items/${itemId}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch {
    throw new Error("Failed to fetch item");
  }
}

// Get all Pending Items
export async function fetchPendingItems(
  pageNumber: number
): Promise<allItem[]> {
  try {
    const response = await axios.get(`${DOMAIN}/api/superAdmin/pendingItems`, {
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

// Get Count Pending items
export async function fetchPendingItemsCount(): Promise<number> {
  try {
    const response = await axios.get(
      `${DOMAIN}/api/superAdmin/pendingItems/count`,
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

// Get single Pending item for user
export async function fetchPendingItem(
  pendingItemId: string
): Promise<PendingItem> {
  try {
    const response = await axios.get(
      `${DOMAIN}/api/superAdmin/pendingItems/${pendingItemId}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch {
    throw new Error("Failed to fetch Pending item");
  }
}

//creat new item (move Pending item to item)
export async function creatItem(pendingItemId: string) {
  try {
    const response = await axios.post(
      `${DOMAIN}/api/superAdmin/pendingItems/${pendingItemId}`,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
}


//update new item (move Pending item to item)
export async function updateItem(pendingItemId: string) {
  try {
    const response = await axios.put(
      `${DOMAIN}/api/superAdmin/items/pendingItems/${pendingItemId}`,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
}