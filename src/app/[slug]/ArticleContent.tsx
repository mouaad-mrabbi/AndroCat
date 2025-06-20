import Image from "next/image";
import Link from "next/link";
import Star from "@/components/card/star";
import { FaAndroid } from "react-icons/fa";
import { TbVersionsFilled } from "react-icons/tb";
import { ImDatabase } from "react-icons/im";
import Spoiler from "@/components/spoiler";
import { RiDownloadFill } from "react-icons/ri";
import Toolbar from "@/components/toolbar";
import NotFoundPage from "@/app/not-found";
import { fetchArticleById } from "@/apiCalls/consumerApiCall";
import Rating from "@/components/rating";
import { headers } from "next/headers";
import BannerAd from "@/components/bannerAd";
import Head from "next/head";
import { DOMAIN, DOMAINCDN } from "@/utils/constants";

interface DownloadLink {
  key: string;
  label: string;
  bgColor: string;
  size: string | null;
  link: string | null;
}

export async function ArticleContent({ slug }: { slug: string }) {
  try {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";

    const isMobile =
      /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(userAgent);

    if (!slug || isNaN(Number(slug.split("-")[0]))) {
      throw new Error("Invalid slug format");
    }
    const [idPart, ...titleParts] = slug.split("-");
    const articleId = parseInt(idPart);
    if (isNaN(articleId)) {
      throw new Error("Invalid articleId from slug");
    }

    const article = await fetchArticleById(articleId);

    const capitalize = (str: any) =>
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const category =
      article.articleType === "GAME"
        ? capitalize(article.gameCategory)
        : capitalize(article.programCategory);

    const structuredData = {
      "@context": "https://schema.org",
      "@type":
        article.articleType === "GAME" ? "VideoGame" : "SoftwareApplication",
      name: `Download ${article.title} ${article.isMod && article.typeMod} ${
        article.version
      } apk for android`,
      description: `${article.title} (${article.isMod && article.typeMod}) - ${
        article.descriptionMeta
      }`,
      url: `${DOMAIN}/${slug}`,
      image: `${DOMAINCDN}/${article.image}`,
      screenshot: article.appScreens?.map((img) => `${DOMAINCDN}/${img}`),
      keywords:
        [...(article.keywords || []), "games", "apps", "mod", "apk"].join(
          ", "
        ) || "games, apps, mod, apk",
      developer: article.developer,
      applicationCategory: category,
      operatingSystem: "Android",
      softwareVersion: article.version,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: article.averageRating,
        ratingCount: article.ratingCount,
      },
    };

    const downloadLinks = [
      {
        key: "apk",
        label: "APK",
        bgColor: "bg-interactive",
        size: article.sizeFileAPK,
        link: article.linkAPK,
      },
      {
        key: "original-apk",
        label: "Original APK",
        bgColor: "bg-[#3f4244]",
        size: article.sizeFileScript,
        link: article.linkOriginalAPK,
      },
      {
        key: "obb",
        label: "OBB",
        bgColor: "bg-yellow-600",
        size: article.sizeFileOBB,
        link: article.linkOBB,
      },
      {
        key: "script",
        label: "Script",
        bgColor: "bg-yellow-600",
        size: article.sizeFileScript,
        link: article.linkScript,
      },
    ];

    const renderDownloadLink = ({
      key,
      label,
      bgColor,
      size,
      link,
    }: DownloadLink) => {
      if (!link) return null;

      return (
        <Link
          key={key}
          href={`/download/${article.id}-${key}`}
          title={`Download ${label} ${article.title} Updated to version ${article.version}`}
          className={`flex items-center justify-between max-[1000px]:flex-col 
            box-border py-4 px-8 max-sm:px-4 uppercase ${bgColor} leading-relaxed 
            font-bold rounded-full max-[1000px]:rounded-xl shadow-xl shadow-${bgColor}/20`}
        >
          <div>
            <p>
              Download {label} {article.title}{" "}
              <span> Updated to version {article.version}</span>
            </p>
          </div>
          <div className="max-[1000px]:font-medium flex items-center gap-2">
            <RiDownloadFill />
            <p>{size}</p>
          </div>
        </Link>
      );
    };
    return (
      <>
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
          />
        </Head>
        <div className="min-w-[320px]">
          <Toolbar
            local={"home"}
            firstLocal={article.articleType === "GAME" ? "games" : "programs"}
            scndLocal={`${article.title}`}
          />
          {/* content */}
          <div className="bg-[#1b1d1f] max-[770px]:bg-transparent m-7 max-[770px]:m-0">
            <div
              className="
                grid gap-4 p-6
                grid-cols-[minmax(0,auto)_minmax(0,1fr)]
                min-[770px]:grid-cols-[minmax(0,auto)_minmax(0,1fr)]
                lg:grid-cols-[minmax(0,auto)_minmax(0,1fr)_minmax(0,208px)]
              "
            >
              {/* 1 */}
              <div
                className="
                  lg:col-start-1 lg:row-start-1 lg:row-span-3
                  min-[770px]:row-span-4 min-[770px]:col-start-1 min-[770px]:row-start-1
                  row-span-2 col-start-1 row-start-2
                  order-1
                "
              >
                {/* image square */}
                <Image
                  src={`${DOMAINCDN}/${article.image}`}
                  width={190}
                  height={190}
                  alt={`${article.title} ${article.isMod ? "mod" : ""} apk`}
                  className="w-[136px] min-[500px]:w-[184px] min-[770px]:w-[160px] min-[1200px]:w-[184px] aspect-square rounded-2xl object-cover"
                  priority
                />
                {/* developer */}
                <p className="text-sm text-[#b2b2b2]  lg:hidden mt-4">
                  {article.developer}
                </p>
              </div>

              {/* 2 */}
              <div
                className="
            lg:col-start-2 lg:row-start-1 lg:col-span-1
            min-[770px]:col-start-2 min-[770px]:row-start-1
            col-span-3 row-start-1
            order-2
          "
              >
                <h1 className="text-[1.5rem] font-bold">
                  Download <span>{article.title}</span>{" "}
                  {article.isMod && <span>({article.typeMod})</span>}{" "}
                  <span>{article.version}</span> APK for Android
                </h1>
              </div>

              {/* 3 */}
              <div
                className="
                  lg:col-start-2 lg:row-start-2 lg:col-span-1
                  min-[770px]:col-start-2 min-[770px]:row-start-2 min-[770px]:col-span-3
                  col-span-2 col-start-2 row-start-2
                  order-3
                "
              >
                {/* developer */}
                <p className="text-sm text-[#b2b2b2] mb-2.5 max-lg:hidden">
                  {article.developer}
                </p>
                <div className="flex items-center gap-4  mb-4 max-lg:hidden">
                  <Star rating={article.averageRating} />
                  <p className="font-bold">
                    {article.averageRating}{" "}
                    <span className="text-sm font-normal">
                      ({article.ratingCount})
                    </span>
                  </p>
                </div>
                <div>
                  <ul className="flex gap-4 text-sm  text-[#b2b2b2] max-[770px]:flex-col max-[770px]:gap-2">
                    <li className="flex items-center gap-2">
                      <FaAndroid />
                      <span>Android {article.androidVer} +</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <TbVersionsFilled />
                      <span>Version: {article.version}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ImDatabase />
                      <span>{article.sizeFileAPK}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 5 */}
              <div
                className="
                  max-[770px]:bg-transparent
                  max-lg:bg-[#55585b] max-lg:rounded-full max-lg:p-2 
                  lg:row-start-1 lg:row-span-3 lg:col-span-1 lg:col-start-3
                  min-[770px]:col-start-2 min-[770px]:row-start-3 min-[770px]:col-span-3
                  col-span-2 col-start-2 row-start-3
                  order-4 h-max  
                "
              >
                {/* Downloads */}
                <div className="flex flex-col gap-6 items-center max-lg:flex-row">
                  <Link
                    href="#downloads"
                    title="downloads"
                    className="w-52 px-4 py-3 uppercase font-bold rounded-full text-sm text-ellipsis whitespace-nowrap text-center
                        bg-interactive shadow-xl shadow-interactive/20 overflow-hidden"
                  >
                    {article.OBB || article.Script
                      ? `Downloads`
                      : `Download(${article.sizeFileAPK})`}
                  </Link>

                  <p className="text-sm text-[#b2b2b2] text-center max-[770px]:hidden">
                    Updated to version {article.version}!
                  </p>
                </div>
              </div>

              {/* 4 */}
              <div
                className="
                  lg:col-start-2 lg:row-start-3 lg:col-span-1
                  min-[770px]:col-start-2 min-[770px]:row-start-4
                  col-span-3 row-start-4 
                  order-5
                "
              >
                <Spoiler
                  title={article.title}
                  description={article.description}
                  isMod={article.isMod}
                  {...(article.isMod && {
                    typeMod: article.typeMod ?? undefined,
                  })}
                  paragraphs={article.paragraphs}
                  secondTitle={article.secondTitle}
                />
              </div>
            </div>

            <div className="zig-zag-line my-8"></div>

            {/* Screenshots */}
            <div className="p-6">
              <h2 className="mb-4 text-2xl font-bold  max-[770px]:text-xl max-[500px]:text-center">
                <span className="sr-only">
                  {article.title} {article.isMod && `${article.typeMod} `}
                  APK –
                </span>
                Screenshots
              </h2>
              <div
                className="flex gap-4 overflow-x-scroll mb-4 select-none snap-x
                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-track]:bg-gray-100
                [&::-webkit-scrollbar-thumb]:bg-gray-300
                dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
                max-lg:[&::-webkit-scrollbar]:hidden"
              >
                {article.appScreens.map((elem) => (
                  <Link
                    href={`${DOMAINCDN}/${elem}`}
                    title={`${article.title} ${
                      article.isMod ? article.typeMod : ""
                    }`}
                    target="_blank"
                    className="shrink-0 snap-center min-[500px]:h-[300px] min-[500px]:w-auto max-w-[80vw]"
                    key={`${DOMAINCDN}/${elem}`}
                  >
                    <Image
                      src={`${DOMAINCDN}/${elem}`}
                      width={526}
                      height={296}
                      alt={`${article.title} ${
                        article.isMod ? article.typeMod : ""
                      }`}
                      className="object-contain rounded-lg w-full h-full "
                      loading="lazy"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* rating */}
          <div className="flex justify-between max-[500px]:flex-col items-center gap-8 bg-[#1b1d1f] p-8 mx-7 max-[770px]:mx-0">
            <Rating rating={article.averageRating} articleId={article.id} />
            <div className=" flex items-end gap-2 ">
              <p className="text-3xl font-bold max-[500px]:text-4xl">
                {article.averageRating}
              </p>
              <p>({article.ratingCount})</p>
            </div>
          </div>
          {/* Download link */}
          <div
            id="downloads"
            className="flex flex-col gap-8 bg-[#292c2f] p-8 mx-7 max-[770px]:mx-0"
          >
            <h2 className="mb-4 text-2xl font-bold  max-[770px]:text-xl max-[500px]:text-center sr-only">
              {article.title} v{article.version}{" "}
              {article.isMod ? article.typeMod + " " : ""}– Download
            </h2>

            {downloadLinks.map(renderDownloadLink)}
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-2 max-[1000px]:grid-cols-1 gap-8 bg-[#1b1d1f] p-8 mx-7 max-[770px]:mx-0 ">
            <div>
              <h3 className="mb-2 font-bold max-[770px]:text-xl max-[500px]:text-center">
                <span className="sr-only">{article.title} APK – </span>
                Additional Information:
              </h3>
              <div className="grid grid-cols-4 gap-4 max-[700px]:grid-cols-2">
                {[
                  { label: "Categories", value: category },
                  { label: "Type", value: capitalize(article.articleType) },
                  { label: "Installs", value: `${article.installs} +` },
                  { label: "Rated for", value: `${article.ratedFor} + years` },
                ].map((item, index) => (
                  <div key={index}>
                    <p className="font-bold">{item.label}</p>
                    <p className="text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="max-[500px]:text-center ">
              <h3 className="mb-2 font-bold ">
                <span className="sr-only">{article.title} APK –</span>
                Fast and secure, no worries:
              </h3>

              <p className="text-sm">
                Download the latest version of <strong>{article.title}</strong>{" "}
                ({article.isMod && article.typeMod + "/"}
                {article.articleType}).apk quickly and easily — it's fast, free,
                secure, and requires no registration
              </p>
            </div>
          </div>

          {/* ads */}
          <div className="my-4">
            {isMobile ? (
              <BannerAd
                adKey="07f2afe0bcf9b49663131219e82e4d87"
                width={300}
                height={250}
              />
            ) : (
              <BannerAd
                adKey="0916e702dcda4948935eb4bd47cd5b6b"
                width={728}
                height={90}
              />
            )}
          </div>
          <div className="my-4">
            {isMobile ? (
              <BannerAd
                adKey="07f2afe0bcf9b49663131219e82e4d87"
                width={300}
                height={250}
                delay={1500}
              />
            ) : (
              <BannerAd
                adKey="0916e702dcda4948935eb4bd47cd5b6b"
                width={728}
                height={90}
                delay={1500}
              />
            )}
          </div>
        </div>
      </>
    );
  } catch {
    return <NotFoundPage />;
  }
}
