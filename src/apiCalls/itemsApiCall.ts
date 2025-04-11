import { Item } from "@prisma/client";
import prisma from "@/utils/db";

// Get item based on pageNumber
export async function getItems(pageNumber: number): Promise<Item[]> {
  const response = await fetch(
    `http://localhost:3000/api/items?pageNumber=${pageNumber}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    const errorData = await response.json(); // محاولة جلب تفاصيل الخطأ
    throw new Error(errorData.message || "Failed to fetch items");
  }

  const items = await response.json();
  return items;
}

// Get items count
export async function getItemsCount(): Promise<number> {
  const response = await fetch(`http://localhost:3000/api/items/count`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to get articles count");
  }

  const { count } = (await response.json()) as { count: number };
  return count;
}

export async function fetchItem(id: string) {
  if (!id) {
    throw { status: 400, message: "ID is required." };
  }

  try {
    const item = await prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      throw { status: 404, message: `Item with ID ${id} not found.` };
    }

    return item;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }

    console.error(`Failed to fetch item with ID ${id}:`, error);

    throw {
      status: 500,
      message:
        "An unexpected error occurred while fetching the item. Please try again later.",
      details: error.message || error,
    };
  }
}

//get item by id
export async function getSingleItem(id: string): Promise<Item> {
  const response = await fetch(
    `http://localhost:3000/api/items/${id}`,
    { credentials: "include" }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch items");
  }

  const item = await response.json();
  return item;
}