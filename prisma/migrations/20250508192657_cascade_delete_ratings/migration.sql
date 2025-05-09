-- DropForeignKey
ALTER TABLE "ArticleRating" DROP CONSTRAINT "ArticleRating_articleId_fkey";

-- AddForeignKey
ALTER TABLE "ArticleRating" ADD CONSTRAINT "ArticleRating_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
