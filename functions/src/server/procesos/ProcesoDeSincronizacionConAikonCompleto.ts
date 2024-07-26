import { AikonApiObtenerTokenService, fetchTokenReturnValue } from '../servicios/AikonApiObtenerTokenService';
import { PrismaService } from '../servicios/PrismaService';
import { SyncMarca } from '../servicios/SyncMarca';
import { SyncArticuloPrecioService } from '../servicios/SyncArticuloPrecioService';
import { SyncReferencia01 } from '../servicios/SyncReferencia01';
import { SyncReferencia02 } from '../servicios/SyncReferencia02';
import { SyncFamilia } from '../servicios/SyncFamilia';
import { ProcesoInfoTipo } from '../entidades/ProcesoInfoTipo';
import { ProcesoInfo } from '../entidades/ProcesoInfo';
import { ProcesoInfoDetalle } from '../entidades/ProcesoInfoDetalle';

const tipoProceso = new ProcesoInfoTipo(1, 'ProcesoSincronizacionConAikonCompleto') // Esto esta hardcodeado. repensarlo.
/* 
    == Esta función agrupa todas las sincronizaciones que deben hacerse ==
    Estos son los requerimientos principales:
    [OK] Antes de ejecutar este proceso en particular,se hace un backup completo con prisma. El archivo generado se almacena en un bucket específico para ficheros backups en Firebase Cloud Storage.
    [OK] Almacenar información de procesoInfo.
    [OK] Obtener el Token (hacer reintentos si es necesario).
    [OK] Preparar toda la información a sincronizar: Marcas, Categorías, Rubros, Familias y ArtículosPrecios respectivamente.
    [OK] Ejecutar cada sincronización de cada entidad en una transacción de prisma.
    [OK] Finalizar procesoInfo.
    [OK] En caso de error. Se almacena error en el procesoInfo y procesoInfoDetalle. Además se utiliza el sistema Cloud Logging (console.error y console.log publican automáticamente a este servicio si estamos dentro de Firebase Cloud Functions).
    [OK] La información de cada paso se almacena en procesoInfoDetalle
*/
export async function procesoDeSincronizacionConAikonCompleto() {
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

        // Backup de la DB
        step_name = 'BackupDatabase'
        envolverPasoConProcesoDetalle(procesoInfo.id, step_name, async () => {
            return await PrismaService.generateBackupForProcesoDeSincronizacionConAikonCompleto()
        })

        // ## Preparaciones de las entidades a sincronizar ##
        // Preparar Sync de Marca
        step_name = 'PrepararSincronizacionMarcas'
        const marcaUpsertBatchOperations = await envolverPasoConProcesoDetalle(procesoInfo.id, step_name, async () => {
            return SyncMarca.prepararSincronizacion(tokenId)
        })

        // Preparar Sync de Referencia01 (Categorías)
        step_name = 'PrepararSincronizacionCategorías'
        const referencia01UpsertBatchOperations = await envolverPasoConProcesoDetalle(procesoInfo.id, step_name, async () => {
            return SyncReferencia01.prepararSincronizacion(tokenId)
        })

        // Preparar Sync de Referencia02 (Rubros)
        step_name = 'PrepararSincronizacionRubros'
        const referencia02UpsertBatchOperations = await envolverPasoConProcesoDetalle(procesoInfo.id, step_name, async () => {
            return SyncReferencia02.prepararSincronizacion(tokenId)
        })

        // Preparar Sync Familias
        step_name = 'PrepararSincronizacionFamilias'
        const familiaUpsertBatchOperations = await envolverPasoConProcesoDetalle(procesoInfo.id, step_name, async () => {
            return SyncFamilia.prepararSincronizacion(tokenId)
        })

        // Preparar Sync Articulos.
        step_name = 'PrepararSincronizacionArtículos'
        const articuloPrecioBatchOperations = await envolverPasoConProcesoDetalle(procesoInfo.id, step_name, async () => {
            return SyncArticuloPrecioService.prepararSincronizacion(tokenId);
        })
        
        // ## Transacciones que se encargan de ejecutar los CREATE y UPDATE correspondientes en cada tabla ##
        // Ejecutar Transacción Marcas
        step_name = 'EjecutarSincronizacionMarcas'
        await envolverPasoConProcesoDetalle(procesoInfo.id, step_name, async () => {
            return PrismaService.executeTransactionFromBatchOperations(marcaUpsertBatchOperations)
        })

        // Ejecutar Transacción Referencia01
        step_name = 'EjecutarSincronizacionCategorías'
        await envolverPasoConProcesoDetalle(procesoInfo.id, step_name, async () => {
            return PrismaService.executeTransactionFromBatchOperations(referencia01UpsertBatchOperations)
        })

        // Ejecutar Transacción Referencia02
        step_name = 'EjecutarSincronizacionRubros'
        await envolverPasoConProcesoDetalle(procesoInfo.id, step_name, async () => {
            return PrismaService.executeTransactionFromBatchOperations(referencia02UpsertBatchOperations)
        })

        // Ejecutar Transacción Familias
        step_name = 'EjecutarSincronizacionFamilias'
        await envolverPasoConProcesoDetalle(procesoInfo.id, 'EjecutarSincronizacionFamilias', async () => {
            return PrismaService.executeTransactionFromBatchOperations(familiaUpsertBatchOperations)
        })

        // Ejecutar Transacción Artículos
        step_name = 'EjecutarSincronizacionArtículos'
        await envolverPasoConProcesoDetalle(procesoInfo.id, step_name, async () => {
            return PrismaService.executeTransactionFromBatchOperations(articuloPrecioBatchOperations)
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
                functionName: 'procesoDeSincronizacionConAikonCompleto',
                step: step_name,
                timestamp: Date.now(),
                errorType: 'process_error'
            });
        }
    }
}

async function envolverPasoConProcesoDetalle<T>(procesoInfoId: number, nombrePaso: string, cbEjecucionPaso: () => Promise<T>) {
    const procesoInfoDetalleBackupDb = new ProcesoInfoDetalle(-1, procesoInfoId, nombrePaso)
    try {
        await procesoInfoDetalleBackupDb.iniciar()
        const startTime = performance.now()
        const resultCallbackExecution = await cbEjecucionPaso()
        const endTime = performance.now()
        const tiempoEjecucionMs = endTime - startTime
        await procesoInfoDetalleBackupDb.finalizar(tiempoEjecucionMs)
        return resultCallbackExecution
    } catch (e: any) {
        if (e instanceof Error) {
            if (procesoInfoDetalleBackupDb.fueIniciado()) {
                procesoInfoDetalleBackupDb.error = true
                procesoInfoDetalleBackupDb.mensaje_error = e.message
                await procesoInfoDetalleBackupDb.finalizar(0)
            }
        }
        throw e
    }
}

