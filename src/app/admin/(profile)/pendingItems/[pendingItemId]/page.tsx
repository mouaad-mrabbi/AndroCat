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
import LoadingItem from "@/components/loadingItem";

// Pages
import NotFoundPage from "@/app/not-found";

// API Calls
import { fetchPendingItem, creatItem, updateItem } from "@/apiCalls/superAdminApiCall";

// Utils & Types
import { ActionType, ItemCategories, ItemType, User } from "@prisma/client";
import { toast } from "react-toastify";

interface PageparamsProps {
  params: Promise<{ pendingItemId: string }>;
}

interface PendingItem {
  id: string;
  status: ActionType;
  checking: boolean;
  title: string;
  description: string;
  image: string;
  developer: string;
  version: string;
  androidVer: string;

  itemType: ItemType;
  categories: ItemCategories;

  OBB: boolean;
  Script: boolean;
  linkAPK: string;
  linkOBB?: string;
  linkVideo?: string;
  linkScript?: string;
  sizeFileAPK: string;
  sizeFileOBB?: string;
  sizeFileScript?: string;
  appScreens: string[];
  keywords: string[];
  isMod: boolean;
  typeMod?: string;
  ratedFor: number;
  installs: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  createdBy: User;
  itemId?: string | null;
}

export default function Page({ params }: PageparamsProps) {
  const [pendingItem, setPendingItem] = useState<PendingItem>();
  const [pendingItemId, setPendingItemId] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getParams = async () => {
      const { pendingItemId } = await params;
      setPendingItemId(pendingItemId);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    const fetchItems = async () => {
      if (!pendingItemId) return;

      setIsLoading(true);
      setError(null);

      try {
        const PendingItem = await fetchPendingItem(pendingItemId);
        setPendingItem(PendingItem);
      } catch (error: any) {
        setError("Failed to fetch pending items.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [pendingItemId]);

  const handleMoveToItem = async () => {
    if (!pendingItem) return;
    if (pendingItem.status === "CREATE") {
      try {
        const response = await creatItem(pendingItem.id);

        toast.success(response.data.message || "New items added");
        router.push(`/admin/items/${response.data.id}`);
      } catch (error: any) {
        toast.error(error?.response?.data?.message);
      }
    } else if (pendingItem.status === "UPDATE") {
      try {
        const response = await updateItem(pendingItem.id);

        toast.success(response.data.message || "New items added");
        router.push(`/admin/items/${pendingItem.itemId}`);
      } catch (error: any) {
        toast.error(error?.response?.data?.message);
      }
    } else if (pendingItem.status === "DELETE") {
    }
  };

  if (isLoading) return <LoadingItem />;
  if (error) return NotFoundPage();
  if (!pendingItem) return NotFoundPage();

  return (
    <div className="min-w-[320px]">
      <Toolbar
        local={"dashboard"}
        firstLocal={"pendingItems"}
        scndLocal={`${pendingItem.title}`}
      />
      {/* content */}
      <div className="bg-[#1b1d1f] max-[770px]:bg-transparent  m-7 max-[770px]:m-0 ">
        <div className="flex max-[770px]:flex-col p-6">
          {/* title */}
          <p className="text-[1.5rem] font-bold min-[770px]:hidden mb-4">
            Download <span>{pendingItem.title}</span>{" "}
            {pendingItem.isMod && <span>({pendingItem.typeMod})</span>}{" "}
            <span>{pendingItem.version}</span> free on android
          </p>

          <div className="flex">
            {/* left */}
            <div>
              {/* image square */}
              <div className=" aspect-square h-[136px] min-[500px]:h-[184px] min-[770px]:h-[160px] min-[1200px]:h-[184px]">
                <Image
                  src={pendingItem.image}
                  width={90}
                  height={90}
                  alt={pendingItem.title || "game"}
                  className="aspect-square w-full rounded-2xl object-cover"
                  priority // لتحميل الصورة أولاً
                />
              </div>
              {/* developer */}
              <p className="text-sm text-[#b2b2b2]  lg:hidden my-4">
                {pendingItem.developer}
              </p>
            </div>
            {/* center */}
            <div className=" ml-8 max-[770px]:ml-4">
              <div>
                {/* title */}
                <p className="text-[1.65rem] font-bold max-[770px]:hidden">
                  Download <span>{pendingItem.title}</span>{" "}
                  {pendingItem.isMod && <span>({pendingItem.typeMod})</span>}{" "}
                  <span>{pendingItem.version}</span> free on android
                </p>
                {/* developer */}
                <p className="text-sm text-[#b2b2b2] my-2.5 max-lg:hidden">
                  {pendingItem.developer}
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
                    <span>Android {pendingItem.androidVer} +</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <TbVersionsFilled />
                    <span>Version: {pendingItem.version}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ImDatabase />
                    <span>{pendingItem.sizeFileAPK}</span>
                  </li>
                </ul>
                <div className="h-12  w-full mt-5 max-[500px]:mt-2 max-[500px]:h-10 min-[770px]:hidden ">
                  <Link
                    href={"/"}
                    className="box-border h-full flex items-center px-4 uppercase bg-green-500 leading-relaxed font-bold rounded-full shadow-xl shadow-green-500/20 text-nowrap max-[340px]:text-[10px] max-[500px]:text-xs "
                  >
                    Download ({pendingItem.sizeFileAPK})
                  </Link>
                </div>
              </div>

              <div className="flex gap-6 items-center p-2 mt-6 w-full h-16 rounded-full bg-[#55585b] lg:hidden max-[770px]:hidden">
                <Link
                  href={"/"}
                  className="box-border h-full flex items-center px-4 uppercase bg-green-500 leading-relaxed font-bold rounded-full text-nowrap"
                >
                  Download ({pendingItem.sizeFileAPK})
                </Link>
                <p className="text-sm text-white text-center">
                  Updated to version {pendingItem.version}!
                </p>
              </div>

              <div className=" max-[770px]:hidden mt-6">
                <Spoiler
                  title={pendingItem.title}
                  description={pendingItem.description}
                  isMod={pendingItem.isMod}
                  {...(pendingItem.isMod && {
                    typeMod: pendingItem.typeMod ?? undefined,
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
              Download ({pendingItem.sizeFileAPK})
            </Link>
            <p className="text-sm text-[#b2b2b2] text-center pt-2.5">
              Updated to version {pendingItem.version}!
            </p>
          </div>

          {/* description */}
          <div className=" min-[770px]:hidden">
            <Spoiler
              title={pendingItem.title}
              description={pendingItem.description}
              isMod={pendingItem.isMod}
              {...(pendingItem.isMod && {
                typeMod: pendingItem.typeMod ?? undefined,
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
            {pendingItem.appScreens.map((elem) => (
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
      <div className="flex flex-col gap-8 bg-[#1b1d1f] max-[770px]:bg-transparent p-8 m-7 max-[770px]:m-0 ">
        {/* APK link */}
        <Link
          href={pendingItem.linkAPK}
          className="flex items-center justify-between max-[1000px]:flex-col 
          box-border py-4 px-8 max-sm:px-4 uppercase bg-green-500 leading-relaxed 
          font-bold rounded-full max-[1000px]:rounded-xl shadow-xl shadow-green-500/20"
        >
          <div>
            <p>
              Download APK {pendingItem.title}{" "}
              <span> Updated to version {pendingItem.version}</span>
            </p>
          </div>
          <div className="max-[1000px]:font-medium flex items-center gap-2">
            <RiDownloadFill />
            <p>{pendingItem.sizeFileAPK}</p>
          </div>
        </Link>
        {/* OBB link */}
        {pendingItem.OBB && pendingItem.linkOBB && (
          <Link
            href={pendingItem.linkOBB || ""}
            className="flex items-center justify-between max-[1000px]:flex-col 
          box-border py-4 px-8 max-sm:px-4 uppercase bg-yellow-600 leading-relaxed 
          font-bold rounded-full max-[1000px]:rounded-xl shadow-xl shadow-yellow-600/20"
          >
            <div>
              <p>
                Download OBB {pendingItem.title}{" "}
                <span> Updated to version {pendingItem.version}</span>
              </p>
            </div>
            <div className="max-[1000px]:font-medium flex items-center gap-2">
              <RiDownloadFill />
              <p>{pendingItem.sizeFileOBB}</p>
            </div>
          </Link>
        )}
        {/* Script link */}
        {pendingItem.Script && pendingItem.linkScript && (
          <Link
            href={pendingItem.linkScript}
            className="flex items-center justify-between max-[1000px]:flex-col 
          box-border py-4 px-8 max-sm:px-4 uppercase bg-yellow-600 leading-relaxed 
          font-bold rounded-full max-[1000px]:rounded-xl shadow-xl shadow-yellow-600/20 "
          >
            <div>
              <p>
                Download Script {pendingItem.title}{" "}
                <span> Updated to version {pendingItem.version}</span>
              </p>
            </div>
            <div className="max-[1000px]:font-medium flex items-center gap-2">
              <RiDownloadFill />
              <p>{pendingItem.sizeFileScript}</p>
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
            href={`/admin/${pendingItem.id}/update`}
          >
            update
          </Link>
          <Link
            className="flex justify-center items-center bg-red-500 w-1/2 rounded-3xl
           font-bold text-xl shadow-xl shadow-red-500/20"
            href={""}
          >
            delete
          </Link>
        </div>

        {/* info for admin and post */}
        <div className="flex gap-10 w-full text-center mb-10">
          {/* info user */}
          <div className="flex flex-col gap-4">
            <div className="h-44 aspect-square rounded-full ">
              <Image
                src={pendingItem.createdBy.profile}
                width={90}
                height={90}
                alt={pendingItem.createdBy.username}
                className="object-contain rounded-lg h-full w-full "
                priority // To download the image first
              />
            </div>
            <p>{pendingItem.createdBy.username}</p>
          </div>

          {/* info post */}
          <div className="flex flex-1 justify-around">
            <div>
              <p className="text-green-500">created at</p>
              <div>{new Date(pendingItem.createdAt).toLocaleString()}</div>
              <div className="bg-red-400 h-max text-black rounded-md">
                {new Date(pendingItem.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>

            <div className="h-16 w-px bg-gray-300"></div>

            <div>
              <p className="text-green-500">updated at</p>
              <div>{new Date(pendingItem.updatedAt).toLocaleString()}</div>
              <div className="bg-red-400 h-max text-black rounded-md">
                {new Date(pendingItem.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* move To Item */}

      <div className=" bg-[#1b1d1f] max-[770px]:bg-transparent p-8 m-7 max-[770px]:m-0 ">
        <p className="mb-4 text-2xl font-bold  max-[770px]:text-xl max-[500px]:text-center ">
          move To Item
        </p>

        <button
          className="flex justify-center items-center w-full p-4 bg-green-500  rounded-3xl 
          font-bold text-xl shadow-xl shadow-green-500/20"
          onClick={handleMoveToItem}
        >
          <p>
            To Item <span>{pendingItem.status}</span>
          </p>
        </button>
      </div>
    </div>
  );
}
