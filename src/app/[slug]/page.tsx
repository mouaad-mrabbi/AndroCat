import { ArticleContent } from "./ArticleContent";
import { fetchMetadata } from "@/apiCalls/consumerApiCall";
import { DOMAIN, DOMAINCDN } from "@/utils/constants";

interface ArticlesPageProp {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlesPageProp) {
  try {
    const { slug } = await params;

    const parts = slug.split("-");
    const id = Number(parts[0]);
    const titleSlug = parts.slice(1).join("-");

    if (isNaN(id)) {
      throw new Error("Invalid articleId from slug");
    }

    const article = await fetchMetadata(id);

    const modType = article.isMod ? `(${article.typeMod}) ` : "";
    const title = `Download ${article.title} ${modType}${article.version} apk for android`;
    const description = `${article.title} ${modType}- ${article.descriptionMeta}`;
    const imageUrl = article.image ? `${DOMAINCDN}/${article.image}` : "";

    return {
      title,
      description,
      keywords: (article.keywords?.length
        ? [...article.keywords, "games", "apps", "mod", "apk"]
        : ["games", "apps", "mod", "apk"]
      ).join(", "),
      openGraph: {
        type: "article",
        url: `${DOMAIN}/${slug}`,
        title,
        description,
        images: imageUrl
          ? [
              {
                url: imageUrl,
                alt: title,
                width: 190,
                height: 190,
              },
            ]
          : [],
        article: {
          section:
            article.articleType === "GAME"
              ? article.gameCategory
              : article.programCategory,
          tag: article.keywords,
          published_time: article.createdAt,
          modified_time: article.updatedAt,
        },
        siteName: "AndroCat",
        site_name: "androcat",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
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
  } catch {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function ArticlePage({ params }: ArticlesPageProp) {
  const { slug } = await params;

  return <ArticleContent slug={slug} />;
}
