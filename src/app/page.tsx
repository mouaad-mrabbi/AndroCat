import SwiperCarousel from "@/components/swiperCarousel";
import SectionSep from "@/components/sectionSep/sectionSep";

const Home = () => {
  return (
    <div>
      <SwiperCarousel />
      <SectionSep sectionTitle={"games"}/>
      <div className="zig-zag-line"></div>
      <SectionSep sectionTitle={"programs"}/>
    </div>
  );
};

export default Home;