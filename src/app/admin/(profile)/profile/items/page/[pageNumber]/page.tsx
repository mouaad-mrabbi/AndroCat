"use client";

import { ITEM_PER_PAGE } from "@/utils/constants";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotFoundPage from "@/app/not-found";
import LoadingItems from "@/components/loadingItems";
import Toolbar from "@/components/toolbar";
import AppList from "@/components/list/appList";
import Pagination from "@/components/pagination";
import { allItem } from "@/utils/types";
import { fetchItemsCount, fetchItems } from "@/apiCalls/superAdminApiCall";

interface PageparamsProps {
  params: Promise<{ pageNumber: string }>;
}

export default function Page({ params }: PageparamsProps) {
  const [items, setItems] = useState<allItem[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<number>(1);
  const router = useRouter();

  useEffect(() => {
    const getParams = async () => {
      const { pageNumber } = await params;
      const page = Number(pageNumber);

      if (isNaN(page) || page < 1) {
        router.push("/admin/items/1");
        return;
      }

      setPageNumber(page);
    };

    getParams();
  }, [params, router]);

  useEffect(() => {
    const Items = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const PendingItems = await fetchItems(Number(pageNumber));
        const count = await fetchItemsCount();

        const pages = Math.ceil(count / ITEM_PER_PAGE);

        setPages(pages);
        setItems(PendingItems);
      } catch (error: any) {
        setError("Failed to fetch pending items.");
      } finally {
        setIsLoading(false);
      }
    };

    Items();
  }, [pageNumber]);

  if (isLoading) return <LoadingItems />;

  if (error) return NotFoundPage();

  return (
    <div>
      <Toolbar local={"dashboard"} firstLocal={"Items"} scndLocal={""} />
      <div className="px-7 max-[500px]:px-0">
        <AppList items={items} url={`items`} />
        <Pagination
          pages={pages}
          pageSelect={Number(pageNumber)}
          url={`/admin/items`}
        />
      </div>
    </div>
  );
}
