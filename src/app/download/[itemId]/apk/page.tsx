import { getDownloadData } from "@/apiCalls/consumerApiCall";
import Image from "next/image";
import { FaAndroid } from "react-icons/fa";
import Countdown from "@/components/countdown";
import NotFoundPage from "@/app/not-found";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import InterstitialAd from "@/components/interstitialAd"; // ← الاستدعاء هنا
import Banner728x90 from "@/components/banner728x90";

interface ItemsPageProp {
  params: Promise<{ itemId: string }>;
}

export default async function ItemPage({ params }: ItemsPageProp) {
  const { itemId } = await params;

  try {
    const item = await getDownloadData(itemId, "apk");

    return (
      <div className="max-w-[648px] mx-auto p-10">
        <InterstitialAd /> {/* ←-- Add the ads here*/}
        <Banner728x90 /> {/* ←-- Add the ads here*/}
        {/* Back Window */}
        <Link
          href={`/${itemId}`}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-500/50"
        >
          <IoArrowBack />
        </Link>
        {/* Box */}
        <div className="flex flex-col items-center max-w-[480px] mx-auto">
          <div className="aspect-square w-44 mb-9">
            <Image
              src={item.image}
              width={90}
              height={90}
              alt={item?.title || "game"}
              className="aspect-square w-full rounded-2xl object-cover"
              priority
            />
          </div>
          <p className="text-[1.25rem] text-center font-bold mb-9">
            Download <span>{item.title}</span>{" "}
            {item.isMod && <span>({item.typeMod})</span>}{" "}
            <span>{item.version}</span> free on Android
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500 font-bold mb-4">
            <FaAndroid />
            <span>Android {item.androidVer} +</span>
          </div>

          <Countdown fileSize={item.sizeFileAPK} link={item.linkAPK} />
        </div>
      </div>
    );
  } catch {
    return <NotFoundPage />;
  }
}
