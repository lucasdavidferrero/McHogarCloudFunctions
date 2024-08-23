import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { initializeApp, cert  } from "firebase-admin/app";
import { FIRE_API_KEY, FIRE_AUTH_DOMAIN, FIRE_PROJECT_ID, FIRE_STORAGE_BUCKET, FIRE_MESSAGING_SENDER_ID, FIRE_APP_ID, FIRE_MEASUREMENT_ID, GOOGLE_APPLICATION_CREDENTIALS_JSON_FILENAME } from '../env'
const serviceAccount = require(`../../${GOOGLE_APPLICATION_CREDENTIALS_JSON_FILENAME}`)
console.log('SERVICE ACCOUNT: ', serviceAccount)
const firebaseConfig = {
    apiKey: FIRE_API_KEY,
    authDomain: FIRE_AUTH_DOMAIN,
    projectId: FIRE_PROJECT_ID,
    storageBucket: FIRE_STORAGE_BUCKET,
    messagingSenderId: FIRE_MESSAGING_SENDER_ID,
    appId: FIRE_APP_ID,
    measurementId: FIRE_MEASUREMENT_ID,
    credential: cert(serviceAccount)
  };

const firebaseApp = initializeApp(firebaseConfig)

const firestore = getFirestore(firebaseApp)
const defaultStorage = getStorage(firebaseApp).bucket()
const customStorageBackups = getStorage(firebaseApp).bucket('gs://mc-hogar-backups')

export {
    firestore,
    defaultStorage,
    customStorageBackups
}