/*
  Warnings:

  - Made the column `aik_ap_precio_iva` on table `aikon_articulo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aik_ap_utilidad` on table `aikon_articulo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aik_ar_cosnet` on table `aikon_articulo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aik_impuesto_interno` on table `aikon_articulo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aik_iva_porcen` on table `aikon_articulo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aik_stock_total` on table `aikon_articulo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `aikon_articulo` MODIFY `aik_ap_precio_iva` DECIMAL(15, 2) NOT NULL,
    MODIFY `aik_ap_utilidad` DECIMAL(6, 2) NOT NULL,
    MODIFY `aik_ar_cosnet` DECIMAL(15, 2) NOT NULL,
    MODIFY `aik_impuesto_interno` DECIMAL(6, 2) NOT NULL,
    MODIFY `aik_iva_porcen` DECIMAL(6, 2) NOT NULL,
    MODIFY `aik_stock_total` SMALLINT UNSIGNED NOT NULL;
