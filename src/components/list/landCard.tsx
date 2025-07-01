import { Suspense } from "react";
import Star from "../card/star";
import Image from "next/image";
import Link from "next/link";
import { DOMAINCDN } from "@/utils/constants";
import { allArticle } from "@/utils/types";
import slugify from "slugify";
import { slugifyTitle } from "@/utils/slugifyTitle";

type Props = {
  article: allArticle;
  url: string;
  index: number;
};

export default function LandCard({ article, url, index }: Props) {

  const cleanTitle = slugifyTitle(article.title);
  
  return (
    <Suspense fallback={LoadingLandCard()}>
      <Link
        title={`${article.title} ${
          article.isMod ? `(${article.typeMod})` : ""
        }`}
        href={
          url === "home"
            ? `/${article.id}-${cleanTitle}`
            : url === "pendingArticles" || url === "articles"
            ? `/admin/${url}/${article.id}`
            : "#"
        }
        className="flex max-[820px]:flex-col gap-4 p-6 max-[820px]:p-4 bg-[#1b1d1f] 
      hover:bg-[#212325] min-[820px]:h-[200px] min-[1070px]:h-[172px] min-[1200px]:h-[200px]  select-none "
      >
        <div className="relative aspect-square h-full max-[820px]:h-auto max-[820px]:w-full">
          <Image
            src={`${DOMAINCDN}/${article.image}`}
            width={190}
            height={190}
            alt={`${article.title} ${article.isMod ? article.typeMod : ""}`}
            className="h-full w-full rounded-2xl object-cover"
            /*priority={index < 3}*/
            draggable="false"
            loading="lazy"
          />
          {article.isMod && (
            <div className="absolute bottom-1 right-1 px-2 py-1 font-bold text-sm bg-black/20 rounded-xl">
              MOD
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between max-[820px]:h-28 ">
          <div>
            <p className="font-semibold line-clamp-2 max-[820px]:text-sm">
              {article.title}{" "}
              {article.isMod && <span>({article.typeMod})</span>}
            </p>
            <p className="font-extralight text-xs max-[820px]:text-[10px] text-[#909192] line-clamp-1">
              {article.developer}
            </p>
          </div>

          {url === "pendingArticles" ? (
            <Star rating={0} />
          ) : (
            <Star rating={article.averageRating || 0} />
          )}
        </div>
      </Link>
    </Suspense>
  );
}

export function LoadingLandCard() {
  return (
    <div
      className="flex max-[820px]:flex-col gap-4 p-6 max-[820px]:p-4 
      min-[820px]:h-[200px] min-[1070px]:h-[172px] min-[1200px]:h-[200px] bg-gray-900"
    >
      <div className="aspect-square h-full max-[820px]:h-auto max-[820px]:w-full ">
        <div className="h-full w-full rounded-2xl object-cover bg-gray-800" />
      </div>

      <div className="flex flex-col justify-between max-[820px]:h-28 w-full">
        <div>
          <h3 className="h-4  rounded-full w-full mb-2.5 bg-gray-800"></h3>
          <p className="h-3 rounded-full w-full mb-2.5 bg-gray-800"></p>
        </div>
        <h3 className="h-4  rounded-full w-1/2 mb-2.5 bg-gray-800"></h3>
      </div>
    </div>
  );
}
