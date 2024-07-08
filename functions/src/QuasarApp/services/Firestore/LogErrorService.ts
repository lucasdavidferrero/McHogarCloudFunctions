import { FieldValue } from 'firebase-admin/firestore';
import { LogErrorOptions, ErrorTypeDocumentNames } from './log-error-service.types';
import { firestore } from "../../../firebase";
import { logger } from "firebase-functions/v2";

export class LogErrorFirestoreService {
    static async logProcessError (errorTypeDocName: ErrorTypeDocumentNames ,options: LogErrorOptions) {
        const errorDocData = {
            timestamp: FieldValue.serverTimestamp(),
            errorCode: options.errorCode || '',
            stack: options.stack || '',
            context: options.context || {},
            message: options.message,
            additionalInfo: options.additionalInfo || ''
        }
        
        try {
            const colRef = firestore.collection(`Procesos/${errorTypeDocName}/Errors`)
            await colRef.add(errorDocData)
        } catch (firestoreError) {
            logger.error('Error al guardar un error de un proceso en Firestore', firestoreError)
        }
    }
}