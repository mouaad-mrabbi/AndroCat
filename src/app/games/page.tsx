export const dynamic = "force-dynamic";

import GamesPage from "./[pageId]/page";

export default function GamesPageN1() {
  const params = Promise.resolve({ pageId: "1" });

  return <GamesPage params={params} />;
}
