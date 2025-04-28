import SwiperCarousel from "@/components/swiperCarousel";
import SectionSep from "@/components/sectionSep/sectionSep";
import { DOMAIN } from "@/utils/constants";
import Head from "next/head";

export const metadata = {
  title: "AndroCat | Download Android games mod and programs for free.",
  description:
    "Free Android games and MOD APK apps with AndroCat. Safe, fast and updated daily with top trending apps and games for Android devices.",
  keywords: [
    "games for android",
    "programs for android",
    "mod apk",
    "androcat",
    "androcat com",
    "andro cat",
    "android cat",
    "android apps",
    "free android games",
    "MOD APK download",
    "apk games",
    "free apk",
    "modded games",
    "latest android games",
    "apk downloader",
  ],
  alternates: {
    canonical: `${DOMAIN}`,
  },

  openGraph: {
    type: "website",
    url: `${DOMAIN}`,
    title: "AndroCat - Free MOD APK Games & Android Apps",
    description:
      "Free Android MOD APKs and trending games on AndroCat. Updated daily. Safe and fast downloads for all your favorite apps.",
    images: [
      {
        url: `${DOMAIN}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: "Download Free MOD APK Android Games and Apps - AndroCat",
      },
    ],
  },
  twitter: {
    title: "AndroCat - Download MOD APKs for Free",
    description:
      "Free Android APKs, apps and modded games ready to download. Discover new experiences with AndroCat.",
    images: [`${DOMAIN}/images/logo.png`],
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
              name: "Download Free Android Games and MOD APKs",
              description:
                "Download free Android games and MOD APK apps safely and quickly from AndroCat. Updated daily with trending apps and games.",
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

      {/* محتوى الصفحة */}
      <div>
        <SwiperCarousel />
        <SectionSep sectionTitle={"GAME"} />
        <div className="zig-zag-line"></div>
        <SectionSep sectionTitle={"PROGRAM"} />
        <div className="zig-zag-line"></div>

        <div className="max-[500px]:px-0 px-8">
          <div className="mt-10 text-[#898a8b] max-w-[57.5rem]">
            <h2 className="text-xl mb-4 font-bold max-[770px]:text-base max-[770px]:mb-2">
              Download free games for Android
            </h2>
            <div className="max-[770px]:text-sm">
              On Androcat.com, you can download free Android games and apps
              quickly and easily. We offer the latest versions of the most
              popular games, apps, and MOD APKs, with daily catalog updates. All
              games available on our platform are carefully tested to ensure
              they work perfectly, so you don't have to worry about crashes or
              viruses. Enjoy downloading your favorite APK games at excellent
              speeds and with complete safety!
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
