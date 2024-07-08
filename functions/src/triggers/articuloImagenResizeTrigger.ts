import { ArticuloWebService } from '../QuasarApp/services/ArticuloWebService';
import { CloudEvent } from "firebase-functions/v2";
import { StorageObjectData, onObjectFinalized } from "firebase-functions/v2/storage";
import { getStorage, getDownloadURL } from "firebase-admin/storage";
import { logger } from "firebase-functions/v2";
import path from 'path'
import sharp from "sharp"
import { FieldValue } from "firebase-admin/firestore";
import { firestore } from "../firebase";
import { LogErrorFirestoreService } from '../QuasarApp/services/Firestore/LogErrorService';
import { ErrorTypeDocumentNames } from '../QuasarApp/services/Firestore/log-error-service.types'
import { NOMBRE_CARPETA_IMAGEN_PRINCIPAL_ARTICULO, PREFIJO_IMAGEN_OPTIMIZADA, RUTA_IMAGENES_ARTICULOS } from '@mc-hogar/gestion-articulos';
import { REGION_SOUTHAMERICA, STORAGE_BUCKET_NAMES } from '@mc-hogar/app'
import { v4 as uuidv4 }  from 'uuid'

// https://firebase.google.com/docs/functions/manage-functions?gen=2nd

export const resizeImage = onObjectFinalized({
    region: REGION_SOUTHAMERICA,
    bucket: STORAGE_BUCKET_NAMES.GESTION_ARTICULO_IMAGEN , // specify your bucket name if needed
    eventFilters: {
        // Filter to only include images in the /articulos/img/ directory
        name: RUTA_IMAGENES_ARTICULOS
    },
    labels: { GestorImagenesArticulo: ErrorTypeDocumentNames.ProcesoRedimencionarOptimizarImagenArticulo },
    cpu: 2,
    timeoutSeconds: 120,
    memory: '512MiB',
    retry: true // Enable retries
}, async (event: CloudEvent<StorageObjectData>) => {
    try {
        const fileBucket = event.data.bucket; // Storage bucket containing the file.
        const filePath = event.data.name as string; // File path in the bucket.
        const contentType = event.data.contentType as string; // File content type

        // Check if the object created is a folder
        if (contentType === 'application/octet-stream') {
            return logger.log("Object created is a folder. Skipping processing.");
        }

        // Exit if this is triggered on a file that is not an image.
        if (!contentType.startsWith("image/")) {
            await getStorage().bucket(fileBucket).file(filePath).delete()
            return logger.log("Deleted non-image file:", filePath);
        }
        // Exit if the image is already resized.
        const fileName = path.basename(filePath);
        if (fileName.startsWith(PREFIJO_IMAGEN_OPTIMIZADA)) {
            return logger.log("Already resized.");
        }

        // Download file into memory from bucket.
        const bucket = getStorage().bucket(fileBucket);
        const downloadResponse = await bucket.file(filePath).download();
        const imageBuffer = downloadResponse[0];
        logger.log("Image downloaded!");

        // Generate the new image using sharp.
        const resizedBuffer = await sharp(imageBuffer).resize({
            width: 500,
            height: 500,
            withoutEnlargement: true,
        }).toFormat('webp', { quality: 70 }).toBuffer()
        logger.log("Resized image created");

        // Prefix '500x500_' to file name. Suffix an UUID
        const uniqueSuffix = '_' + uuidv4()
        const resizedFileName = `${PREFIJO_IMAGEN_OPTIMIZADA}${path.basename(fileName, path.extname(fileName))}${uniqueSuffix}.webp`;
        const resizedFilePath = path.join(path.dirname(filePath), resizedFileName).replace(/\\/g, '/');

        // Upload resized and optimazed image.
        const metadata = { contentType: 'image/webp' };
        const resizedFile = bucket.file(resizedFilePath);
        await resizedFile.save(resizedBuffer, {
            metadata: metadata,
        });
        logger.log("Resized image uploaded!");

        // Generate download URL for the resized image
        const downloadURL = await getDownloadURL(resizedFile)
        logger.log("Resized image URL generated!");

        // Extract the article ID from the file path
        const articleId = filePath.split('/')[2];
        logger.log(`Extracted article ID: ${articleId}`);

        // Reference to the Firestore document
        const articleDocRef = firestore.collection('articulos').doc(articleId);

        // Update the document, create if not exists
        const filePathParts = filePath.split('/')
        if (filePathParts.includes(NOMBRE_CARPETA_IMAGEN_PRINCIPAL_ARTICULO)) {
            const task1 = ArticuloWebService.saveUrlImagenPrincipal(articleId, downloadURL)
            const task2 = articleDocRef.set({
                imagenPrincipal: { URLdescarga: downloadURL, rutaArchivo: resizedFilePath }
            }, { merge: true });
            await Promise.all([task1, task2])
        } else {
            await articleDocRef.set({
                imagenesCarousel: FieldValue.arrayUnion({
                    URLdescarga: downloadURL,
                    rutaArchivo: resizedFilePath   
                })
            }, { merge: true });
        }
        
        logger.log('Firestore document updated!');

        // Delete the original image.
        await bucket.file(filePath).delete();
        logger.log("Original image deleted!");

        return logger.log("Process of resizing image was run successfully!");
    } catch (error: any) {
        logger.error("Error en el proceso de redimencionamiento de imagen:", error);
        await LogErrorFirestoreService.logProcessError(ErrorTypeDocumentNames.ProcesoRedimencionarOptimizarImagenArticulo, 
            {   errorCode: error.code, 
                stack: error.stack, 
                context: { filePath: event.data.name, bucket: event.data.bucket }, 
                message: error.message})
        throw error; // Ensure the function retries on failure
    }
})