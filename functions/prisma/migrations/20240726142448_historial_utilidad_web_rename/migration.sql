/*
  Warnings:

  - You are about to drop the `articulo_precio_arp_utilidad_web` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `articulo_precio_arp_utilidad_web` DROP FOREIGN KEY `articulo_precio_arp_utilidad_web_aik_ar_codigo_fkey`;

-- DropTable
DROP TABLE `articulo_precio_arp_utilidad_web`;

-- CreateTable
CREATE TABLE `articulo_precio_historial_arp_utilidad_web` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aik_ar_codigo` VARCHAR(24) NOT NULL,
    `arp_utilidad_web` DECIMAL(6, 2) NOT NULL,
    `fecha_hora_desde` DATETIME(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    `fecha_hora_hasta` DATETIME(2) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `articulo_precio_historial_arp_utilidad_web` ADD CONSTRAINT `articulo_precio_historial_arp_utilidad_web_aik_ar_codigo_fkey` FOREIGN KEY (`aik_ar_codigo`) REFERENCES `articulo_precio`(`aik_ar_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
