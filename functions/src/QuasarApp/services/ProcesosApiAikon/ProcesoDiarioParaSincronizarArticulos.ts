import { ProcesoBase } from "./ProcesoBase";
import axios, { AxiosResponse } from 'axios';
import { DtTablaArticulo, DtTablaPrecio, DtTablaPrecioDataEscencialSincronizacion, DtTablaArticuloDataEscencialSincronizacion, DtTablaArticuloPrecioEsencialSincronizacion, DtTablaArticuloNoHabilitado, DtTablaDataArticuloNoHabilitado  } from "../../entities/ProcesosApiAikon/types";
import { aikon_articulo, Prisma, PrismaPromise } from "@prisma/client";
import prisma from '../../../prisma';
import { DateUtils } from "../../../utils/DateUtils";
import { PrismaService } from "../../../server/servicios/PrismaService";

const LP_CODIGO_PRECIO_VENTA_PUBLICO = '01';

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
            const responseDtTablaArticulosNoHabilitados: Promise<AxiosResponse<DtTablaArticuloNoHabilitado>> = axios.post('https://aikon247.net/webapi/api/IS3/DtTabla', { cuenta: '230', token: this.sesionTrabajo.token, tabla: 'ARTICULO_NO_HABILITADO' })
            const result = await Promise.all([allArticulosRecords, responseDtTablaArticulo, responseDtTablaPrecios, responseDtTablaArticulosNoHabilitados])

            const aikonArticulosMcHogar: AikonArticuloPrismaSchema[] = result[0]
            const dtTablaArticuloDataAikonApi = result[1].data.data
            const dtTablaPreciosDataAikonApi = result[2].data.data.filter( precio => precio.lp_codigo === LP_CODIGO_PRECIO_VENTA_PUBLICO )
            const dtTablaArticulosNoHabilitadosAikonApi = result[3].data.data

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
            // Convertir los valores en los campos necesarios.Convertir Estructura a la de prisma.
            const listadoArticulosConPreciosConvertidoFromAPI: AikonArticuloApiConvertido[] = listadoArticulosConPrecios.map(articulo => {
                return {
                    aik_ar_codigo: articulo.ar_codigo,
                    aik_ar_publicarweb: 'S',
                    aik_ar_descri: articulo.ar_descri,
                    aik_ar_memo: articulo.ar_memo,
                    aik_ar_alto: articulo.ar_alto,
                    aik_ar_ancho: articulo.ar_ancho,
                    aik_ar_profundo: articulo.ar_profundo,
                    aik_ar_color: articulo.ar_color,
                    aik_ar_peso: articulo.ar_peso,
                    aik_ar_descria: articulo.ar_descria,
                    aik_ar_mesesgarantia: articulo.AR_MESESGARANTIA,
                    aik_ar_cosnet: articulo.ar_cosnet,
                    aik_ap_utilidad: articulo.Utilidad,
                    aik_ap_impuesto_interno: articulo.impuestoInterno,
                    aik_iva_porcen: articulo.AR_IVAPORCEN,
                    aik_stock_total: articulo.st_stock,
                    aik_ap_precio_iva: articulo.ap_precio_iva,
                    aik_ar_fechamodif: articulo.AR_FECHAMODIF,
                    aik_ar_fecha_alta: articulo.AR_FECHAALTA,
                    aik_fa_codigo: articulo.fa_codigo,
                    aik_ma_codigo: articulo.MA_CODIGO,
                    aik_re1_codigo: articulo.RE1_CODIGO,
                    aik_re2_codigo: articulo.RE2_CODIGO,
                    aik_esa_codigo: articulo.ESA_CODIGO
                }
            })

            const listadoArticulosConPreciosConvertidoFromAPIIndex: { [key: string]: AikonArticuloApiConvertido } = {};
            listadoArticulosConPreciosConvertidoFromAPI.forEach(articuloPrecio => {
                listadoArticulosConPreciosConvertidoFromAPIIndex[articuloPrecio.aik_ar_codigo] = articuloPrecio
            })

            const dtTablaArticulosNoHabilitadosAikonApiIndex: { [key: string]: DtTablaDataArticuloNoHabilitado } = {}
            dtTablaArticulosNoHabilitadosAikonApi.forEach(articuloNoHabilitado => {
                dtTablaArticulosNoHabilitadosAikonApiIndex[articuloNoHabilitado.AR_CODIGO] = articuloNoHabilitado
            })

            // Realizar comparación con la info de la base de datos. Existen 3 caminos: No se hace nada, se hace un UPDATE, se hace un CREATE. Se usa fecha actualización
            // Si el artículo esta en API pero no en MySQL -> CREATE.
            // Si el artículo no esta en API pero sí en MySQL -> UPDATE [ESA_CODIGO y AR_PUBLICARWEB ultima_fecha_modificacion_esa_codigo, ultima_fecha_modificación_ar_publicarweb].[ARTICULO_NO_HABILITADO]
            // Si el artículo esta en la API y esta en MySQL -> UPDATE (únicamente para los artículos que tienen fecha modificación distintas).
            const prismaCreate: PrismaPromise<aikon_articulo>[] = []
            const prismaUpdatesNoHabilitados: Prisma.PrismaPromise<aikon_articulo>[] = []
            const prismaUpdatesHabilitados: Prisma.PrismaPromise<aikon_articulo>[] = []

            listadoArticulosConPreciosConvertidoFromAPI.forEach(articuloAikonApi => {
                // Los artículos que están en la API pero no en MySQL -> CREATE.
                const indexArticuloPrecio = aikonArticulosMcHogar.findIndex(articuloPrecio => {
                    return articuloPrecio.aik_ar_codigo === articuloAikonApi.aik_ar_codigo // [TODO hacerlo con índices. es más rápido]
                })
                if (indexArticuloPrecio === -1) {
                    const createData: Prisma.aikon_articuloUncheckedCreateInput = {
                        aik_ar_codigo: articuloAikonApi.aik_ar_codigo,
                        aik_ar_publicarweb: 'S',
                        aik_ar_descri: articuloAikonApi.aik_ar_descri,
                        aik_ar_memo: articuloAikonApi.aik_ar_memo,
                        aik_ar_alto: articuloAikonApi.aik_ar_alto,
                        aik_ar_ancho: articuloAikonApi.aik_ar_ancho,
                        aik_ar_profundo: articuloAikonApi.aik_ar_profundo,
                        aik_ar_color: articuloAikonApi.aik_ar_color,
                        aik_ar_peso: articuloAikonApi.aik_ar_peso,
                        aik_ar_descria: articuloAikonApi.aik_ar_descria,
                        aik_ar_mesesgarantia: articuloAikonApi.aik_ar_mesesgarantia,
                        aik_ar_cosnet: articuloAikonApi.aik_ar_cosnet,
                        aik_ap_utilidad: articuloAikonApi.aik_ap_utilidad,
                        aik_ap_impuesto_interno: articuloAikonApi.aik_ap_impuesto_interno,
                        aik_iva_porcen: articuloAikonApi.aik_iva_porcen,
                        aik_stock_total: articuloAikonApi.aik_stock_total,
                        aik_ap_precio_iva: articuloAikonApi.aik_ap_precio_iva,
                        aik_ar_fechamodif: articuloAikonApi.aik_ar_fechamodif,
                        aik_ar_fecha_alta: articuloAikonApi.aik_ar_fecha_alta,
                        aik_fa_codigo: articuloAikonApi.aik_fa_codigo,
                        aik_ma_codigo: articuloAikonApi.aik_ma_codigo,
                        aik_re1_codigo: articuloAikonApi.aik_re1_codigo,
                        aik_re2_codigo: articuloAikonApi.aik_re2_codigo,
                        aik_esa_codigo: articuloAikonApi.aik_esa_codigo,
                    }
                    const prismaCreateArticulo = PrismaService.createAikonArticulo(createData)
                    prismaCreate.push(prismaCreateArticulo)
                }
            })
    
                aikonArticulosMcHogar.forEach(articuloMcHogar => {
                    const articuloApiAikon = listadoArticulosConPreciosConvertidoFromAPIIndex[articuloMcHogar.aik_ar_codigo]
                    const articuloNoHabilitadoApiAikon = dtTablaArticulosNoHabilitadosAikonApiIndex[articuloMcHogar.aik_ar_codigo]
                    if(!articuloApiAikon) {
                        // Artículo se encuentra en DB pero no en la API Aikon.
                        const updateArticuloNoHabilitado = prisma.aikon_articulo.update({
                            where: { aik_ar_codigo: articuloMcHogar.aik_ar_codigo },
                            data: { aik_esa_codigo: articuloNoHabilitadoApiAikon.ESA_CODIGO, aik_ar_publicarweb: articuloNoHabilitadoApiAikon.AR_PUBLICARWEB }
                        })
                        prismaUpdatesNoHabilitados.push(updateArticuloNoHabilitado)
                    } else {
                        // Artículo se encuentra en API y en la DB Mysql.
                        if (articuloApiAikon.aik_ar_fechamodif !== null && BigInt(articuloApiAikon.aik_ar_fechamodif) !== articuloMcHogar.aik_ar_fechamodif) {
                            // Sincronizar artículos únicamente si las fechas modificadas son distintas. Se convierte a BigInt la fecha de la API para que en la comparación sea compatible los tipos de datos.
                            const updateArticuloHabilitado = prisma.aikon_articulo.update({
                                where: { aik_ar_codigo: articuloMcHogar.aik_ar_codigo },
                                data: {
                                    aik_ar_publicarweb: 'S',
                                    aik_ar_descri: articuloApiAikon.aik_ar_descri,
                                    aik_ar_memo: articuloApiAikon.aik_ar_memo,
                                    aik_ar_alto: articuloApiAikon.aik_ar_alto,
                                    aik_ar_ancho: articuloApiAikon.aik_ar_ancho,
                                    aik_ar_profundo: articuloApiAikon.aik_ar_profundo,
                                    aik_ar_color: articuloApiAikon.aik_ar_color,
                                    aik_ar_peso: articuloApiAikon.aik_ar_peso,
                                    aik_ar_descria: articuloApiAikon.aik_ar_descria,
                                    aik_ar_mesesgarantia: articuloApiAikon.aik_ar_mesesgarantia,
                                    aik_ar_cosnet: articuloApiAikon.aik_ar_cosnet,
                                    aik_ap_utilidad: articuloApiAikon.aik_ap_utilidad,
                                    aik_ap_impuesto_interno: articuloApiAikon.aik_ap_impuesto_interno,
                                    aik_iva_porcen: articuloApiAikon.aik_iva_porcen,
                                    aik_stock_total: articuloApiAikon.aik_stock_total,
                                    aik_ap_precio_iva: articuloApiAikon.aik_ap_precio_iva,
                                    aik_ar_fechamodif: articuloApiAikon.aik_ar_fechamodif,
                                    aik_ar_fecha_alta: articuloApiAikon.aik_ar_fecha_alta,
                                    aik_fa_codigo: articuloApiAikon.aik_fa_codigo,
                                    aik_ma_codigo: articuloApiAikon.aik_ma_codigo,
                                    aik_re1_codigo: articuloApiAikon.aik_re1_codigo,
                                    aik_re2_codigo: articuloApiAikon.aik_re2_codigo,
                                    aik_esa_codigo: articuloApiAikon.aik_esa_codigo
                                }                           
                            })
                            prismaUpdatesHabilitados.push(updateArticuloHabilitado)
                        }
                    }
    
                })
            
                const operacionesConcatenadas = prismaCreate.concat(prismaUpdatesHabilitados).concat(prismaUpdatesNoHabilitados)
                const transactionResult = await prisma.$transaction(operacionesConcatenadas)
                console.log(transactionResult)

                console.log('Proceso de sync finalizado correctamente...')
        }
    }
}

interface AikonArticuloPrismaSchema {
    aik_ar_codigo: string
    aik_ar_publicarweb: string
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

interface AikonArticuloApiConvertido {
    aik_ar_codigo: string
    aik_ar_publicarweb: string
    aik_ar_descri: string
    aik_ar_memo: string
    aik_ar_alto: number
    aik_ar_ancho: number
    aik_ar_profundo: number
    aik_ar_color: string
    aik_ar_peso: number
    aik_ar_descria: string
    aik_ar_mesesgarantia: number
    aik_ar_cosnet: number
    aik_ap_utilidad: number // lista precio
    aik_ap_impuesto_interno: number // lista precio
    aik_iva_porcen: number
    aik_stock_total: number
    aik_ap_precio_iva: number // lista precio
    aik_ar_fechamodif: number | null
    aik_ar_fecha_alta: number | null
    aik_fa_codigo: string
    aik_ma_codigo: string
    aik_re1_codigo: string
    aik_re2_codigo: string
    aik_esa_codigo: string
}