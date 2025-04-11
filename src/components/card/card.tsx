import Image from "next/image";
import Link from "next/link";
import Star from "./star";

export default function Card() {
  return (
    <Link href={`/`}>
      <div className="flex flex-col bg-[#1b1d1f] hover:bg-[#212325] w-48 max-[450px]:w-44 h-80 p-4 select-none ">
        <Image
          src="/images/images1.jpeg"
          width={90}
          height={90}
          alt="images1"
          className="aspect-square w-full rounded-2xl object-cover"
          priority // لتحميل الصورة أولاً
        />
        <div className="flex flex-col flex-1 justify-between  pt-4">
          <div>
            <p className="font-semibold line-clamp-2">
              PC Creator 2 (MOD, Unlimited Money)
            </p>
            <p className="font-extralight text-xs text-[#909192] line-clamp-1">
              CREATY GAMES LLC
            </p>
          </div>
          <Star rating={3.7} />
        </div>
      </div>
    </Link>
  );
}
