import { onRequest } from "firebase-functions/v2/https";
import { expressApp } from './express.js'
import { initializeApp } from "firebase-admin/app";

initializeApp();
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript
// Workflow for debugger: https://youtu.be/2u6Zb36OQjM?si=stodJLGa2qSHoF2l
// chrome://inspect/
// https://blog.logrocket.com/building-rest-api-firebase-cloud-functions-typescript-firestore/

exports.mchogar = onRequest(expressApp);
// exports.generateResizedImgForProducts = generateResizedImg