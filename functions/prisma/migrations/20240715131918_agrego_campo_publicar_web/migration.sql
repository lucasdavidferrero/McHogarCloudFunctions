-- AlterTable
ALTER TABLE `aikon_articulo` ADD COLUMN `aik_ar_publicarweb` VARCHAR(1) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `articulo_web` ADD COLUMN `ar_publicarweb_ultima_fecha_modificado` BIGINT UNSIGNED NULL;
