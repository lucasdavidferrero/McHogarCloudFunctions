import { ProcesoInfoDetalle } from "../entidades/ProcesoInfoDetalle"

export async function envolverPasoConProcesoDetalle<T>(procesoInfoId: number, nombrePaso: string, cbEjecucionPaso: () => Promise<T>) {
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