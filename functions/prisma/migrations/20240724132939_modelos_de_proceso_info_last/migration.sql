/*
  Warnings:

  - The primary key for the `aikon_marca` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `marca_extension` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `aikon_articulo` DROP FOREIGN KEY `aikon_articulo_aik_ma_codigo_fkey`;

-- DropForeignKey
ALTER TABLE `marca_extension` DROP FOREIGN KEY `marca_extension_aik_ma_codigo_fkey`;

-- AlterTable
ALTER TABLE `aikon_articulo` MODIFY `aik_ma_codigo` VARCHAR(4) NOT NULL;

-- AlterTable
ALTER TABLE `aikon_marca` DROP PRIMARY KEY,
    MODIFY `aik_ma_codigo` VARCHAR(4) NOT NULL,
    ADD PRIMARY KEY (`aik_ma_codigo`);

-- AlterTable
ALTER TABLE `marca_extension` DROP PRIMARY KEY,
    MODIFY `aik_ma_codigo` VARCHAR(4) NOT NULL,
    ADD PRIMARY KEY (`aik_ma_codigo`);

-- CreateTable
CREATE TABLE `tipo_proceso_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `descripcion` VARCHAR(255) NULL,

    UNIQUE INDEX `tipo_proceso_info_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proceso_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha_hora_inicio` DATETIME(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    `fecha_hora_fin` DATETIME(2) NULL,
    `estado_ejecucion` VARCHAR(100) NOT NULL,
    `id_usuario` INTEGER NULL,
    `tiempo_ejecucion` INTEGER NULL,
    `error` BOOLEAN NOT NULL DEFAULT false,
    `mensaje_error` VARCHAR(10000) NULL,
    `id_tipo_proceso_info` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proceso_info_detalle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_paso` VARCHAR(255) NOT NULL,
    `estado_ejecucion` VARCHAR(100) NOT NULL,
    `tiempo_ejecucion` INTEGER NULL,
    `error` BOOLEAN NOT NULL DEFAULT false,
    `mensaje_error` VARCHAR(10000) NULL,
    `id_proceso_info` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `marca_extension` ADD CONSTRAINT `marca_extension_aik_ma_codigo_fkey` FOREIGN KEY (`aik_ma_codigo`) REFERENCES `aikon_marca`(`aik_ma_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aikon_articulo` ADD CONSTRAINT `aikon_articulo_aik_ma_codigo_fkey` FOREIGN KEY (`aik_ma_codigo`) REFERENCES `aikon_marca`(`aik_ma_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proceso_info` ADD CONSTRAINT `proceso_info_id_tipo_proceso_info_fkey` FOREIGN KEY (`id_tipo_proceso_info`) REFERENCES `tipo_proceso_info`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proceso_info_detalle` ADD CONSTRAINT `proceso_info_detalle_id_proceso_info_fkey` FOREIGN KEY (`id_proceso_info`) REFERENCES `proceso_info`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
