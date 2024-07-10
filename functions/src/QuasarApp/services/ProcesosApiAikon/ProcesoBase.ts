import { AikonApiSesionTrabajo } from "../../entities/ProcesosApiAikon/AikonApiSesionTrabajo"
export class ProcesoBase {
    protected sesionTrabajo: AikonApiSesionTrabajo | null = null

    constructor() {}
    protected async inicializarSesionTrabajo () {
        this.sesionTrabajo = new AikonApiSesionTrabajo()
        await this.sesionTrabajo.iniciarSesionTrabajo()
    }
}