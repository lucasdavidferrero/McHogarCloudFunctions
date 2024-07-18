import { AIKON_API_NRO_CUENTA, AIKON_API_ENDPOINT } from '../entidades/AikonApiTypes'
import { AikonApiError } from '../errores/AikonApiError';
import { DateUtils } from '../../utils/DateUtils';
import axios from 'axios';
export class AikonApiObtenerTokenService {
    private static API_URL = AIKON_API_ENDPOINT.OBTENER_TOKEN
    private static NRO_CUENTA = AIKON_API_NRO_CUENTA
    private static USUARIO = 'Rafael'
    private static CLAVE = 'RAFA'
    private static EMPRESA = '6666'

    static async fetchToken() {
        const reqData: AikonApiObtenerTokenRequest = {
            cuenta: this.NRO_CUENTA,
            usuario: this.USUARIO,
            contraseña: this.CLAVE,
            empresa: this.EMPRESA
        }
        const response = await axios.post<AikonApiObtenerTokenResponse>(this.API_URL, reqData)
        if(response.data.estado === 'ERROR') { throw new AikonApiError(response.data.log) }

        const returnObj: fetchTokenReturnValue = {
            id: String(response.data.token.ID),
            tokenId: response.data.token.Codigo,
            fechaUnixObtencionToken: Number(DateUtils.convertDateStringAikonApiToUnixTimestamp(response.data.token.Fecha))
        }
        return returnObj
    }
}

interface AikonApiObtenerTokenRequest {
    cuenta: string
    usuario: string
    contraseña: string
    empresa: string
}
interface AikonApiObtenerTokenResponse {
    estado: 'ok' | 'ERROR',
    log: string
    token: {
        ID: number
        Codigo: string
        Fecha: string
    }
}
interface fetchTokenReturnValue {
    id: string
    tokenId: string
    fechaUnixObtencionToken: number
}