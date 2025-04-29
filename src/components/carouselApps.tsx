"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules"; // استيراد الوحدات من 'swiper/modules'
import "swiper/css"; // استيراد أنماط Swiper الأساسية
import "swiper/css/navigation"; // أنماط Navigation
import "swiper/css/pagination"; // أنماط Pagination
import Card from "./card/card";
import { getTopItems } from "@/apiCalls/consumerApiCall";
import { allItem } from "@/utils/types";

export default function Carousel({sectionTitle}:{sectionTitle:"GAME" | "PROGRAM"}) {
  const [isMounted, setIsMounted] = useState(false); // حالة لتتبع تحميل الصفحة
  const [items, setItems] = useState<allItem[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const Items = await getTopItems(sectionTitle);
      setItems(Items);
    };

    fetchItems();
  }, []);

  useEffect(() => {
    // محاكاة عملية تحميل باستخدام setTimeout
    setTimeout(() => {
      setIsMounted(true); // تأكيد أن الصفحة قد تم تحميلها
    }, 2000); // انتظر لمدة 2 ثانية قبل التحميل
  }, []);

  if (!isMounted) {
    return (
      <div role="status" className="animate-pulse">
        <div className="w-full h-80 bg-slate-900xx"></div>
      </div>
    ); // عرض شاشة التحميل
  }

  return (
    <div className="w-full relative">
      <Swiper
        modules={[Navigation, Pagination]} // إضافة الوحدات هنا
        loop={true}
        spaceBetween={20} // المسافة بين العناصر
        slidesPerView={1} // عدد العناصر المعروضة بشكل افتراضي
        /* navigation // إضافة أسهم التنقل */
        observer={true} // يراقب التغييرات في DOM
        observeParents={true} // يراقب التغييرات في العناصر الأم
        breakpoints={{
          1220: { slidesPerView: 6, spaceBetween: 0, slidesPerGroup: 4 },
          1030: { slidesPerView: 5, spaceBetween: 0, slidesPerGroup: 4 },
          850: { slidesPerView: 4, spaceBetween: 0, slidesPerGroup: 3 },
          650: { slidesPerView: 3, spaceBetween: 0, slidesPerGroup: 2 },
          450: { slidesPerView: 2, spaceBetween: 0, slidesPerGroup: 1 },
          385: { slidesPerView: 1.8, spaceBetween: 0, slidesPerGroup: 1 },
          350: { slidesPerView: 1.8, spaceBetween: 0, slidesPerGroup: 1 },
          315: { slidesPerView: 1.6, spaceBetween: 0, slidesPerGroup: 1 },
          280: { slidesPerView: 1.4, spaceBetween: 0, slidesPerGroup: 1 },
          0: { slidesPerView: 1, spaceBetween: 0, slidesPerGroup: 1 },
        }}
      >
        <div className="swiper-wrapper ">
          {items.map((item, index) => (
            <SwiperSlide key={index + 1}>
              <Card item={item} />
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </div>
  );
}
