-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN', 'OWNER');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('GAME', 'PROGRAM');

-- CreateEnum
CREATE TYPE "ItemCategories" AS ENUM ('ACTION', 'CARDS', 'ARCADE', 'RPG', 'SHOOTER', 'CASUAL', 'STRATEGY', 'SPORT', 'SIMULATIONS', 'RACE', 'DESKTOP', 'LOGICAL', 'QUESTS', 'ADVENTURE', 'MUSIC', 'ROLE_PLAYING', 'PUZZLE');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
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
CREATE TABLE "ItemRating" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "ItemRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "developer" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "androidVer" TEXT NOT NULL,
    "itemType" "ItemType" NOT NULL,
    "categories" "ItemCategories" NOT NULL,
    "OBB" BOOLEAN NOT NULL DEFAULT false,
    "Script" BOOLEAN NOT NULL DEFAULT false,
    "linkAPK" TEXT NOT NULL,
    "linkOBB" TEXT,
    "linkVideo" TEXT,
    "linkScript" TEXT,
    "sizeFileAPK" TEXT NOT NULL,
    "sizeFileOBB" TEXT,
    "sizeFileScript" TEXT,
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
    "createdById" TEXT NOT NULL,
    "validatedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "validatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingItem" (
    "id" TEXT NOT NULL,
    "status" "ActionType" NOT NULL,
    "checking" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT,
    "description" TEXT,
    "image" TEXT,
    "developer" TEXT,
    "version" TEXT,
    "androidVer" TEXT,
    "itemType" "ItemType",
    "categories" "ItemCategories",
    "OBB" BOOLEAN DEFAULT false,
    "Script" BOOLEAN DEFAULT false,
    "linkAPK" TEXT,
    "linkOBB" TEXT,
    "linkVideo" TEXT,
    "linkScript" TEXT,
    "sizeFileAPK" TEXT,
    "sizeFileOBB" TEXT,
    "sizeFileScript" TEXT,
    "appScreens" TEXT[],
    "keywords" TEXT[],
    "isMod" BOOLEAN DEFAULT false,
    "typeMod" TEXT,
    "ratedFor" INTEGER,
    "installs" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "itemId" TEXT,

    CONSTRAINT "PendingItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RejectedPendingItem" (
    "id" TEXT NOT NULL,
    "pendingItemId" TEXT NOT NULL,
    "rejectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rejectedById" TEXT NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "RejectedPendingItem_pkey" PRIMARY KEY ("id")
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
CREATE INDEX "ItemRating_itemId_idx" ON "ItemRating"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemRating_itemId_ipAddress_key" ON "ItemRating"("itemId", "ipAddress");

-- CreateIndex
CREATE UNIQUE INDEX "PendingItem_itemId_key" ON "PendingItem"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "RejectedPendingItem_pendingItemId_key" ON "RejectedPendingItem"("pendingItemId");

-- AddForeignKey
ALTER TABLE "ItemRating" ADD CONSTRAINT "ItemRating_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_validatedById_fkey" FOREIGN KEY ("validatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingItem" ADD CONSTRAINT "PendingItem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingItem" ADD CONSTRAINT "PendingItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RejectedPendingItem" ADD CONSTRAINT "RejectedPendingItem_pendingItemId_fkey" FOREIGN KEY ("pendingItemId") REFERENCES "PendingItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RejectedPendingItem" ADD CONSTRAINT "RejectedPendingItem_rejectedById_fkey" FOREIGN KEY ("rejectedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
