/*
  Warnings:

  - The primary key for the `Item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ItemRating` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ItemRating` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `PendingItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `PendingItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `itemId` column on the `PendingItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `RejectedPendingItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `RejectedPendingItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `createdById` on the `Item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `validatedById` on the `Item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `itemId` on the `ItemRating` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `createdById` on the `PendingItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `pendingItemId` on the `RejectedPendingItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `rejectedById` on the `RejectedPendingItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_validatedById_fkey";

-- DropForeignKey
ALTER TABLE "ItemRating" DROP CONSTRAINT "ItemRating_itemId_fkey";

-- DropForeignKey
ALTER TABLE "PendingItem" DROP CONSTRAINT "PendingItem_createdById_fkey";

-- DropForeignKey
ALTER TABLE "PendingItem" DROP CONSTRAINT "PendingItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "RejectedPendingItem" DROP CONSTRAINT "RejectedPendingItem_pendingItemId_fkey";

-- DropForeignKey
ALTER TABLE "RejectedPendingItem" DROP CONSTRAINT "RejectedPendingItem_rejectedById_fkey";

-- AlterTable
ALTER TABLE "Item" DROP CONSTRAINT "Item_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "createdById",
ADD COLUMN     "createdById" INTEGER NOT NULL,
DROP COLUMN "validatedById",
ADD COLUMN     "validatedById" INTEGER NOT NULL,
ADD CONSTRAINT "Item_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ItemRating" DROP CONSTRAINT "ItemRating_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER NOT NULL,
ADD CONSTRAINT "ItemRating_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PendingItem" DROP CONSTRAINT "PendingItem_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "createdById",
ADD COLUMN     "createdById" INTEGER NOT NULL,
DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER,
ADD CONSTRAINT "PendingItem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "RejectedPendingItem" DROP CONSTRAINT "RejectedPendingItem_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "pendingItemId",
ADD COLUMN     "pendingItemId" INTEGER NOT NULL,
DROP COLUMN "rejectedById",
ADD COLUMN     "rejectedById" INTEGER NOT NULL,
ADD CONSTRAINT "RejectedPendingItem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

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
