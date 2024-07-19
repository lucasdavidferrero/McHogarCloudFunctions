-- AddForeignKey
ALTER TABLE `aikon_articulo_utilidad` ADD CONSTRAINT `aikon_articulo_utilidad_aik_ar_codigo_fkey` FOREIGN KEY (`aik_ar_codigo`) REFERENCES `aikon_articulo`(`aik_ar_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aikon_articulo_stock_total` ADD CONSTRAINT `aikon_articulo_stock_total_aik_ar_codigo_fkey` FOREIGN KEY (`aik_ar_codigo`) REFERENCES `aikon_articulo`(`aik_ar_codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
