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
CALL DropCheckConstraintIfExists('articulo_precio', 'arp_utilidad_web_chk');
CALL DropCheckConstraintIfExists('articulo_precio', 'arp_utilidad_ofer_chk');
CALL DropCheckConstraintIfExists('articulo_precio', 'arp_utilidad_ofer_fecha_hasta_chk');
CALL DropCheckConstraintIfExists('articulo_precio', 'arp_utilidad_ofer_stock_hasta_chk');
CALL DropCheckConstraintIfExists('articulo_precio', 'arp_descuento_chk');

/* Creamos los CHECK CONSTRAINT. Estas reflejan reglas de negocio. */
ALTER TABLE articulo_precio
ADD CONSTRAINT arp_utilidad_web_chk 
	CHECK (arp_utilidad_web >= 0),
ADD CONSTRAINT arp_utilidad_ofer_chk 
	CHECK ( ((arp_utilidad_ofer >= 0) AND (arp_utilidad_ofer_fecha_hasta IS NOT NULL)) OR arp_utilidad_ofer IS NULL),
ADD CONSTRAINT arp_utilidad_ofer_fecha_hasta_chk
	CHECK((arp_utilidad_ofer_fecha_hasta IS NOT NULL AND arp_utilidad_ofer IS NOT NULL) OR (arp_utilidad_ofer_fecha_hasta IS NULL AND arp_utilidad_ofer IS NULL)),
ADD CONSTRAINT arp_utilidad_ofer_stock_hasta_chk
	CHECK((arp_utilidad_ofer_stock_hasta IS NOT NULL AND arp_utilidad_ofer IS NOT NULL) OR arp_utilidad_ofer_stock_hasta IS NULL),
ADD CONSTRAINT arp_descuento_chk 
	CHECK(arp_descuento > 0);
