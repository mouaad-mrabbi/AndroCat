import { Suspense } from "react";
import Star from "../card/star";
import Image from "next/image";
import Link from "next/link";
import { DomainsImages } from "@/utils/constants";
import { allItem } from "@/utils/types";

type Props = {
  item: allItem;
  url: string;
  index: number;
};

export default function LandCard({ item, url, index }: Props) {
  const defaultImage = "/images/defaultSquareImage.png"; // صورة بديلة

  // دالة للتحقق من الدومين
  const isValidDomain = (url: string) => {
    const validDomains = DomainsImages; // إضافة الدومينات المسموح بها
    return validDomains.some((domain) => url.includes(domain));
  };

  // التحقق من الدومين للصورة الرئيسية
  const imageSrc = isValidDomain(item.image) ? item.image : defaultImage;

  return (
    <Suspense fallback={LoadingLandCard()}>
      <Link
        href={
          url === "home"
            ? `/${item.id}`
            : url === "pendingItems" || url === "items"
            ? `/admin/${url}/${item.id}`
            : "#"
        }
        className="flex max-[820px]:flex-col gap-4 p-6 max-[820px]:p-4 bg-[#1b1d1f] 
      hover:bg-[#212325] min-[820px]:h-[200px] min-[1070px]:h-[172px] min-[1200px]:h-[200px]  select-none "
      >
        <div className="relative aspect-square h-full max-[820px]:h-auto max-[820px]:w-full">
          <Image
            src={imageSrc}
            width={90}
            height={90}
            alt={item.title ?? "post"}
            className="h-full w-full rounded-2xl object-cover"
            priority={index < 3} // أول 3 صور يتم تحميلها بالأولوية
            draggable="false"
          />
          {item.isMod && (
            <div className="absolute bottom-1 right-1 px-2 py-1 font-bold text-sm bg-black/20 rounded-xl">
              MOD
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between max-[820px]:h-28 ">
          <div>
            <p className="font-semibold line-clamp-2 max-[820px]:text-sm">
              {item.title} {item.isMod && <span>({item.typeMod})</span>}
            </p>
            <p className="font-extralight text-xs max-[820px]:text-[10px] text-[#909192] line-clamp-1">
              {item.developer}
            </p>
          </div>

          {url === "pendingItems" ? (
            <Star rating={0} />
          ) : (
            <Star rating={item.averageRating || 0} />
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
