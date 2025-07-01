import { getDownloadData } from "@/apiCalls/consumerApiCall";
import Image from "next/image";
import { FaAndroid } from "react-icons/fa";
import Countdown from "@/components/countdown";
import NotFoundPage from "@/app/not-found";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import InterstitialAd from "@/components/interstitialAd";
import BannerAd from "@/components/bannerAd";
import { headers } from "next/headers";
import { DOMAINCDN } from "@/utils/constants";
import { slugifyTitle } from "@/utils/slugifyTitle";

export default async function DownloadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";

  const isMobile =
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(userAgent);

  const { slug } = await params;
  const [idPart, typePart] = slug.split("-");
  const articleId = parseInt(idPart);
  try {
    const article = await getDownloadData(articleId, typePart);
    const cleanTitle = slugifyTitle(article.title);
    return (
      <div>
        <InterstitialAd />

        <div className="max-w-[648px] mx-auto p-10">
          {/* Back Window */}
          <Link
            href={`/${article.id}-${cleanTitle}`}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-500/50"
          >
            <IoArrowBack />
          </Link>

          {/* Box */}
          <div className="flex flex-col items-center max-w-[480px] mx-auto">
            <div className="aspect-square w-44 mb-9">
              <Image
                src={`${DOMAINCDN}/${article.image}`}
                width={190}
                height={190}
                alt={article?.title || "game"}
                className="aspect-square w-full rounded-2xl object-cover"
                priority
              />
            </div>

            <p className="text-[1.25rem] text-center font-bold mb-9">
              <span>{article.title}</span>{" "}
              {article.isMod && <span>({article.typeMod})</span>}{" "}
              <span>{article.version}</span>.{typePart}
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-500 font-bold mb-4">
              <FaAndroid />
              <span>Android {article.androidVer} +</span>
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

            <Countdown fileSize={article.size} link={article.link} />
          </div>
        </div>

        {/* ads */}
        <div className="my-4">
          {isMobile ? (
            <BannerAd
              adKey="07f2afe0bcf9b49663131219e82e4d87"
              width={300}
              height={250}
              delay={1000}
            />
          ) : (
            <BannerAd
              adKey="0916e702dcda4948935eb4bd47cd5b6b"
              width={728}
              height={90}
              delay={1000}
            />
          )}
        </div>
      </div>
    );
  } catch {
    return <NotFoundPage />;
  }
}
