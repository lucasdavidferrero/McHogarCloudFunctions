import { AikonApiSesionTrabajo } from "../../entities/ProcesosApiAikon/AikonApiSesionTrabajo"
export class ProcesoBase {
    protected _sesionTrabajo: AikonApiSesionTrabajo

    constructor() {
        this._sesionTrabajo = new AikonApiSesionTrabajo()
        this._sesionTrabajo.iniciarSesionTrabajo()
    }
}