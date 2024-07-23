import { customStorageBackups } from "../../firebase";
export class CloudStorageService {


    static async guardarJsonBackupCompleto (jsonData: any) {
        const now = new Date()
        const anioActualCompleto = now.getFullYear()
        const mesActual = now.getMonth() + 1
        const nombreArchivo = `${now.getDate()}-${mesActual}-${anioActualCompleto}-${now.getTime()}.json`
        const file = customStorageBackups.file(`/BackupsGeneradosProcesoCompletoSincronizacion/${anioActualCompleto}/${mesActual}/${nombreArchivo}`)
        const stream = file.createWriteStream({
            metadata: {
                contentType: 'application/json'
            }
        })

        return new Promise((resolve, reject) => {
            stream.on('error', (err) => {
                reject(err)
            })

            stream.on('finish', () => {
                resolve(true)
            })

            stream.end(JSON.stringify(jsonData))
        })
    }

}