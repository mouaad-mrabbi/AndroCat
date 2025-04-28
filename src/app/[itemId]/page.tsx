import { ItemContent } from "./ItemContent";
import { fetchMetadata } from "@/apiCalls/consumerApiCall";
import Head from "next/head";
import { DOMAIN } from "@/utils/constants";

interface ItemsPageProp {
  params: Promise<{ itemId: string }>;
}

export async function generateMetadata({ params }: ItemsPageProp) {
  const itemId = Number((await params).itemId);

  try {
    const item = await fetchMetadata(itemId);

    return {
      title: `Download ${item.title} ${item.isMod && item.typeMod} ${
        item.version
      } free on android`,
      description: `Download ${item.title} ${item.isMod && item.typeMod} - ${
        item.description
      }`,
      keywords: item.keywords?.join(", ") || "games, apps, mods",
      openGraph: {
        site_name: "androcat",
        type: "article",
        url: `https://androcat.com/${itemId}`,
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
        canonical: `https://androcat.com/${itemId}`,
      },
      robots: {
        index: true,
        follow: true,
      },
      viewport: "width=device-width, initial-scale=1.0, maximum-scale=5.0",
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

export default async function ItemPage({ params }: ItemsPageProp) {
  const { itemId } = await params;
  const item = await fetchMetadata(Number(itemId));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": item.itemType === "GAME" ? "VideoGame" : "SoftwareApplication",
    name: `Download ${item.title} ${item.isMod && item.typeMod} ${
      item.version
    } free on android`,
    description: `Download ${item.title} ${item.isMod && item.typeMod} - ${
        item.description
      }`,
    url: `${DOMAIN}/${itemId}`,
    image: item.image,
    keywords: item.keywords?.join(", ") || "games, apps, mods",
    developer: item.developer,
    applicationCategory: item.categories,
    operatingSystem: "Android",
    softwareVersion: item.version,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: item.averageRating,
      ratingCount: item.ratingCount,
    },
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </Head>
      <ItemContent itemId={itemId} />
    </>
  );
}
