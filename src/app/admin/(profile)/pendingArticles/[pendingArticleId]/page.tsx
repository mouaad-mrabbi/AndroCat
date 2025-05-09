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
      console.log("here")
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
        <div className="flex max-[770px]:flex-col p-6">
          {/* title */}
          <p className="text-[1.5rem] font-bold min-[770px]:hidden mb-4">
            Download <span>{pendingArticle.title}</span>{" "}
            {pendingArticle.isMod && <span>({pendingArticle.typeMod})</span>}{" "}
            <span>{pendingArticle.version}</span> free on android
          </p>

          <div className="flex">
            {/* left */}
            <div>
              {/* image square */}
              <div className=" aspect-square h-[136px] min-[500px]:h-[184px] min-[770px]:h-[160px] min-[1200px]:h-[184px]">
                <Image
                  src={pendingArticle.image}
                  width={90}
                  height={90}
                  alt={pendingArticle.title || "game"}
                  className="aspect-square w-full rounded-2xl object-cover"
                  priority // لتحميل الصورة أولاً
                />
              </div>
              {/* developer */}
              <p className="text-sm text-[#b2b2b2]  lg:hidden my-4">
                {pendingArticle.developer}
              </p>
            </div>
            {/* center */}
            <div className=" ml-8 max-[770px]:ml-4">
              <div>
                {/* title */}
                <p className="text-[1.65rem] font-bold max-[770px]:hidden">
                  Download <span>{pendingArticle.title}</span>{" "}
                  {pendingArticle.isMod && (
                    <span>({pendingArticle.typeMod})</span>
                  )}{" "}
                  <span>{pendingArticle.version}</span> free on android
                </p>
                {/* developer */}
                <p className="text-sm text-[#b2b2b2] my-2.5 max-lg:hidden">
                  {pendingArticle.developer}
                </p>
              </div>
              <div className="flex items-center gap-4  mb-4 max-lg:hidden">
                <Star rating={0} />
                <p className="font-bold">
                  {0} <span className="text-sm font-normal">({0})</span>
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
                <div className="h-12  w-full mt-5 max-[500px]:mt-2 max-[500px]:h-10 min-[770px]:hidden ">
                  <Link
                    href={"/"}
                    className="box-border h-full flex items-center px-4 uppercase bg-green-500 leading-relaxed font-bold rounded-full shadow-xl shadow-green-500/20 text-nowrap max-[340px]:text-[10px] max-[500px]:text-xs "
                  >
                    Download ({pendingArticle.sizeFileAPK})
                  </Link>
                </div>
              </div>

              <div className="flex gap-6 items-center p-2 mt-6 w-full h-16 rounded-full bg-[#55585b] lg:hidden max-[770px]:hidden">
                <Link
                  href={"/"}
                  className="box-border h-full flex items-center px-4 uppercase bg-green-500 leading-relaxed font-bold rounded-full text-nowrap"
                >
                  Download ({pendingArticle.sizeFileAPK})
                </Link>
                <p className="text-sm text-white text-center">
                  Updated to version {pendingArticle.version}!
                </p>
              </div>

              <div className=" max-[770px]:hidden mt-6">
                <Spoiler
                  title={pendingArticle.title}
                  description={pendingArticle.description}
                  isMod={pendingArticle.isMod}
                  {...(pendingArticle.isMod && {
                    typeMod: pendingArticle.typeMod ?? undefined,
                  })}
                />
              </div>
            </div>
          </div>
          {/* right */}
          <div className=" w-52 ml-8 flex flex-col max-lg:hidden">
            <Link
              href={"/"}
              className="box-border p-4 uppercase bg-green-500 leading-relaxed font-bold rounded-full shadow-xl shadow-green-500/20 text-nowrap"
            >
              Download ({pendingArticle.sizeFileAPK})
            </Link>
            <p className="text-sm text-[#b2b2b2] text-center pt-2.5">
              Updated to version {pendingArticle.version}!
            </p>
          </div>

          {/* description */}
          <div className=" min-[770px]:hidden">
            <Spoiler
              title={pendingArticle.title}
              description={pendingArticle.description}
              isMod={pendingArticle.isMod}
              {...(pendingArticle.isMod && {
                typeMod: pendingArticle.typeMod ?? undefined,
              })}
            />
          </div>
        </div>

        <div className="zig-zag-line my-8"></div>

        {/* Screenshots */}
        <div className="p-6">
          <p className="mb-4 text-2xl font-bold  max-[770px]:text-xl max-[500px]:text-center ">
            Screenshots
          </p>
          <div
            className="flex gap-4 overflow-x-scroll mb-4 select-none"
            style={{ scrollbarWidth: "none" }}
          >
            {pendingArticle.appScreens.map((elem: any) => (
              <Link
                href={elem}
                target="_blank"
                className="rounded-lg bg-black aspect-[650/300]  h-[300px] max-[400px]:h-[125px] max-[500px]:h-[150px] max-[770px]:h-[200px]"
                key={elem}
              >
                <Image
                  src={elem}
                  width={90}
                  height={90}
                  alt={elem}
                  className="object-contain rounded-lg h-full w-full "
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
          href={pendingArticle.linkAPK}
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
            href={pendingArticle.linkOBB || ""}
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
            href={pendingArticle.linkScript}
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
            href={pendingArticle.linkOriginalAPK}
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
