/*
  Warnings:

  - You are about to drop the column `ar_esa_codigo_ultima_fecha_modificado` on the `articulo_web` table. All the data in the column will be lost.
  - You are about to drop the column `ar_publicarweb_ultima_fecha_modificado` on the `articulo_web` table. All the data in the column will be lost.
  - You are about to drop the `historial_costo_neto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `historial_costo_neto` DROP FOREIGN KEY `historial_costo_neto_aik_ar_codigo_fkey`;

-- AlterTable
ALTER TABLE `articulo_web` DROP COLUMN `ar_esa_codigo_ultima_fecha_modificado`,
    DROP COLUMN `ar_publicarweb_ultima_fecha_modificado`;

-- DropTable
DROP TABLE `historial_costo_neto`;

-- CreateTable
CREATE TABLE `aikon_articulo_historial_costo_neto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aik_ar_codigo` VARCHAR(24) NOT NULL,
    `aik_ar_cosnet` DECIMAL(15, 2) NOT NULL,
    `hscn_fecha_hora_desde` DATETIME(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    `hscn_fecha_hora_hasta` DATETIME(2) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aikon_articulo_utilidad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aik_ar_codigo` VARCHAR(24) NOT NULL,
    `aik_ap_utilidad` DECIMAL(6, 2) NOT NULL,
    `hsutil_fecha_hora_desde` DATETIME(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    `hsutil_fecha_hora_hasta` DATETIME(2) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aikon_articulo_stock_total` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aik_ar_codigo` VARCHAR(24) NOT NULL,
    `aik_stock_total` SMALLINT UNSIGNED NOT NULL,
    `hsutil_fecha_hora_desde` DATETIME(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    `hsutil_fecha_hora_hasta` DATETIME(2) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `aikon_articulo_historial_costo_neto` ADD CONSTRAINT `aikon_articulo_historial_costo_neto_aik_ar_codigo_fkey` FOREIGN KEY (`aik_ar_codigo`) REFERENCES `aikon_articulo`(`aik_ar_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
