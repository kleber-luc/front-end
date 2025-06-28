/*
  Warnings:

  - You are about to alter the column `CEP` on the `Address` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(8)`.
  - You are about to alter the column `cpf` on the `Admin` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(11)`.
  - You are about to alter the column `phone` on the `Admin` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(9)`.
  - You are about to alter the column `phone` on the `Client` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(9)`.
  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "CEP" SET DATA TYPE VARCHAR(8);

-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "cpf" SET DATA TYPE VARCHAR(11),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(9);

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "phone" SET DATA TYPE VARCHAR(9);

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_cpf_key" ON "Admin"("cpf");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
