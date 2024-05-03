/*
  Warnings:

  - Made the column `aik_re1_codigo` on table `aikon_articulo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aik_re2_codigo` on table `aikon_articulo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aik_esa_codigo` on table `aikon_articulo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aik_fa_codigo` on table `aikon_articulo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aik_ma_codigo` on table `aikon_articulo` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `aikon_articulo` DROP FOREIGN KEY `aikon_articulo_aik_esa_codigo_fkey`;

-- DropForeignKey
ALTER TABLE `aikon_articulo` DROP FOREIGN KEY `aikon_articulo_aik_fa_codigo_fkey`;

-- DropForeignKey
ALTER TABLE `aikon_articulo` DROP FOREIGN KEY `aikon_articulo_aik_ma_codigo_fkey`;

-- AlterTable
ALTER TABLE `aikon_articulo` MODIFY `aik_re1_codigo` VARCHAR(5) NOT NULL,
    MODIFY `aik_re2_codigo` VARCHAR(5) NOT NULL,
    MODIFY `aik_esa_codigo` VARCHAR(2) NOT NULL,
    MODIFY `aik_fa_codigo` VARCHAR(20) NOT NULL,
    MODIFY `aik_ma_codigo` VARCHAR(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `aikon_articulo` ADD CONSTRAINT `aikon_articulo_aik_fa_codigo_fkey` FOREIGN KEY (`aik_fa_codigo`) REFERENCES `aikon_familia`(`aik_fa_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aikon_articulo` ADD CONSTRAINT `aikon_articulo_aik_ma_codigo_fkey` FOREIGN KEY (`aik_ma_codigo`) REFERENCES `aikon_marca`(`aik_ma_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aikon_articulo` ADD CONSTRAINT `aikon_articulo_aik_re1_codigo_fkey` FOREIGN KEY (`aik_re1_codigo`) REFERENCES `aikon_referencia01`(`aik_re1_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aikon_articulo` ADD CONSTRAINT `aikon_articulo_aik_re2_codigo_fkey` FOREIGN KEY (`aik_re2_codigo`) REFERENCES `aikon_referencia02`(`aik_re2_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aikon_articulo` ADD CONSTRAINT `aikon_articulo_aik_esa_codigo_fkey` FOREIGN KEY (`aik_esa_codigo`) REFERENCES `aikon_estado_articulo`(`aik_esa_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
