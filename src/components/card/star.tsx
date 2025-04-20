"use client";
import { useState, useEffect } from "react";
import { RiStarFill, RiStarHalfFill, RiStarLine } from "react-icons/ri";

interface StarProps {
  rating: number; // Accept both number and string for flexibility
}

export default function Star({ rating=0 }: StarProps) {
  if (rating < 0) {
    rating = 0;
  } else if (rating > 5) {
    rating = 5;
  }
  const [roundedValue, setRoundedValue] = useState<number | null>(0);

  useEffect(() => {
    const number = typeof rating === "string" ? parseFloat(rating) : rating;
    const rounded = Math.round(number * 2) / 2; // Round to nearest 0.5
    setRoundedValue(rounded);
  }, [rating]);

  function hasDecimal(num: number): boolean {
    return num % 1 !== 0;
  }

  if (roundedValue === null) {
    return null; // Return nothing until the value is calculated
  }

  // Calculate how many stars are filled and empty
  const fullStars = Math.floor(roundedValue);
  const halfStar = hasDecimal(roundedValue);
  const emptyStars = 5 - Math.ceil(roundedValue);

  return (
    <div className="flex text-2xl">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <RiStarFill key={`full-${i}`} className="fill-green-500" />
      ))}
      {/* Half star */}
      {halfStar && <RiStarHalfFill key="half" className="fill-green-500" />}
      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <RiStarLine key={`empty-${i}`} className="fill-green-500" />
      ))}
    </div>
  );
}
