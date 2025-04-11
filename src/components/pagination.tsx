import { Suspense } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { BsArrowRight } from "react-icons/bs";
import Link from "next/link";

interface PageProps {
  pages: number;
  pageSelect: number;
  url: string;
}
export default function Pagination({ pages, pageSelect, url }: PageProps) {
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
        <Link
          href={`${url}/${page}`}
          key={page}
          className={
            " hover:text-green-500 h-full w-11 inline-flex items-center justify-center"
          }
        >
          {page}
        </Link>
      );
    };

    const renderEllipsis = () => (
      <span className="h-full w-11 inline-flex justify-center items-center">
        ...
      </span>
    );

    if (pages <= 7) {
      return (
        <div className="h-full flex flex-nowrap">
          {Array.from({ length: pages }, (_, i) => renderButton(i + 1))}
        </div>
      );
    } else {
      if (pageSelect < 4 && pageSelect > 0) {
        // أول 5 صفحات
        return (
          <div className="h-full flex flex-nowrap">
            {[1, 2, 3, 4, 5].map((page) => renderButton(page))}
            {renderEllipsis()}
            {renderButton(pages)}
          </div>
        );
      } else if (pageSelect > pages - 3 && pageSelect <= pages) {
        // آخر 5 صفحات
        return (
          <div className="h-full flex-nowrap">
            {renderButton(1)}
            {renderEllipsis()}
            {[pages - 4, pages - 3, pages - 2, pages - 1, pages].map(
              renderButton
            )}
          </div>
        );
      } else if (pageSelect <= pages - 3 && pageSelect >= 4) {
        // وسط الصفحات
        return (
          <div className="h-full flex-nowrap">
            {renderButton(1)}
            {renderEllipsis()}
            {[pageSelect - 1, pageSelect, pageSelect + 1].map(renderButton)}
            {renderEllipsis()}
            {renderButton(pages)}
          </div>
        );
      }
    }
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

export function LoadingPagination() {
  return <div className="w-full  my-8 h-10 bg-gray-800"></div>;
}
