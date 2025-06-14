import { ARTICLE_PER_PAGE, DOMAIN } from "@/utils/constants";
import { NextResponse } from "next/server";
import prisma from "@/utils/db";
import { slugifyTitle } from "@/utils/slugifyTitle";

type SitemapUrl = {
  loc: string;
  priority: string;
  changefreq: string;
  lastmod?: string;
};

export async function GET() {
  const SITE_URL = DOMAIN;
  const PAGE_SIZE = ARTICLE_PER_PAGE;

  const articles = await prisma.article.findMany({
    where: {
      isApproved: true,
    },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      isMod: true,
      articleType: true,
      updatedAt: true,
    },
  });

  const games = articles.filter((a) => a.articleType === "GAME");
  const programs = articles.filter((a) => a.articleType === "PROGRAM");

  const totalGamesPages = Math.ceil(games.length / PAGE_SIZE);
  const totalProgramsPages = Math.ceil(programs.length / PAGE_SIZE);

  const staticUrls: SitemapUrl[] = [
    { loc: `${SITE_URL}/`, priority: "1.0", changefreq: "daily" },
    { loc: `${SITE_URL}/games`, priority: "0.7", changefreq: "weekly" },
    { loc: `${SITE_URL}/programs`, priority: "0.7", changefreq: "weekly" },
/*     ...Array.from({ length: totalGamesPages - 1 }, (_, i) => ({
      loc: `${SITE_URL}/games/${i + 2}`,
      priority: "0.4",
      changefreq: "weekly",
    })),
    ...Array.from({ length: totalProgramsPages - 1 }, (_, i) => ({
      loc: `${SITE_URL}/programs/${i + 2}`,
      priority: "0.4",
      changefreq: "weekly",
    })), */
  ];

  const articleUrls: SitemapUrl[] = articles.map((item) => ({
    loc: `${SITE_URL}/${item.id}-${slugifyTitle(item.title)}${
      item.isMod ? "-mod" : ""
    }-apk-android-download`,
    priority: "0.9",
    changefreq: "weekly",
    lastmod: item.updatedAt.toISOString().split("T")[0],
  }));

  const urls = [...staticUrls, ...articleUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, priority, changefreq, lastmod }) => `
  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${
      lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""
    }
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
