import ProgramsPage from "./[pageId]/page";

export default function ProgramsPageN1() {
  const params = Promise.resolve({ pageId: "1" });

  return <ProgramsPage params={params} />;
}