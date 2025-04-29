"use client";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type NavigationItem = {
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
  const navigation: NavigationItem[] = [
    { name: "Home", href: "/", current: firstSegment === "" },
    { name: "Games", href: "/games", current: firstSegment === "games" },
    {
      name: "Programs",
      href: "/programs",
      current: firstSegment === "programs",
    },
    /*     { name: "FAQ", href: "/faq", current: firstSegment === "faq" },
     */
  ];

  return (
    <Disclosure as="nav" className="bg-[#292c2f]">
      <div className="min-[770px]:flex items-center mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-20 max-[770px]:h-16">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <DisclosureButton
              className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block h-6 w-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden h-6 w-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>
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
              <Link href={"/"} title="AndroCat">
                <Image
                  src="/images/andro.png"
                  alt="AndroCat Logo"
                  width={160}
                  height={40}
                  priority={true}
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:block my-auto">
              <div className="flex gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    title={item.name}
                    className={classNames(
                      item.current
                        ? "text-green-500"
                        : "text-white hover:text-gray-400",
                      "px-3 py-2 font-bold text-xl"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden" id="mobile-menu">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.href}
              as={Link}
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              title={item.name}
              className={classNames(
                item.current
                  ? "text-green-500"
                  : "text-white hover:text-gray-400",
                "block rounded-md px-3 py-2 text-base font-bold"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default Example;
