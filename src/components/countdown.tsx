"use client";
import { DOMAINCDN } from "@/utils/constants";
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
  const [clickedOnce, setClickedOnce] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowDownload(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (!clickedOnce) {
      setClickedOnce(true);

      const adScript = document.createElement("script");
      adScript.src =
        "//pl26463102.profitableratecpm.com/0c/b6/8c/0cb68c1040fbce3d43357b3727be32f1.js";
      adScript.async = true;
      document.body.appendChild(adScript);
    }
  }, []);

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
          href={`${DOMAINCDN}/${link}`}
          className="mt-4 flex items-center box-border h-10 py-3 px-6 uppercase bg-interactive text-white 
            font-bold rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95"
          download={clickedOnce}
          rel="nofollow"
        >
          Download ({fileSize})
        </a>
      )}
    </>
  );
}
