import { CloudEvent } from "firebase-functions/v2";
import { onObjectDeleted, StorageObjectData } from "firebase-functions/v2/storage";
import { logger } from "firebase-functions/v2";
import { PREFIJO_IMAGEN_OPTIMIZADA, IMAGEN_PRINCIPAL_NOMBRE_CARPETA } from "../types/TriggerFunctions.type";
import path from 'path'
import { ArticuloWebService } from './../services/ArticuloWebService';
import { firestore } from "../firebase";
import { FieldValue } from 'firebase-admin/firestore';

export const articuloImagenOnObjectDeleted = onObjectDeleted(
    {
        region: 'southamerica-east1',
        eventFilters: {
            // Filter to only include images in the /articulos/img/ directory
            name: 'articulos/img/**'
        }
    },
    async (event: CloudEvent<StorageObjectData>) => {
        const time = event.time
        const type = event.type
        const object = event.data
        const filePath = event.data.name
        console.log(`${time}; ${type}; ${filePath}`)
        console.log(object)

        // Terminar proceso si la imágen que se eliminó, no es la optimizada.
        const fileName = path.basename(filePath);
        if (!fileName.startsWith(PREFIJO_IMAGEN_OPTIMIZADA)) {
            return logger.log("Imagen eliminada no esta optimizada. Terminar Trigger");
        }

        const codigoArticulo = filePath.split('/')[2];
        logger.log(`Código del artículo: ${codigoArticulo}`);

        const filePathParts = filePath.split('/')
        const articuloDocRef = firestore.collection('articulos').doc(codigoArticulo);
        if (filePathParts.includes(IMAGEN_PRINCIPAL_NOMBRE_CARPETA)) {
            // Limpiar información imagen principal.
            const task1 = ArticuloWebService.eliminarUrlImagenPrincipal(codigoArticulo)
            const task2 = articuloDocRef.update({
                imagenPrincipal: FieldValue.delete()
            })
            await Promise.all([task1, task2])
            logger.log("Información de Imágen Principal eliminada correctamente.")
       } else {
            // Limpiar información imagen carousel.
            const urlDescargaArticulo = (await ArticuloWebService.obtenerArticuloWebPorCodigoArticulo(codigoArticulo))?.ar_url_img_principal
            await articuloDocRef.update({
                imagenesCarousel: FieldValue.arrayRemove( { rutaArchivo: filePath, URLdescarga: urlDescargaArticulo } )
            })
            logger.log("Información de Imágen Carousel eliminada correctamente.")
       }

       logger.log("Proceso de limpieza de información de imágen eliminada ejecutado correctamente.");
    }
)