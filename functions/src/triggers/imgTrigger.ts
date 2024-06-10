import { CloudEvent } from "firebase-functions/v2";
import { StorageObjectData, onObjectFinalized } from "firebase-functions/v2/storage";
import { getStorage } from "firebase-admin/storage";
import { logger } from "firebase-functions/v2";
import path from 'path'
import sharp from "sharp"

export const resizeImage = onObjectFinalized({
    region: 'southamerica-east1',
    // bucket: 'your-bucket-name', // specify your bucket name if needed
    eventFilters: {
        // Filter to only include images in the /articulos/img/ directory
        name: 'articulos/img/**'
    }
}, async (event: CloudEvent<StorageObjectData>) => {
    const fileBucket = event.data.bucket; // Storage bucket containing the file.
    const filePath = event.data.name as string; // File path in the bucket.
    const contentType = event.data.contentType as string; // File content type

    // Exit if this is triggered on a file that is not an image.
    if (contentType !== undefined && !contentType.startsWith("image/")) {
        return logger.log("This is not an image.");
    }
    // Exit if the image is already a thumbnail.
    const fileName = path.basename(filePath);
    if (fileName.startsWith("500x500_")) {
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
    logger.log("Thumbnail created");

    // Prefix '500x500_' to file name.
    const resizedFileName = `500x500_${path.basename(fileName, path.extname(fileName))}.webp`;
    const resizedFilePath = path.join(path.dirname(filePath), resizedFileName).replace(/\\/g, '/');

    // Upload the thumbnail.
    const metadata = { contentType: 'image/webp' };
    await bucket.file(resizedFilePath).save(resizedBuffer, {
        metadata: metadata,
    });
    logger.log("Resized image uploaded!");

    // Optionally delete the original image.
    await bucket.file(filePath).delete();
    logger.log("Original image deleted!");

    // TODO: Update Firestore if needed.

    return logger.log("Process of resizing image was run successfully!");
}) 


/*
export const generateResizedImg = onObjectFinalized({cpu: 2 }, (async(event:CloudEvent<StorageObjectData>) => {
    const fileBucket = event.data.bucket; // Storage bucket containing the file.
    const filePath = event.data.name; // File path in the bucket.
    const contentType = event.data.contentType; // File content type

    // Exit if this is triggered on a file that is not an image.
    if (contentType !== undefined && !contentType.startsWith("image/")) {
        return logger.log("This is not an image.");
    }
    // Exit if the image is already a thumbnail.
    const fileName = path.basename(filePath);
    if (fileName.startsWith("500x500_")) {
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
    logger.log("Thumbnail created");

    // Prefix '500x500_' to file name.
    const resizedFileName = `500x500_${fileName}`;
    const resizedFilePath = path.join(path.dirname(filePath), resizedFileName);

    // Upload the thumbnail.
    const metadata = {contentType: 'image/webp'};
    await bucket.file(resizedFilePath).save(resizedBuffer, {
        metadata: metadata,
    });
    return logger.log("Resized image uploaded!");

}));*/