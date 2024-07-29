/* Inicializaciones de valores en las tablas. */

INSERT INTO aikon_estado_articulo(aik_esa_codigo, aik_esa_descri)
VALUES('01', 'Disponible'), ('02', 'Activo'), ('03', 'Inactivo');

INSERT INTO tipo_proceso_info(nombre, descripcion)
VALUES('ProcesoSincronizacionConAikonCompleto',
 'Se hace un backup completo antes de ejecutar este proceso.
Se sincroniza en el siguiente orden: Marca, Referencia01, Referencia02, Familia, Articulo y sus Precios'
 );

SELECT * FROM tipo_proceso_info;
SELECT * FROM proceso_info;
SELECT * FROM proceso_info_detalle WHERE id_proceso_info = 14;

SELECT * FROM articulo_precio;
SELECT * FROM aikon_articulo ORDER BY aik_ar_fecha_alta DESC;

