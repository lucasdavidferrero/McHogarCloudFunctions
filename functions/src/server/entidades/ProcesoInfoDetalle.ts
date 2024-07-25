import { PrismaService } from "../servicios/PrismaService"

export class ProcesoInfoDetalle {
    private _id: number
    private _id_proceso_info: number
    private _nombre_paso: string
    private _estado_ejecucion: 'Procesando' | 'Finalizado'
    private _tiempo_ejecucion: number | null
    private _error: boolean
    private _mensaje_error: string | null
    
    constructor(id: number, idProcesoInfo: number, nombrePaso: string) {
        this._id = id
        this._id_proceso_info = idProcesoInfo
        this._nombre_paso = nombrePaso
        this._estado_ejecucion = 'Procesando'
        this._tiempo_ejecucion = null
        this._error = false
        this._mensaje_error = null
    }

    async iniciar() {
        const newId = await PrismaService.crearProcesoInfoDetalle(this)
        this._id = newId
    }

    async finalizar(tiempoEjecucionMs: number) {
        this._estado_ejecucion = 'Finalizado'
        this._tiempo_ejecucion = tiempoEjecucionMs
    }
    
    fueIniciado () {
        return this._id !== -1
    }

    // Getters
    public get id() {
        return this._id
    }
    public get id_proceso_info() {
        return this._id_proceso_info
    }
    public get nombre_paso() {
        return this._nombre_paso
    }
    public get estado_ejecucion() {
        return this._estado_ejecucion
    }
    public get tiempo_ejecucion(): number | null {
        return this._tiempo_ejecucion
    }
    public get error(): boolean {
        return this._error
    }
    public get mensaje_error(): string | null {
        return this._mensaje_error
    }

    // Setters
    public set estado_ejecucion(nuevoEstado: 'Procesando' | 'Finalizado') {
        this._estado_ejecucion = nuevoEstado
    }
    public set tiempo_ejecucion(tiempoEnMs: number) {
        this._tiempo_ejecucion = tiempoEnMs
    }
    public set error(nuevoError: true) {
        this._error = nuevoError
    }
    public set mensaje_error(mensaje: string) {
        this._mensaje_error = mensaje
    }
}