"use client";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { IoMdSearch } from "react-icons/io";
import { useState } from "react";

type NavigationArticle = {
  name: string;
  href: string;
  current: boolean;
};

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

const Example: React.FC = () => {
  const pathname = usePathname();
  const firstSegment = pathname.split("/")[1];
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const navigation: NavigationArticle[] = [
    { name: "Home", href: "/", current: firstSegment === "" },
    { name: "Games", href: "/games", current: firstSegment === "games" },
    {
      name: "Programs",
      href: "/programs",
      current: firstSegment === "programs",
    },
    // { name: "FAQ", href: "/faq", current: firstSegment === "faq" },
  ];

  return (
    <>
      <Disclosure as="nav" className="bg-[#292c2f]">
        <div className="max-w-7xl px-2 sm:px-6 lg:px-8 h-full">
          <div className="relative flex h-16 items-center justify-between">
            {/* زر القائمة للجوال */}
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton
                className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  className="block h-6 w-6 group-data-open:hidden"
                  aria-hidden="true"
                />
                <XMarkIcon
                  className="hidden h-6 w-6 group-data-open:block"
                  aria-hidden="true"
                />
              </DisclosureButton>
            </div>

            {/* الشعار والتنقل */}
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center relative">
                {pathname === "/" ? (
                  <h1 className="sr-only">
                    AndroCat - Download Free Android Games and Programs
                  </h1>
                ) : (
                  <span className="sr-only">
                    AndroCat - Download Free Android Games and Programs
                  </span>
                )}
                <Link href="/" title="AndroCat">
                  <Image
                    src="/images/AndroCat-logo.png"
                    alt="AndroCat Logo"
                    className="w-44"
                    width={1573}
                    height={421}
                    priority
                  />
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:block my-auto">
                <div className="flex gap-4">
                  {navigation.map((article) => (
                    <Link
                      key={article.href}
                      href={article.href}
                      aria-current={article.current ? "page" : undefined}
                      title={article.name}
                      className={classNames(
                        article.current
                          ? "text-interactive"
                          : "text-white hover:text-gray-400",
                        "px-3 py-2 font-bold text-xl"
                      )}
                    >
                      {article.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* زر فتح البحث */}
            <button
              className="absolute  right-0 top-1/2 -translate-y-1/2 text-2xl rounded-full text-white p-2 h-max"
              onClick={() => setShowSearch((prev) => !prev)}
            >
              <IoMdSearch />
            </button>
          </div>
        </div>

        {/* قائمة الجوال */}
        <DisclosurePanel className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {navigation.map((article) => (
              <DisclosureButton
                key={article.href}
                as={Link}
                href={article.href}
                aria-current={article.current ? "page" : undefined}
                title={article.name}
                className={classNames(
                  article.current
                    ? "text-interactive"
                    : "text-white hover:text-gray-400",
                  "block rounded-md px-3 py-2 text-base font-bold"
                )}
              >
                {article.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>

      {/* شريط البحث المتحرك */}
      <div
        className={classNames(
          "overflow-hidden transition-all duration-300 ease-in-out bg-[#1f2123]",
          showSearch ? "max-h-32 py-4" : "max-h-0"
        )}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              router.push(
                `/search?q=${encodeURIComponent(searchQuery.trim())}`
              );
              setShowSearch(false);
            }
          }}
          className="max-w-7xl mx-auto px-4"
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full px-4 py-2 pr-20 text-lg focus:outline-none bg-[#292c2f] text-white rounded-md"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-white  hover:text-interactive"
            >
              <IoMdSearch className="text-xl" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Example;
