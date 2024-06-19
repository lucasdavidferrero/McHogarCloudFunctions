import { ArticuloWebService } from './../services/ArticuloWebService';
import { CloudEvent } from "firebase-functions/v2";
import { StorageObjectData, onObjectFinalized } from "firebase-functions/v2/storage";
import { getStorage, getDownloadURL } from "firebase-admin/storage";
import { logger } from "firebase-functions/v2";
import path from 'path'
import sharp from "sharp"
import { FieldValue } from "firebase-admin/firestore";
import { firestore } from "../firebase";
import { GestorImagenesArticulos } from '@mc-hogar/lib-core';
// https://firebase.google.com/docs/functions/manage-functions?gen=2nd

export const resizeImage = onObjectFinalized({
    region: 'southamerica-east1',
    // bucket: 'your-bucket-name', // specify your bucket name if needed
    eventFilters: {
        // Filter to only include images in the /articulos/img/ directory
        name: GestorImagenesArticulos.RUTA_IMAGENES_ARTICULOS
    },
    cpu: 2,
    timeoutSeconds: 120,
    memory: '512MiB'
}, async (event: CloudEvent<StorageObjectData>) => {
    const fileBucket = event.data.bucket; // Storage bucket containing the file.
    const filePath = event.data.name as string; // File path in the bucket.
    const contentType = event.data.contentType as string; // File content type

    // Exit if this is triggered on a file that is not an image.
    if (contentType !== undefined && !contentType.startsWith("image/")) {
        return logger.log("This is not an image.");
    }
    // Exit if the image is already resized.
    const fileName = path.basename(filePath);
    if (fileName.startsWith(GestorImagenesArticulos.PREFIJO_IMAGEN_OPTIMIZADA)) {
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

    // Prefix '500x500_' to file name.
    const resizedFileName = `${GestorImagenesArticulos.PREFIJO_IMAGEN_OPTIMIZADA}${path.basename(fileName, path.extname(fileName))}.webp`;
    const resizedFilePath = path.join(path.dirname(filePath), resizedFileName).replace(/\\/g, '/');

    // Upload the thumbnail.
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
    if (filePathParts.includes(GestorImagenesArticulos.NOMBRE_CARPETA_IMAGEN_PRINCIPAL_ARTICULO)) {
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

    // Optionally delete the original image.
    await bucket.file(filePath).delete();
    logger.log("Original image deleted!");

    return logger.log("Process of resizing image was run successfully!");
})