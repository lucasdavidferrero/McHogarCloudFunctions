import { CloudEvent, logger } from "firebase-functions/v2";
import { onObjectDeleted, StorageObjectData } from "firebase-functions/v2/storage";
import path from 'path'
import { ArticuloWebService } from './../services/ArticuloWebService';
import { firestore } from "../firebase";
import { FieldValue, DocumentSnapshot } from 'firebase-admin/firestore';
import { IArticuloDocData, PREFIJO_IMAGEN_OPTIMIZADA, IMAGEN_PRINCIPAL_NOMBRE_CARPETA } from "@mc-hogar/lib-core";

export const articuloImagenOnObjectDeleted = onObjectDeleted(
    {
        region: 'southamerica-east1',
        eventFilters: {
            // Filter to only include images in the /articulos/img/ directory
            name: 'articulos/img/**'
        }
    },
    async (event: CloudEvent<StorageObjectData>) => {
        const filePath = event.data.name

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
            // Obtener document, eliminar entry del array, actualizar document.
            const docSnap: DocumentSnapshot<IArticuloDocData> = await articuloDocRef.get()
            const documentData = docSnap.data()
            if (docSnap.exists && documentData) {
                const imagenesCarouselFromDocData = Array.isArray(documentData.imagenesCarousel) ? documentData.imagenesCarousel : [] 
                const indexImagenEliminar = imagenesCarouselFromDocData.findIndex((img) => img.rutaArchivo === filePath)
                if (indexImagenEliminar !== -1) {
                    imagenesCarouselFromDocData.splice(indexImagenEliminar, 1)
                    await articuloDocRef.update({
                        imagenesCarousel: imagenesCarouselFromDocData
                    })
                }
            }
            logger.log("Información de Imágen Carousel eliminada correctamente.")
       }
       logger.log("Proceso de limpieza de información de imágen eliminada ejecutado correctamente.");
    }
)