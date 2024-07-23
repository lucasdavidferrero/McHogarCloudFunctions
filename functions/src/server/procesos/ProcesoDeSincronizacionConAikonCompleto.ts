import { SyncArticuloPrecioService } from '../servicios/SyncArticuloPrecioService';
import { AikonApiObtenerTokenService } from '../servicios/AikonApiObtenerTokenService';
import { PrismaService } from '../servicios/PrismaService';
import { SyncMarca } from '../servicios/SyncMarca';

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
        // Backup de la DB
        await PrismaService.generateBackupForProcesoDeSincronizacionConAikonCompleto()

        // Info de inicio de ejecución del proceso. [TODO]

        // Ejecución de los Sync
        await procesoDeSincronizacionConAikonCompletoTransaccion()
    } catch (e) {
        // Info de Error en el proceso.[TODO]
        console.error(e)
    } finally {
        // Info de fin de ejecución del proceso.[TODO]
    }
}

async function procesoDeSincronizacionConAikonCompletoTransaccion() {
    const { tokenId, fechaUnixObtencionToken, id } = await AikonApiObtenerTokenService.fetchToken()
    // Sync de Marca
    const marcaUpsertBatchOperations = await SyncMarca.prepararSincronizacion(tokenId)

    // Sync de Categoría (Ref01) [TODO]
    // Sync de Rubro (Ref02) [TODO]
    // Sync Familia [TODO]
    
    // Sync de Artículos
    const articuloPrecioBatchOperations = await SyncArticuloPrecioService.prepararSincronizacion(tokenId);

    const batchOperations = new Array().concat(marcaUpsertBatchOperations, articuloPrecioBatchOperations)
    // Transacción que ejecuta todos los CREATE y UPDATE necesarios de cada tabla.      
    await PrismaService.executeTransactionFromBatchOperations(batchOperations)

    console.log(fechaUnixObtencionToken, id)
}
