import { resizeImage } from './triggers/articuloImagenResizeTrigger';
import { articuloImagenOnObjectDeleted } from './triggers/articuloImagenOnObjectDeleted';
import { onRequest } from "firebase-functions/v2/https";
import { expressAppQuasar } from './expressQuasar'
import { expressAppNuxt } from './expressNuxt';
import { REGION_SOUTHAMERICA } from '@mc-hogar/app';
import './polyfills'

// API CALLS
exports.mchogarQuasar = onRequest({ region: [REGION_SOUTHAMERICA] }, expressAppQuasar)
exports.mchogarNuxt = onRequest({ region: [REGION_SOUTHAMERICA] }, expressAppNuxt)

// TRIGGERS
exports.imgresizedV1 = resizeImage
exports.articuloImagenOnObjectDeletedTrigger = articuloImagenOnObjectDeleted

export {}