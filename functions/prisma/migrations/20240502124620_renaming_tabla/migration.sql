/*
  Warnings:

  - You are about to drop the `articulo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `articulo` DROP FOREIGN KEY `articulo_aik_ar_codigo_fkey`;

-- DropTable
DROP TABLE `articulo`;

-- CreateTable
CREATE TABLE `articulo_web` (
    `aik_ar_codigo` VARCHAR(24) NOT NULL,
    `ar_url_img_principal` VARCHAR(400) NULL,

    PRIMARY KEY (`aik_ar_codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `articulo_web` ADD CONSTRAINT `articulo_web_aik_ar_codigo_fkey` FOREIGN KEY (`aik_ar_codigo`) REFERENCES `aikon_articulo`(`aik_ar_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
