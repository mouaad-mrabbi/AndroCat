import LandCard from "./landCard";
import { Suspense } from "react";
import { LoadingLandCard } from "./landCard";
import { ARTICLE_PER_PAGE } from "@/utils/constants";
import { allArticle } from "@/utils/types";

type AppListing = {
  articles: allArticle[];
  url: string;
};

export default function AppList({ articles, url  }: AppListing) {
  return (
    <Suspense fallback={<LoadingAppList />}>
      <div
        className="grid grid-cols-[repeat(3,1fr)] max-[570px]:grid-cols-[repeat(2,1fr)]
        max-[820px]:grid-cols-[repeat(3,1fr)] max-[1070px]:grid-cols-[repeat(2,1fr)] gap-4 max-[820px]:gap-2
        max-w-[1200px] mx-auto"
      >
        {articles.map((article,index) => (
          <LandCard key={article.id} article={article} url={url} index={index}></LandCard>
        ))}
      </div>
    </Suspense>
  );
}


export function LoadingAppList() {
  return (
    <div
      className="grid grid-cols-[repeat(3,1fr)] max-[570px]:grid-cols-[repeat(2,1fr)]
      max-[820px]:grid-cols-[repeat(3,1fr)] max-[1070px]:grid-cols-[repeat(2,1fr)]
      gap-4 max-[820px]:gap-2 max-w-[1200px] mx-auto"
    >
      {Array.from({ length: ARTICLE_PER_PAGE }, (_, i) => (
        <LoadingLandCard key={i} />
      ))}
    </div>
  );
}
