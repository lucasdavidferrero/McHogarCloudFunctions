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
    try {
        // Inicialización del proceso info.
        const procesoInfo = new ProcesoInfo(-1, tipoProceso.id, new Date())
        await procesoInfo.iniciar()

        // Backup de la DB
        envolverPasoConProcesoDetalle(procesoInfo.id, 'BackupDatabase', async () => {
            return await PrismaService.generateBackupForProcesoDeSincronizacionConAikonCompleto()
        })

        // Obtener Token
        const { tokenId, fechaUnixObtencionToken, id } = await envolverPasoConProcesoDetalle<fetchTokenReturnValue>(procesoInfo.id, 'ObtenerToken', async () => {
            return AikonApiObtenerTokenService.fetchToken()
        })

        // ## Preparaciones de las entidades a sincronizar ##
        // Preparar Sync de Marca
        const marcaUpsertBatchOperations = await envolverPasoConProcesoDetalle(procesoInfo.id, 'PrepararSincronizacionMarcas', async () => {
            return SyncMarca.prepararSincronizacion(tokenId)
        })

        // Preparar Sync de Referencia01 (Categorías)
        const referencia01UpsertBatchOperations = await envolverPasoConProcesoDetalle(procesoInfo.id, 'PrepararSincronizacionCategorías', async () => {
            return SyncReferencia01.prepararSincronizacion(tokenId)
        })

        // Preparar Sync de Referencia02 (Rubros)
        const referencia02UpsertBatchOperations = await envolverPasoConProcesoDetalle(procesoInfo.id, 'PrepararSincronizacionRubros', async () => {
            return SyncReferencia02.prepararSincronizacion(tokenId)
        })

        // Preparar Sync Familias
        const familiaUpsertBatchOperations = await envolverPasoConProcesoDetalle(procesoInfo.id, 'PrepararSincronizacionFamilias', async () => {
            return SyncFamilia.prepararSincronizacion(tokenId)
        })

        // Preparar Sync Articulos.
        const articuloPrecioBatchOperations = await envolverPasoConProcesoDetalle(procesoInfo.id, 'PrepararSincronizacionArtículos', async () => {
            return SyncArticuloPrecioService.prepararSincronizacion(tokenId);
        })
        
        // ## Transacciones que se encargan de ejecutar los CREATE y UPDATE correspondientes en cada tabla ##
        // Ejecutar Transacción Marcas
        await envolverPasoConProcesoDetalle(procesoInfo.id, 'EjecutarSincronizacionMarcas', async () => {
            return PrismaService.executeTransactionFromBatchOperations(marcaUpsertBatchOperations)
        })

        // Ejecutar Transacción Referencia01
        await envolverPasoConProcesoDetalle(procesoInfo.id, 'EjecutarSincronizacionCategorías', async () => {
            return PrismaService.executeTransactionFromBatchOperations(referencia01UpsertBatchOperations)
        })

        // Ejecutar Transacción Referencia02
        await envolverPasoConProcesoDetalle(procesoInfo.id, 'EjecutarSincronizacionRubros', async () => {
            return PrismaService.executeTransactionFromBatchOperations(referencia02UpsertBatchOperations)
        })

        // Ejecutar Transacción Familias
        await envolverPasoConProcesoDetalle(procesoInfo.id, 'EjecutarSincronizacionRubros', async () => {
            return PrismaService.executeTransactionFromBatchOperations(familiaUpsertBatchOperations)
        })

        // Ejecutar Transacción Artículos
        await envolverPasoConProcesoDetalle(procesoInfo.id, 'EjecutarSincronizacionArtículos', async () => {
            return PrismaService.executeTransactionFromBatchOperations(articuloPrecioBatchOperations)
        })
        
        procesoInfo.finalizar()



        console.log(fechaUnixObtencionToken, id)
    } catch (e) {
        console.error(e)
    }
}

/*async function procesoDeSincronizacionConAikonCompletoTransaccion() {
    const { tokenId, fechaUnixObtencionToken, id } = await AikonApiObtenerTokenService.fetchToken()
    // Sync de Marca
    const marcaUpsertBatchOperations = await SyncMarca.prepararSincronizacion(tokenId)

    // Sync de Categoría (Ref01)
    const referencia01UpsertBatchOperations = await SyncReferencia01.prepararSincronizacion(tokenId)

    // Sync de Rubro (Ref02)
    const referencia02UpsertBatchOperations = await SyncReferencia02.prepararSincronizacion(tokenId)

    // Sync Familia
    const familiaUpsertBatchOperations = await SyncFamilia.prepararSincronizacion(tokenId)
    
    // Sync de Artículos
    const articuloPrecioBatchOperations = await SyncArticuloPrecioService.prepararSincronizacion(tokenId);

    // Transacciones que ejecutan todos los CREATE y UPDATE necesarios para cada tabla.
    await PrismaService.executeTransactionFromBatchOperations(marcaUpsertBatchOperations)
    await PrismaService.executeTransactionFromBatchOperations(referencia01UpsertBatchOperations)
    await PrismaService.executeTransactionFromBatchOperations(referencia02UpsertBatchOperations)
    await PrismaService.executeTransactionFromBatchOperations(familiaUpsertBatchOperations)
    await PrismaService.executeTransactionFromBatchOperations(articuloPrecioBatchOperations)

    console.log(fechaUnixObtencionToken, id)
}*/

async function envolverPasoConProcesoDetalle<T>(procesoInfoId: number, nombrePaso: string, cbEjecucionPaso: () => Promise<T>) {
    const procesoInfoDetalleBackupDb = new ProcesoInfoDetalle(-1, procesoInfoId, nombrePaso)
    try {
        await procesoInfoDetalleBackupDb.iniciar()
        const startTime = performance.now()
        const resultCallbackExecution = await cbEjecucionPaso()
        const endTime = performance.now()
        const tiempoEjecucionMs = endTime - startTime
        procesoInfoDetalleBackupDb.finalizar(tiempoEjecucionMs)
        return resultCallbackExecution
    } catch (e: any) {
        if (procesoInfoDetalleBackupDb.fueIniciado()) {
            procesoInfoDetalleBackupDb.error = true
            procesoInfoDetalleBackupDb.mensaje_error = e.message || e
            procesoInfoDetalleBackupDb.finalizar(0)
        }
        throw e
    }
    
}