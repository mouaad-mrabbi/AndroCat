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
            <h2 className="text-xl mb-4 font-bold max-[770px]:text-base max-[770px]:mb-2">
              Download free games for Android
            </h2>
            <div className="max-[770px]:text-sm">
              On Androcat.com, you can effortlessly download free Android games,
              MOD APKs, and premium apps with lightning-fast speeds and
              guaranteed safety. Whether you’re searching for the latest Android
              games, apps, or MOD APKs, we offer an extensive catalog of
              high-quality content that’s continuously updated to bring you the
              most popular and recent releases. Our platform specializes in
              providing unlocked apps and modded versions of games, allowing you
              to experience all the premium features without any cost. Each game
              and app available on Androcat.com is meticulously tested to ensure
              it meets the highest standards for performance, security, and
              compatibility, so you don’t have to worry about crashes, bugs, or
              viruses. With Androcat, you can easily access a variety of APK
              games, from action-packed adventures to casual games, all
              optimized for your Android device. We also ensure all APKs are
              virus-free and scanned for any harmful content to keep your device
              safe. The download speeds are optimized to deliver a seamless
              experience, ensuring you can enjoy your favorite Android games and
              apps without any interruptions. Androcat.com is designed to cater
              to all Android users, offering a secure, fast, and reliable
              platform where you can get the best free Android games, MOD APKs,
              and apps at no cost. Whether you're looking for free Android
              games, the latest MOD APKs, or unlocked apps, Androcat.com has
              something for everyone. Enjoy a hassle-free downloading experience
              with regular updates to our catalog, making it your go-to source
              for all things Android.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
