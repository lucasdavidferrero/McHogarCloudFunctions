import { ProcesoInfoTipo } from "../entidades/ProcesoInfoTipo"
import { ProcesoInfo } from "../entidades/ProcesoInfo"
import { envolverPasoConProcesoDetalle } from './utilsProcesos'
import { AikonApiObtenerTokenService, fetchTokenReturnValue } from "../servicios/AikonApiObtenerTokenService"
import { PrismaService } from "../servicios/PrismaService"
import { SyncArticuloInfoRelevante } from "../servicios/SyncArticuloInfoRelevante"


const tipoProceso = new ProcesoInfoTipo(1, 'ProcesoSincronizacionConAikonCompleto')

/*
    [X] Obtener Token
    [X] Obtener DtTabla=articulo y DtTabla=precios
    [X] Convertir Estructuras.
    [X] Hacer update con prisma.
    [X] ## ##
    [X] ## ##   
*/
export async function procesoDeSincronizacionArticulosInfoRelevante () {
    const procesoInfo = new ProcesoInfo(-1, tipoProceso.id)
    let step_name = 'IniciarProcesoInfo'
    try {
        // Inicialización del proceso info.
        await procesoInfo.iniciar()
        const startTime = performance.now()

        // Obtener Token. Hacer Retry (6 veces) cuando da Error. Este paso, por alguna razón externa, suele retornar errores de servidor.
        step_name = 'ObtenerToken'
        const { tokenId } = await envolverPasoConProcesoDetalle<fetchTokenReturnValue>(procesoInfo.id, step_name, async () => {
            const intentos = 5
            for(let i = 0; i < intentos; i++) {
                try {
                    return await AikonApiObtenerTokenService.fetchToken()
                } catch (e) {
                    continue;
                }
            }
            return await AikonApiObtenerTokenService.fetchToken()
        })

        // ## Preparaciones de las entidades a sincronizar ##
        // Preparar Sync Articulo Info Relevante
        step_name = 'PrepararSincronizacionArticulosInfoRelevante'
        const articulosInfoRelevanteBatchOperations = await envolverPasoConProcesoDetalle(procesoInfo.id, step_name, async () => {
            return SyncArticuloInfoRelevante.prepararSincronizacion(tokenId)
        })

        // Ejecutar Transacción
        step_name = 'EjecutarSincronizacionArticulosInfoRelevante'
        await envolverPasoConProcesoDetalle(procesoInfo.id, step_name, async () => {
            return PrismaService.executeTransactionFromBatchOperations(articulosInfoRelevanteBatchOperations)
        })

        const endTime = performance.now()
        const tiempoEjecucionMs = endTime - startTime
        step_name = 'FinalizarProcesoInfo'
        await procesoInfo.finalizar(tiempoEjecucionMs)
    } catch (e: any) {
        if (e instanceof Error) {
            if(procesoInfo.fueIniciado()) {
                procesoInfo.error = true
                procesoInfo.mensaje_error = e.message
                await procesoInfo.finalizar(0)
            }
            console.error({
                errorName: e.name,
                errorStack: e.stack || '',
                errorMessage: e.message,
                functionName: 'procesoDeSincronizacionArticulosInfoRelevante',
                step: step_name,
                timestamp: Date.now(),
                errorType: 'process_error'
            });
        }
    }
}