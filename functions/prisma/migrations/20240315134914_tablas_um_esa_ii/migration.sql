-- DropForeignKey
ALTER TABLE `aikon_articulo` DROP FOREIGN KEY `AIKON_ARTICULO_FA_CODIGO_fkey`;

-- DropForeignKey
ALTER TABLE `aikon_articulo` DROP FOREIGN KEY `AIKON_ARTICULO_MA_CODIGO_fkey`;

-- CreateTable
CREATE TABLE `aikon_estado_articulo` (
    `ESA_CODIGO` VARCHAR(2) NOT NULL,
    `ESA_DESCRI` VARCHAR(30) NULL,

    PRIMARY KEY (`ESA_CODIGO`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aikon_unidad_medida` (
    `UM_CODIGO` VARCHAR(2) NOT NULL,
    `UM_DESCRI` VARCHAR(30) NULL,

    PRIMARY KEY (`UM_CODIGO`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aikon_impuesto_interno` (
    `II_CODIGO` VARCHAR(2) NOT NULL,
    `II_DESCRI` VARCHAR(40) NULL,
    `II_PORCEN` DECIMAL(6, 2) NULL,
    `II_TIPO` VARCHAR(1) NULL,
    `PL_CODINT` VARCHAR(4) NULL,

    PRIMARY KEY (`II_CODIGO`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `aikon_articulo` ADD CONSTRAINT `aikon_articulo_FA_CODIGO_fkey` FOREIGN KEY (`FA_CODIGO`) REFERENCES `aikon_familia`(`FA_CODIGO`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aikon_articulo` ADD CONSTRAINT `aikon_articulo_MA_CODIGO_fkey` FOREIGN KEY (`MA_CODIGO`) REFERENCES `aikon_marca`(`MA_CODIGO`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aikon_articulo` ADD CONSTRAINT `aikon_articulo_ESA_CODIGO_fkey` FOREIGN KEY (`ESA_CODIGO`) REFERENCES `aikon_estado_articulo`(`ESA_CODIGO`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aikon_articulo` ADD CONSTRAINT `aikon_articulo_UM_CODIGO_fkey` FOREIGN KEY (`UM_CODIGO`) REFERENCES `aikon_unidad_medida`(`UM_CODIGO`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aikon_articulo` ADD CONSTRAINT `aikon_articulo_II_CODIGO_fkey` FOREIGN KEY (`II_CODIGO`) REFERENCES `aikon_impuesto_interno`(`II_CODIGO`) ON DELETE SET NULL ON UPDATE CASCADE;
