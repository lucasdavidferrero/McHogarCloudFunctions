export interface AikonApiCuentaUrlRequest {
    Cuenta: string
    CuentaPwd: string
}
export interface AikonApiCuentaUrlResponse {
    estado: string
    log: string
    retorno: string
}

export interface AikonApiObtenerTokenRequest {
    cuenta: string //número de cuenta que le corresponde el cliente.
    usuario: string
    contraseña: string
    empresa: string // código de la empresa a trabajar, obteniendo/insertando datos 
}
export interface AikonApiObtenerTokenResponse {
    estado: string
    log: string
    token: AikonApiTokenInfo
}
export interface AikonApiTokenInfo {
    ID: string
    Codigo: string
    Fecha: string
    Usado: string
    Clave: string
    Empresa: string
    Url: string
    UsuarioNombre: string
}

export interface ISesionTrabajo {
    idSesion: string
    token: string
    fechaTokenGeneradoUnixTimestamp: number | null
    cuentaUrl: string
    sesionIniciada: boolean
    iniciarSesionTrabajo(): void
}