import SwiperCarousel from "@/components/swiperCarousel";
import SectionSep from "@/components/sectionSep/sectionSep";

const Home = () => {
  return (
    <div>
      <SwiperCarousel />
      <SectionSep sectionTitle={"GAME"} />
      <div className="zig-zag-line"></div>
      <SectionSep sectionTitle={"PROGRAM"} />
      <div className="zig-zag-line"></div>

      <div className="max-[500px]:px-0 px-8">
        <div className="mt-10 text-[#898a8b] max-w-[57.5rem]">
          <h1 className="text-xl mb-4 font-bold max-[770px]:text-base max-[770px]:mb-2">
            Download free games for Android
          </h1>
          <div className="max-[770px]:text-sm">
            On Androcat.com, you can download free Android games and apps
            quickly and easily. We offer the latest versions of the most popular
            games, apps, and MOD APKs, with daily catalog updates. All games
            available on our platform are carefully tested to ensure they work
            perfectly, so you don't have to worry about crashes or viruses.
            Enjoy downloading your favorite APK games at excellent speeds and
            with complete safety!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
