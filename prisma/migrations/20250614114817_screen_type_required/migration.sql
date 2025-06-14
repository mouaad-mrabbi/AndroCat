/*
  Warnings:

  - Made the column `screenType` on table `Article` required. This step will fail if there are existing NULL values in that column.
  - Made the column `screenType` on table `PendingArticle` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "screenType" SET NOT NULL,
ALTER COLUMN "screenType" SET DEFAULT 'SIXTEEN_BY_NINE';

-- AlterTable
ALTER TABLE "PendingArticle" ALTER COLUMN "screenType" SET NOT NULL,
ALTER COLUMN "screenType" SET DEFAULT 'SIXTEEN_BY_NINE';
