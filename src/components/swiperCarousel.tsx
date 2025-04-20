"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";

const SwiperCarousel= () => {
  return (
    <div className="w-full relative select-none ">
      <Swiper
        loop={true}
        pagination={{ clickable: true }}
        /* navigation={windowWidth >= 1024} */
        modules={[Navigation]}
        className="default-carousel"
      >
        <SwiperSlide>
          <div className="  h-80 flex items-center ">
            <Image
              src="/images/imageGames.png"
              width={500}
              height={500}
              alt="Picture of the author"
              className="h-full w-full object-cover brightness-[0.35]"
            />
            <div
              className="absolute top-0 right-0 p-20 w-[400px] lg:w-1/2 h-full 
             transform lg:skew-x-[-20deg] max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:p-8 
             flex items-center max-lg:bg-transparent "
            >
              <div className="lg:skew-x-[20deg] max-lg:text-center  ">
                <p className="font-bold text-3xl">MOD Games</p>
                <p className="font-medium text-lg py-4 ">
                  A free catalog of the newest MOD game versions available for
                  download.
                </p>
                <Link
                  href="/games"
                  className="p-2.5 rounded-full font-bold w-max bg-green-500"
                >
                  ALL MOD Games
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className=" h-80 flex items-center">
            <Image
              src="/images/imagePrograms.jpeg"
              width={500}
              height={500}
              alt="Picture of the author"
              className="h-full w-full object-cover brightness-50"
            />
            <div
              className="absolute top-0 right-0 p-20 w-[400px] lg:w-1/2 h-full
             transform lg:skew-x-[-20deg] max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:p-8 
             flex items-center max-lg:bg-transparent "
            >
              <div className="lg:skew-x-[20deg] max-lg:text-center  ">
                <p className="font-bold text-3xl">MOD Games</p>
                <p className="font-medium text-lg py-4 ">
                  Free catalog of the latest MOD versions of games that you can
                  download for free
                </p>
                <Link
                  href="/programs"
                  className=" p-2.5 rounded-full font-bold w-max bg-green-500"
                >
                  ALL MOD Games
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default SwiperCarousel;
