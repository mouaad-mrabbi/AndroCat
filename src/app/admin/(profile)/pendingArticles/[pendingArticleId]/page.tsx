"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Icons
import { FaAndroid } from "react-icons/fa";
import { TbVersionsFilled } from "react-icons/tb";
import { ImDatabase } from "react-icons/im";
import { RiDownloadFill } from "react-icons/ri";

// Components
import Star from "@/components/card/star";
import Spoiler from "@/components/spoiler";
import Toolbar from "@/components/toolbar";
import LoadingArticle from "@/components/loadingArticle";

// Pages
import NotFoundPage from "@/app/not-found";

// API Calls
import {
  creatArticle,
  fetchPendingArticle,
  updateArticle,
} from "@/apiCalls/superAdminApiCall";

// Utils & Types
import { toast } from "react-toastify";
import { PendingArticleAndObjects } from "@/utils/types";
import ConfirmBox from "@/components/confirmBox";
import { deleteArticleCreatedBy } from "@/apiCalls/adminApiCall";
import { deleteArticle } from "@/apiCalls/ownerApiCall";
import { DOMAINCDN } from "@/utils/constants";

interface PageparamsProps {
  params: Promise<{ pendingArticleId: string }>;
}
type ConfirmOpenState = {
  delete: boolean;
};

export default function Page({ params }: PageparamsProps) {
  const [pendingArticle, setPendingArticle] =
    useState<PendingArticleAndObjects>();
  const [pendingArticleId, setPendingArticleId] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [isConfirmOpen, setIsConfirmOpen] = useState<ConfirmOpenState>({
    delete: false,
  });

  useEffect(() => {
    const getParams = async () => {
      const { pendingArticleId } = await params;
      setPendingArticleId(Number(pendingArticleId));
    };
    getParams();
  }, [params]);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!pendingArticleId) return;

      setIsLoading(true);
      setError(null);

      try {
        const PendingArticle = await fetchPendingArticle(pendingArticleId);
        setPendingArticle(PendingArticle);
      } catch (error: any) {
        setError("Failed to fetch pending Articles.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [pendingArticleId]);

  const handleMoveToArticle = async () => {
    if (!pendingArticle) return;
    if (pendingArticle.status === "CREATE") {
      try {
        const response = await creatArticle(pendingArticle.id);

        toast.success(response.data.message || "New Articles added");
        router.push(`/admin/articles/${response.data.id}`);
      } catch (error: any) {
        toast.error(error?.response?.data?.message);
      }
    } else if (pendingArticle.status === "UPDATE") {
      try {
        const response = await updateArticle(pendingArticle.id);

        toast.success(response.data.message || "New Articles added");
        router.push(`/admin/articles/${pendingArticle.articleId}`);
      } catch (error: any) {
        toast.error(error?.response?.data?.message);
      }
    } else if (pendingArticle.status === "DELETE" && pendingArticle.articleId) {
      console.log("here");
      try {
        const res = await deleteArticle(pendingArticle.articleId);
        toast.success(res);
      } catch (error: any) {
        toast.error(error);
      }
    }
  };

  if (isLoading) return <LoadingArticle />;
  if (error) return NotFoundPage();
  if (!pendingArticle) return NotFoundPage();

  const handleDelete = async () => {
    if (!pendingArticleId) return;
    try {
      const res = await deleteArticleCreatedBy(pendingArticleId);
      toast.success(res);
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className="min-w-[320px]">
      <Toolbar
        local={"dashboard"}
        firstLocal={"pendingArticles"}
        scndLocal={`${pendingArticle.title}`}
      />
      {/* content */}
      <div className="bg-[#1b1d1f] max-[770px]:bg-transparent  m-7 max-[770px]:m-0 ">
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
              src={`${DOMAINCDN}/${pendingArticle.image}`}
              width={190}
              height={190}
              alt={`${pendingArticle.title} ${pendingArticle.isMod ? "mod" : ""} apk`}
              className="w-[136px] min-[500px]:w-[184px] min-[770px]:w-[160px] min-[1200px]:w-[184px] aspect-square rounded-2xl object-cover"
              priority
            />
            {/* developer */}
            <p className="text-sm text-[#b2b2b2]  lg:hidden mt-4">
              {pendingArticle.developer}
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
              Download <span>{pendingArticle.title}</span>{" "}
              {pendingArticle.isMod && <span>({pendingArticle.typeMod})</span>}{" "}
              <span>{pendingArticle.version}</span> APK for Android
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
              {pendingArticle.developer}
            </p>
            <div className="flex items-center gap-4  mb-4 max-lg:hidden">
              <Star rating={0} />
              <p className="font-bold">
                {0}{" "}
                <span className="text-sm font-normal">
                  ({0})
                </span>
              </p>
            </div>
            <div>
              <ul className="flex gap-4 text-sm  text-[#b2b2b2] max-[770px]:flex-col max-[770px]:gap-2">
                <li className="flex items-center gap-2">
                  <FaAndroid />
                  <span>Android {pendingArticle.androidVer} +</span>
                </li>
                <li className="flex items-center gap-2">
                  <TbVersionsFilled />
                  <span>Version: {pendingArticle.version}</span>
                </li>
                <li className="flex items-center gap-2">
                  <ImDatabase />
                  <span>{pendingArticle.sizeFileAPK}</span>
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
              {pendingArticle.OBB || pendingArticle.Script ? (
                <Link
                  href="#downloads"
                  title="downloads"
                  className="w-52 px-4 py-3 uppercase font-bold rounded-full text-center
                        bg-green-500 shadow-xl shadow-green-500/20"
                >
                  Downloads
                </Link>
              ) : (
                <Link
                  href={`/download/${pendingArticle.id}/apk`}
                  title={`Download APK ${pendingArticle.title} Updated to version ${pendingArticle.version}`}
                  className="w-52 px-4 py-3 uppercase font-bold rounded-full text-sm text-ellipsis whitespace-nowrap text-center
                        bg-green-500 shadow-xl shadow-green-500/20 overflow-hidden"
                >
                  Download({pendingArticle.sizeFileAPK})
                </Link>
              )}
              <p className="text-sm text-[#b2b2b2] text-center max-[770px]:hidden">
                Updated to version {pendingArticle.version}!
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
              title={pendingArticle.title}
              description={pendingArticle.description}
              isMod={pendingArticle.isMod}
              {...(pendingArticle.isMod && {
                typeMod: pendingArticle.typeMod ?? undefined,
              })}
              paragraphs={pendingArticle.paragraphs}
              secondTitle={pendingArticle.secondTitle}
            />
          </div>
        </div>

        <div className="zig-zag-line my-8"></div>

        {/* Screenshots */}
        <div className="p-6">
          <h2 className="mb-4 text-2xl font-bold  max-[770px]:text-xl max-[500px]:text-center">
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
            {pendingArticle.appScreens.map((elem) => (
              <Link
                href={`${DOMAINCDN}/${elem}`}
                title={`${pendingArticle.title} ${
                  pendingArticle.isMod ? pendingArticle.typeMod : ""
                }`}
                target="_blank"
                className="shrink-0 snap-center min-[500px]:h-[300px] min-[500px]:w-auto max-w-[80vw]"
                key={`${DOMAINCDN}/${elem}`}
              >
                <Image
                  src={`${DOMAINCDN}/${elem}`}
                  width={526}
                  height={296}
                  alt={`${pendingArticle.title} ${
                    pendingArticle.isMod ? pendingArticle.typeMod : ""
                  }`}
                  className="object-contain rounded-lg w-full h-full "
                  loading="lazy"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Download link */}
      <div className="flex flex-col gap-8 bg-[#1b1d1f] max-[770px]:bg-transparent p-8 m-7 max-[770px]:m-0 ">
        {/* APK link */}
        <Link
          href={`${DOMAINCDN}/${pendingArticle.linkAPK}`}
          className="flex items-center justify-between max-[1000px]:flex-col 
          box-border py-4 px-8 max-sm:px-4 uppercase bg-green-500 leading-relaxed 
          font-bold rounded-full max-[1000px]:rounded-xl shadow-xl shadow-green-500/20"
        >
          <div>
            <p>
              Download APK {pendingArticle.title}{" "}
              <span> Updated to version {pendingArticle.version}</span>
            </p>
          </div>
          <div className="max-[1000px]:font-medium flex items-center gap-2">
            <RiDownloadFill />
            <p>{pendingArticle.sizeFileAPK}</p>
          </div>
        </Link>
        {/* OBB link */}
        {pendingArticle.OBB && pendingArticle.linkOBB && (
          <Link
            href={`${DOMAINCDN}/${pendingArticle.linkOBB}`}
            className="flex items-center justify-between max-[1000px]:flex-col 
          box-border py-4 px-8 max-sm:px-4 uppercase bg-yellow-600 leading-relaxed 
          font-bold rounded-full max-[1000px]:rounded-xl shadow-xl shadow-yellow-600/20"
          >
            <div>
              <p>
                Download OBB {pendingArticle.title}{" "}
                <span> Updated to version {pendingArticle.version}</span>
              </p>
            </div>
            <div className="max-[1000px]:font-medium flex items-center gap-2">
              <RiDownloadFill />
              <p>{pendingArticle.sizeFileOBB}</p>
            </div>
          </Link>
        )}
        {/* Script link */}
        {pendingArticle.Script && pendingArticle.linkScript && (
          <Link
            href={`${DOMAINCDN}/${pendingArticle.linkScript}`}
            className="flex items-center justify-between max-[1000px]:flex-col 
          box-border py-4 px-8 max-sm:px-4 uppercase bg-yellow-600 leading-relaxed 
          font-bold rounded-full max-[1000px]:rounded-xl shadow-xl shadow-yellow-600/20 "
          >
            <div>
              <p>
                Download Script {pendingArticle.title}{" "}
                <span> Updated to version {pendingArticle.version}</span>
              </p>
            </div>
            <div className="max-[1000px]:font-medium flex items-center gap-2">
              <RiDownloadFill />
              <p>{pendingArticle.sizeFileScript}</p>
            </div>
          </Link>
        )}
        {/* OriginalAPK link */}
        {pendingArticle.OriginalAPK && pendingArticle.linkOriginalAPK && (
          <Link
            href={`${DOMAINCDN}/${pendingArticle.linkOriginalAPK}`}
            className="flex items-center justify-between max-[1000px]:flex-col 
          box-border py-4 px-8 max-sm:px-4 uppercase bg-yellow-600 leading-relaxed 
          font-bold rounded-full max-[1000px]:rounded-xl shadow-xl shadow-yellow-600/20 "
          >
            <div>
              <p>
                Download Original APK {pendingArticle.title}{" "}
                <span>
                  {" "}
                  Updated to version {pendingArticle.versionOriginal}
                </span>
              </p>
            </div>
            <div className="max-[1000px]:font-medium flex items-center gap-2">
              <RiDownloadFill />
              <p>{pendingArticle.sizeFileOriginalAPK}</p>
            </div>
          </Link>
        )}
      </div>

      {/* admin */}
      <div className=" bg-[#1b1d1f] max-[770px]:bg-transparent p-8 m-7 max-[770px]:m-0 ">
        <p className="mb-4 text-2xl font-bold  max-[770px]:text-xl max-[500px]:text-center ">
          admin
        </p>

        <div className="flex gap-10 h-16 w-full text-center mb-10">
          <Link
            className="flex justify-center items-center bg-green-500 w-1/2 rounded-3xl 
          font-bold text-xl shadow-xl shadow-green-500/20"
            href={`/admin/pendingArticles/update/${pendingArticle.id}`}
          >
            update
          </Link>
          <button
            onClick={() => {
              setIsConfirmOpen({ ...isConfirmOpen, delete: true });
            }}
            className="flex justify-center items-center bg-red-500 w-1/2 rounded-3xl
           font-bold text-xl shadow-xl shadow-red-500/20"
          >
            delete
          </button>
        </div>

        {/* info for admin and post */}
        <div className="flex gap-10 w-full text-center mb-10">
          {/* info user */}
          <div className="flex flex-col gap-4">
            <div className="h-44 aspect-square rounded-full ">
              <Image
                src={pendingArticle.createdBy.profile}
                width={90}
                height={90}
                alt={pendingArticle.createdBy.username}
                className="object-contain rounded-lg h-full w-full "
                priority // To download the image first
              />
            </div>
            <p>{pendingArticle.createdBy.username}</p>
          </div>

          {/* info post */}
          <div className="flex flex-1 justify-around">
            <div>
              <p className="text-green-500">created at</p>
              <div>{new Date(pendingArticle.createdAt).toLocaleString()}</div>
              <div className="bg-red-400 h-max text-black rounded-md">
                {new Date(pendingArticle.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  }
                )}
              </div>
            </div>

            <div className="h-16 w-px bg-gray-300"></div>

            <div>
              <p className="text-green-500">updated at</p>
              <div>{new Date(pendingArticle.updatedAt).toLocaleString()}</div>
              <div className="bg-red-400 h-max text-black rounded-md">
                {new Date(pendingArticle.updatedAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* move To article */}
      <div className=" bg-[#1b1d1f] max-[770px]:bg-transparent p-8 m-7 max-[770px]:m-0 ">
        <p className="mb-4 text-2xl font-bold  max-[770px]:text-xl max-[500px]:text-center ">
          move To Article
        </p>

        <button
          className="flex justify-center items-center w-full p-4 bg-green-500  rounded-3xl 
          font-bold text-xl shadow-xl shadow-green-500/20"
          onClick={handleMoveToArticle}
        >
          <p>
            To Article <span>{pendingArticle.status}</span>
          </p>
        </button>
      </div>

      {/* Confirm Box */}
      {isConfirmOpen.delete && (
        <ConfirmBox
          message={"Are you sure you want to delete this pending article?"}
          onConfirm={handleDelete}
          onCancel={() => setIsConfirmOpen({ ...isConfirmOpen, delete: false })}
        />
      )}
    </div>
  );
}
