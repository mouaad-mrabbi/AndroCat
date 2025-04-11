import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page

/* import { Suspense } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { BsArrowRight } from "react-icons/bs";
import Link from "next/link";

interface PageProps {
  pages?: number;
  pageSelect?: number;
  url?: string;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}
export default function PaginationSearch({
  pages = 4,
  pageSelect = 2,
  url,
  setPage,
}: PageProps) {
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
          onClick={() => setPage(page)}
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
    <Suspense fallback={<div>Loading pagination...</div>}>
      <div className="w-full flex justify-between bg-[#1b1d1f] my-8 h-10 ">
        {pageSelect === 1 ? (
          <p className="flex items-center justify-center w-16 border-r text-stone-500 border-stone-500 border-solid">
            <BsArrowLeft className=" stroke-1" />
          </p>
        ) : (
          <Link
            href={`${url}/${pageSelect - 1}`}
            className="flex items-center justify-center  hover:text-green-500 w-16 border-r border-gray-400 border-solid"
          >
            <BsArrowLeft className=" stroke-1" />
          </Link>
        )}

        {moodPagination()}

        {pageSelect === pages ? (
          <p className="flex items-center justify-center w-16 border-l text-stone-500 border-stone-500 border-solid ">
            <BsArrowRight className=" stroke-1" />
          </p>
        ) : (
          <Link
            href={`${url}/${pageSelect + 1}`}
            className="flex items-center justify-center  hover:text-green-500 w-16 border-l border-gray-400 border-solid"
          >
            <BsArrowRight className=" stroke-1" />
          </Link>
        )}
      </div>
    </Suspense>
  );
}
 */