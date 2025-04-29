import { ItemContent } from "./ItemContent";
import { fetchMetadata } from "@/apiCalls/consumerApiCall";
import { DOMAIN } from "@/utils/constants";

interface ItemsPageProp {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ItemsPageProp) {
  const { slug } = await params;
  const [idPart, ...titleParts] = slug.split("-");
  const itemId = parseInt(idPart);

  try {
    const item = await fetchMetadata(itemId);

    return {
      title: `Download ${item.title} ${item.isMod && item.typeMod} ${
        item.version
      } android`,
      description: `Download ${item.title} ${item.isMod && item.typeMod} - ${
        item.description
      }`,
      keywords: item.keywords?.join(", ") || "games, apps, mods",
      openGraph: {
        site_name: "androcat",
        type: "article",
        url: `${DOMAIN}/${slug}`,
        title: `Download ${item.title} ${item.isMod && item.typeMod} ${
          item.version
        } free on android`,
        description: `Download ${item.title} ${item.isMod && item.typeMod} - ${
          item.description
        }`,
        images: [
          {
            url: item.image,
            alt: `Download ${item.title} ${item.isMod && item.typeMod} ${
              item.version
            } free on android`,
            width: 190,
            height: 190,
          },
        ],
        article: {
          section: item.categories || "Games",
          tag: ["MOD", "GTA", "Android", "Free Download"],
        },
      },
      twitter: {
        card: "summary_large_image",
        title: `Download ${item.title} ${item.isMod && item.typeMod} ${
          item.version
        } free on android`,
        description: `Download ${item.title} ${item.isMod && item.typeMod} - ${
          item.description
        }`,
        image: item.image,
        creator: "@YourTwitterHandle",
        site: "@YourSiteTwitterHandle",
      },
      alternates: {
        canonical: `${DOMAIN}/${slug}`,
      },
      robots: {
        index: true,
        follow: true,
      },
      meta: {
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-status-bar-style": "default",
      },
    };
  } catch (error) {
    console.error(error); // سجل الخطأ في الكونsole لتتبع المشكلة
    return {
      title: "Item not found",
      description: "This item could not be found.",
      keywords: "games, apps, mods",
      openGraph: {
        title: "Item not found",
        description: "This item could not be found.",
        url: `https://androcat.com/${itemId}`,
        images: [],
      },
      meta: {
        robots: "noindex, nofollow", // عدم السماح لمحركات البحث بالزحف على هذه الصفحة
        canonical: `https://androcat.com/${itemId}`,
      },
      errorMessage: "An error occurred while fetching the item data.", // إضافة رسالة خطأ نصية
    };
  }
}

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
};

export default async function ItemPage({ params }: ItemsPageProp) {
  const { slug } = await params;

  return <ItemContent slug={slug} />;
}
