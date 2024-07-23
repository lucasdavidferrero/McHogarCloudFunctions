import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { initializeApp, cert  } from "firebase-admin/app";
const serviceAccount = require('../../cloudfunctions-express-templat-firebase-adminsdk-zkh4i-3b7f67997f.json')

const firebaseApp = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'cloudfunctions-express-templat.appspot.com'
});

const firestore = getFirestore(firebaseApp);
const defaultStorage = getStorage().bucket()
const customStorageBackups = getStorage().bucket('gs://mc-hogar-backups')

export {
    firestore,
    defaultStorage,
    customStorageBackups
}