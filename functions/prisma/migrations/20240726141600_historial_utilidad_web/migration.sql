/*
  Warnings:

  - You are about to drop the column `hscn_fecha_hora_desde` on the `aikon_articulo_historial_costo_neto` table. All the data in the column will be lost.
  - You are about to drop the column `hscn_fecha_hora_hasta` on the `aikon_articulo_historial_costo_neto` table. All the data in the column will be lost.
  - You are about to drop the column `hst_fecha_hora_desde` on the `aikon_articulo_historial_stock_total` table. All the data in the column will be lost.
  - You are about to drop the column `hst_fecha_hora_hasta` on the `aikon_articulo_historial_stock_total` table. All the data in the column will be lost.
  - You are about to drop the column `hsut_fecha_hora_desde` on the `aikon_articulo_historial_utilidad` table. All the data in the column will be lost.
  - You are about to drop the column `hsut_fecha_hora_hasta` on the `aikon_articulo_historial_utilidad` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `aikon_articulo_historial_costo_neto` DROP COLUMN `hscn_fecha_hora_desde`,
    DROP COLUMN `hscn_fecha_hora_hasta`,
    ADD COLUMN `fecha_hora_desde` DATETIME(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    ADD COLUMN `fecha_hora_hasta` DATETIME(2) NULL;

-- AlterTable
ALTER TABLE `aikon_articulo_historial_stock_total` DROP COLUMN `hst_fecha_hora_desde`,
    DROP COLUMN `hst_fecha_hora_hasta`,
    ADD COLUMN `fecha_hora_desde` DATETIME(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    ADD COLUMN `fecha_hora_hasta` DATETIME(2) NULL;

-- AlterTable
ALTER TABLE `aikon_articulo_historial_utilidad` DROP COLUMN `hsut_fecha_hora_desde`,
    DROP COLUMN `hsut_fecha_hora_hasta`,
    ADD COLUMN `fecha_hora_desde` DATETIME(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    ADD COLUMN `fecha_hora_hasta` DATETIME(2) NULL;

-- CreateTable
CREATE TABLE `articulo_precio_arp_utilidad_web` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aik_ar_codigo` VARCHAR(24) NOT NULL,
    `arp_utilidad_web` DECIMAL(6, 2) NOT NULL,
    `fecha_hora_desde` DATETIME(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    `fecha_hora_hasta` DATETIME(2) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `articulo_precio_arp_utilidad_web` ADD CONSTRAINT `articulo_precio_arp_utilidad_web_aik_ar_codigo_fkey` FOREIGN KEY (`aik_ar_codigo`) REFERENCES `articulo_precio`(`aik_ar_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
