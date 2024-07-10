import { AikonApiService } from "../../services/ProcesosApiAikon/AikonApiService";
import { ISesionTrabajo } from "./types";
import { DateUtils } from "../../../utils/DateUtils";
export class AikonApiSesionTrabajo implements ISesionTrabajo {
    private _idToken = ''
    private _token = ''
    private _fechaTokenGeneradoUnixTimestamp: number | null = 0
    private _cuentaUrl = ''
    private _sesionIniciada = false
    constructor() {}

    get idToken () {
        return this._idToken
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
        this._cuentaUrl = await AikonApiService.obtenerCuentaUrl()
        const tokenInfo = await AikonApiService.obtenerToken(this._cuentaUrl)
        this._idToken = tokenInfo.ID
        this._token = tokenInfo.Codigo
        this._fechaTokenGeneradoUnixTimestamp = DateUtils.convertDateStringAikonApiToUnixTimestamp(tokenInfo.Fecha)
        this._sesionIniciada = true
    }
}