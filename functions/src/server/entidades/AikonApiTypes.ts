export const AIKON_API_BASE_URL = 'https://aikon247.net/webapi/api/IS3'

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
    token: string | null
    fechaTokenGeneradoUnixTimestamp: number | null
    cuentaUrl: string
    sesionIniciada: boolean
    iniciarSesionTrabajo(): void
}
export interface DtTabla<T> {
    resultado: {
        estado: string
        log: string
        retorno: string | null
    }
    data: T[]
}

/* DtTabla Articulo */
export type DtTablaArticulo = DtTabla<DtTablaArticuloData>
export interface DtTablaArticuloData {
    ar_codigo: string
    ar_descri: string
    um_codigo: string
    ar_barras: string
    AR_IVAPORCEN: number
    ma_descri: string
    fa_nombre: string
    fa_codigo: string
    st_stock: number
    ar_umexacta: string
    ar_cosbru: number
    ar_cosrep: number
    ar_cosucp: number
    fecha_ucp: string
    ar_equum: number
    ar_bonifi: string
    ar_desmax: string
    ar_minimavta: number
    ar_cosnet: number
    um_codigo_descri: string
    um_codcom_descri: string
    un_fijarprecio: string
    un_pisadesc: string
    AR_ESUNILEVER: string
    AR_UNICAJ: number
    AR_ESUNILEVER_ACTIVO: string
    ar_memo: string
    ar_descria: string
    ar_tamano: string
    ar_alto: number
    ar_ancho: number
    ar_profundo: number
    ar_color: string
    ar_peso: number
    ar_litros: number
    AR_ES_COMBO: string
    AR_ESDECOMPRAS: string
    AR_ESDEVENTAS: string
    MO_CODIGO: string
    AR_FECHAALTA: string | null
    RE1_CODIGO: string
    RE2_CODIGO: string
    ESA_CODIGO: string
    MA_CODIGO: string
    AR_FECHAMODIF: string | null
    AR_MESESGARANTIA: number
}
export interface DtTablaArticuloDataEscencialSincronizacion {
    ar_codigo: string
    ar_descri: string
    ar_memo: string
    ar_alto: number
    ar_ancho: number
    ar_profundo: number
    ar_color: string
    ar_peso: number
    ar_descria: string
    AR_MESESGARANTIA: number
    ar_cosnet: number
    AR_IVAPORCEN: number
    st_stock: number
    AR_FECHAMODIF: number | null
    AR_FECHAALTA: number | null
    fa_codigo: string
    MA_CODIGO: string
    RE1_CODIGO: string
    RE2_CODIGO: string
    ESA_CODIGO: string  
}

export type DtTablaPrecio = DtTabla<DtTablaPrecioData>
export interface DtTablaPrecioData {
    lp_codigo: string
    ar_codigo: string
    ap_precio: number
    Utilidad: number
    ap_precio_iva: number
    impuestoInterno: number
}
export interface DtTablaPrecioDataEscencialSincronizacion {
    ar_codigo: string
    Utilidad: number
    ap_precio_iva: number
    impuestoInterno: number
}
export type DtTablaArticuloPrecioEsencialSincronizacion = DtTablaArticuloDataEscencialSincronizacion & DtTablaPrecioDataEscencialSincronizacion 

export interface DtTablaDataArticuloNoHabilitado {
    ESA_CODIGO: string,
    AR_PUBLICARWEB: 'S' | 'N'
    AR_CODIGO: string
    AR_DESCRI: string
}
export type DtTablaArticuloNoHabilitado = DtTabla<DtTablaDataArticuloNoHabilitado>

export enum DtTablaNombre {
    Articulos = "articulo",
    ArticulosNoHabilitados = "ARTICULO_NO_HABILITADO",
    Precios = "precios"
}