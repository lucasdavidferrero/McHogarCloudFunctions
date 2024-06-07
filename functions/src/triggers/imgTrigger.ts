/* import { CloudEvent } from "firebase-functions/v2";
import { StorageObjectData } from "firebase-functions/v2/storage"; */
import * as functions from "firebase-functions"
// import { onObjectFinalized } from "firebase-functions/v2/storage";

import { getStorage } from "firebase-admin/storage";
import { logger } from "firebase-functions/v2";
import path from 'path'
import sharp from "sharp"
import { ObjectMetadata } from "firebase-functions/v1/storage";

export default functions.region('southamerica-east1').storage.object().onFinalize(async (event: ObjectMetadata) => {

    const fileBucket = event.bucket; // Storage bucket containing the file.
    const filePath = event.name as string; // File path in the bucket.
    const contentType = event.contentType as string; // File content type

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