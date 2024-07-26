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

const tipoProceso = new ProcesoInfoTipo(1, 'ProcesoSincronizacionConAikonCompleto')
/* 
    == Esta función agrupa todas las sincronizaciones que deben hacerse ==
    Estos son los requerimientos principales:
    [ x ] Antes de ejecutar este preoceso en particular, es recomendable realizar un backup de las tablas que van a ser afectadas.
    [ x ] Almacenar información de comienzo de ejecución del proceso completo. (idProceso, FechaHoraInicio, Nombre del proceso, Estado de ejecución, Disparador(Sistema, UsuarioId))
    [ x ] Obtener el Token desde aquí.
    [ x ] Preparar toda la información a sincronizar: Marcas, Categorías, Rubros, Familias y ArtículosPrecios respectivamente.
    [ x ] Ejecutar todas las sincronizaciones en una transacción de Prisma (MySQL Transaction).
    [ x ] Almacenar información de la ejecución satisfactoria del proceso. (Tiempo de ejecución, Estado: Finalizado, Error: false, FechaHoraFin)
    [ x ] En caso de error. Almacenar error. Actualizar información de ejecución de proceso. (Estado: Finalizado, Error: true, FechaHoraFin). Crear una fila en MySQL o almacenar error en Firestore.
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
        const { tokenId, fechaUnixObtencionToken, id } = await envolverPasoConProcesoDetalle<fetchTokenReturnValue>(procesoInfo.id, step_name, async () => {
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

        console.log('FechaUnixToken y ID', fechaUnixObtencionToken, id)
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

