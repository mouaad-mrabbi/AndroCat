import { PrismaClient } from "@prisma/client";
import { ItemContent } from "./ItemContent";
import { fetchMetadata } from "@/apiCalls/consumerApiCall";

const prisma = new PrismaClient();

interface ItemsPageProp {
  params: Promise<{ itemId: string }>;
}

export async function generateMetadata({ params }: ItemsPageProp) {
  const { itemId } = await params;

  try {
    const item = await fetchMetadata(itemId);

    return {
      title: item.title || "title not available",
      description: item.description||"There is no description for this item.",
      keywords: item.keywords?.length ? item.keywords.join(", ") : "elements, data, meta",
    };
  } catch (error) {
    return {
      title: "title not available",
      description: "There is no description for this item.",
    };
  }
}

export default async function ItemPage({ params }: ItemsPageProp) {
  const { itemId } = await params;

  return <ItemContent itemId={itemId} />;
}
