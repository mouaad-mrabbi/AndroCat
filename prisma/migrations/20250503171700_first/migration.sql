-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN', 'OWNER');

-- CreateEnum
CREATE TYPE "ArticleType" AS ENUM ('GAME', 'PROGRAM');

-- CreateEnum
CREATE TYPE "GameCategories" AS ENUM ('ACTION', 'CARDS', 'ARCADE', 'RPG', 'SHOOTER', 'CASUAL', 'STRATEGY', 'SPORT', 'SIMULATIONS', 'RACE', 'DESKTOP', 'LOGICAL', 'QUESTS', 'ADVENTURE', 'MUSIC', 'ROLE_PLAYING', 'PUZZLE');

-- CreateEnum
CREATE TYPE "ProgramCategories" AS ENUM ('BUSINESS_FINANCE', 'HEALTH_SPORT', 'INTERNET', 'SOCIAL', 'MUSIC_VIDEO', 'PERSONALIZATION', 'EDUCATION', 'OFFICE', 'WEATHER', 'TRAVEL', 'CAMERA', 'PHOTOGRAPHY', 'FILE_MANAGERS', 'TRANSLATORS', 'LINK', 'TOOLS');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "country" TEXT,
    "profile" TEXT NOT NULL DEFAULT '/images/default-profile.png',
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "resetPasswordToken" TEXT,
    "resetPasswordExpires" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "developer" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "versionOriginal" TEXT,
    "androidVer" TEXT NOT NULL,
    "articleType" "ArticleType" NOT NULL,
    "gameCategory" "GameCategories",
    "programCategory" "ProgramCategories",
    "OBB" BOOLEAN NOT NULL DEFAULT false,
    "Script" BOOLEAN NOT NULL DEFAULT false,
    "OriginalAPK" BOOLEAN NOT NULL DEFAULT false,
    "linkAPK" TEXT NOT NULL,
    "linkOBB" TEXT,
    "linkVideo" TEXT,
    "linkScript" TEXT,
    "linkOriginalAPK" TEXT,
    "sizeFileAPK" TEXT NOT NULL,
    "sizeFileOBB" TEXT,
    "sizeFileScript" TEXT,
    "sizeFileOriginalAPK" TEXT,
    "appScreens" TEXT[],
    "keywords" TEXT[],
    "isMod" BOOLEAN NOT NULL DEFAULT false,
    "typeMod" TEXT,
    "ratedFor" INTEGER NOT NULL,
    "installs" TEXT NOT NULL,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "views" INTEGER DEFAULT 0,
    "downloadCount" INTEGER DEFAULT 0,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdById" INTEGER NOT NULL,
    "validatedById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "validatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleRating" (
    "id" SERIAL NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "articleId" INTEGER NOT NULL,

    CONSTRAINT "ArticleRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingArticle" (
    "id" SERIAL NOT NULL,
    "status" "ActionType" NOT NULL,
    "checking" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "developer" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "versionOriginal" TEXT,
    "androidVer" TEXT NOT NULL,
    "articleType" "ArticleType" NOT NULL,
    "gameCategory" "GameCategories",
    "programCategory" "ProgramCategories",
    "OBB" BOOLEAN NOT NULL DEFAULT false,
    "Script" BOOLEAN NOT NULL DEFAULT false,
    "OriginalAPK" BOOLEAN NOT NULL DEFAULT false,
    "linkAPK" TEXT NOT NULL,
    "linkOBB" TEXT,
    "linkVideo" TEXT,
    "linkScript" TEXT,
    "linkOriginalAPK" TEXT,
    "sizeFileAPK" TEXT NOT NULL,
    "sizeFileOBB" TEXT,
    "sizeFileScript" TEXT,
    "sizeFileOriginalAPK" TEXT,
    "appScreens" TEXT[],
    "keywords" TEXT[],
    "isMod" BOOLEAN NOT NULL DEFAULT false,
    "typeMod" TEXT,
    "ratedFor" INTEGER NOT NULL,
    "installs" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "articleId" INTEGER,

    CONSTRAINT "PendingArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RejectedPendingArticle" (
    "id" SERIAL NOT NULL,
    "pendingArticleId" INTEGER NOT NULL,
    "rejectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rejectedById" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "RejectedPendingArticle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_verificationToken_key" ON "User"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetPasswordToken_key" ON "User"("resetPasswordToken");

-- CreateIndex
CREATE INDEX "ArticleRating_articleId_idx" ON "ArticleRating"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleRating_articleId_ipAddress_key" ON "ArticleRating"("articleId", "ipAddress");

-- CreateIndex
CREATE UNIQUE INDEX "PendingArticle_articleId_key" ON "PendingArticle"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "RejectedPendingArticle_pendingArticleId_key" ON "RejectedPendingArticle"("pendingArticleId");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_validatedById_fkey" FOREIGN KEY ("validatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleRating" ADD CONSTRAINT "ArticleRating_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingArticle" ADD CONSTRAINT "PendingArticle_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingArticle" ADD CONSTRAINT "PendingArticle_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RejectedPendingArticle" ADD CONSTRAINT "RejectedPendingArticle_pendingArticleId_fkey" FOREIGN KEY ("pendingArticleId") REFERENCES "PendingArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RejectedPendingArticle" ADD CONSTRAINT "RejectedPendingArticle_rejectedById_fkey" FOREIGN KEY ("rejectedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
