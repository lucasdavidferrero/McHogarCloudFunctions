import { resizeImage } from './triggers/articuloImagenResizeTrigger.js';
import { articuloImagenOnObjectDeleted } from './triggers/articuloImagenOnObjectDeleted.js';
import { onRequest } from "firebase-functions/v2/https";
import { expressAppQuasar } from './expressQuasar.js'
import { expressAppNuxt } from './expressNuxt.js';
import { REGION_SOUTHAMERICA } from '@mc-hogar/app';
import './polyfills.js'

// API CALLS
exports.mchogarQuasar = onRequest({ region: [REGION_SOUTHAMERICA] }, expressAppQuasar)
exports.mchogarNuxt = onRequest({ region: [REGION_SOUTHAMERICA] }, expressAppNuxt)

// TRIGGERS
exports.imgresizedV1 = resizeImage
exports.articuloImagenOnObjectDeletedTrigger = articuloImagenOnObjectDeleted