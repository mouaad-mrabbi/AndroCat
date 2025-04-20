import Image from "next/image";
import Link from "next/link";
import Star from "./star";
import { allItem } from "@/utils/types";

export default function Card({item}: {item:allItem}) {
  return (
    <Link href={`/${item.id}`}>
      <div className="flex flex-col bg-[#1b1d1f] hover:bg-[#212325] w-48 max-[450px]:w-44 h-80 p-4 select-none ">
        <Image
          src={item.image}
          width={90}
          height={90}
          alt={item.title}
          className="aspect-square w-full rounded-2xl object-cover"
        />
        <div className="flex flex-col flex-1 justify-between pt-4">
          <div>
            <p className="font-semibold line-clamp-2">
              {item.title} {item.isMod && item.typeMod}
            </p>
            <p className="font-extralight text-xs text-[#909192] line-clamp-1">
             {item.developer}
            </p>
          </div>
          <Star rating={item.averageRating ?? 0} />
        </div>
      </div>
    </Link>
  );
}
