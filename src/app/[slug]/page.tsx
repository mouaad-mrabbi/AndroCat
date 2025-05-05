import { ArticleContent } from "./ArticleContent";
import { fetchMetadata } from "@/apiCalls/consumerApiCall";
import { DOMAIN } from "@/utils/constants";

interface ArticlesPageProp {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlesPageProp) {
  const { slug } = await params;
  const [idPart, ...titleParts] = slug.split("-");
  const articleId = parseInt(idPart);

  try {
    const article = await fetchMetadata(articleId);

    return {
      title: `Download ${article.title} ${article.isMod && article.typeMod} ${
        article.version
      } android`,
      description: `Download ${article.title} ${
        article.isMod && article.typeMod
      } - ${article.description}`,
      keywords: article.keywords?.join(", ") || "games, apps, mods",
      openGraph: {
        type: "article",
        url: `${DOMAIN}/${slug}`,
        title: `Download ${article.title} ${article.isMod && article.typeMod} ${
          article.version
        } free on android`,
        description: `Download ${article.title} ${
          article.isMod && article.typeMod
        } - ${article.description}`,
        images: [
          {
            url: article.image,
            alt: `Download ${article.title} ${
              article.isMod && article.typeMod
            } ${article.version} free on android`,
            width: 190,
            height: 190,
          },
        ],
        article: {
          section:
            article.articleType === "GAME"
              ? article.gameCategory
              : article.programCategory,
          tag: ["MOD", "GTA", "Android", "Free Download"],
        },
      },
      twitter: {
        card: "summary_large_image",
        title: `Download ${article.title} ${article.isMod && article.typeMod} ${
          article.version
        } free on android`,
        description: `Download ${article.title} ${
          article.isMod && article.typeMod
        } - ${article.description}`,
        image: article.image,
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
      title: "article not found",
      description: "This article could not be found.",
      keywords: "games, apps, mods",
      openGraph: {
        title: "article not found",
        description: "This article could not be found.",
        url: `https://androcat.com/${articleId}`,
        images: [],
      },
      meta: {
        robots: "noindex, nofollow", // عدم السماح لمحركات البحث بالزحف على هذه الصفحة
        canonical: `https://androcat.com/${articleId}`,
      },
      errorMessage: "An error occurred while fetching the article data.", // إضافة رسالة خطأ نصية
    };
  }
}

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
};

export default async function ArticlePage({ params }: ArticlesPageProp) {
  const { slug } = await params;

  return <ArticleContent slug={slug} />;
}
