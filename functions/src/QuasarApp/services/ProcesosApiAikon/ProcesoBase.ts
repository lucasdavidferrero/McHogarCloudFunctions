import { AikonApiSesionTrabajo } from "../../entities/ProcesosApiAikon/AikonApiSesionTrabajo"
export class ProcesoBase {
    protected _sesionTrabajo: AikonApiSesionTrabajo | null = null

    constructor() {
        (async () => {
            this._sesionTrabajo = new AikonApiSesionTrabajo()
            await this._sesionTrabajo.iniciarSesionTrabajo()
        })()
    }
}