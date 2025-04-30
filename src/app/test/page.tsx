"use client";
import { useEffect, useRef } from "react";
import Flickity from "flickity";
import "flickity/dist/flickity.min.css"; // استيراد CSS الخاص بـ Flickity
import { IoArrowForward, IoArrowBackOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import Star from "@/components/card/star";

const Carousel = () => {
  const flickityRef = useRef<HTMLDivElement>(null); // تحديد نوع العنصر DOM هنا

  useEffect(() => {
    if (flickityRef.current) {
      const flickityInstance = new Flickity(flickityRef.current, {
        groupCells: true,
        cellAlign: "center",
        contain: true,
        wrapAround: true,
        pageDots: false,
      });

      // إخفاء الأزرار الأصلية الخاصة بـ Flickity
      const prevNextButtons = flickityRef.current.querySelectorAll(
        ".flickity-prev-next-button"
      );
      prevNextButtons.forEach((button) => {
        button.classList.add("hidden");
      });

      const prevButton = document.querySelector(".carousel-prev");
      const nextButton = document.querySelector(".carousel-next");

      prevButton?.addEventListener("click", () => flickityInstance.previous());
      nextButton?.addEventListener("click", () => flickityInstance.next());

      return () => {
        flickityInstance.destroy();
        prevButton?.removeEventListener("click", () =>
          flickityInstance.previous()
        );
        nextButton?.removeEventListener("click", () => flickityInstance.next());
      };
    }
  }, []);

  const colors = ["bg-gray-400", "bg-green-400", "bg-green-400", "bg-green-400", "bg-green-400", "bg-green-400", "bg-green-400", "bg-green-400", "bg-green-400"];

  return (
    <div className="mx-auto">
      <div className="relative">
        <div className="carousel w-full" ref={flickityRef}>
          {colors.map((color, index) => (
            <Link href={`/`} title={` free on android in Androcat`} key={index}>
              <div className="flex flex-col bg-[#1b1d1f] mr-4 hover:bg-[#212325] w-48 max-[450px]:w-44 h-80 p-4 select-none ">
                <div className="relative">
                  <Image
                    src={"/"}
                    width={90}
                    height={90}
                    alt={""}
                    className="aspect-square w-full rounded-2xl object-cover"
                  />
                </div>

                <div className="flex flex-col flex-1 justify-between pt-4">
                  <div>
                    <p className="font-semibold line-clamp-2">{index + 1}</p>
                    <p className="font-extralight text-xs text-[#909192] line-clamp-1">
                      {index + 1}
                    </p>
                  </div>
                  <Star rating={0} />
                </div>
              </div>
            </Link>
          ))}
        </div>
        <button
          className="carousel-prev absolute left-2 top-1/2 text-2xl transform -translate-y-1/2 bg-[#78C257] text-white p-3 
  rounded-full focus:outline-none max-lg:hidden"
        >
          <IoArrowBackOutline />
        </button>
        <button
  className="carousel-next absolute right-2 top-1/2 text-2xl transform -translate-y-1/2 bg-[#78C257] text-white p-3 
  rounded-full focus:outline-none max-lg:hidden"
        >
          <IoArrowForward />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
