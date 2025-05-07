"use client";

import { useEffect, useState } from "react";
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
import ConfirmBox from "@/components/confirmBox";
import LoadingArticle from "@/components/loadingArticle";

// Pages
import NotFoundPage from "@/app/not-found";

// Utils & API
import { toast } from "react-toastify";
import { approvedArticle } from "@/apiCalls/ownerApiCall";
import { ArticleAndObjects } from "@/utils/types";
import { fetchArticle } from "@/apiCalls/superAdminApiCall";

interface PageparamsProps {
  params: Promise<{ articleId: string }>;
}
type ConfirmOpenState = {
  Approved: boolean;
  delete: boolean;
};
interface DownloadLink {
  key: string;
  label: string;
  bgColor: string;
  size: string | null; // Allowing null here
  link: string | null;
}

export default function PageArticle({ params }: PageparamsProps) {
  const [article, setArticle] = useState<ArticleAndObjects>();
  const [articleId, setArticleId] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState<ConfirmOpenState>({
    Approved: false,
    delete: false,
  });

  useEffect(() => {
    const getParams = async () => {
      const { articleId } = await params;
      setArticleId(articleId);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    const FetchArticle = async () => {
      if (!articleId) return;

      setIsLoading(true);
      setError(null);

      try {
        const Article = await fetchArticle(articleId);

        setArticle(Article);
      } catch (error: any) {
        setError("Failed to fetch pending articles.");
      } finally {
        setIsLoading(false);
      }
    };

    FetchArticle();
  }, [articleId]);

  const handleApproved = async (e: string) => {
    if (!article) return;

    try {
      const response = await approvedArticle(article.id, e);

      toast.success(response.data.message);
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  if (isLoading) return <LoadingArticle />;
  if (error) return NotFoundPage();
  if (!article) return NotFoundPage();

  const capitalize = (str: any) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const category =
    article.articleType === "GAME"
      ? capitalize(article.gameCategory)
      : capitalize(article.programCategory);

  const downloadLinks = [
    {
      key: "apk",
      label: "APK",
      bgColor: "bg-green-500",
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
        href={link}
        title={`Download ${label} ${article.title} Updated to version ${
          key=== "original-apk" ? article.versionOriginal : article.version
        }`}
        className={`flex items-center justify-between max-[1000px]:flex-col 
              box-border py-4 px-8 max-sm:px-4 uppercase ${bgColor} leading-relaxed 
              font-bold rounded-full max-[1000px]:rounded-xl shadow-xl shadow-${bgColor}/20`}
      >
        <div>
          <p>
            Download {label} {article.title}{" "}
            <span> Updated to version {key === "original-apk" ? article.versionOriginal : article.version}</span>
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
    <div className="min-w-[320px]">
      <Toolbar
        local={"dashboard"}
        firstLocal={"articles"}
        scndLocal={`${article.title}`}
      />
      {/* content */}
      <div className="bg-[#1b1d1f] max-[770px]:bg-transparent  m-7 max-[770px]:m-0 ">
        <div className="flex max-[770px]:flex-col p-6">
          {/* title */}
          <p className="text-[1.5rem] font-bold min-[770px]:hidden mb-4">
            Download <span>{article.title}</span>{" "}
            {article.isMod && <span>({article.typeMod})</span>}{" "}
            <span>{article.version}</span> free on android
          </p>

          <div className="flex">
            {/* left */}
            <div>
              {/* image square */}
              <div className=" aspect-square h-[136px] min-[500px]:h-[184px] min-[770px]:h-[160px] min-[1200px]:h-[184px]">
                <Image
                  src={article.image}
                  width={90}
                  height={90}
                  alt={article.title || "game"}
                  className="aspect-square w-full rounded-2xl object-cover"
                  priority // لتحميل الصورة أولاً
                />
              </div>
              {/* developer */}
              <p className="text-sm text-[#b2b2b2]  lg:hidden my-4">
                {article.developer}
              </p>
            </div>
            {/* center */}
            <div className=" ml-8 max-[770px]:ml-4">
              <div>
                {/* title */}
                <p className="text-[1.65rem] font-bold max-[770px]:hidden">
                  Download <span>{article.title}</span>{" "}
                  {article.isMod && <span>({article.typeMod})</span>}{" "}
                  <span>{article.version}</span> free on android
                </p>
                {/* developer */}
                <p className="text-sm text-[#b2b2b2] my-2.5 max-lg:hidden">
                  {article.developer}
                </p>
              </div>
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
                <div className="h-12  w-full mt-5 max-[500px]:mt-2 max-[500px]:h-10 min-[770px]:hidden ">
                  <Link
                    href={"/"}
                    className="box-border h-full flex items-center px-4 uppercase bg-green-500 leading-relaxed font-bold rounded-full shadow-xl shadow-green-500/20 text-nowrap max-[340px]:text-[10px] max-[500px]:text-xs "
                  >
                    Download ({article.sizeFileAPK})
                  </Link>
                </div>
              </div>

              <div className="flex gap-6 items-center p-2 mt-6 w-full h-16 rounded-full bg-[#55585b] lg:hidden max-[770px]:hidden">
                <Link
                  href={"/"}
                  className="box-border h-full flex items-center px-4 uppercase bg-green-500 leading-relaxed font-bold rounded-full text-nowrap"
                >
                  Download ({article.sizeFileAPK})
                </Link>
                <p className="text-sm text-white text-center">
                  Updated to version {article.version}!
                </p>
              </div>

              <div className=" max-[770px]:hidden mt-6">
                <Spoiler
                  title={article.title}
                  description={article.description}
                  isMod={article.isMod}
                  {...(article.isMod && {
                    typeMod: article.typeMod ?? undefined,
                  })}
                />
              </div>
            </div>
          </div>
          {/* right */}
          <div className=" w-52  flex ml-auto flex-col max-lg:hidden">
            <Link
              href={"/"}
              className="box-border p-4 uppercase bg-green-500 leading-relaxed font-bold rounded-full shadow-xl shadow-green-500/20 text-nowrap"
            >
              Download ({article.sizeFileAPK})
            </Link>
            <p className="text-sm text-[#b2b2b2] text-center pt-2.5">
              Updated to version {article.version}!
            </p>
          </div>

          {/* description */}
          <div className=" min-[770px]:hidden">
            <Spoiler
              title={article.title}
              description={article.description}
              isMod={article.isMod}
              {...(article.isMod && {
                typeMod: article.typeMod ?? undefined,
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
            {article.appScreens.map((elem) => (
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
                  priority // To download the image first
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Download link */}
      <div
        id="downloads"
        className="flex flex-col gap-8 bg-[#292c2f] p-8 mx-7 max-[770px]:mx-0"
      >
        {downloadLinks.map(renderDownloadLink)}
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-2 max-[1000px]:grid-cols-1 gap-8 bg-[#1b1d1f] p-8 mx-7 max-[770px]:mx-0 ">
        <div>
          <p className="mb-2  font-bold  max-[770px]:text-xl max-[500px]:text-center">
            Additional Information:
          </p>
          <div className="grid grid-cols-4 gap-4 max-[700px]:grid-cols-2">
            {[
              { label: "Categories", value: category },
              { label: "Type", value: capitalize(article.articleType) },
              { label: "Installs", value: article.installs },
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
          <p className="mb-2 font-bold">Fast and secure, no worries:</p>

          <p className="text-sm">
            Download the latest version of {article.title} (
            {article.isMod && article.typeMod + "/"}
            {article.articleType}).apk quickly and easily — it's fast, free,
            secure, and requires no registration
          </p>
        </div>
      </div>

      {/* Approved */}
      <div className=" bg-[#1b1d1f] max-[770px]:bg-transparent p-8 m-7 max-[770px]:m-0 ">
        <p className="mb-4 text-2xl font-bold  max-[770px]:text-xl max-[500px]:text-center ">
          Approved
        </p>
        {article.isApproved ? (
          <button
            className="flex justify-center items-center p-4  w-full rounded-3xl 
          font-bold text-xl border-2"
            onClick={() => {
              setIsConfirmOpen({ ...isConfirmOpen, Approved: true });
            }}
          >
            Approved
            <div className="h-4 w-4 bg-green-500 rounded-full ml-4"></div>
          </button>
        ) : (
          <button
            className="flex justify-center items-center p-4  w-full rounded-3xl 
          font-bold text-xl border-2"
            onClick={() => {
              setIsConfirmOpen({ ...isConfirmOpen, Approved: true });
            }}
          >
            Approved
            <div className="h-4 w-4 bg-red-500 rounded-full ml-4"></div>
          </button>
        )}
      </div>

      {/* pending Article */}
      <div className=" bg-[#1b1d1f] max-[770px]:bg-transparent p-8 m-7 max-[770px]:m-0 ">
        <p className="mb-4 text-2xl font-bold  max-[770px]:text-xl max-[500px]:text-center ">
          Pending Article
        </p>
        <Link
          className="flex justify-center items-center bg-green-500 rounded-3xl 
          font-bold text-xl shadow-xl shadow-green-500/20 py-4"
          href={`/admin/pendingArticles/${article.pendingArticle?.id}`}
        >
          Pending Article
        </Link>
      </div>

      {/* Add pending Article (update) & (delete)*/}
      <div className=" bg-[#1b1d1f] max-[770px]:bg-transparent p-8 m-7 max-[770px]:m-0 ">
        <p className="mb-4 text-2xl font-bold  max-[770px]:text-xl max-[500px]:text-center ">
          Add pending Article
        </p>

        <div className="flex gap-10 h-16 w-full text-center mb-10">
          <Link
            className="flex justify-center items-center bg-green-500 w-1/2 rounded-3xl 
          font-bold text-xl shadow-xl shadow-green-500/20"
            href={`/admin/articles/${article.id}/pendingArticles/create`}
          >
            update
          </Link>
          <button
            className="flex justify-center items-center bg-red-500 w-1/2 rounded-3xl
           font-bold text-xl shadow-xl shadow-red-500/20"
            onClick={() => {
              setIsConfirmOpen({ ...isConfirmOpen, delete: true });
            }}
          >
            delete
          </button>
        </div>
      </div>

      {/* validated By */}
      <div className=" bg-[#1b1d1f] max-[770px]:bg-transparent p-8 m-7 max-[770px]:m-0 ">
        <p className="mb-4 text-2xl font-bold  max-[770px]:text-xl max-[500px]:text-center ">
          validated By
        </p>
        {/* info for admin and post */}
        <div className="flex gap-10 w-full text-center mb-10">
          {/* info user */}
          <div className="flex flex-col gap-4">
            <div className="h-44 aspect-square rounded-full ">
              <Image
                src={article.validatedBy.profile}
                width={170}
                height={170}
                alt={article.validatedBy.username}
                className="object-contain rounded-lg h-full w-full "
                priority // To download the image first
              />
            </div>
            <p>{article.validatedBy.username}</p>
          </div>

          {/* info post */}
          <div className="flex flex-1 justify-around">
            <div>
              <p className="text-green-500">validated At</p>
              <div>{new Date(article.validatedAt).toLocaleString()}</div>
              <div className="bg-red-400 h-max text-black rounded-md">
                {new Date(article.validatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* created By */}
      <div className=" bg-[#1b1d1f] max-[770px]:bg-transparent p-8 m-7 max-[770px]:m-0 ">
        <p className="mb-4 text-2xl font-bold  max-[770px]:text-xl max-[500px]:text-center ">
          created By
        </p>
        {/* info for admin and post */}
        <div className="flex gap-10 w-full text-center mb-10">
          {/* info user */}
          <div className="flex flex-col gap-4">
            <div className="h-44 aspect-square rounded-full ">
              <Image
                src={article.createdBy.profile}
                width={170}
                height={170}
                alt={article.createdBy.username}
                className="object-contain rounded-lg h-full w-full "
                priority // To download the image first
              />
            </div>
            <p>{article.createdBy.username}</p>
          </div>

          {/* info post */}
          <div className="flex flex-1 justify-around">
            <div>
              <p className="text-green-500">created at</p>
              <div>{new Date(article.createdAt).toLocaleString()}</div>
              <div className="bg-red-400 h-max text-black rounded-md">
                {new Date(article.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Box */}
      {isConfirmOpen.Approved && (
        <ConfirmBox
          message={
            article.isApproved
              ? "Are you sure you want to reject this article?"
              : "Are you sure you want to approve this article?"
          }
          onConfirm={() =>
            handleApproved(article.isApproved ? "false" : "true")
          }
          onCancel={() =>
            setIsConfirmOpen({ ...isConfirmOpen, Approved: false })
          }
        />
      )}
      {/* Confirm Box */}
      {isConfirmOpen.delete && (
        <ConfirmBox
          message="Are you sure you want to delete this article?"
          onConfirm={() =>
            handleApproved(article.isApproved ? "false" : "true")
          }
          onCancel={() => setIsConfirmOpen({ ...isConfirmOpen, delete: false })}
        />
      )}
    </div>
  );
}
