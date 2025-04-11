import Toolbar from "@/components/toolbar";
import AppList from "@/components/list/appList";
import Pagination from "@/components/pagination";
import { ITEM_PER_PAGE } from "@/utils/constants";
import NotFoundPage from "@/app/not-found";
import { redirect } from "next/navigation";
import { fetchItems, fetchItemsCount } from "@/apiCalls/consumerApiCall";

interface ItemsPageProp {
  params: Promise<{ pageId: string }>;
}

export default async function ProgramsPage({ params }: ItemsPageProp) {
  const { pageId } = await params;
  if (isNaN(Number(pageId)) || Number(pageId) < 1) {
    return redirect("/programs/1");
  }

  try {
    const items = await fetchItems(Number(pageId), "PROGRAM");
    const count = await fetchItemsCount("PROGRAM");

    const pages = Math.ceil(Number(count) / ITEM_PER_PAGE);

    return (
      <div>
        <Toolbar local="home" firstLocal={"programs"} />
        <div className="px-7 max-[500px]:px-0">
          <AppList url={"program"} items={items} />
          <Pagination
            pages={pages}
            pageSelect={Number(pageId)}
            url={"program"}
          />
        </div>
      </div>
    );
  } catch {
    return NotFoundPage();
  }
}