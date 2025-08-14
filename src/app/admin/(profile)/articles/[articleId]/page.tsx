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
import { createPendingUpdateArticle } from "@/apiCalls/adminApiCall";
import { CreateArticleDto } from "@/utils/dtos";
import { ArticleType, ScreenType } from "@prisma/client";
import { DOMAINCDN } from "@/utils/constants";

interface PageparamsProps {
  params: Promise<{ articleId: string }>;
}
type ConfirmOpenState = {
  Approved: boolean;
  delete: boolean;
};
type LoadingState = {
  delete: boolean;
  create: boolean;
};

export default function PageArticle({ params }: PageparamsProps) {
  const [formData, setFormData] = useState<CreateArticleDto>({
    title: "",
    description: "",
    descriptionMeta: "",
    image: "",
    developer: "",
    version: "",
    versionOriginal: null,
    androidVer: "",
    articleType: ArticleType.GAME,
    gameCategory: null,
    programCategory: null,
    OBB: false,
    Script: false,
    OriginalAPK: false,
    linkAPK: "",
    linkOBB: null,
    linkVideo: null,
    linkScript: null,
    linkOriginalAPK: null,
    sizeFileAPK: "",
    sizeFileOBB: null,
    sizeFileScript: null,
    sizeFileOriginalAPK: null,
    screenType: ScreenType.SIXTEEN_BY_NINE,
    appScreens: [],
    keywords: [],
    isMod: false,
    typeMod: null,
    ratedFor: 0,
    installs: "",
    createdById: 0,
    paragraphs: [],
    apks: [],
    xapks: [],
  });
  const [article, setArticle] = useState<ArticleAndObjects>();
  const [articleId, setArticleId] = useState<number>();
  const [isLoading1, setIsLoading1] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState<ConfirmOpenState>({
    Approved: false,
    delete: false,
  });

  const [isLoading, setIsLoading] = useState<LoadingState>({
    delete: false,
    create: false,
  });

  useEffect(() => {
    const getParams = async () => {
      const { articleId } = await params;
      setArticleId(Number(articleId));
    };
    getParams();
  }, [params]);

  useEffect(() => {
    const FetchArticle = async () => {
      if (!articleId) return;

      setIsLoading1(true);
      setError(null);

      try {
        const Article = await fetchArticle(articleId);
        const {
          title,
          description,
          descriptionMeta,
          image,
          developer,
          version,
          versionOriginal,
          androidVer,
          articleType,
          gameCategory,
          programCategory,
          OBB,
          Script,
          OriginalAPK,
          linkAPK,
          linkOBB,
          linkVideo,
          linkScript,
          linkOriginalAPK,
          sizeFileAPK,
          sizeFileOBB,
          sizeFileScript,
          sizeFileOriginalAPK,
          screenType,
          appScreens,
          keywords,
          isMod,
          typeMod,
          ratedFor,
          installs,
          createdById,
          paragraphs,
          apks,
          xapks,
        } = Article;
        setFormData({
          title,
          description,
          descriptionMeta,
          image,
          developer,
          version,
          versionOriginal,
          androidVer,
          articleType,
          gameCategory,
          programCategory,
          OBB,
          Script,
          OriginalAPK,
          linkAPK,
          linkOBB,
          linkVideo,
          linkScript,
          linkOriginalAPK,
          sizeFileAPK,
          sizeFileOBB,
          sizeFileScript,
          sizeFileOriginalAPK,
          screenType,
          appScreens,
          keywords,
          isMod,
          typeMod,
          ratedFor,
          installs,
          createdById,
          paragraphs,
          apks,
          xapks,
        });
        setArticle(Article);
      } catch (error: any) {
        setError("Failed to fetch pending articles.");
      } finally {
        setIsLoading1(false);
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

  if (isLoading1) return <LoadingArticle />;
  if (error) return NotFoundPage();
  if (!article) return NotFoundPage();

  const capitalize = (str: any) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const category =
    article.articleType === "GAME"
      ? capitalize(article.gameCategory)
      : capitalize(article.programCategory);

  const handleDelete = async () => {
    if (!articleId) return;

    try {
      setIsLoading({ ...isLoading, delete: true });
      setIsConfirmOpen({ ...isConfirmOpen, delete: false });

      await createPendingUpdateArticle(articleId, formData, "DELETE");
      toast.success("Create PendingArticle For DELETE");
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsLoading({ ...isLoading, delete: false });
    }
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
            <p className="text-sm text-[#b2b2b2] lg:hidden mt-4 w-[136px] min-[500px]:w-[184px] min-[770px]:w-[160px]">
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
                Downloads
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
                className="shrink-0 snap-center min-[500px]:h-[300px] min-[500px]:w-auto max-w-[80vw] max-h-[400px]"
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

      {/* Download link */}
      <div
        id="downloads"
        className="flex flex-col gap-8 bg-[#292c2f] p-8 mx-7 max-[770px]:mx-0"
      >
        {/* APKs Section */}
        {article.apks.length > 0 && (
          <>
            <h2 className="text-xl font-bold max-[770px]:text-xl max-[500px]:text-center">
              APKs
            </h2>
            {article.apks.map((apk, i) => (
              <Link
                key={`APKs ${i}`}
                href={`${articleId}/download/${i + 1}-apk`}
                title={`Download APK ${article.title} Updated to version ${apk.version}`}
                className={`flex items-center justify-between max-[1000px]:flex-col 
                      box-border py-4 px-8 max-sm:px-4 uppercase bg-interactive leading-relaxed 
                      font-bold rounded-full max-[1000px]:rounded-xl shadow-xl shadow-interactive-20`}
              >
                <div>
                  <p>
                    Download APK {article.title}{" "}
                    <span> Updated to version {apk.version}</span>
                  </p>
                </div>
                <div className="max-[1000px]:font-medium flex items-center gap-2">
                  <RiDownloadFill />
                  <p>{apk.size}</p>
                </div>
              </Link>
            ))}
          </>
        )}

        {/* XAPKs Section */}
        {article.xapks.length > 0 && (
          <>
            <h2 className="text-xl font-bold max-[770px]:text-xl max-[500px]:text-center">
              XAPKs
            </h2>
            {article.xapks.map((xapk, i) => (
              <Link
                key={`XAPKs ${i}`}
                href={`${articleId}/download/${i + 1}-xapk`}
                title={`Download XAPK ${article.title} Updated to version ${xapk.version}`}
                className={`flex items-center justify-between max-[1000px]:flex-col 
                      box-border py-4 px-8 max-sm:px-4 uppercase bg-interactive leading-relaxed 
                      font-bold rounded-full max-[1000px]:rounded-xl shadow-xl shadow-interactive-20`}
              >
                <div>
                  <p>
                    Download XAPK {article.title}{" "}
                    <span> Updated to version {xapk.version}</span>
                  </p>
                </div>
                <div className="max-[1000px]:font-medium flex items-center gap-2">
                  <RiDownloadFill />
                  <p>{xapk.size}</p>
                </div>
              </Link>
            ))}
          </>
        )}

        {/* original apk */}
        {article.OriginalAPK && (
          <>
            <h2 className="text-xl font-bold max-[770px]:text-xl max-[500px]:text-center">
              Original APK
            </h2>
            <Link
              key={"original-apk"}
              href={`${articleId}/download/1-original-apk`}
              title={`Download Original APK ${article.title} Updated to version ${article.versionOriginal}`}
              className={`flex items-center justify-between max-[1000px]:flex-col 
            box-border py-4 px-8 max-sm:px-4 uppercase bg-[#3f4244] leading-relaxed 
            font-bold rounded-full max-[1000px]:rounded-xl shadow-xl shadow-[#3f4244]/20`}
            >
              <div>
                <p>
                  Download Original APK {article.title}{" "}
                  <span> Updated to version {article.versionOriginal}</span>
                </p>
              </div>
              <div className="max-[1000px]:font-medium flex items-center gap-2">
                <RiDownloadFill />
                <p>{article.sizeFileScript}</p>
              </div>
            </Link>
          </>
        )}

        {/* obb */}
        {article.OBB && (
          <>
            <h2 className="text-xl font-bold max-[770px]:text-xl max-[500px]:text-center">
              OBB
            </h2>
            <Link
              key={"obb"}
              href={`${articleId}/download/1-obb`}
              title={`Download OBB ${article.title} Updated to version ${article.version}`}
              className={`flex items-center justify-between max-[1000px]:flex-col 
                    box-border py-4 px-8 max-sm:px-4 uppercase bg-yellow-600 leading-relaxed 
                    font-bold rounded-full max-[1000px]:rounded-xl shadow-xl shadow-yellow-600/20`}
            >
              <div>
                <p>
                  Download OBB {article.title}{" "}
                  <span> Updated to version {article.version}</span>
                </p>
              </div>
              <div className="max-[1000px]:font-medium flex items-center gap-2">
                <RiDownloadFill />
                <p>{article.sizeFileOBB}</p>
              </div>
            </Link>
          </>
        )}
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
            className={`flex justify-center items-center w-1/2 rounded-3xl font-bold text-xl shadow-xl ${
              isLoading.delete
                ? "bg-gray-400 cursor-not-allowed shadow-gray-400/20"
                : "bg-red-500 shadow-red-500/20"
            }`}
            onClick={() => {
              setIsConfirmOpen({ ...isConfirmOpen, delete: true });
            }}
            disabled={isLoading.delete}
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
          message={"Are you sure you want to delete this article?"}
          onConfirm={handleDelete}
          onCancel={() => setIsConfirmOpen({ ...isConfirmOpen, delete: false })}
        />
      )}
    </div>
  );
}
