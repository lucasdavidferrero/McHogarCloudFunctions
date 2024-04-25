-- DropForeignKey
ALTER TABLE `articulo_precio` DROP FOREIGN KEY `articulo_precio_aik_ar_codigo_fkey`;

-- AddForeignKey
ALTER TABLE `articulo_precio` ADD CONSTRAINT `articulo_precio_aik_ar_codigo_fkey` FOREIGN KEY (`aik_ar_codigo`) REFERENCES `aikon_articulo`(`aik_ar_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
