import { ProcesoBase } from "./ProcesoBase";
import axios, { AxiosResponse } from 'axios'
import { DtTablaArticulo } from "../../entities/ProcesosApiAikon/types";
export class ProcesoDiarioParaSincronizarArticulos extends ProcesoBase {
    constructor() {
       super()
    }
    async iniciar() {
        await this.inicializarSesionTrabajo()

        // [x] Obtener articulos en DtTabla.
        if (this.sesionTrabajo) {
            const response: AxiosResponse<DtTablaArticulo> = await axios.post('https://aikon247.net/webapi/api/IS3/DtTabla', { cuenta: '230', token: this.sesionTrabajo.token, tabla: 'articulo' })
            console.log(response)
        }
        


        // [ ] Procesar info. Quedarse con los campos deseados, si es necesario convertir valores.
        // [ ] Sincronizar con Base de Datos [CREATE || UPDATE].
    }
}