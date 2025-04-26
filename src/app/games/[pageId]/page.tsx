export const metadata = {
  title: "Download modded games on android",
  description:
    "Discover the latest versions of exciting and popular games, with daily updates of curated games and exclusive content for Android devices, ensuring the best Android game download experience.",
  keywords: [
    "modded games",
    "free modded games",
    "virus-free game downloads",
    "game hacks",
    "modded apps",
    "free Android games",
    "hack games for Android",
    "exclusive modded apps",
    "safe game downloads",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${DOMAIN}/games/`,
  },
};

export const dynamic = "force-dynamic"; // 👈 أضف هذا السطر

import Toolbar from "@/components/toolbar";
import AppList from "@/components/list/appList";
import Pagination from "@/components/pagination";
import { DOMAIN, ITEM_PER_PAGE } from "@/utils/constants";
import NotFoundPage from "@/app/not-found";
import { redirect } from "next/navigation";
import { fetchItems, fetchItemsCount } from "@/apiCalls/consumerApiCall";
import CardRow from "@/components/cardRow";

interface ItemsPageProp {
  params: Promise<{ pageId: string }>;
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

    return (
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
    );
  } catch {
    return NotFoundPage();
  }
}
