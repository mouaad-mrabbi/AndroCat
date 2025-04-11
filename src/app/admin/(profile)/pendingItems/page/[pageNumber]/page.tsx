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
import {
  fetchPendingItems,
  fetchPendingItemsCount,
} from "@/apiCalls/superAdminApiCall";

interface PageparamsProps {
  params: Promise<{ pageNumber: string }>;
}

export default function Page({ params }: PageparamsProps) {
  const [items, setItems] = useState<allItem[]>([]);
  const [pageNumber, setPageNumber] = useState<number | null>(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<number>(1);
  const router = useRouter();


  useEffect(() => {
    const getParams = async () => {
      try {
        const { pageNumber } = await params;
        const page = Number(pageNumber);

        if (isNaN(page) || page < 1) {
          router.push("/admin/pendingItems/page/1");
          return;
        }

        setPageNumber(page);
      } catch (err) {
        setPageNumber(1);
      }
    };

    getParams();
  }, [params, router]);

  useEffect(() => {
    if (pageNumber === null) return;

    const fetchItems = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const PendingItems = await fetchPendingItems(pageNumber);
        const count = await fetchPendingItemsCount();

        const pages = Math.ceil(count / ITEM_PER_PAGE);
        setPages(pages);
        setItems(PendingItems);
      } catch (error: any) {
        setError("Failed to fetch pending items.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [pageNumber]);

  if (pageNumber === null || isLoading) {
    return <LoadingItems />;
  }

  if (error) {
    return NotFoundPage();
  }

  return (
    <div>
      <Toolbar local={"dashboard"} firstLocal={"Pending Items"} />
      <div className="px-7 max-[500px]:px-0">
        <AppList items={items} url={`pendingItems`} />
        <Pagination
          pages={pages}
          pageSelect={Number(pageNumber)}
          url={`/admin/pendingItems/page`}
        />
      </div>
    </div>
  );
}
