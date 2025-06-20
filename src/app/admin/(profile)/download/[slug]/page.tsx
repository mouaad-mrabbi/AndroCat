import { getDownloadData } from "@/apiCalls/consumerApiCall";
import Image from "next/image";
import { FaAndroid } from "react-icons/fa";
import NotFoundPage from "@/app/not-found";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { DOMAINCDN } from "@/utils/constants";
import { slugifyTitle } from "@/utils/slugifyTitle";
import Countdown from "@/components/countdownAdmin";

export default async function DownloadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  const { slug } = await params;
  const [idPart, typePart] = slug.split("-");
  const articleId = parseInt(idPart);

  try {
    const article = await getDownloadData(articleId, typePart);
    const cleanTitle = slugifyTitle(article.title);
    return (
      <div>
        <div className="max-w-[648px] mx-auto p-10">
          {/* Back Window */}
          <Link
            href={`/${article.id}-${cleanTitle}${
              article.isMod ? "-mod" : ""
            }-apk-android-download`}
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

            <Countdown fileSize={article.size} link={article.link} />
          </div>
        </div>
      </div>
    );
  } catch {
    return <NotFoundPage />;
  }
}
