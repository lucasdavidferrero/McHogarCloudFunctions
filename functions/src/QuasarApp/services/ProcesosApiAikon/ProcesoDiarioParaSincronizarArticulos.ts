import { ProcesoBase } from "./ProcesoBase";
import axios, { AxiosResponse } from 'axios'
import { DtTablaArticulo, DtTablaPrecioData } from "../../entities/ProcesosApiAikon/types";
export class ProcesoDiarioParaSincronizarArticulos extends ProcesoBase {
    constructor() {
       super()
    }
    async iniciar() {
        await this.inicializarSesionTrabajo()

        // [x] Obtener información en DtTabla.
        if (this.sesionTrabajo) {
            const responseDtTablaArticulo: Promise<AxiosResponse<DtTablaArticulo>> = axios.post('https://aikon247.net/webapi/api/IS3/DtTabla', { cuenta: '230', token: this.sesionTrabajo.token, tabla: 'articulo' })
            const responseDtTablaPrecios: Promise<AxiosResponse<DtTablaPrecioData>> = axios.post('https://aikon247.net/webapi/api/IS3/DtTabla', { cuenta: '230', token: this.sesionTrabajo.token, tabla: 'precios' })
            const result = await Promise.all([responseDtTablaArticulo, responseDtTablaPrecios])

            // Quedarse solo con los campos necesarios para hacer la sincronización.
            // Convertir los valores en los campos necesarios.
            // Realizar comparación con la info de la base de datos. Existen 3 caminos: No se hace nada, se hace un UPDATE, se hace un CREATE.
        }
    }
}