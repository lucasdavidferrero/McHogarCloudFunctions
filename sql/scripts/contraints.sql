/* Store Procedure para utilizar a la hora de eliminar check constraints. */
DROP PROCEDURE IF EXISTS DropCheckConstraintIfExists;
DELIMITER //
CREATE PROCEDURE DropCheckConstraintIfExists(
    IN tableName VARCHAR(64),
    IN constraintName VARCHAR(64)
)
BEGIN
    DECLARE constraintExists INT;

    -- Check if the constraint exists
    SELECT COUNT(*)
    INTO constraintExists
    FROM information_schema.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = tableName
      AND CONSTRAINT_NAME = constraintName;

    -- If the constraint exists, drop it
    IF constraintExists > 0 THEN
        SET @dropStmt = CONCAT('ALTER TABLE ', tableName, ' DROP CONSTRAINT ', constraintName);
        PREPARE stmt FROM @dropStmt;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END //
DELIMITER ;

/* Eliminamos check constraint (si existen) */
CALL DropCheckConstraintIfExists('articulo_precio', 'articulo_precio_CHECK_ARP_UTILIDAD_WEB');
CALL DropCheckConstraintIfExists('articulo_precio', 'articulo_precio_CHECK_ARP_UTILIDAD_OFER');
CALL DropCheckConstraintIfExists('articulo_precio', 'articulo_precio_CHECK_ARP_UTILIDAD_OFER_FECHA_HASTA');
CALL DropCheckConstraintIfExists('articulo_precio', 'articulo_precio_CHECK_ARP_UTILIDAD_OFER_STOCK_HASTA');
CALL DropCheckConstraintIfExists('articulo_precio', 'articulo_precio_CHECK_ARP_DESCUENTO');
CALL DropCheckConstraintIfExists('proceso_info', 'proceso_info_CHECK_ESTADO_EJECUCION');
CALL DropCheckConstraintIfExists('proceso_info_detalle', 'proceso_info_detalle_CHECK_ESTADO_EJECUCION');

/* Creamos los CHECK CONSTRAINT. Estas reflejan reglas de negocio. */

/* CHECK CONSTRAINT para articulos */
ALTER TABLE articulo_precio
ADD CONSTRAINT `articulo_precio_CHECK_ARP_UTILIDAD_WEB`
	CHECK (arp_utilidad_web >= 0),
ADD CONSTRAINT `articulo_precio_CHECK_ARP_UTILIDAD_OFER`
	CHECK ( ((arp_utilidad_ofer >= 0) AND (arp_utilidad_ofer_fecha_hasta IS NOT NULL)) OR arp_utilidad_ofer IS NULL),
ADD CONSTRAINT `articulo_precio_CHECK_ARP_UTILIDAD_OFER_FECHA_HASTA`
	CHECK((arp_utilidad_ofer_fecha_hasta IS NOT NULL AND arp_utilidad_ofer IS NOT NULL) OR (arp_utilidad_ofer_fecha_hasta IS NULL AND arp_utilidad_ofer IS NULL)),
ADD CONSTRAINT `articulo_precio_CHECK_ARP_UTILIDAD_OFER_STOCK_HASTA`
	CHECK((arp_utilidad_ofer_stock_hasta IS NOT NULL AND arp_utilidad_ofer IS NOT NULL) OR arp_utilidad_ofer_stock_hasta IS NULL),
ADD CONSTRAINT `articulo_precio_CHECK_ARP_DESCUENTO`
	CHECK(arp_descuento > 0);

/* CHECK CONSTRAINT para tablas de procesos. */
ALTER TABLE proceso_info
ADD CONSTRAINT `proceso_info_CHECK_ESTADO_EJECUCION`
	CHECK (estado_ejecucion IN ('Procesando', 'Finalizado'));

ALTER TABLE proceso_info_detalle
ADD CONSTRAINT `proceso_info_detalle_CHECK_ESTADO_EJECUCION`
	CHECK (estado_ejecucion IN ('Procesando', 'Finalizado'));

