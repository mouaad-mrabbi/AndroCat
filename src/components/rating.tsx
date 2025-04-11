"use client";
import { useState, useEffect } from "react";
import { RiStarFill, RiStarHalfFill, RiStarLine } from "react-icons/ri";
import { sendRatingToAPI } from "@/apiCalls/consumerApiCall";
import { motion, AnimatePresence } from "framer-motion";

interface RatingProps {
  rating: number;
  itemId: string;
}

export default function Rating({
  rating ,
  itemId,
}: RatingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [textWindow, setTextWindow] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [roundedValue, setRoundedValue] = useState<number | null>(0);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);

  useEffect(() => {
    const number = typeof rating === "string" ? parseFloat(rating) : rating;
    const rounded = Math.round(number * 2) / 2; // تقريب لأقرب 0.5
    setRoundedValue(rounded);
  }, [rating]);

  function handleClick(value: number) {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      const FetchItem = async () => {
        try {
          const response = await sendRatingToAPI(value, itemId);
          setTextWindow(response.data.message);
          setIsOpen(true);
        } catch (error: any) {
          console.log(error);
          setTextWindow(error);
          setIsOpen(true);
        }
      };

      FetchItem();
    }, 1000); // تحميل يظهر لمدة ثانية
  }

  function renderStars(value: number | null) {
    if (value === null) return null;

    const fullStars = Math.floor(value);
    const halfStar = value % 1 !== 0;
    const emptyStars = 5 - Math.ceil(value);

    return (
      <div className="flex fill-yellow-500 cursor-pointer ">
        {/* النجوم الممتلئة */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <RiStarFill
            key={`full-${i}`}
            className="fill-green-500 cursor-pointer text-5xl"
            onMouseEnter={() => setHoverValue(i + 1)}
            onMouseLeave={() => setHoverValue(null)}
            onClick={() => handleClick(i + 1)}
          />
        ))}
        {/* النصف نجمة */}
        {halfStar && (
          <RiStarHalfFill
            key="half"
            className="fill-green-500 cursor-pointer text-5xl"
            onMouseEnter={() => setHoverValue(fullStars + 1)}
            onMouseLeave={() => setHoverValue(null)}
            onClick={() => handleClick(fullStars + 0.5)}
          />
        )}
        {/* النجوم الفارغة */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <RiStarLine
            key={`empty-${i}`}
            className="fill-green-500 cursor-pointer text-5xl"
            onMouseEnter={() =>
              setHoverValue(fullStars + (halfStar ? 1 : 0) + i + 1)
            } // ✅ التعديل هنا
            onMouseLeave={() => setHoverValue(null)}
            onClick={() => handleClick(fullStars + (halfStar ? 1 : 0) + i + 1)}
          />
        ))}

        {/* النافذة المنبثقة */}
        {isOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="bg-[#292c2f] rounded-lg shadow-lg max-w-[470px] w-full p-6 relative"
              onClick={(e) => e.stopPropagation()} // لمنع الإغلاق عند النقر داخل النافذة
            >
              <h2 className="text-lg font-bold mb-4">Information</h2>
              <p className="text-lg">{textWindow}</p>

              {/* زر الإغلاق */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-3xl"
              >
                &times;
              </button>
            </div>
          </div>
        )}
        {/* شاشة التحميل */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              key="loading"
              className="fixed inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-white text-base">Please wait...</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex">
      {renderStars(hoverValue ?? userRating ?? roundedValue)}
    </div>
  );
}
