"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ITEM_SEARCH_PER_PAGE } from "@/utils/constants";
import { allItem } from "@/utils/types";
import AppList from "@/components/list/appList";
import { FaSearch } from "react-icons/fa";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import Loading from "../[itemId]/loading";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import SearchMeta from "@/components/seo/SearchMeta";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") || "";

  const [searchText, setSearchText] = useState(qParam);
  const [results, setResults] = useState<allItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageSelect, setPageSelect] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pages, setPages] = useState(0);

  const handleSearch = async (pageNumber = 1, keyword = searchText) => {
    setLoading(true);
    setResults([]);
    setError("");
    if (pageNumber === 1) {
      setPageSelect(1);
      setTotalCount(0);
      setPages(0);
    }

    try {
      const { data } = await axios.get("/api/consumer/items/search", {
        params: { searchText: keyword, pageNumber },
      });

      setResults(data.data);
      setTotalCount(data.count);
      setPageSelect(pageNumber);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (qParam) {
      setSearchText(qParam);
      handleSearch(1, qParam);
    }
  }, [qParam]);

  useEffect(() => {
    setPages(Math.ceil(totalCount / ITEM_SEARCH_PER_PAGE));
  }, [totalCount]);

  const handleQueryUpdate = () => {
    if (searchText.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchText.trim())}`);
    }
  };

  const moodPagination = () => {
    const renderButton = (page: number) => {
      return pageSelect === page ? (
        <p
          key={page + " p"}
          className="bg-[#434546] h-full w-11 inline-flex items-center justify-center"
        >
          {page}
        </p>
      ) : (
        <button
          key={page}
          className="hover:text-green-500 h-full w-11 inline-flex items-center justify-center"
          onClick={() => handleSearch(page)}
        >
          {page}
        </button>
      );
    };

    return (
      <div className="h-full flex flex-nowrap">
        {Array.from({ length: pages }, (_, i) => renderButton(i + 1))}
      </div>
    );
  };

  return (
    <>
      <SearchMeta />

      <div className="mt-14 max-[576px]:mt-8">
        <h1 className="text-3xl font-bold my-4 px-7">Search</h1>

        <div className="px-7 max-[500px]:px-0">
          {/* Box Error */}
          {error && (
            <div
              className="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
              role="alert"
            >
              <p className="text-red-500">{error}</p>
              <button
                type="button"
                className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
                aria-label="Close"
                onClick={() => setError("")}
              >
                <IoMdClose />
              </button>
            </div>
          )}

          {/* Search */}
          <div className="relative mb-6 p-6 bg-[#1d1f21]">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search for..."
              onKeyDown={(e) => e.key === "Enter" && handleQueryUpdate()}
              className="
              w-full border-none shadow-lg px-6 py-4 pr-14 text-base text-gray-900 outline-none focus:ring-transparent
              sm:text-lg sm:leading-7 sm:py-7 sm:px-8 sm:pr-[5rem] sm:h-[5.25rem]
              dark:bg-[#292c2f] dark:text-white dark:shadow-[0_8px_22px_rgba(0,0,0,0.25)]
            "
            />
            <button
              onClick={handleQueryUpdate}
              className="absolute p-3 inset-y-0 right-8 top-1/2 -translate-y-1/2 text-white hover:text-green-500 text-xl transition-colors duration-500"
            >
              <FaSearch />
            </button>
          </div>

          {loading && <Loading />}

          <AppList items={results} url={"home"} />
        </div>

        {/* Pagination Search */}
        {totalCount > 0 && (
          <div className="flex justify-between mt-4 text-white px-7 max-[500px]:px-0">
            <div className="w-full flex justify-between bg-[#1b1d1f] my-8 h-10">
              {pageSelect === 1 ? (
                <p className="flex items-center justify-center w-16 border-r text-stone-500 border-stone-500 border-solid">
                  <BsArrowLeft className=" stroke-1" />
                </p>
              ) : (
                <button
                  onClick={() => handleSearch(pageSelect - 1)}
                  className="flex items-center justify-center hover:text-green-500 w-16 border-r border-gray-400 border-solid"
                >
                  <BsArrowLeft className=" stroke-1" />
                </button>
              )}

              {moodPagination()}

              {pageSelect === pages ? (
                <p className="flex items-center justify-center w-16 border-l text-stone-500 border-stone-500 border-solid">
                  <BsArrowRight className=" stroke-1" />
                </p>
              ) : (
                <button
                  onClick={() => handleSearch(pageSelect + 1)}
                  className="flex items-center justify-center hover:text-green-500 w-16 border-l border-gray-400 border-solid"
                >
                  <BsArrowRight className=" stroke-1" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
