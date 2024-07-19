/*
  Warnings:

  - You are about to drop the `aikon_articulo_stock_total` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aikon_articulo_utilidad` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `aikon_articulo_stock_total` DROP FOREIGN KEY `aikon_articulo_stock_total_aik_ar_codigo_fkey`;

-- DropForeignKey
ALTER TABLE `aikon_articulo_utilidad` DROP FOREIGN KEY `aikon_articulo_utilidad_aik_ar_codigo_fkey`;

-- DropTable
DROP TABLE `aikon_articulo_stock_total`;

-- DropTable
DROP TABLE `aikon_articulo_utilidad`;

-- CreateTable
CREATE TABLE `aikon_articulo_historial_utilidad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aik_ar_codigo` VARCHAR(24) NOT NULL,
    `aik_ap_utilidad` DECIMAL(6, 2) NOT NULL,
    `hsut_fecha_hora_desde` DATETIME(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    `hsut_fecha_hora_hasta` DATETIME(2) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aikon_articulo_historial_stock_total` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aik_ar_codigo` VARCHAR(24) NOT NULL,
    `aik_stock_total` SMALLINT UNSIGNED NOT NULL,
    `hst_fecha_hora_desde` DATETIME(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    `hst_fecha_hora_hasta` DATETIME(2) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `aikon_articulo_historial_utilidad` ADD CONSTRAINT `aikon_articulo_historial_utilidad_aik_ar_codigo_fkey` FOREIGN KEY (`aik_ar_codigo`) REFERENCES `aikon_articulo`(`aik_ar_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aikon_articulo_historial_stock_total` ADD CONSTRAINT `aikon_articulo_historial_stock_total_aik_ar_codigo_fkey` FOREIGN KEY (`aik_ar_codigo`) REFERENCES `aikon_articulo`(`aik_ar_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
