// app/search/page.tsx
"use client";

import { Suspense } from "react";
import SearchPageContent from "./SearchPageContent"; // Import the actual content

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
