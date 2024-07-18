import { AikonApiService } from "../../services/ProcesosApiAikon/AikonApiService";
import { ISesionTrabajo } from "./types";
import { DateUtils } from "../../../utils/DateUtils";
export class AikonApiSesionTrabajo implements ISesionTrabajo {
    private _idSesion = ''
    private _token: string | null = null
    private _fechaTokenGeneradoUnixTimestamp: number | null = 0
    private _cuentaUrl = 'https://aikon247.net/webapi/api/IS3/ObtenerToken'
    private _sesionIniciada = false
    constructor() {}

    get idSesion () {
        return this._idSesion
    }
    get token () {
        return this._token
    }
    get fechaTokenGeneradoUnixTimestamp () {
        return this._fechaTokenGeneradoUnixTimestamp
    }
    get cuentaUrl () {
        return this._cuentaUrl
    }
    get sesionIniciada () {
        return this._sesionIniciada
    }

    async iniciarSesionTrabajo(): Promise<void> {
        const tokenInfo = await AikonApiService.obtenerToken(this._cuentaUrl)
        this._idSesion = tokenInfo.ID
        this._token = tokenInfo.Codigo
        this._fechaTokenGeneradoUnixTimestamp = DateUtils.convertDateStringAikonApiToUnixTimestamp(tokenInfo.Fecha)
        this._sesionIniciada = true
    }
}