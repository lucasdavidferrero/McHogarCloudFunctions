/*
  Warnings:

  - The primary key for the `aikon_articulo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ALI_CODCOM` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `ALI_CODVEN` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `AR_ALTO` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `AR_ANCHO` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `AR_BARRAS` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `AR_CODIGO` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `AR_COLOR` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `AR_COSNET` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `AR_COSREP` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `AR_COSUCP` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `AR_DESCRI` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `AR_DESCRIA` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `AR_DESMAX` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `AR_FECHAMODIF` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `AR_MEMO` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `AR_MESESGARANTIA` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `AR_PROFUNDO` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `ESA_CODIGO` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `FA_CODIGO` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `II_CODIGO` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `MA_CODIGO` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `PR_CODIGO` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `RE1_CODIGO` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `RE2_CODIGO` on the `aikon_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `UM_CODIGO` on the `aikon_articulo` table. All the data in the column will be lost.
  - The primary key for the `aikon_estado_articulo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ESA_CODIGO` on the `aikon_estado_articulo` table. All the data in the column will be lost.
  - You are about to drop the column `ESA_DESCRI` on the `aikon_estado_articulo` table. All the data in the column will be lost.
  - The primary key for the `aikon_familia` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `FA_CODIGO` on the `aikon_familia` table. All the data in the column will be lost.
  - You are about to drop the column `FA_NIVEL` on the `aikon_familia` table. All the data in the column will be lost.
  - You are about to drop the column `FA_NOMBRE` on the `aikon_familia` table. All the data in the column will be lost.
  - You are about to drop the column `FA_PALM` on the `aikon_familia` table. All the data in the column will be lost.
  - The primary key for the `aikon_marca` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `MA_CODIGO` on the `aikon_marca` table. All the data in the column will be lost.
  - You are about to drop the column `MA_DESCRI` on the `aikon_marca` table. All the data in the column will be lost.
  - You are about to drop the column `MA_FECHAMODIF` on the `aikon_marca` table. All the data in the column will be lost.
  - You are about to drop the `aikon_art_precio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aikon_impuesto_interno` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aikon_lista_precio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aikon_unidad_medida` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `aik_ar_codigo` to the `aikon_articulo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `esa_codigo` to the `aikon_estado_articulo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fa_codigo` to the `aikon_familia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ma_codigo` to the `aikon_marca` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `aikon_art_precio` DROP FOREIGN KEY `aikon_art_precio_AR_CODIGO_fkey`;

-- DropForeignKey
ALTER TABLE `aikon_art_precio` DROP FOREIGN KEY `aikon_art_precio_LP_CODIGO_fkey`;

-- DropForeignKey
ALTER TABLE `aikon_articulo` DROP FOREIGN KEY `aikon_articulo_ESA_CODIGO_fkey`;

-- DropForeignKey
ALTER TABLE `aikon_articulo` DROP FOREIGN KEY `aikon_articulo_FA_CODIGO_fkey`;

-- DropForeignKey
ALTER TABLE `aikon_articulo` DROP FOREIGN KEY `aikon_articulo_II_CODIGO_fkey`;

-- DropForeignKey
ALTER TABLE `aikon_articulo` DROP FOREIGN KEY `aikon_articulo_MA_CODIGO_fkey`;

-- DropForeignKey
ALTER TABLE `aikon_articulo` DROP FOREIGN KEY `aikon_articulo_UM_CODIGO_fkey`;

-- AlterTable
ALTER TABLE `aikon_articulo` DROP PRIMARY KEY,
    DROP COLUMN `ALI_CODCOM`,
    DROP COLUMN `ALI_CODVEN`,
    DROP COLUMN `AR_ALTO`,
    DROP COLUMN `AR_ANCHO`,
    DROP COLUMN `AR_BARRAS`,
    DROP COLUMN `AR_CODIGO`,
    DROP COLUMN `AR_COLOR`,
    DROP COLUMN `AR_COSNET`,
    DROP COLUMN `AR_COSREP`,
    DROP COLUMN `AR_COSUCP`,
    DROP COLUMN `AR_DESCRI`,
    DROP COLUMN `AR_DESCRIA`,
    DROP COLUMN `AR_DESMAX`,
    DROP COLUMN `AR_FECHAMODIF`,
    DROP COLUMN `AR_MEMO`,
    DROP COLUMN `AR_MESESGARANTIA`,
    DROP COLUMN `AR_PROFUNDO`,
    DROP COLUMN `ESA_CODIGO`,
    DROP COLUMN `FA_CODIGO`,
    DROP COLUMN `II_CODIGO`,
    DROP COLUMN `MA_CODIGO`,
    DROP COLUMN `PR_CODIGO`,
    DROP COLUMN `RE1_CODIGO`,
    DROP COLUMN `RE2_CODIGO`,
    DROP COLUMN `UM_CODIGO`,
    ADD COLUMN `aik_ap_precio_iva` DECIMAL(15, 2) NULL,
    ADD COLUMN `aik_ap_utilidad` DECIMAL(6, 2) NULL,
    ADD COLUMN `aik_ar_alto` DOUBLE NULL,
    ADD COLUMN `aik_ar_ancho` DOUBLE NULL,
    ADD COLUMN `aik_ar_codigo` VARCHAR(24) NOT NULL,
    ADD COLUMN `aik_ar_color` VARCHAR(20) NULL,
    ADD COLUMN `aik_ar_cosnet` DECIMAL(15, 2) NULL,
    ADD COLUMN `aik_ar_descri` VARCHAR(200) NULL,
    ADD COLUMN `aik_ar_descria` VARCHAR(200) NULL,
    ADD COLUMN `aik_ar_fechamodif` DATETIME(3) NULL,
    ADD COLUMN `aik_ar_memo` VARCHAR(4000) NULL,
    ADD COLUMN `aik_ar_mesesgarantia` DOUBLE NULL,
    ADD COLUMN `aik_ar_peso` DOUBLE NULL,
    ADD COLUMN `aik_ar_profundo` DOUBLE NULL,
    ADD COLUMN `aik_impuesto_interno` DECIMAL(6, 2) NULL,
    ADD COLUMN `aik_iva_porcen` DECIMAL(6, 2) NULL,
    ADD COLUMN `aik_re1_codigo` VARCHAR(5) NULL,
    ADD COLUMN `aik_re2_codigo` VARCHAR(5) NULL,
    ADD COLUMN `aik_stock_total` SMALLINT UNSIGNED NULL,
    ADD COLUMN `esa_codigo` VARCHAR(2) NULL,
    ADD COLUMN `fa_codigo` VARCHAR(20) NULL,
    ADD COLUMN `ma_codigo` VARCHAR(3) NULL,
    ADD PRIMARY KEY (`aik_ar_codigo`);

-- AlterTable
ALTER TABLE `aikon_estado_articulo` DROP PRIMARY KEY,
    DROP COLUMN `ESA_CODIGO`,
    DROP COLUMN `ESA_DESCRI`,
    ADD COLUMN `esa_codigo` VARCHAR(2) NOT NULL,
    ADD COLUMN `esa_descri` VARCHAR(30) NULL,
    ADD PRIMARY KEY (`esa_codigo`);

-- AlterTable
ALTER TABLE `aikon_familia` DROP PRIMARY KEY,
    DROP COLUMN `FA_CODIGO`,
    DROP COLUMN `FA_NIVEL`,
    DROP COLUMN `FA_NOMBRE`,
    DROP COLUMN `FA_PALM`,
    ADD COLUMN `fa_codigo` VARCHAR(20) NOT NULL,
    ADD COLUMN `fa_nivel` VARCHAR(2) NULL,
    ADD COLUMN `fa_nombre` VARCHAR(30) NULL,
    ADD COLUMN `fa_palm` VARCHAR(1) NULL,
    ADD PRIMARY KEY (`fa_codigo`);

-- AlterTable
ALTER TABLE `aikon_marca` DROP PRIMARY KEY,
    DROP COLUMN `MA_CODIGO`,
    DROP COLUMN `MA_DESCRI`,
    DROP COLUMN `MA_FECHAMODIF`,
    ADD COLUMN `ma_codigo` VARCHAR(3) NOT NULL,
    ADD COLUMN `ma_descri` VARCHAR(30) NULL,
    ADD PRIMARY KEY (`ma_codigo`);

-- DropTable
DROP TABLE `aikon_art_precio`;

-- DropTable
DROP TABLE `aikon_impuesto_interno`;

-- DropTable
DROP TABLE `aikon_lista_precio`;

-- DropTable
DROP TABLE `aikon_unidad_medida`;

-- CreateTable
CREATE TABLE `articulo` (
    `aik_ar_codigo` VARCHAR(24) NOT NULL,
    `ar_url_img_principal` VARCHAR(400) NULL,

    PRIMARY KEY (`aik_ar_codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `articulo_precio` (
    `aik_ar_codigo` VARCHAR(24) NOT NULL,
    `arp_utilidad_web` DECIMAL(6, 2) NOT NULL,
    `arp_utilidad_ofer` DECIMAL(6, 2) NULL,
    `arp_utilidad_ofer_fecha_hasta` DATE NULL,
    `arp_utilidad_ofer_stock_hasta` SMALLINT UNSIGNED NULL,
    `arp_descuento` DECIMAL(6, 2) NOT NULL,
    `arp_descuento_fecha_hasta` DATE NULL,
    `arp_porcentaje_off` DECIMAL(6, 2) NOT NULL,

    PRIMARY KEY (`aik_ar_codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `aikon_articulo` ADD CONSTRAINT `aikon_articulo_fa_codigo_fkey` FOREIGN KEY (`fa_codigo`) REFERENCES `aikon_familia`(`fa_codigo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aikon_articulo` ADD CONSTRAINT `aikon_articulo_ma_codigo_fkey` FOREIGN KEY (`ma_codigo`) REFERENCES `aikon_marca`(`ma_codigo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aikon_articulo` ADD CONSTRAINT `aikon_articulo_esa_codigo_fkey` FOREIGN KEY (`esa_codigo`) REFERENCES `aikon_estado_articulo`(`esa_codigo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articulo` ADD CONSTRAINT `articulo_aik_ar_codigo_fkey` FOREIGN KEY (`aik_ar_codigo`) REFERENCES `aikon_articulo`(`aik_ar_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articulo_precio` ADD CONSTRAINT `articulo_precio_aik_ar_codigo_fkey` FOREIGN KEY (`aik_ar_codigo`) REFERENCES `articulo`(`aik_ar_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
