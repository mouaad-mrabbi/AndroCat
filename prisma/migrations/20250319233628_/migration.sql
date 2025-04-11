/*
  Warnings:

  - Made the column `title` on table `PendingItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `PendingItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `PendingItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `developer` on table `PendingItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `version` on table `PendingItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `androidVer` on table `PendingItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `itemType` on table `PendingItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `categories` on table `PendingItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `OBB` on table `PendingItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Script` on table `PendingItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `linkAPK` on table `PendingItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sizeFileAPK` on table `PendingItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isMod` on table `PendingItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ratedFor` on table `PendingItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `installs` on table `PendingItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PendingItem" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "developer" SET NOT NULL,
ALTER COLUMN "version" SET NOT NULL,
ALTER COLUMN "androidVer" SET NOT NULL,
ALTER COLUMN "itemType" SET NOT NULL,
ALTER COLUMN "categories" SET NOT NULL,
ALTER COLUMN "OBB" SET NOT NULL,
ALTER COLUMN "Script" SET NOT NULL,
ALTER COLUMN "linkAPK" SET NOT NULL,
ALTER COLUMN "sizeFileAPK" SET NOT NULL,
ALTER COLUMN "isMod" SET NOT NULL,
ALTER COLUMN "ratedFor" SET NOT NULL,
ALTER COLUMN "installs" SET NOT NULL;
