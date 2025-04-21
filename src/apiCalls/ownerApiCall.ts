import { DOMAIN } from "@/utils/constants";
import { allItem, ItemAndObjects } from "@/utils/types";
import axios from "axios";

//get all items
export async function fetchItems(pageNumber: number): Promise<allItem[]> {
  try {
    const response = await axios.get(`${DOMAIN}/api/owner/items`, {
      params: { pageNumber },
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error || "Failed to get all items");
  }
}

// Get Count items
export async function fetchItemsCount(): Promise<number> {
  try {
    const response = await axios.get(`${DOMAIN}/api/owner/items/count`, {
      headers: { "Cache-Control": "no-store" },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error || "Failed to get items count");
  }
}

// Get single item
export async function fetchItem(itemId: string): Promise<ItemAndObjects> {
  try {
    const response = await axios.get(`${DOMAIN}/api/owner/items/${itemId}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error || "Failed to get all items");
  }
}

// Approved item
export async function approvedItem(itemId: number, approved: string) {
  try {
    const response = await axios.put(
      `${DOMAIN}/api/owner/items/${itemId}/approved`,
      {},
      {
        params: { approved },
        withCredentials: true,
      }
    );

    return response;
  } catch (error: any) {
    throw (error || "Failed to Approved item");
  }
}
