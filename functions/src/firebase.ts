import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, cert  } from "firebase-admin/app";
const serviceAccount = require('../../cloudfunctions-express-templat-firebase-adminsdk-zkh4i-3b7f67997f.json')
const firebaseApp = initializeApp({
    credential: cert(serviceAccount)
});

const firestore = getFirestore(firebaseApp);

export {
    firestore
}