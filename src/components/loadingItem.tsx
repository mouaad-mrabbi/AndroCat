"use client";
import { useEffect, useState } from "react";

export default function LoadingItem() {
  const [heights, setHeights] = useState(new Array(6).fill(20));

  useEffect(() => {
    const interval = setInterval(() => {
      setHeights(heights.map(() => Math.random() * 50 + 20));
    }, 500);
    return () => clearInterval(interval);
  }, [heights]);

  return (
    <div
      className="flex "
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      <div className="flex items-center justify-center space-x-2 w-full">
        {heights.map((height, index) => (
          <div
            key={index}
            className="w-2 bg-white rounded transition-all duration-500"
            style={{ height: `${height}px` }}
          ></div>
        ))}
      </div>
    </div>
  );
}
