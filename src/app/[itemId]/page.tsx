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
      title: item.title,
      description: item.description,
      keywords: item.keywords?.join(", ") || "games, apps, mods",
      openGraph: {
        type: "website",
        url: `https://androcat.com/${itemId}`,
        title: item.title,
        description: item.description,
        images: [
          {
            url: item.image,
            alt: item.title,
          },
        ],
        article: {
          section: item.categories || "Games",
          tag: ["MOD", "GTA", "Android", "Free Download"],
        },
      },
      twitter: {
        card: "summary_large_image",
        title: item.title,
        description: item.description,
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
    name: item.title,
    description: item.description,
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
    publisher: {
      "@type": "Organization",
      name: "AndroCat",
      logo: {
        "@type": "ImageObject",
        url: `${DOMAIN}/images/logo.png`,
      },
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
