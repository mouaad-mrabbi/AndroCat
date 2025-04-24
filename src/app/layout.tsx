// This project was developed by MOUAAD MRABBI - 2025
// All rights reserved © AndroCat

export const metadata = {
  title: "AndroCat",
  description:
    "Download the latest free Android games and MOD APK apps with AndroCat. Safe, fast and updated daily with top trending apps and games for Android devices.",
  keywords: [
    "MOD APK",
    "androcat",
    "android apps",
    "free android games",
    "MOD APK download",
    "apk games",
    "free apk",
    "modded games",
    "latest android games",
    "apk downloader",
  ],
  icons: {
    icon: `${DOMAIN}/images/logo.png`,
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${DOMAIN}`,
  },
  openGraph: {
    type: "website",
    url: `${DOMAIN}`,
    title: "AndroCat - Free MOD APK Games & Android Apps",
    description:
      "Discover thousands of free Android MOD APKs and trending games on AndroCat. Updated daily. Safe and fast downloads for all your favorite apps.",
    images: [
      {
        url: `${DOMAIN}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: "Download Free MOD APK Android Games and Apps - AndroCat",
      },
    ],
    siteName: "AndroCat",
  },
  twitter: {
    card: "summary_large_image",
    site: "@androcat",
    creator: "@mouaadmrabbi",
    title: "AndroCat - Download MOD APKs for Free",
    description:
      "Free Android APKs, apps and modded games ready to download. Discover new experiences with AndroCat.",
    images: [`${DOMAIN}/images/logo.png`],
  },
  other: {
    author: "MOUAAD MRABBI",
    copyright: "© 2025 AndroCat. All rights reserved.",
  },
};

import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { ToastContainer } from "react-toastify";
import "@/components/clientLogger";
import Head from "next/head";
import { DOMAIN } from "@/utils/constants";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "AndroCat",
              url: DOMAIN,
              logo: `${DOMAIN}/images/logo.png`,
              sameAs: [
                "https://twitter.com/androcat",
                "https://facebook.com/androcat",
                // أي حسابات تواصل اجتماعي لديك
              ],
            }),
          }}
        />
      </Head>
      <body>
        <ToastContainer />
        <Nav />
        <div className="max-w-[1348px] mx-auto">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
