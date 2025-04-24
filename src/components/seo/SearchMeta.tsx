// components/seo/SearchMeta.tsx
"use client";

import { DOMAIN } from "@/utils/constants";
import Head from "next/head";
import { useSearchParams } from "next/navigation";

export default function SearchMeta() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const pageTitle = q ? `Search results for "${q}"` : "Search";
  const pageDescription = q
    ? `Find the best results related to "${q}" in our database.`
    : "Search through our database of apps and games.";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "name": pageTitle,
    "about": q,
    "description": pageDescription,
    "mainEntity": {
      "@type": "SearchAction",
      "target": `${DOMAIN}/search?q=${encodeURIComponent(q)}`,
      "query-input": "required name=q"
    }
  };

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}/search?q=${encodeURIComponent(q)}`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
}
