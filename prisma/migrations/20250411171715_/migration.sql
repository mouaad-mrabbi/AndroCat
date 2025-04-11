/*
  Warnings:

  - You are about to drop the column `search_vector` on the `Item` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Item_search_vector_idx";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "search_vector";
