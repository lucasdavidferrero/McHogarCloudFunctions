/* 
  Este script debe ejecutarse después de haber creado la base de datos.
  Los triggers se utilizan en conjunto con la sincronización, por ende, deben de estar creados antes de ejecutar los procesos de sincronización.
*/
/* Triggers for Mc Hogar */
DROP TRIGGER IF EXISTS `prisma-api`.`aikon_articulo_AFTER_INSERT`;
DROP TRIGGER IF EXISTS `prisma-api`.`aikon_articulo_AFTER_UPDATE`;
DROP TRIGGER IF EXISTS `prisma-api`.`aikon_marca_AFTER_INSERT`;

/* Artículos */
DELIMITER $$
CREATE TRIGGER `prisma-api`.`aikon_articulo_AFTER_INSERT`
AFTER INSERT
ON aikon_articulo FOR EACH ROW
BEGIN
	INSERT INTO articulo_precio(aik_ar_codigo, arp_utilidad_web)
    VALUES(NEW.aik_ar_codigo, NEW.aik_ap_utilidad);
    
    INSERT INTO articulo_web(aik_ar_codigo, ar_descripcion_web)
    VALUES(NEW.aik_ar_codigo, NEW.aik_ar_descri);
    
    -- Primer row en cada tabla de historiales.
    INSERT INTO aikon_articulo_historial_costo_neto(aik_ar_codigo, aik_ar_cosnet)
    VALUES(NEW.aik_ar_codigo, NEW.aik_ar_cosnet);
    INSERT INTO aikon_articulo_historial_stock_total(aik_ar_codigo, aik_stock_total)
    VALUES(NEW.aik_ar_codigo, NEW.aik_stock_total);
    INSERT INTO aikon_articulo_historial_utilidad(aik_ar_codigo, aik_ap_utilidad)
    VALUES(NEW.aik_ar_codigo, NEW.aik_ap_utilidad);
    
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `prisma-api`.`aikon_articulo_AFTER_UPDATE`
AFTER UPDATE
ON aikon_articulo FOR EACH ROW
BEGIN
	/* Tablas Historiales */
	IF(OLD.aik_ar_cosnet != NEW.aik_ar_cosnet) THEN
		-- Le pongo fechaFin al último row (el que no tiene fecha_hora_hasta)
		UPDATE aikon_articulo_historial_costo_neto 
        SET hscn_fecha_hora_hasta = NOW() 
        WHERE hscn_fecha_hora_hasta IS NULL;
        
		INSERT INTO aikon_articulo_historial_costo_neto(aik_ar_codigo, aik_ar_cosnet)
		VALUES(NEW.aik_ar_codigo, NEW.aik_ar_cosnet);
    END IF;
    
    IF(OLD.aik_stock_total != NEW.aik_stock_total) THEN
		-- Le pongo fechaFin al último row (el que no tiene fecha_hora_hasta)
		UPDATE aikon_articulo_historial_stock_total 
        SET hst_fecha_hora_hasta = NOW() 
        WHERE hst_fecha_hora_hasta IS NULL;
        
		INSERT INTO aikon_articulo_historial_stock_total(aik_ar_codigo, aik_stock_total)
		VALUES(NEW.aik_ar_codigo, NEW.aik_stock_total);
    END IF;
    
    IF(OLD.aik_ap_utilidad != NEW.aik_ap_utilidad) THEN
		-- Le pongo fechaFin al último row (el que no tiene fecha_hora_hasta)
		UPDATE aikon_articulo_historial_utilidad 
        SET hsut_fecha_hora_hasta = NOW() 
        WHERE hsut_fecha_hora_hasta IS NULL;
        
		INSERT INTO aikon_articulo_historial_utilidad(aik_ar_codigo, aik_ap_utilidad)
		VALUES(NEW.aik_ar_codigo, NEW.aik_ap_utilidad);
    END IF;
    /* Fin Tablas Historiales */
    
    /* Publicarweb ultíma fecha modificado TODO: VER */
    IF (OLD.aik_ar_publicarweb != NEW.aik_ar_publicarweb) THEN
		UPDATE articulo_web
        SET ar_publicarweb_ultima_fecha_modificado = NOW()
        WHERE aik_ar_codigo = OLD.aik_ar_codigo;
    END IF;
    
    /* ESA_CODIGO ultíma fecha modificado TODO: VER */
    IF(OLD.aik_esa_codigo != NEW.aik_esa_codigo) THEN
		UPDATE articulo_web
        SET ar_esa_codigo_ultima_fecha_modificado = NOW()
        WHERE aik_ar_codigo = OLD.aik_ar_codigo;
    END IF;
END$$
DELIMITER ;
/* FIN Articulos */

/* MARCAS */
DELIMITER $$
CREATE TRIGGER `prisma-api`.`aikon_marca_AFTER_INSERT`
AFTER INSERT
ON aikon_marca FOR EACH ROW
BEGIN
	INSERT INTO marca_extension(aik_ma_codigo)
    VALUES(NEW.aik_ma_codigo);
END$$
DELIMITER ;