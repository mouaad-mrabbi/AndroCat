import { ArticleContent } from "./ArticleContent";
import { fetchMetadata } from "@/apiCalls/consumerApiCall";
import { DOMAIN, DOMAINCDN } from "@/utils/constants";

interface ArticlesPageProp {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlesPageProp) {
  const { slug } = await params;
  const [idPart, ...titleParts] = slug.split("-");
  const articleId = parseInt(idPart);

  const article = await fetchMetadata(articleId);

  return {
    title: `Download ${article.title} ${article.isMod && article.typeMod} ${
      article.version
    } apk for android`,
    description: `Download ${article.title} ${
      article.isMod && article.typeMod
    } ${article.version} ${article.descriptionMeta}`,
    keywords:
      [...(article.keywords || []), "games", "apps", "mod", "apk"].join(", ") ||
      "games, apps, mod, apk",
    openGraph: {
      type: "article",
      url: `${DOMAIN}/${slug}`,
      title: `Download ${article.title} ${article.isMod && article.typeMod} ${
        article.version
      } apk for android`,
      description: `Download ${article.title} ${
        article.isMod && article.typeMod
      } ${article.version} ${article.descriptionMeta}`,
      images: [
        {
          url: `${DOMAINCDN}/${article.image}`,
          alt: `Download ${article.title} ${article.isMod && article.typeMod} ${
            article.version
          } apk for android`,
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
      siteName: "AndroCat",
      site_name: "androcat",
    },
    twitter: {
      card: "summary_large_image",
      title: `Download ${article.title} ${article.isMod && article.typeMod} ${
        article.version
      } apk for android`,
      description: `Download ${article.title} ${
        article.isMod && article.typeMod
      } ${article.version} ${article.descriptionMeta}`,
      image: `${DOMAINCDN}/${article.image}`,
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
}

export default async function ArticlePage({ params }: ArticlesPageProp) {
  const { slug } = await params;

  return <ArticleContent slug={slug} />;
}
