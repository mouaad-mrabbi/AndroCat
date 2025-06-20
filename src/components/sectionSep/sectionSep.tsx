import CarouselApps from "../carouselApps";
import Link from "next/link";
interface SectionTitle {
  sectionTitle: "GAME" | "PROGRAM";
}
export default function SectionSep({ sectionTitle }: SectionTitle) {
  return (
    <div className="flex flex-col gap-4 my-16 max-[500px]:px-0 px-8 mx-2 ">
      <div className="uppercase text-2xl leading-relaxed font-bold">
        <h2>list {sectionTitle}</h2>
      </div>
      <CarouselApps sectionTitle={sectionTitle} />
      <Link
        href={`/${sectionTitle.toLowerCase()}s`}
        title={`all ${sectionTitle} on Androcat`}
        className="uppercase bg-interactive leading-relaxed font-bold w-max py-1.5 px-6 rounded-full shadow-xl shadow-interactive/20"
      >
        <span>all {sectionTitle}</span>
      </Link>
    </div>
  );
}
