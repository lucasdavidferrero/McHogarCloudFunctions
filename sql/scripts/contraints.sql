/* Los CHECK Constraint reflejan reglas de negocio. */
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

ALTER TABLE articulo_precio
DROP CONSTRAINT arp_utilidad_web_chk,
DROP CONSTRAINT arp_utilidad_ofer_chk,
DROP CONSTRAINT arp_utilidad_ofer_fecha_hasta_chk,
DROP CONSTRAINT arp_utilidad_ofer_stock_hasta_chk,
DROP CONSTRAINT arp_descuento_chk;

/* Triggers */


/* Pruebas */
INSERT INTO articulo_precio(aik_ar_codigo, arp_utilidad_web, arp_utilidad_ofer_stock_hasta)
VALUES ('00170025', 65.5, null);
/* ,arp_utilidad_ofer, arp_utilidad_ofer_fecha_hasta  */
SELECT * FROM articulo_precio;
DELETE FROM articulo_precio WHERE aik_ar_codigo = '00170025';

UPDATE articulo_precio
SET arp_utilidad_ofer = 30.52, arp_utilidad_ofer_fecha_hasta = '2024-04-21'
WHERE aik_ar_codigo = '00170025';

SELECT * FROM aikon_articulo order by aik_ar_codigo asc;

SELECT * FROM aikon_marca;

SELECT * FROM aikon_articulo AS ART WHERE ART.aik_ar_codigo = '00010001';

SELECT * FROM aikon_articulo WHERE aik_ar_codigo = '00010041';
SELECT * FROM articulo_precio WHERE aik_ar_codigo = '00010041';
SELECT * FROM articulo_web WHERE aik_ar_codigo = '00010041';


DELETE FROM articulo_precio WHERE aik_ar_codigo = '00010041';
DELETE FROM articulo_web WHERE aik_ar_codigo = '00010041';
DELETE FROM aikon_articulo WHERE aik_ar_codigo = '00010041';

SELECT * FROM aikon_articulo WHERE aik_ar_codigo = '00010041';
SELECT * FROM articulo_web WHERE aik_ar_codigo = '00010041';
SELECT * FROM aikon_articulo ORDER BY aik_ar_fecha_alta DESC;

SELECT * FROM aikon_articulo_historial_costo_neto;
SELECT * FROM aikon_articulo_historial_stock_total;
SELECT * FROM aikon_articulo_historial_utilidad;

SELECT * FROM aikon_articulo;

INSERT INTO aikon_marca (aik_ma_codigo, aik_ma_descri) 
VALUES('671', 'FUNDICION SOL MAYO'), ('672', 'CAMBELL'), ('673', 'AUGUSTE'), ('674', 'E-NIGHTS');

SELECT * FROM aikon_referencia01 WHERE aik_re1_codigo = '00007';

SELECT * FROM aikon_referencia01; # 12
SELECT * FROM aikon_referencia02;

SELECT * FROM aikon_referencia01;

SELECT * FROM aikon_articulo as AA WHERE AA.aik_ma_codigo = '126';
