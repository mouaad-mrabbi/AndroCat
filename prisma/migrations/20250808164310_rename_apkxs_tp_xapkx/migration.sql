/*
  Warnings:

  - You are about to drop the `ArticleAPKXS` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PendingArticleAPKXS` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ArticleAPKXS" DROP CONSTRAINT "ArticleAPKXS_articleId_fkey";

-- DropForeignKey
ALTER TABLE "PendingArticleAPKXS" DROP CONSTRAINT "PendingArticleAPKXS_pendingArticleId_fkey";

-- DropTable
DROP TABLE "ArticleAPKXS";

-- DropTable
DROP TABLE "PendingArticleAPKXS";

-- CreateTable
CREATE TABLE "ArticleXAPKS" (
    "id" SERIAL NOT NULL,
    "articleId" INTEGER NOT NULL,
    "version" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "isMod" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ArticleXAPKS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingArticleXAPKS" (
    "id" SERIAL NOT NULL,
    "pendingArticleId" INTEGER NOT NULL,
    "version" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "isMod" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,

    CONSTRAINT "PendingArticleXAPKS_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArticleXAPKS" ADD CONSTRAINT "ArticleXAPKS_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingArticleXAPKS" ADD CONSTRAINT "PendingArticleXAPKS_pendingArticleId_fkey" FOREIGN KEY ("pendingArticleId") REFERENCES "PendingArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
