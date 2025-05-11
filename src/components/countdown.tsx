"use client";
import { useState, useEffect } from "react";

export default function Countdown({
  fileSize,
  link,
}: {
  fileSize: string;
  link: string;
}) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [showDownload, setShowDownload] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowDownload(true);
    }
  }, [timeLeft]);

  return (
    <>
      {!showDownload ? (
        <div
          className="relative flex items-center justify-center box-border h-28 w-28 p-12 uppercase bg-gradient-to-r
           from-emerald-500 to-green-600 leading-relaxed font-bold text-nowrap rounded-full text-white shadow-lg"
        >
          <span className="text-5xl font-mono tracking-wider z-10">
            {timeLeft}
          </span>

          <svg
            className="absolute inset-0 text-white/50 animate-[spin_4s_linear_infinite]"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeOpacity="0.5"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="butt"
              strokeDasharray="180 120"
            />
          </svg>
        </div>
      ) : (
        <a
          href={link}
          className="mt-4 flex items-center box-border h-10 py-3 px-6 uppercase bg-green-500 text-white 
  font-bold rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95"
          download
          rel="nofollow"
        >
          Download ({fileSize})
        </a>
      )}
    </>
  );
}
