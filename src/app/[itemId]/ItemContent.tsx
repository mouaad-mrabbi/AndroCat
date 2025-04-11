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
import { fetchItemById } from "@/apiCalls/consumerApiCall";
import Rating from "@/components/rating";

export async function ItemContent({ itemId }: { itemId: string }) {
  try {
    const item = await fetchItemById(itemId);

    return (
      <div className="min-w-[320px]">
        <Toolbar
          local={"home"}
          firstLocal={"games"}
          scndLocal={`${item.title}`}
        />
        {/* content */}
        <div className="bg-[#1b1d1f] max-[770px]:bg-transparent m-7 max-[770px]:m-0 ">
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
                  {/* Downloads */}
                  <div className="h-12  w-full mt-5 max-[500px]:mt-2 max-[500px]:h-10 min-[770px]:hidden ">
                    {item.OBB || item.Script ? (
                      <Link
                        href="#downloads"
                        className="box-border h-full flex items-center px-4 uppercase bg-green-500 leading-relaxed font-bold rounded-full text-nowrap"
                      >
                        Downloads
                      </Link>
                    ) : (
                      <Link
                        href={"/"}
                        className="box-border h-full flex items-center px-4 uppercase bg-green-500 leading-relaxed font-bold 
                      rounded-full shadow-xl shadow-green-500/20 text-nowrap max-[340px]:text-[10px] max-[500px]:text-xs "
                      >
                        Download ({item.sizeFileAPK})
                      </Link>
                    )}
                  </div>
                </div>

                {/* Downloads */}
                <div className="flex gap-6 items-center p-2 mt-6 w-full h-16 rounded-full bg-[#55585b] lg:hidden max-[770px]:hidden">
                  {item.OBB || item.Script ? (
                    <Link
                      href="#downloads"
                      className="box-border h-full flex items-center px-4 uppercase bg-green-500 leading-relaxed font-bold rounded-full text-nowrap"
                    >
                      Downloads
                    </Link>
                  ) : (
                    <Link
                      href={"/"}
                      className="box-border h-full flex items-center px-4 uppercase bg-green-500 leading-relaxed font-bold rounded-full text-nowrap"
                    >
                      Download ({item.sizeFileAPK})
                    </Link>
                  )}

                  <p className="text-sm text-white text-center">
                    Updated to version {item.version}!
                  </p>
                </div>

                <div className=" max-[770px]:hidden mt-6">
                  <Spoiler
                    title={item.title}
                    description={item.description}
                    isMod={item.isMod}
                    {...(item.isMod && { typeMod: item.typeMod ?? undefined })}
                  />
                </div>
              </div>
            </div>

            {/* right */}
            <div className=" w-52 ml-8 flex flex-col max-lg:hidden">
              {item.OBB || item.Script ? (
                <Link
                  href="#downloads"
                  className="box-border p-4 uppercase bg-green-500 leading-relaxed font-bold rounded-full 
                  shadow-xl shadow-green-500/20 text-nowrap text-center"
                >
                  Downloads
                </Link>
              ) : (
                <Link
                  href={"/"}
                  className="box-border p-4 uppercase bg-green-500 leading-relaxed font-bold rounded-full shadow-xl shadow-green-500/20 text-nowrap"
                >
                  Download ({item.sizeFileAPK})
                </Link>
              )}
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
                {...(item.isMod && { typeMod: item.typeMod ?? undefined })}
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

        {/* rating */}
        <div className="flex justify-between max-[500px]:flex-col items-center gap-8 bg-[#1b1d1f] p-8 mx-7 max-[770px]:mx-0 ">
          <Rating rating={item.averageRating} itemId={item.id} />
          <div className=" flex items-end gap-2 ">
            <p className="text-3xl font-bold max-[500px]:text-4xl">
              {item.averageRating}
            </p>
            <p>({item.ratingCount})</p>
          </div>
        </div>
        {/* Download link */}
        <div
          id="downloads"
          className="flex flex-col gap-8 bg-[#292c2f] p-8 mx-7 max-[770px]:mx-0 "
        >
          {/* APK link */}
          <Link
            href={`/download/${item.id}/apk`}
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
              href={`/download/${item.id}/obb`}
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
              href={`/download/${item.id}/script`}
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
        <div className="flex flex-col gap-8 bg-[#1b1d1f] p-8 mx-7 max-[770px]:mx-0 ">
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
          </div>
        </div>
      </div>
    );
  } catch {
    return <NotFoundPage />;
  }
}
