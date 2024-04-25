/*
  Warnings:

  - You are about to drop the column `esa_codigo` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `fa_codigo` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `ma_codigo` on the `aikon_articulo` table. All the data in the column will be lost.
  - The primary key for the `aikon_estado_articulo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `esa_codigo` on the `aikon_estado_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `esa_descri` on the `aikon_estado_articulo` table. All the data in the column will be lost.
  - The primary key for the `aikon_familia` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fa_codigo` on the `aikon_familia` table. All the data in the column will be lost.
  - You are about to drop the column `fa_nivel` on the `aikon_familia` table. All the data in the column will be lost.
  - You are about to drop the column `fa_nombre` on the `aikon_familia` table. All the data in the column will be lost.
  - You are about to drop the column `fa_palm` on the `aikon_familia` table. All the data in the column will be lost.
  - The primary key for the `aikon_marca` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ma_codigo` on the `aikon_marca` table. All the data in the column will be lost.
  - You are about to drop the column `ma_descri` on the `aikon_marca` table. All the data in the column will be lost.
  - Added the required column `aik_esa_codigo` to the `aikon_estado_articulo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aik_fa_codigo` to the `aikon_familia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aik_ma_codigo` to the `aikon_marca` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `aikon_articulo` DROP FOREIGN KEY `aikon_articulo_esa_codigo_fkey`;

-- DropForeignKey
ALTER TABLE `aikon_articulo` DROP FOREIGN KEY `aikon_articulo_fa_codigo_fkey`;

-- DropForeignKey
ALTER TABLE `aikon_articulo` DROP FOREIGN KEY `aikon_articulo_ma_codigo_fkey`;

-- AlterTable
ALTER TABLE `aikon_articulo` DROP COLUMN `esa_codigo`,
    DROP COLUMN `fa_codigo`,
    DROP COLUMN `ma_codigo`,
    ADD COLUMN `aik_esa_codigo` VARCHAR(2) NULL,
    ADD COLUMN `aik_fa_codigo` VARCHAR(20) NULL,
    ADD COLUMN `aik_ma_codigo` VARCHAR(3) NULL;

-- AlterTable
ALTER TABLE `aikon_estado_articulo` DROP PRIMARY KEY,
    DROP COLUMN `esa_codigo`,
    DROP COLUMN `esa_descri`,
    ADD COLUMN `aik_esa_codigo` VARCHAR(2) NOT NULL,
    ADD COLUMN `aik_esa_descri` VARCHAR(30) NULL,
    ADD PRIMARY KEY (`aik_esa_codigo`);

-- AlterTable
ALTER TABLE `aikon_familia` DROP PRIMARY KEY,
    DROP COLUMN `fa_codigo`,
    DROP COLUMN `fa_nivel`,
    DROP COLUMN `fa_nombre`,
    DROP COLUMN `fa_palm`,
    ADD COLUMN `aik_fa_codigo` VARCHAR(20) NOT NULL,
    ADD COLUMN `aik_fa_nivel` VARCHAR(2) NULL,
    ADD COLUMN `aik_fa_nombre` VARCHAR(30) NULL,
    ADD COLUMN `aik_fa_palm` VARCHAR(1) NULL,
    ADD PRIMARY KEY (`aik_fa_codigo`);

-- AlterTable
ALTER TABLE `aikon_marca` DROP PRIMARY KEY,
    DROP COLUMN `ma_codigo`,
    DROP COLUMN `ma_descri`,
    ADD COLUMN `aik_ma_codigo` VARCHAR(3) NOT NULL,
    ADD COLUMN `aik_ma_descri` VARCHAR(30) NULL,
    ADD PRIMARY KEY (`aik_ma_codigo`);

-- AlterTable
ALTER TABLE `articulo_precio` MODIFY `arp_descuento` DECIMAL(6, 2) NULL,
    MODIFY `arp_porcentaje_off` DECIMAL(6, 2) NULL;

-- CreateTable
CREATE TABLE `marca_extension` (
    `aik_ma_codigo` VARCHAR(3) NOT NULL,
    `maext_url_imagen` VARCHAR(400) NULL,

    PRIMARY KEY (`aik_ma_codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aikon_referencia01` (
    `aik_re1_codigo` VARCHAR(5) NOT NULL,
    `aik_re1_descri` VARCHAR(30) NOT NULL,

    PRIMARY KEY (`aik_re1_codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aikon_referencia02` (
    `aik_re2_codigo` VARCHAR(5) NOT NULL,
    `aik_re2_descri` VARCHAR(30) NOT NULL,

    PRIMARY KEY (`aik_re2_codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoria_rubro` (
    `catrub_id` INTEGER NOT NULL AUTO_INCREMENT,
    `aik_re1_codigo` VARCHAR(5) NOT NULL,
    `aik_re2_codigo` VARCHAR(5) NOT NULL,

    UNIQUE INDEX `categoria_rubro_aik_re2_codigo_key`(`aik_re2_codigo`),
    PRIMARY KEY (`catrub_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rubro_familia` (
    `rubfa_id` INTEGER NOT NULL AUTO_INCREMENT,
    `aik_fa_codigo` VARCHAR(20) NOT NULL,
    `aik_re2_codigo` VARCHAR(5) NOT NULL,

    UNIQUE INDEX `rubro_familia_aik_fa_codigo_key`(`aik_fa_codigo`),
    PRIMARY KEY (`rubfa_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historial_costo_neto` (
    `hscn_id` INTEGER NOT NULL AUTO_INCREMENT,
    `aik_ar_codigo` VARCHAR(24) NOT NULL,
    `aik_ar_cosnet` DECIMAL(15, 2) NOT NULL,
    `hscn_fecha_hora_desde` DATETIME(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    `hscn_fecha_hora_hasta` DATETIME(2) NULL,

    PRIMARY KEY (`hscn_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `marca_extension` ADD CONSTRAINT `marca_extension_aik_ma_codigo_fkey` FOREIGN KEY (`aik_ma_codigo`) REFERENCES `aikon_marca`(`aik_ma_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categoria_rubro` ADD CONSTRAINT `categoria_rubro_aik_re1_codigo_fkey` FOREIGN KEY (`aik_re1_codigo`) REFERENCES `aikon_referencia01`(`aik_re1_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categoria_rubro` ADD CONSTRAINT `categoria_rubro_aik_re2_codigo_fkey` FOREIGN KEY (`aik_re2_codigo`) REFERENCES `aikon_referencia02`(`aik_re2_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rubro_familia` ADD CONSTRAINT `rubro_familia_aik_fa_codigo_fkey` FOREIGN KEY (`aik_fa_codigo`) REFERENCES `aikon_familia`(`aik_fa_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rubro_familia` ADD CONSTRAINT `rubro_familia_aik_re2_codigo_fkey` FOREIGN KEY (`aik_re2_codigo`) REFERENCES `aikon_referencia02`(`aik_re2_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aikon_articulo` ADD CONSTRAINT `aikon_articulo_aik_fa_codigo_fkey` FOREIGN KEY (`aik_fa_codigo`) REFERENCES `aikon_familia`(`aik_fa_codigo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aikon_articulo` ADD CONSTRAINT `aikon_articulo_aik_ma_codigo_fkey` FOREIGN KEY (`aik_ma_codigo`) REFERENCES `aikon_marca`(`aik_ma_codigo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aikon_articulo` ADD CONSTRAINT `aikon_articulo_aik_esa_codigo_fkey` FOREIGN KEY (`aik_esa_codigo`) REFERENCES `aikon_estado_articulo`(`aik_esa_codigo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_costo_neto` ADD CONSTRAINT `historial_costo_neto_aik_ar_codigo_fkey` FOREIGN KEY (`aik_ar_codigo`) REFERENCES `aikon_articulo`(`aik_ar_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
