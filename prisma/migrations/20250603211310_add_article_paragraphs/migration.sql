-- CreateTable
CREATE TABLE "ArticleParagraph" (
    "id" SERIAL NOT NULL,
    "articleId" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ArticleParagraph_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingArticleParagraph" (
    "id" SERIAL NOT NULL,
    "pendingArticleId" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "PendingArticleParagraph_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArticleParagraph" ADD CONSTRAINT "ArticleParagraph_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingArticleParagraph" ADD CONSTRAINT "PendingArticleParagraph_pendingArticleId_fkey" FOREIGN KEY ("pendingArticleId") REFERENCES "PendingArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
