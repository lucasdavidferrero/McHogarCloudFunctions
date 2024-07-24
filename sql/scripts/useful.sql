SELECT * FROM aikon_articulo;

INSERT INTO tipo_proceso_info(nombre, descripcion)
VALUES('ProcesoSincronizacionConAikonCompleto',
 'Se hace un backup completo antes de ejecutar este proceso.
 Se sincroniza en el siguiente orden: Marca, Referencia01, Referencia02, Familia, Articulo y sus Precios'
 );