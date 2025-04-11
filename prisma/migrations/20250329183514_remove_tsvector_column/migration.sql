-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "search_vector" TEXT;

-- CreateIndex
CREATE INDEX "Item_search_vector_idx" ON "Item"("search_vector");
