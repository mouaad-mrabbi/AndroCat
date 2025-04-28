// This project was developed by MOUAAD MRABBI - 2025
// All rights reserved © AndroCat

export const metadata = {
  icons: {
    icon: `${DOMAIN}/images/logo.png`,
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    siteName: "AndroCat",
  },
  twitter: {
    site: "@androcat",
    creator: "@mouaadmrabbi",
    card: "summary_large_image",
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
        {/* Organization Schema */}
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
              ],
            }),
          }}
        />

        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "AndroCat",
              potentialAction: {
                "@type": "SearchAction",
                target: `${DOMAIN}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
              publisher: {
                "@type": "Organization",
                name: "AndroCat",
                logo: {
                  "@type": "ImageObject",
                  url: `${DOMAIN}/images/logo.png`,
                },
              },
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
