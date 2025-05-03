import Toolbar from "@/components/toolbar";
import AppList from "@/components/list/appList";
import Pagination from "@/components/pagination";
import { DOMAIN, ITEM_PER_PAGE } from "@/utils/constants";
import NotFoundPage from "@/app/not-found";
import { redirect } from "next/navigation";
import { fetchItems, fetchItemsCount } from "@/apiCalls/consumerApiCall";
import Head from "next/head";
import CardRow from "@/components/cardRow";

interface ItemsPageProp {
  params: Promise<{ pageId: string }>;
}

export async function generateMetadata({ params }: ItemsPageProp) {
  const { pageId } = await params;
  const page = Number(pageId);

  const prevPage = page > 1 ? `${DOMAIN}/programs/${page - 1}` : null;
  const nextPage = `${DOMAIN}/programs/${page + 1}`;

  return {
    title: "Download Top Android Programs and Tools APK for Free",
    description:
      "Download Android programs and APK apps for free. Discover top tools and essential applications for your Android device on this page.",
    keywords:
      "free Android programs, free programs, Android tools APK, download Android apps, best Android utilities, Android program download, APK apps for Android, Android APK programs free",
    alternates: {
      canonical: `${DOMAIN}/programs`,
      types: {
        "application/atom+xml": [
          {
            rel: "prev",
            url: prevPage ?? undefined,
          },
          {
            rel: "next",
            url: nextPage,
          },
        ],
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProgramsPage({ params }: ItemsPageProp) {
  const { pageId } = await params;
  if (isNaN(Number(pageId)) || Number(pageId) < 1) {
    return redirect("/programs/1");
  }

  try {
    const items = await fetchItems(Number(pageId), "PROGRAM");
    const count = await fetchItemsCount("PROGRAM");

    const pages = Math.ceil(Number(count) / ITEM_PER_PAGE);

    const structuredData = {
      "@context": "https://schema.org",
      name: "Download modded games on android",
      description:
        "In this section, you can download the latest cool and popular games. We also have daily updates of selected games mod for Android.",
      url: `${DOMAIN}/programs`,
      keywords:
        "mod, modded games for free, play free of viruses, hack, modded applications",
    };

    return (
      <>
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
          />
        </Head>

        <div>
          <div className="mb-8">
            <Toolbar local="home" firstLocal={"programs"} />
            <CardRow itemType="programs" />
          </div>

          <div className="px-7 max-[500px]:px-0">
            <AppList url={"program"} items={items} />
            <Pagination
              pages={pages}
              pageSelect={Number(pageId)}
              url={"program"}
            />
          </div>
        </div>
      </>
    );
  } catch {
    return NotFoundPage();
  }
}
