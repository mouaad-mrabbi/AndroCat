"use client";

import { ARTICLE_PER_PAGE } from "@/utils/constants";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotFoundPage from "@/app/not-found";
import LoadingArticles from "@/components/loadingArticles";
import Toolbar from "@/components/toolbar";
import AppList from "@/components/list/appList";
import Pagination from "@/components/pagination";
import {
  getMyPendingArticles,
  getMyPendingArticlesCount,
} from "@/apiCalls/adminApiCall";
import { allArticle } from "@/utils/types";

interface PageparamsProps {
  params: Promise<{ pageNumber: string }>;
}

export default function Page({ params }: PageparamsProps) {
  const [articles, setArticles] = useState<allArticle[]>([]);
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
        router.push("/admin/profile/pendingArticles/page/1");
        return;
      }

      setPageNumber(page);
    };

    getParams();
  }, [params, router]);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const PendingArticles = await getMyPendingArticles(Number(pageNumber));
        const count = await getMyPendingArticlesCount();

        const pages = Math.ceil(count / ARTICLE_PER_PAGE);

        setPages(pages);
        setArticles(PendingArticles);
      } catch (error: any) {
        setError("Failed to fetch pending Articles.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [pageNumber]);

  if (isLoading) {
    return <LoadingArticles />;
  }

  if (error) {
    return NotFoundPage();
  }

  return (
    <div>
      <Toolbar local={"dashboard"} firstLocal={"Pending Articles"} />
      <div className="px-7 max-[500px]:px-0">
        <AppList articles={articles} url={`profile/pendingArticles`} />
        <Pagination
          pages={pages}
          pageSelect={Number(pageNumber)}
          url={`/admin/profile/pendingArticles/page`}
        />
      </div>
    </div>
  );
}
