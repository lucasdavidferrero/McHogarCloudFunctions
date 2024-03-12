/*
  Warnings:

  - You are about to drop the `brand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pricinghistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `productcategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `pricinghistory` DROP FOREIGN KEY `PricingHistory_productId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_brandId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_categoryId_fkey`;

-- DropTable
DROP TABLE `brand`;

-- DropTable
DROP TABLE `pricinghistory`;

-- DropTable
DROP TABLE `product`;

-- DropTable
DROP TABLE `productcategory`;

-- CreateTable
CREATE TABLE `ARTICULO` (
    `AR_CODIGO` VARCHAR(24) NOT NULL,
    `AR_DESCRI` VARCHAR(100) NULL,
    `FA_CODIGO` VARCHAR(20) NULL,
    `UM_CODIGO` VARCHAR(2) NULL,
    `AR_MEMO` VARCHAR(4000) NULL,
    `II_CODIGO` VARCHAR(2) NULL,
    `AR_BARRAS` VARCHAR(20) NULL,
    `AR_COSNET` DOUBLE NULL,
    `MA_CODIGO` VARCHAR(3) NULL,
    `RE1_CODIGO` VARCHAR(5) NULL,
    `RE2_CODIGO` VARCHAR(5) NULL,
    `ALI_CODVEN` VARCHAR(2) NULL,
    `ALI_CODCOM` VARCHAR(2) NULL,
    `ESA_CODIGO` VARCHAR(2) NULL,
    `AR_ALTO` DOUBLE NULL,
    `AR_ANCHO` DOUBLE NULL,
    `AR_PROFUNDO` DOUBLE NULL,
    `AR_COLOR` VARCHAR(20) NULL,
    `AR_DESMAX` VARCHAR(20) NULL,
    `AR_DESCRIA` VARCHAR(100) NULL,
    `AR_COSREP` DOUBLE NULL,
    `AR_COSUCP` DOUBLE NULL,
    `AR_FECHAMODIF` DATETIME(3) NULL,
    `PR_CODIGO` VARCHAR(5) NULL,
    `AR_MESESGARANTIA` DOUBLE NULL,

    PRIMARY KEY (`AR_CODIGO`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
