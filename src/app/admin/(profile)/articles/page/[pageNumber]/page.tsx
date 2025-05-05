"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotFoundPage from "@/app/not-found";
import LoadingArticles from "@/components/loadingArticles";
import Toolbar from "@/components/toolbar";
import AppList from "@/components/list/appList";
import Pagination from "@/components/pagination";
import { ARTICLE_PER_PAGE } from "@/utils/constants";
import { allArticle } from "@/utils/types";
import { fetchArticles, fetchArticlesCount } from "@/apiCalls/ownerApiCall";

interface PageparamsProps {
  params: Promise<{ pageNumber: string }>;
}

export default function PageArticles({ params }: PageparamsProps) {
  const [articles, setArticles] = useState<allArticle[]>([]);
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
          router.push("/admin/articles/page/1");
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

    const FetchArticles = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const Articles = await fetchArticles(pageNumber);
        const count = await fetchArticlesCount();

        const pages = Math.ceil(count / ARTICLE_PER_PAGE);
        setPages(pages);

        setArticles(Articles);
      } catch (error: any) {
        setError("Failed to fetch pending Articles.");
      } finally {
        setIsLoading(false);
      }
    };

    FetchArticles();
  }, [pageNumber]);

  if (pageNumber === null || isLoading) {
    return <LoadingArticles />;
  }

  if (error) {
    return NotFoundPage();
  }

  return (
    <div>
      <Toolbar local={"dashboard"} firstLocal={"Articles"} />
      <div className="px-7 max-[500px]:px-0">
        <AppList articles={articles} url={`articles`} />
        <Pagination
          pages={pages}
          pageSelect={Number(pageNumber)}
          url={`/admin/articles/page`}
        />
      </div>
    </div>
  );
}
