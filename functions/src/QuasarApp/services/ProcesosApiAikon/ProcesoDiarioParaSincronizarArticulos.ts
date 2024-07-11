import { ProcesoBase } from "./ProcesoBase";
import axios, { AxiosResponse } from 'axios'
import { DtTablaArticulo, DtTablaPrecioData } from "../../entities/ProcesosApiAikon/types";

/**
 * Proceso que será responsable de obtener información de los artículos y precios provenientes del sistema Aikon (a través de su API). Obtener
 * la información de artículos y sus precios del sistema MC Hogar (MySQL). Realiza una comparación entre las 2 fuentes de información, se hacen las
 * operaciones necesarias (UPDATE, CREATE, no hacer nada) y se actualiza la base de datos MySQL de MC Hogar.
 * Con esto, tenemos al sistema web sincronizado con la información del sistema Aikon ERP.
 * @author Lucas Ferrero <lucasdavidferrero@gmail.com>
 */
export class ProcesoDiarioCompletoParaSincronizarArticulos extends ProcesoBase {
    constructor() { super() }
    async iniciar() {
        await this.inicializarSesionTrabajo()

        // [x] Obtener información en DtTabla.
        if (this.sesionTrabajo) {
            const responseDtTablaArticulo: Promise<AxiosResponse<DtTablaArticulo>> = axios.post('https://aikon247.net/webapi/api/IS3/DtTabla', { cuenta: '230', token: this.sesionTrabajo.token, tabla: 'articulo' })
            const responseDtTablaPrecios: Promise<AxiosResponse<DtTablaPrecioData>> = axios.post('https://aikon247.net/webapi/api/IS3/DtTabla', { cuenta: '230', token: this.sesionTrabajo.token, tabla: 'precios' })
            const result = await Promise.all([responseDtTablaArticulo, responseDtTablaPrecios])
            console.log(result)
            // Quedarse so lo con los campos necesarios para hacer la sincronización.
            // Convertir los valores en los campos necesarios.
            // Realizar comparación con la info de la base de datos. Existen 3 caminos: No se hace nada, se hace un UPDATE, se hace un CREATE.
        }
    }
}