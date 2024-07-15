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

/* 
		{
			"ar_codigo": "00040141",
			"ar_descri": "A SPLIT HITACHI HSFY3200FCINV 3200 W F/C INVERTER",
			"um_codigo": "UN",
			"um_codcom": "UN",
			"ar_barras": "00040141",
			"AR_IVAPORCEN": 21.0,
			"ma_descri": "HITACHI",
			"fa_nombre": "AIRE SPLIT",
			"fa_codigo": "0004",
			"st_stock": 6.0,
			"ar_umexacta": "S",
			"ar_cosbru": 0.0,
			"ar_cosrep": 4442.7,
			"ar_cosucp": 105405.0,
			"fecha_ucp": "22/12/2022",
			"ar_equum": 1.0,
			"ar_bonifi": "0",
			"ar_desmax": "5,5",
			"ar_minimavta": 0.0,
			"ar_cosnet": 470000.0,
			"um_codigo_descri": "UNIDAD",
			"um_codcom_descri": "UNIDAD",
			"un_fijarprecio": "",
			"un_pisadesc": "",
			"AR_ESUNILEVER": "N",
			"AR_UNICAJ": 1.0,
			"AR_ESUNILEVER_ACTIVO": "N",
			"ar_memo": "Características generales\r\nSplit Inverter Frio / Calor - Potencia Frigorias 3000 a 3999 - Capacidad watts 3200 F / C - Consumo Eficiencia energética Frío A++\r\nEficiencia energética Calor B - Funciones Función deshumificación - Función sueño - Dimensiones de la unidad interior\r\nunidad interior  - Alto 275 mm - Ancho 850 mm - Prof. 320 mm - Peso 8,5 kg\r\nunidad exterior - Alto 482 mm - Ancho 715 mm - Prof. 240 mm - Peso 25 kg\r\nControl remoto\r\nModelo y origen\r\nModelo\r\nHSFY3200FCINV",
			"ar_descria": "3300 f/c gas 410 ECO",
			"ar_tamano": "Grande",
			"ar_alto": 0.0,
			"ar_ancho": 0.0,
			"ar_profundo": 0.0,
			"ar_color": "",
			"ar_peso": 0.0,
			"ar_litros": 0.0,
			"AR_ES_COMBO": "N",
			"AR_ESDECOMPRAS": "S",
			"AR_ESDEVENTAS": "S",
			"MO_CODIGO": "",
			"AR_FECHAALTA": "\/Date(1720407600000-0300)\/",
			"RE1_CODIGO": "00001",
			"RE2_CODIGO": "00001",
			"ESA_CODIGO": "01",
			"MA_CODIGO": "192",
			"AR_FECHAMODIF": "\/Date(1702669740000-0300)\/",
			"AR_MESESGARANTIA": 0.0
},
*/