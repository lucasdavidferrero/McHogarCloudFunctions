/*
  Warnings:

  - You are about to drop the column `AR_CODIGO` on the `familia` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[FA_CODIGO]` on the table `ARTICULO` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `FA_CODIGO` to the `ARTICULO` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `familia` DROP FOREIGN KEY `FAMILIA_AR_CODIGO_fkey`;

-- AlterTable
ALTER TABLE `articulo` ADD COLUMN `FA_CODIGO` VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE `familia` DROP COLUMN `AR_CODIGO`;

-- CreateIndex
CREATE UNIQUE INDEX `ARTICULO_FA_CODIGO_key` ON `ARTICULO`(`FA_CODIGO`);

-- AddForeignKey
ALTER TABLE `ARTICULO` ADD CONSTRAINT `ARTICULO_FA_CODIGO_fkey` FOREIGN KEY (`FA_CODIGO`) REFERENCES `FAMILIA`(`FA_CODIGO`) ON DELETE RESTRICT ON UPDATE CASCADE;
