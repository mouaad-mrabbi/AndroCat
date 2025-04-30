"use client";
import React, { useEffect, useState, useRef } from "react";
import Card from "./card/card";
import { getTopItems } from "@/apiCalls/consumerApiCall";
import { allItem } from "@/utils/types";
import Flickity from "flickity";
import "flickity/dist/flickity.min.css";
import { IoArrowForward, IoArrowBackOutline } from "react-icons/io5";

export default function Carousel({
  sectionTitle,
}: {
  sectionTitle: "GAME" | "PROGRAM";
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<allItem[]>([]);
  const flickityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchItems = async () => {
      const Items = await getTopItems(sectionTitle);
      setItems(Items);
      setIsLoading(true);
    };

    fetchItems();

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

  if (!isLoading) {
    return (
      <div role="status" className="animate-pulse">
        <div className="w-full h-80 bg-slate-900xx"></div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <div className="carousel w-full" ref={flickityRef}>
        {items.map((item, index) => (
          <Card item={item} key={index + 1} />
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
  );
}
