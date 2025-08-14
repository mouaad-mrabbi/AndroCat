import SwiperCarousel from "@/components/swiperCarousel";
import SectionSep from "@/components/sectionSep/sectionSep";
import { DOMAIN } from "@/utils/constants";
import Head from "next/head";

export const metadata = {
  title: "AndroCat | Download Android games mod and programs for free.",
  description:
    "AndroCat offers free Android games, premium MOD APKs, and unlocked apps. Enjoy fast, safe downloads of your favorite APKs with no viruses and high-speed performance.",
  keywords: [
    "androcat",
    "games",
    "programs",
    "android",
    "mod",
    "apk",
    "apps",
    "free",
    "downloader",
  ],
  alternates: {
    canonical: `${DOMAIN}`,
  },
  openGraph: {
    type: "website",
    url: `${DOMAIN}`,
    title: "AndroCat - Free MOD APK Games & Android Apps",
    description:
      "AndroCat offers free Android games, premium MOD APKs, and unlocked apps. Enjoy fast, safe downloads of your favorite APKs with no viruses and high-speed performance.",
    images: [
      {
        url: `${DOMAIN}/images/AndroCat-logo.png`,
        width: 1573,
        height: 421,
        alt: "Download Free MOD APK Android Games and Apps - AndroCat",
      },
    ],
  },
  twitter: {
    title: "AndroCat | Download Android games mod and programs for free.",
    description:
      "AndroCat offers free Android games, premium MOD APKs, and unlocked apps. Enjoy fast, safe downloads of your favorite APKs with no viruses and high-speed performance.",
    images: [`${DOMAIN}/images/AndroCat-logo.png`],
  },
};

const Home = () => {
  return (
    <>
      <Head>
        {/* CollectionPage Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "AndroCat | Download Android games mod and programs for free.",
              description:
                "AndroCat offers free Android games, premium MOD APKs, and unlocked apps. Enjoy fast, safe downloads of your favorite APKs with no viruses and high-speed performance.",
              url: DOMAIN,
            }),
          }}
        />
        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "AndroCat",
              url: DOMAIN,
            }),
          }}
        />
      </Head>

      <div>
        <SwiperCarousel />
        <SectionSep sectionTitle={"GAME"} />
        <div className="zig-zag-line"></div>
        <SectionSep sectionTitle={"PROGRAM"} />
        <div className="zig-zag-line"></div>

        <div className="max-[500px]:px-0 px-8 mx-2">
          <div className="mt-10 text-[#898a8b] max-w-[57.5rem]">
            <h2 className="text-xl mb-4 max-[770px]:mb-2 font-bold max-[770px]:text-base ">
              AndroCat – Your Hub for Android Games and Programs
            </h2>
            <div className="max-[770px]:text-sm mb-5 max-[770px]:mb-3">
              AndroCat is the ultimate destination for downloading both Android
              games and programs. From thrilling action games and casual puzzles
              to essential Android utilities and productivity apps, we provide a
              wide variety of APKs for all types of users. Every file is
              carefully tested to ensure safety, speed, and high performance,
              making it easy to enjoy your favorite apps and programs without
              risks or interruptions. Explore our constantly updated library and
              discover the latest trends in both games and Android software.
            </div>

            <h2 className="text-xl mb-4 font-bold max-[770px]:text-base max-[770px]:mb-2">
              Safe, Fast, and Reliable Downloads
            </h2>
            <div className="max-[770px]:text-sm mb-5 max-[770px]:mb-3">
              At AndroCat, your security and convenience are our priorities. All
              APK files, whether games or programs, are scanned for malware and
              optimized for fast downloads. Our reliable servers guarantee
              smooth access to your favorite apps without broken links, fake
              files, or ads disrupting your experience.
            </div>

            <h2 className="text-xl mb-4 font-bold max-[770px]:text-base max-[770px]:mb-2">
              Unlock Premium Features for Free
            </h2>
            <div className="max-[770px]:text-sm mb-5 max-[770px]:mb-3">
              With our collection of MOD APKs, you can enjoy premium features in
              both games and programs for free — unlimited coins, unlocked
              levels, ad-free functionality, and enhanced capabilities. AndroCat
              gives you access to the latest and most popular Android apps,
              ensuring that you always have high-quality content without
              subscriptions or hidden costs.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
