/*
  Warnings:

  - Added the required column `descriptionMeta` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PendingArticle" DROP CONSTRAINT "PendingArticle_articleId_fkey";

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "descriptionMeta" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PendingArticle" ADD COLUMN     "descriptionMeta" TEXT NOT NULL DEFAULT 'No meta description';

-- AddForeignKey
ALTER TABLE "PendingArticle" ADD CONSTRAINT "PendingArticle_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
