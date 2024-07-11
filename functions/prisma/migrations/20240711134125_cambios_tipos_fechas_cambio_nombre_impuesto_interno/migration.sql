/*
  Warnings:

  - You are about to drop the column `aik_impuesto_interno` on the `aikon_articulo` table. All the data in the column will be lost.
  - Added the required column `aik_ap_impuesto_interno` to the `aikon_articulo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `aikon_articulo`
    ADD COLUMN `aik_ap_impuesto_interno` DECIMAL(6, 2) NOT NULL,
    ADD COLUMN `aik_ar_fecha_alta` BIGINT UNSIGNED NULL,
    MODIFY `aik_ar_fechamodif` BIGINT UNSIGNED NULL;

UPDATE `aikon_articulo`
SET aik_ap_impuesto_interno = aik_impuesto_interno;

ALTER TABLE `aikon_articulo` DROP COLUMN `aik_impuesto_interno`;

-- AlterTable
ALTER TABLE `articulo_web` ADD COLUMN `ar_esa_codigo_ultima_fecha_modificado` BIGINT UNSIGNED NULL;
