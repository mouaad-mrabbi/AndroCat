import { DOMAIN } from "@/utils/constants";
import { Item } from "@prisma/client";
import prisma from "@/utils/db";
import axios from "axios";

export async function fetchItems(
  pageNumber: number = 1,
  itemType?: "GAME" | "PROGRAM"
) {
  try {
    const response = await axios.get(`${DOMAIN}/api/consumer/items`, {
      params: { pageNumber, itemType },
    });

    return response.data && Array.isArray(response.data) ? response.data : [];
  } catch /* (error: any) */ {
    throw new Error(
      /* error.response?.data?.message || */ "Failed to fetch items"
    );
  }
}

export async function fetchItemsCount(itemType?: "GAME" | "PROGRAM") {
  try {
    const response = await axios.get<{ count: number }>(
      `${DOMAIN}/api/consumer/items/count`,
      {
        params: { itemType },
      }
    );

    return response.data.count;
  } catch /* (error: any) */ {
    throw new Error(
      /* error.response?.data?.message || */ "Failed to fetch count"
    );
  }
}

export async function fetchItemById(itemId: string): Promise<Item> {
  try {
    const response = await axios.get<Item>(
      `${DOMAIN}/api/consumer/items/${itemId}`
    );
    return response.data;
  } catch /* (error: any)  */ {
    throw new Error(
      /* error.response?.data?.message || */ "Failed to fetch item by id"
    );
  }
}

export async function fetchMetadata(itemId: string) {
  if (!itemId) {
    throw { status: 400, message: "ID is required." };
  }

  try {
    const item = await prisma.item.findUnique({
      where: { id: itemId, isApproved: true },
      select: {
        id: true,
        title: true,
        description: true,
        keywords: true,
      },
    });
    if (!item) {
      throw { status: 404, message: `Item not found.` };
    }

    return item;
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

export async function sendRatingToAPI(value: number, itemId: string) {
  try {
    const ipAddress = await getIPAddress();

    const response = await axios.post(
      `${DOMAIN}/api/consumer/rating?itemId=${itemId}&rate=${value}`,
      {},
      {
        headers: {
          "x-forwarded-for": ipAddress, // إرسال عنوان الـ IP كـ header
        },
      }
    );

    return response;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to Approved item";
  }
}

//Download Details
export async function getDownloadData(
  itemId: string,
  downloadType: "apk" | "obb" | "script"
) {
  try {
    const response = await axios.get(
      `${DOMAIN}/api/consumer/items/${itemId}/downloadItem`,
      {
        params: { downloadType },
      }
    );

    return response.data;
  } catch  {
    throw ( "Failed to get item data Download");
  }
}
