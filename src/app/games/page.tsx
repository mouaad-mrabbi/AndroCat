export const dynamic = "force-dynamic";

import { DOMAIN } from "@/utils/constants";
import GamesPage from "./[pageId]/page";

export async function metadata(){
  return {
    title: "Download modded games on android",
    description:
      "In this section, you can download the latest cool and popular games. We also have daily updates of selected games mod for Android.",
    alternates: {
      canonical: `${DOMAIN}/games`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function GamesPageN1() {
  const params = Promise.resolve({ pageId: "1" });

  return <GamesPage params={params} />;
}
