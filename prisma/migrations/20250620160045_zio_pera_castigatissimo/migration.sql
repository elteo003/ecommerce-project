/*
  Warnings:

  - The primary key for the `products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `productId` on the `cart_items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `productId` on the `order_items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_productId_fkey";

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "productId",
ADD COLUMN     "productId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "productId",
ADD COLUMN     "productId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP CONSTRAINT "products_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_userId_productId_key" ON "cart_items"("userId", "productId");

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
