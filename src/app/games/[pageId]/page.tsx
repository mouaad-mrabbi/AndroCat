export const dynamic = "force-dynamic"; // 👈 أضف هذا السطر

import Toolbar from "@/components/toolbar";
import AppList from "@/components/list/appList";
import Pagination from "@/components/pagination";
import { DOMAIN, ITEM_PER_PAGE } from "@/utils/constants";
import NotFoundPage from "@/app/not-found";
import { redirect } from "next/navigation";
import { fetchItems, fetchItemsCount } from "@/apiCalls/consumerApiCall";
import CardRow from "@/components/cardRow";
import Head from "next/head";

interface ItemsPageProp {
  params: Promise<{ pageId: string }>;
}

export async function generateMetadata({ params }: ItemsPageProp){
  const { pageId } = await params;
  const page = Number(pageId);

  const prevPage = page > 1 ? `${DOMAIN}/games/${page - 1}` : null;
  const nextPage = `${DOMAIN}/games/${page + 1}`;

  return {
    title: "Download modded games on android",
    description:
      "In this section, you can download the latest cool and popular games. We also have daily updates of selected games mod for Android.",
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

export default async function GamesPage({ params }: ItemsPageProp) {
  const { pageId } = await params;

  if (isNaN(Number(pageId)) || Number(pageId) < 1) {
    return redirect("/games/1");
  }
  try {
    const items = await fetchItems(Number(pageId), "GAME");
    const count = await fetchItemsCount("GAME");

    const pages = Math.ceil(Number(count) / ITEM_PER_PAGE);

    const structuredData = {
      "@context": "https://schema.org",
      name: "Download modded games on android",
      description:
        "In this section, you can download the latest cool and popular games. We also have daily updates of selected games mod for Android.",
      url: `${DOMAIN}/${pageId}`,
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
            <CardRow />
          </div>

          <div className="px-7 max-[500px]:px-0">
            <AppList url={"home"} items={items} />
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
