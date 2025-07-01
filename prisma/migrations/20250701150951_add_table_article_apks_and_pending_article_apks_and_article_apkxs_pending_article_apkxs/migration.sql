-- CreateTable
CREATE TABLE "ArticleAPKS" (
    "id" SERIAL NOT NULL,
    "articleId" INTEGER NOT NULL,
    "version" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "isMod" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ArticleAPKS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingArticleAPKS" (
    "id" SERIAL NOT NULL,
    "pendingArticleId" INTEGER NOT NULL,
    "version" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "isMod" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,

    CONSTRAINT "PendingArticleAPKS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleAPKXS" (
    "id" SERIAL NOT NULL,
    "articleId" INTEGER NOT NULL,
    "version" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "isMod" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ArticleAPKXS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingArticleAPKXS" (
    "id" SERIAL NOT NULL,
    "pendingArticleId" INTEGER NOT NULL,
    "version" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "isMod" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,

    CONSTRAINT "PendingArticleAPKXS_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArticleAPKS" ADD CONSTRAINT "ArticleAPKS_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingArticleAPKS" ADD CONSTRAINT "PendingArticleAPKS_pendingArticleId_fkey" FOREIGN KEY ("pendingArticleId") REFERENCES "PendingArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleAPKXS" ADD CONSTRAINT "ArticleAPKXS_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingArticleAPKXS" ADD CONSTRAINT "PendingArticleAPKXS_pendingArticleId_fkey" FOREIGN KEY ("pendingArticleId") REFERENCES "PendingArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
