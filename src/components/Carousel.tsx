"use client"
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules'; // استيراد الوحدات من 'swiper/modules'
import 'swiper/css'; // استيراد أنماط Swiper الأساسية
import 'swiper/css/navigation'; // أنماط Navigation
import 'swiper/css/pagination'; // أنماط Pagination
import Card from './card/card';

const Carousel = () => {
  const [isMounted, setIsMounted] = useState(false); // حالة لتتبع تحميل الصفحة

  useEffect(() => {
    setIsMounted(true); // تأكيد أن الصفحة قد تم تحميلها
  }, []);

  if (!isMounted) {
    return null; // عدم عرض Swiper حتى يتم تحميل الصفحة
  }

  return (
    <div className="w-full relative">
      <Swiper
        modules={[Navigation, Pagination]} // إضافة الوحدات هنا
        loop={true}
        spaceBetween={20} // المسافة بين العناصر
        slidesPerView={1} // عدد العناصر المعروضة بشكل افتراضي
        navigation // إضافة أسهم التنقل
        observer={true} // يراقب التغييرات في DOM
        observeParents={true} // يراقب التغييرات في العناصر الأم
        breakpoints={{
          1120: { slidesPerView: 6, spaceBetween: 30, slidesPerGroup: 5 },
          960: { slidesPerView: 5, spaceBetween: 0, slidesPerGroup: 4 },
          770: { slidesPerView: 4, spaceBetween: 0, slidesPerGroup: 3 },
          580: { slidesPerView: 3, spaceBetween: 0, slidesPerGroup: 2 },
          390: { slidesPerView: 2, spaceBetween: 0, slidesPerGroup: 1 },
          0: { slidesPerView: 1, spaceBetween: 0, slidesPerGroup: 1 },
        }}
      >
        <div className="swiper-wrapper ">
          {[
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            ,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20].map((slide) => (
            <SwiperSlide key={slide}>
              <Card />
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </div>
  );
};

export default Carousel;