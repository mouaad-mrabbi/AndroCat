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
import LoadingItem from "@/components/loadingItem";

// Pages
import NotFoundPage from "@/app/not-found";

// Utils & API
import { toast } from "react-toastify";
import { approvedItem, fetchItem } from "@/apiCalls/ownerApiCall";
import { ItemAndObjects } from "@/utils/types";

interface PageparamsProps {
  params: Promise<{ itemId: string }>;
}
type ConfirmOpenState = {
  Approved: boolean;
  delete: boolean;
};

export default function Page({ params }: PageparamsProps) {
  const [item, setItem] = useState<ItemAndObjects>();
  const [itemId, setItemId] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState<ConfirmOpenState>({
    Approved: false,
    delete: false,
  });

  useEffect(() => {
    const getParams = async () => {
      const { itemId } = await params;
      setItemId(itemId);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    const FetchItem = async () => {
      if (!itemId) return;

      setIsLoading(true);
      setError(null);

      try {
        const Item = await fetchItem(itemId);

        setItem(Item);
      } catch (error: any) {
        setError("Failed to fetch pending items.");
      } finally {
        setIsLoading(false);
      }
    };

    FetchItem();
  }, [itemId]);

  const handleApproved = async (e: string) => {
    if (!item) return;

    try {
      console.log(item.isApproved);
      const response = await approvedItem(item.id, e);

      toast.success(response.data.message);
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  if (isLoading) return <LoadingItem />;
  if (error) return NotFoundPage();
  if (!item) return NotFoundPage();

  return (
    <div className="min-w-[320px]">
      <Toolbar
        local={"dashboard"}
        firstLocal={"items"}
        scndLocal={`${item.title}`}
      />
      {/* content */}
      <div className="bg-[#1b1d1f] max-[770px]:bg-transparent  m-7 max-[770px]:m-0 ">
        <div className="flex max-[770px]:flex-col p-6">
          {/* title */}
          <p className="text-[1.5rem] font-bold min-[770px]:hidden mb-4">
            Download <span>{item.title}</span>{" "}
            {item.isMod && <span>({item.typeMod})</span>}{" "}
            <span>{item.version}</span> free on android
          </p>

          <div className="flex">
            {/* left */}
            <div>
              {/* image square */}
              <div className=" aspect-square h-[136px] min-[500px]:h-[184px] min-[770px]:h-[160px] min-[1200px]:h-[184px]">
                <Image
                  src={item.image}
                  width={90}
                  height={90}
                  alt={item.title || "game"}
                  className="aspect-square w-full rounded-2xl object-cover"
                  priority // لتحميل الصورة أولاً
                />
              </div>
              {/* developer */}
              <p className="text-sm text-[#b2b2b2]  lg:hidden my-4">
                {item.developer}
              </p>
            </div>
            {/* center */}
            <div className=" ml-8 max-[770px]:ml-4">
              <div>
                {/* title */}
                <p className="text-[1.65rem] font-bold max-[770px]:hidden">
                  Download <span>{item.title}</span>{" "}
                  {item.isMod && <span>({item.typeMod})</span>}{" "}
                  <span>{item.version}</span> free on android
                </p>
                {/* developer */}
                <p className="text-sm text-[#b2b2b2] my-2.5 max-lg:hidden">
                  {item.developer}
                </p>
              </div>
              <div className="flex items-center gap-4  mb-4 max-lg:hidden">
                <Star rating={item.averageRating} />
                <p className="font-bold">
                  {item.averageRating}{" "}
                  <span className="text-sm font-normal">
                    ({item.ratingCount})
                  </span>
                </p>
              </div>

              <div>
                <ul className="flex gap-4 text-sm  text-[#b2b2b2] max-[770px]:flex-col max-[770px]:gap-2">
                  <li className="flex items-center gap-2">
                    <FaAndroid />
                    <span>Android {item.androidVer} +</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <TbVersionsFilled />
                    <span>Version: {item.version}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ImDatabase />
                    <span>{item.sizeFileAPK}</span>
                  </li>
                </ul>
                <div className="h-12  w-full mt-5 max-[500px]:mt-2 max-[500px]:h-10 min-[770px]:hidden ">
                  <Link
                    href={"/"}
                    className="box-border h-full flex items-center px-4 uppercase bg-green-500 leading-relaxed font-bold rounded-full shadow-xl shadow-green-500/20 text-nowrap max-[340px]:text-[10px] max-[500px]:text-xs "
                  >
                    Download ({item.sizeFileAPK})
                  </Link>
                </div>
              </div>

              <div className="flex gap-6 items-center p-2 mt-6 w-full h-16 rounded-full bg-[#55585b] lg:hidden max-[770px]:hidden">
                <Link
                  href={"/"}
                  className="box-border h-full flex items-center px-4 uppercase bg-green-500 leading-relaxed font-bold rounded-full text-nowrap"
                >
                  Download ({item.sizeFileAPK})
                </Link>
                <p className="text-sm text-white text-center">
                  Updated to version {item.version}!
                </p>
              </div>

              <div className=" max-[770px]:hidden mt-6">
                <Spoiler
                  title={item.title}
                  description={item.description}
                  isMod={item.isMod}
                  {...(item.isMod && {
                    typeMod: item.typeMod ?? undefined,
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
              Download ({item.sizeFileAPK})
            </Link>
            <p className="text-sm text-[#b2b2b2] text-center pt-2.5">
              Updated to version {item.version}!
            </p>
          </div>

          {/* description */}
          <div className=" min-[770px]:hidden">
            <Spoiler
              title={item.title}
              description={item.description}
              isMod={item.isMod}
              {...(item.isMod && {
                typeMod: item.typeMod ?? undefined,
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
            {item.appScreens.map((elem) => (
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
      <div className="flex flex-col gap-8 bg-[#292c2f] p-8 mx-7 max-[770px]:m-0x ">
        {/* APK link */}
        <Link
          href={item.linkAPK}
          className="flex items-center justify-between max-[1000px]:flex-col 
          box-border py-4 px-8 max-sm:px-4 uppercase bg-green-500 leading-relaxed 
          font-bold rounded-full max-[1000px]:rounded-xl shadow-xl shadow-green-500/20"
        >
          <div>
            <p>
              Download APK {item.title}{" "}
              <span> Updated to version {item.version}</span>
            </p>
          </div>
          <div className="max-[1000px]:font-medium flex items-center gap-2">
            <RiDownloadFill />
            <p>{item.sizeFileAPK}</p>
          </div>
        </Link>
        {/* OBB link */}
        {item.OBB && item.linkOBB && (
          <Link
            href={item.linkOBB || ""}
            className="flex items-center justify-between max-[1000px]:flex-col 
          box-border py-4 px-8 max-sm:px-4 uppercase bg-yellow-600 leading-relaxed 
          font-bold rounded-full max-[1000px]:rounded-xl shadow-xl shadow-yellow-600/20"
          >
            <div>
              <p>
                Download OBB {item.title}{" "}
                <span> Updated to version {item.version}</span>
              </p>
            </div>
            <div className="max-[1000px]:font-medium flex items-center gap-2">
              <RiDownloadFill />
              <p>{item.sizeFileOBB}</p>
            </div>
          </Link>
        )}
        {/* Script link */}
        {item.Script && item.linkScript && (
          <Link
            href={item.linkScript}
            className="flex items-center justify-between max-[1000px]:flex-col 
          box-border py-4 px-8 max-sm:px-4 uppercase bg-yellow-600 leading-relaxed 
          font-bold rounded-full max-[1000px]:rounded-xl shadow-xl shadow-yellow-600/20 "
          >
            <div>
              <p>
                Download Script {item.title}{" "}
                <span> Updated to version {item.version}</span>
              </p>
            </div>
            <div className="max-[1000px]:font-medium flex items-center gap-2">
              <RiDownloadFill />
              <p>{item.sizeFileScript}</p>
            </div>
          </Link>
        )}
      </div>

      {/* Additional Information */}
      <div className="flex flex-col gap-8 bg-[#1b1d1f] p-8 mx-7 max-[770px]:m-0x ">
        <p className="mb-4 text-2xl font-bold  max-[770px]:text-xl max-[500px]:text-center ">
          Additional Information:
        </p>
        <div className="grid grid-cols-4 gap-4 max-[700px]:grid-cols-2">
          <div>
            <p className="font-bold">Categories</p>
            <p>
              {item.categories.charAt(0).toUpperCase() +
                item.categories.slice(1).toLowerCase()}
            </p>
          </div>
          <div>
            <p className="font-bold">Type</p>
            <p>
              {item.itemType.charAt(0).toUpperCase() +
                item.itemType.slice(1).toLowerCase()}
            </p>
          </div>
          <div>
            <p className="font-bold">Installs</p>
            <p>{item.installs}</p>
          </div>
          <div>
            <p className="font-bold">Rated for</p>
            <p>
              {item.ratedFor} <span>+ years</span>
            </p>
          </div>
          <div>
            <p className="font-bold">Updated</p>
            <p>
              {new Date(item.updatedAt).toLocaleDateString("en-US", {
                month: "long", // 'long' to get full month name (e.g., 'April')
                day: "numeric", // numeric day
                year: "numeric", // numeric year
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Approved */}
      <div className=" bg-[#1b1d1f] max-[770px]:bg-transparent p-8 m-7 max-[770px]:m-0 ">
        <p className="mb-4 text-2xl font-bold  max-[770px]:text-xl max-[500px]:text-center ">
          Approved
        </p>
        {item.isApproved ? (
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

      {/* pending item */}
      <div className=" bg-[#1b1d1f] max-[770px]:bg-transparent p-8 m-7 max-[770px]:m-0 ">
        <p className="mb-4 text-2xl font-bold  max-[770px]:text-xl max-[500px]:text-center ">
          Pending Item
        </p>
        <Link
          className="flex justify-center items-center bg-green-500 rounded-3xl 
          font-bold text-xl shadow-xl shadow-green-500/20 py-4"
          href={`/admin/pendingItems/${item.pendingItem?.id}`}
        >
          Pending Item
        </Link>
      </div>

      {/* Add pending item (update) & (delete)*/}
      <div className=" bg-[#1b1d1f] max-[770px]:bg-transparent p-8 m-7 max-[770px]:m-0 ">
        <p className="mb-4 text-2xl font-bold  max-[770px]:text-xl max-[500px]:text-center ">
          Add pending item
        </p>

        <div className="flex gap-10 h-16 w-full text-center mb-10">
          <Link
            className="flex justify-center items-center bg-green-500 w-1/2 rounded-3xl 
          font-bold text-xl shadow-xl shadow-green-500/20"
            href={`/admin/items/${item.id}/pendingItems/create`}
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
                src={item.validatedBy.profile}
                width={170}
                height={170}
                alt={item.validatedBy.username}
                className="object-contain rounded-lg h-full w-full "
                priority // To download the image first
              />
            </div>
            <p>{item.validatedBy.username}</p>
          </div>

          {/* info post */}
          <div className="flex flex-1 justify-around">
            <div>
              <p className="text-green-500">validated At</p>
              <div>{new Date(item.validatedAt).toLocaleString()}</div>
              <div className="bg-red-400 h-max text-black rounded-md">
                {new Date(item.validatedAt).toLocaleDateString("en-US", {
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
                src={item.createdBy.profile}
                width={170}
                height={170}
                alt={item.createdBy.username}
                className="object-contain rounded-lg h-full w-full "
                priority // To download the image first
              />
            </div>
            <p>{item.createdBy.username}</p>
          </div>

          {/* info post */}
          <div className="flex flex-1 justify-around">
            <div>
              <p className="text-green-500">created at</p>
              <div>{new Date(item.createdAt).toLocaleString()}</div>
              <div className="bg-red-400 h-max text-black rounded-md">
                {new Date(item.createdAt).toLocaleDateString("en-US", {
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
            item.isApproved
              ? "Are you sure you want to reject this article?"
              : "Are you sure you want to approve this article?"
          }
          onConfirm={() => handleApproved(item.isApproved ? "false" : "true")}
          onCancel={() =>
            setIsConfirmOpen({ ...isConfirmOpen, Approved: false })
          }
        />
      )}
      {/* Confirm Box */}
      {isConfirmOpen.delete && (
        <ConfirmBox
          message="Are you sure you want to delete this article?"
          onConfirm={() => handleApproved(item.isApproved ? "false" : "true")}
          onCancel={() => setIsConfirmOpen({ ...isConfirmOpen, delete: false })}
        />
      )}
    </div>
  );
}
