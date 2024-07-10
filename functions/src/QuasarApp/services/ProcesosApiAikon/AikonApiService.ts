import { AikonApiCuentaUrlRequest, AikonApiCuentaUrlResponse, AikonApiObtenerTokenRequest, AikonApiObtenerTokenResponse, AikonApiTokenInfo } from './../../entities/ProcesosApiAikon/types';
import axios , { AxiosResponse  } from "axios"
export class AikonApiService {

    static async obtenerCuentaUrl (cuenta: AikonApiCuentaUrlRequest = { Cuenta: '230', CuentaPwd: '1234' }): Promise<string> {
        try {
            const response: AxiosResponse<AikonApiCuentaUrlResponse> = await axios.post('http://aikonmanager.com/Manager/api/CuentaURL', cuenta)
            return response.data.retorno
        } catch (e) {
            if (axios.isAxiosError(e)) {
                console.error('Axios error:', e.message);
              } else {
                console.error('Unexpected error:', e);
              }
            throw e;
        }
    }

    static async obtenerToken(
        cuentaUrl: string, 
        credenciales: AikonApiObtenerTokenRequest = { cuenta: '230', usuario: 'Rafael', contraseña: 'RAFA', empresa: '6666' }
    ): Promise<AikonApiTokenInfo> {
        try {
            const response: AxiosResponse<AikonApiObtenerTokenResponse> = await axios.post(cuentaUrl, credenciales)
            return response.data.token
        } catch (e) {
            if (axios.isAxiosError(e)) {
                console.error('Axios error:', e.message);
              } else {
                console.error('Unexpected error:', e);
              }
            throw e;
        }
    }
}