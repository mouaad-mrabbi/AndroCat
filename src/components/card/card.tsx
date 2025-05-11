import Image from "next/image";
import Link from "next/link";
import Star from "./star";
import { allArticle } from "@/utils/types";
import slugify from "slugify";

export default function Card({ article }: { article: allArticle }) {
  return (
    <Link
      href={`/${article.id}-${slugify(article.title, { lower: true })}${article.isMod?"-mod":""}`}
      title={`Download ${article.title} ${article.isMod && article.typeMod} free on android in Androcat`}
    >
      <div className="flex flex-col bg-[#1b1d1f] hover:bg-[#212325] w-48 max-[450px]:w-44 h-80 p-4 select-none ml-4">
        <div className="relative">
          <Image
            src={article.image}
            width={190}
            height={190}
            alt={article.title}
            className="aspect-square w-full rounded-2xl object-cover "
            draggable={false}
          />
          {article.isMod && (
            <div className="absolute bottom-1 right-1 px-2 py-1 font-bold text-sm bg-black/20 rounded-xl">
              MOD
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 justify-between pt-4">
          <div>
            <p className="font-semibold line-clamp-2">
              {article.title} {article.isMod && <span>({article.typeMod})</span>}
            </p>
            <p className="font-extralight text-xs text-[#909192] line-clamp-1">
              {article.developer}
            </p>
          </div>
          <Star rating={article.averageRating ?? 0} />
        </div>
      </div>
    </Link>
  );
}
