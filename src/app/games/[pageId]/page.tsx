export const dynamic = "force-dynamic";

import Toolbar from "@/components/toolbar";
import AppList from "@/components/list/appList";
import Pagination from "@/components/pagination";
import { DOMAIN, ARTICLE_PER_PAGE } from "@/utils/constants";
import NotFoundPage from "@/app/not-found";
import { redirect } from "next/navigation";
import { fetchArticles, fetchArticlesCount } from "@/apiCalls/consumerApiCall";
import CardRow from "@/components/cardRow";
import Head from "next/head";

interface ArticlesPageProp {
  params: Promise<{ pageId: string }>;
}

export async function generateMetadata({ params }: ArticlesPageProp) {
  const { pageId } = await params;
  const page = Number(pageId);

  const prevPage = page > 1 ? `${DOMAIN}/games/${page - 1}` : null;
  const nextPage = `${DOMAIN}/games/${page + 1}`;

  return {
    title: "Download Free Modded Android Games APK – Latest Versions",
    description:
      "Download the latest modded Android games APK for free. Enjoy daily updates with the most popular, top-rated, and exclusive games available for Android devices.",
    keywords:
      "Modded Android Games, Free APK Download, Latest Modded APK, Free Android Games, Android APK Download, Popular Modded Games, APK Games for Android, Daily Game Updates, Best Modded Android Games, Free Modded Games APK",
    alternates: {
      canonical: `${DOMAIN}/games`,
      types: {
        "application/atom+xml": [
          {
            rel: "prev",
            url: prevPage ?? undefined,
          },
          {
            rel: "next",
            url: nextPage,
          },
        ],
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function GamesPage({ params }: ArticlesPageProp) {
  const { pageId } = await params;

  if (isNaN(Number(pageId)) || Number(pageId) < 1) {
    return redirect("/games/1");
  }
  try {
    const articles = await fetchArticles(Number(pageId), "GAME");
    const count = await fetchArticlesCount("GAME");

    const pages = Math.ceil(Number(count) / ARTICLE_PER_PAGE);

    const structuredData = {
      "@context": "https://schema.org",
      name: "Download modded games on android",
      description:
        "In this section, you can download the latest cool and popular games. We also have daily updates of selected games mod for Android.",
      url: `${DOMAIN}/games`,
      keywords:
        "mod, modded games for free, play free of viruses, hack, modded applications",
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
        <div>
          <div className="mb-8">
            <Toolbar local={"home"} firstLocal={"games"} />
            <CardRow articleType="games"/>
          </div>

          <div className="px-7 max-[500px]:px-0">
            <AppList url={"home"} articles={articles} />
            <Pagination
              pages={pages}
              pageSelect={Number(pageId)}
              url={"/games"}
            />
          </div>
        </div>
      </>
    );
  } catch {
    return NotFoundPage();
  }
}
