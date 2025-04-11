"use client";

import { IoArrowBack } from "react-icons/io5";

export default function BackWindow() {
  return (
    <button
      onClick={() => window.history.back()}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-500/50"
    >
      <IoArrowBack />
    </button>
  );
}
