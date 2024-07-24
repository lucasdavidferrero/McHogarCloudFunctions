import { PrismaService } from "../servicios/PrismaService"
export class ProcesoInfo {
    private _id: number
    private _id_tipo_proceso: number
    private _fecha_hora_inicio: Date
    private _fecha_hora_fin: Date | null
    private _estado_ejecucion: 'Procesando' | 'Finalizado'
    private _id_usuario: number | null
    private _tiempo_ejecucion: number | null
    private _error: boolean
    private _mensaje_error: string | null
    
    constructor(id: number, idTipoProceso: number, fechaHoraInicio: Date) {
        this._id = id
        this._id_tipo_proceso = idTipoProceso
        this._fecha_hora_inicio = fechaHoraInicio
        this._fecha_hora_fin = null
        this._estado_ejecucion = 'Procesando'
        this._id_usuario = null
        this._tiempo_ejecucion = null
        this._error = false
        this._mensaje_error = null
    }

    async iniciar() {
        const newId = await PrismaService.crearProcesoInfo(this)
        this._id = newId
    }

    async finalizar() {

    }

    // Getters
    public get id() {
        return this._id
    }
    public get id_tipo_proceso() {
        return this._id_tipo_proceso
    }
    public get fecha_hora_inicio() {
        return this._fecha_hora_inicio
    }
    public get fecha_hora_fin(): Date | null {
        return this._fecha_hora_fin
    }
    public get estado_ejecucion() {
        return this._estado_ejecucion
    }
    public get id_usuario() {
        return this._id_usuario
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
    public set fecha_hora_fin(datetime: Date) {
        this._fecha_hora_fin = datetime
    }
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