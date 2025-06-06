"use client";
import React, { useEffect, useState, useRef } from "react";
import "flickity/dist/flickity.min.css";
import { IoArrowForward, IoArrowBackOutline } from "react-icons/io5";
import { allArticle } from "@/utils/types";
import { getTopArticles } from "@/apiCalls/consumerApiCall";
import Card from "./card/card";

const Carousel = ({ sectionTitle }: { sectionTitle: "GAME" | "PROGRAM" }) => {
  const flickityRef = useRef<HTMLDivElement>(null);
  const [flickityInstance, setFlickityInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState<allArticle[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const Articles = await getTopArticles(sectionTitle);
      setArticles(Articles);
      setIsLoading(true);
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    let flickity: any;

    const initFlickity = async () => {
      const Flickity = (await import("flickity")).default;

      if (flickityRef.current) {
        flickity = new Flickity(flickityRef.current, {
          groupCells: true,
          cellAlign: "center",
          contain: true,
          wrapAround: true,
          pageDots: false,
        });

        const prevNextButtons = flickityRef.current.querySelectorAll(
          ".flickity-prev-next-button"
        );
        prevNextButtons.forEach((button) => {
          button.classList.add("hidden");
        });

        const prevButton = document.querySelector(".carousel-prev");
        const nextButton = document.querySelector(".carousel-next");

        prevButton?.addEventListener("click", () => flickity.previous());
        nextButton?.addEventListener("click", () => flickity.next());

        setFlickityInstance(flickity);
      }
    };

    initFlickity();

    return () => {
      if (flickity) {
        flickity.destroy();
      }
    };
  }, [articles]);

  if (!isLoading) {
    return (
      <div role="status" className="animate-pulse">
        <div className="w-full h-80 bg-slate-900xx"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="carousel w-full" ref={flickityRef}>
        {articles.map((article, index) => {
          return <Card article={article} key={index} />;
        })}
      </div>
      <button className="carousel-prev absolute left-2 top-1/2 text-2xl transform -translate-y-1/2 bg-[#78C257] text-white p-3 rounded-full focus:outline-none max-lg:hidden">
        <IoArrowBackOutline />
      </button>
      <button className="carousel-next absolute right-2 top-1/2 text-2xl transform -translate-y-1/2 bg-[#78C257] text-white p-3 rounded-full focus:outline-none max-lg:hidden">
        <IoArrowForward />
      </button>
    </div>
  );
};

export default Carousel;
