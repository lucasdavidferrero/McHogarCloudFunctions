import { resizeImage } from './triggers/articuloImagenResizeTrigger.js';
import { articuloImagenOnObjectDeleted } from './triggers/articuloImagenOnObjectDeleted.js'
import { onRequest } from "firebase-functions/v2/https";
import { expressApp } from './express.js'


exports.mchogarV1 = onRequest({ region: ['southamerica-east1'] }, expressApp);
exports.imgresizedV1 = resizeImage
exports.articuloImagenOnObjectDeletedTrigger = articuloImagenOnObjectDeleted