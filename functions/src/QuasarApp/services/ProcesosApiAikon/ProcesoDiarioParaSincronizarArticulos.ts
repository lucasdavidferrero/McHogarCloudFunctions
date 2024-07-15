import { ProcesoBase } from "./ProcesoBase";
import axios, { AxiosResponse } from 'axios'
import { DtTablaArticulo, DtTablaPrecio, DtTablaPrecioDataEscencialSincronizacion, DtTablaArticuloDataEscencialSincronizacion, DtTablaArticuloPrecioEsencialSincronizacion  } from "../../entities/ProcesosApiAikon/types";
import { Prisma } from "@prisma/client";
import prisma from '../../../prisma'
import { DateUtils } from "../../../utils/DateUtils";

const LP_CODIGO_PRECIO_VENTA_PUBLICO = '01'

/**
 * Proceso que será responsable de obtener información de los artículos y precios provenientes del sistema Aikon (a través de su API). Obtener
 * la información de artículos y sus precios del sistema MC Hogar (MySQL). Realiza una comparación entre las 2 fuentes de información, se hacen las
 * operaciones necesarias (UPDATE, CREATE, no hacer nada) y se actualiza la base de datos MySQL de MC Hogar.
 * Con esto, tenemos al sistema web sincronizado con la información del sistema Aikon ERP.
 * @author Lucas Ferrero <lucasdavidferrero@gmail.com>
 */
export class ProcesoDiarioCompletoParaSincronizarArticulos extends ProcesoBase {
    constructor() { super() }
    async iniciar() {
        await this.inicializarSesionTrabajo()

        // [x] Obtener información en DtTabla.
        if (this.sesionTrabajo) {
            const responseDtTablaArticulo: Promise<AxiosResponse<DtTablaArticulo>> = axios.post('https://aikon247.net/webapi/api/IS3/DtTabla', { cuenta: '230', token: this.sesionTrabajo.token, tabla: 'articulo' })
            const responseDtTablaPrecios: Promise<AxiosResponse<DtTablaPrecio>> = axios.post('https://aikon247.net/webapi/api/IS3/DtTabla', { cuenta: '230', token: this.sesionTrabajo.token, tabla: 'precios' })
            const allArticulosRecords = prisma.aikon_articulo.findMany()
            const result = await Promise.all([allArticulosRecords, responseDtTablaArticulo, responseDtTablaPrecios])

            const aikonArticulosMcHogar: AikonArticuloPrismaSchema[] = result[0]
            const dtTablaArticuloDataAikonApi = result[1].data.data
            const dtTablaPreciosDataAikonApi = result[2].data.data.filter( precio => precio.lp_codigo === LP_CODIGO_PRECIO_VENTA_PUBLICO )

            const dtTablaArticuloDatosEscencialSincronizacion: DtTablaArticuloDataEscencialSincronizacion[] = dtTablaArticuloDataAikonApi.map(({ar_codigo, ar_descri, ar_memo, ar_alto, ar_ancho, ar_profundo, ar_color, ar_peso, ar_descria, AR_MESESGARANTIA, ar_cosnet, AR_IVAPORCEN, st_stock, AR_FECHAMODIF, AR_FECHAALTA, fa_codigo, MA_CODIGO, RE1_CODIGO, RE2_CODIGO, ESA_CODIGO}) => {
                const fechaAltaConvertido = DateUtils.convertDateStringAikonApiToUnixTimestamp(String(AR_FECHAMODIF))
                const fechaModificadoConvertido = DateUtils.convertDateStringAikonApiToUnixTimestamp(String(AR_FECHAALTA))
                return {
                    ar_codigo,
                    ar_descri,
                    ar_memo,
                    ar_alto,
                    ar_ancho,
                    ar_profundo,
                    ar_color,
                    ar_peso,
                    ar_descria,
                    AR_MESESGARANTIA,
                    ar_cosnet,
                    AR_IVAPORCEN,
                    st_stock,
                    AR_FECHAMODIF: fechaAltaConvertido ,
                    AR_FECHAALTA: fechaModificadoConvertido,
                    fa_codigo,
                    MA_CODIGO,
                    RE1_CODIGO,
                    RE2_CODIGO,
                    ESA_CODIGO
                }
            })
            const dtTablaPrecioDatosEscencialSincronizacion: DtTablaPrecioDataEscencialSincronizacion[] = dtTablaPreciosDataAikonApi.map(({ar_codigo, Utilidad, ap_precio_iva, impuestoInterno }) => {
                return {
                    ar_codigo,
                    Utilidad,
                    ap_precio_iva,
                    impuestoInterno
                }
            })

            const preciosIndex: { [key: string]: DtTablaPrecioDataEscencialSincronizacion } = {};
                dtTablaPrecioDatosEscencialSincronizacion.forEach(precio => {
                preciosIndex[precio.ar_codigo] = precio;
            });

            const listadoArticulosConPrecios: DtTablaArticuloPrecioEsencialSincronizacion[] = dtTablaArticuloDatosEscencialSincronizacion.map(articulo => {
                const precio = preciosIndex[articulo.ar_codigo]
                return {
                    ...articulo,
                    ...precio
                }
            })
            // Convertir los valores en los campos necesarios.[skip for now]

            // Realizar comparación con la info de la base de datos. Existen 3 caminos: No se hace nada, se hace un UPDATE, se hace un CREATE. Se usa fecha actualización

            // Si el artículo esta en API pero no en MySQL -> CREATE.
            // Si el artículo no esta en API pero sí en MySQL -> UPDATE [ESA_CODIGO y AR_PUBLICARWEB ultima_fecha_modificacion_esa_codigo, ultima_fecha_modificación_ar_publicarweb].[ARTICULO_NO_HABILITADO]
            // Si el artículo esta en la API y esta en MySQL -> UPDATE (únicamente para los artículos que tienen fecha modificación distintas).

            // Convertir estructura de artículo a la de prisma. Ejecutar UPDATE y CREATE.


            if (aikonArticulosMcHogar) {

            }    

        }
    }
}

interface AikonArticuloPrismaSchema {
    aik_ar_codigo: string
    aik_ar_descri: string
    aik_ar_memo: string
    aik_ar_alto: number
    aik_ar_ancho: number
    aik_ar_profundo: number
    aik_ar_color: string
    aik_ar_peso: number
    aik_ar_descria: string
    aik_ar_mesesgarantia: number
    aik_ar_cosnet: Prisma.Decimal
    aik_ap_utilidad: Prisma.Decimal // lista precio
    aik_ap_impuesto_interno: Prisma.Decimal // lista precio
    aik_iva_porcen: Prisma.Decimal
    aik_stock_total: number
    aik_ap_precio_iva: Prisma.Decimal // lista precio
    aik_ar_fechamodif: bigint | null
    aik_ar_fecha_alta: bigint | null
    aik_fa_codigo: string
    aik_ma_codigo: string
    aik_re1_codigo: string
    aik_re2_codigo: string
    aik_esa_codigo: string
}