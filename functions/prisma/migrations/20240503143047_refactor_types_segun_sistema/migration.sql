/*
  Warnings:

  - Made the column `aik_ar_alto` on table `aikon_articulo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aik_ar_ancho` on table `aikon_articulo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aik_ar_color` on table `aikon_articulo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aik_ar_descri` on table `aikon_articulo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aik_ar_descria` on table `aikon_articulo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aik_ar_memo` on table `aikon_articulo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aik_ar_mesesgarantia` on table `aikon_articulo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aik_ar_peso` on table `aikon_articulo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aik_ar_profundo` on table `aikon_articulo` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `aikon_articulo` DROP FOREIGN KEY `aikon_articulo_aik_ma_codigo_fkey`;

-- AlterTable
ALTER TABLE `aikon_articulo` MODIFY `aik_ar_alto` DOUBLE NOT NULL,
    MODIFY `aik_ar_ancho` DOUBLE NOT NULL,
    MODIFY `aik_ar_color` VARCHAR(20) NOT NULL,
    MODIFY `aik_ar_descri` VARCHAR(200) NOT NULL,
    MODIFY `aik_ar_descria` VARCHAR(200) NOT NULL,
    MODIFY `aik_ar_memo` VARCHAR(4000) NOT NULL,
    MODIFY `aik_ar_mesesgarantia` DOUBLE NOT NULL,
    MODIFY `aik_ar_peso` DOUBLE NOT NULL,
    MODIFY `aik_ar_profundo` DOUBLE NOT NULL,
    MODIFY `aik_ma_codigo` VARCHAR(3) NULL;

-- AddForeignKey
ALTER TABLE `aikon_articulo` ADD CONSTRAINT `aikon_articulo_aik_ma_codigo_fkey` FOREIGN KEY (`aik_ma_codigo`) REFERENCES `aikon_marca`(`aik_ma_codigo`) ON DELETE SET NULL ON UPDATE CASCADE;
