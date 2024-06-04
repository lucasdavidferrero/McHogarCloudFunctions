/*
  Warnings:

  - Made the column `aik_ma_codigo` on table `aikon_articulo` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `aikon_articulo` DROP FOREIGN KEY `aikon_articulo_aik_ma_codigo_fkey`;

-- AlterTable
ALTER TABLE `aikon_articulo` MODIFY `aik_ma_codigo` VARCHAR(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `aikon_articulo` ADD CONSTRAINT `aikon_articulo_aik_ma_codigo_fkey` FOREIGN KEY (`aik_ma_codigo`) REFERENCES `aikon_marca`(`aik_ma_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
