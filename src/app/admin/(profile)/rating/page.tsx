"use client";

import { useState } from "react";
import axios from "axios";
import { DOMAIN } from "@/utils/constants";

export default function OwnerRatingsPage() {
  const [articleId, setArticleId] = useState(0);
  const [count, setCount] = useState(10);
  const [minRate, setMinRate] = useState(3);
  const [maxRate, setMaxRate] = useState(5);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post(`${DOMAIN}/api/owner/rating`, {
        articleId,
        count,
        minRate,
        maxRate,
      });

      setMessage(response.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg space-y-6 text-black dark:text-white
     transition-colors duration-300 mt-8"
    >
      <h1 className="text-2xl font-extrabold text-center">Generate Ratings</h1>

      <div className="space-y-4">
        <input
          type="number"
          placeholder="article ID"
          className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 rounded-md focus:outline-none
           focus:ring-2 focus:ring-blue-500 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          value={articleId}
          onChange={(e) => setArticleId(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Count"
          className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 rounded-md focus:outline-none
           focus:ring-2 focus:ring-blue-500 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Min Rate (1)"
            className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 rounded-md focus:outline-none
             focus:ring-2 focus:ring-blue-500 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            value={minRate}
            onChange={(e) => setMinRate(Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Max Rate (5)"
            className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 rounded-md focus:outline-none
             focus:ring-2 focus:ring-blue-500 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            value={maxRate}
            onChange={(e) => setMaxRate(Number(e.target.value))}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 dark:bg-blue-700 text-white p-3 rounded-md font-medium hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-300 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Submit"}
        </button>

        {message && (
          <p className="text-green-600 dark:text-green-400 text-sm font-medium text-center">
            ✅ {message}
          </p>
        )}
        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm font-medium text-center">
            ❌ {error}
          </p>
        )}
      </div>
    </div>
  );
}
