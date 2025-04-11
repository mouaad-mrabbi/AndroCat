import LandCard from "./landCard";
import { Suspense } from "react";
import { LoadingLandCard } from "./landCard";
import { ITEM_PER_PAGE } from "@/utils/constants";
import { allItem } from "@/utils/types";

type AppListing = {
  items: allItem[];
  url: string;
};

export default function AppList({ items, url  }: AppListing) {
  return (
    <Suspense fallback={<LoadingAppList />}>
      <div
        className="grid grid-cols-[repeat(3,1fr)] max-[570px]:grid-cols-[repeat(2,1fr)]
        max-[820px]:grid-cols-[repeat(3,1fr)] max-[1070px]:grid-cols-[repeat(2,1fr)] gap-4 max-[820px]:gap-2
        max-w-[1200px] mx-auto"
      >
        {items.map((item,index) => (
          <LandCard key={item.id} item={item} url={url} index={index}></LandCard>
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
      {Array.from({ length: ITEM_PER_PAGE }, (_, i) => (
        <LoadingLandCard key={i} />
      ))}
    </div>
  );
}
