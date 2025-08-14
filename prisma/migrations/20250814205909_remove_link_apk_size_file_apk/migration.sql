/*
  Warnings:

  - You are about to drop the column `linkAPK` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `sizeFileAPK` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `linkAPK` on the `PendingArticle` table. All the data in the column will be lost.
  - You are about to drop the column `sizeFileAPK` on the `PendingArticle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "linkAPK",
DROP COLUMN "sizeFileAPK";

-- AlterTable
ALTER TABLE "PendingArticle" DROP COLUMN "linkAPK",
DROP COLUMN "sizeFileAPK";
