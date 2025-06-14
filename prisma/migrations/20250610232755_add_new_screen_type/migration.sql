-- CreateEnum
CREATE TYPE "ScreenType" AS ENUM ('SIXTEEN_BY_NINE', 'NINE_BY_SIXTEEN', 'THREE_BY_FOUR', 'FIVE_BY_EIGHT');

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "screenType" "ScreenType";

-- AlterTable
ALTER TABLE "PendingArticle" ADD COLUMN     "screenType" "ScreenType";
