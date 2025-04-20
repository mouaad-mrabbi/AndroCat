import SwiperCarousel from "@/components/swiperCarousel";
import SectionSep from "@/components/sectionSep/sectionSep";

const Home = () => {
  return (
    <div>
      <SwiperCarousel />
      <SectionSep sectionTitle={"GAME"}/>
      <div className="zig-zag-line"></div>
      <SectionSep sectionTitle={"PROGRAM"}/>
    </div>
  );
};

export default Home;