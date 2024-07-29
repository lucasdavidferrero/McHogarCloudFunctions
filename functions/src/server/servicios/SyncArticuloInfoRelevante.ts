import { Prisma, aikon_articulo } from '@prisma/client'
import { AikonApiDtTablaService } from './AikonApiDtTablaService'
import { DateUtils } from '../../utils/DateUtils';
import { DtTablaArticuloDataEscencialSincronizacion, DtTablaPrecioDataEscencialSincronizacion, DtTablaArticuloPrecioEsencialSincronizacion } from '../entidades/AikonApiTypes';
import { AikonArticuloApiConvertido } from '../entidades/PrismaTypes';
import { PrismaService } from './PrismaService';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const LP_CODIGO_PRECIO_VENTA_PUBLICO = '01';
const CODIGO_ERROR_PRISMA_NO_CUMPLE_CONDICION_WHERE = 'P2025'

export class SyncArticuloInfoRelevante {
    static async prepararSincronizacion (token: string): Promise<Prisma.PrismaPromise<aikon_articulo>[]> {
        const [responseDtTablaArticulo, responseDtTablaPrecios] = await Promise.all([
            AikonApiDtTablaService.fetchArticulos(token),
            AikonApiDtTablaService.fetchPrecios(token)
        ])

        const dtTablaArticuloDataAikonApi = responseDtTablaArticulo.data;
        const dtTablaPreciosDataAikonApi = responseDtTablaPrecios.data.filter(precio => precio.lp_codigo === LP_CODIGO_PRECIO_VENTA_PUBLICO);

        // Inicio Transformaciones para unicamente quedarse con los campos que nos interesan
        const dtTablaArticuloDatosEscencialSincronizacion: DtTablaArticuloDataEscencialSincronizacion[] = dtTablaArticuloDataAikonApi.map(({ AR_FECHAMODIF, AR_FECHAALTA, ...rest }) => ({
            ...rest,
            AR_FECHAMODIF: DateUtils.convertDateStringAikonApiToUnixTimestamp(String(AR_FECHAMODIF)),
            AR_FECHAALTA: DateUtils.convertDateStringAikonApiToUnixTimestamp(String(AR_FECHAALTA))
        }));

        const dtTablaPrecioDatosEscencialSincronizacion: DtTablaPrecioDataEscencialSincronizacion[] = dtTablaPreciosDataAikonApi.map(({ ar_codigo, Utilidad, ap_precio_iva, impuestoInterno }) => ({
            ar_codigo, Utilidad, ap_precio_iva, impuestoInterno
        }));

        const preciosIndex: PreciosIndexType = {};
        dtTablaPrecioDatosEscencialSincronizacion.forEach(precio => preciosIndex[precio.ar_codigo] = precio);

        const listadoArticulosConPreciosFromApi: DtTablaArticuloPrecioEsencialSincronizacion[] = dtTablaArticuloDatosEscencialSincronizacion.map(articulo => ({
            ...articulo,
            ...preciosIndex[articulo.ar_codigo]
        }));

        // Convertir los valores en los campos necesarios. Convertir Estructura a la de prisma.
        const listadoArticulosConPreciosConvertidoFromAPI: AikonArticuloApiConvertido[] = this.convertirListadoArticuloPrecioDesdeApiToPrisma(listadoArticulosConPreciosFromApi, preciosIndex)
        // listadoArticulosConPreciosConvertidoFromAPI convierto a índice.
        const listadoArticulosConPreciosConvertidoFromAPIIndex: ListadoArticulosConPreciosConvertidoFromAikonApiIndexType = {};
        listadoArticulosConPreciosConvertidoFromAPI.forEach(articuloPrecio => {
            listadoArticulosConPreciosConvertidoFromAPIIndex[articuloPrecio.aik_ar_codigo] = articuloPrecio
        })
        
        const prismaArticulosUpdates: Prisma.PrismaPromise<aikon_articulo>[] = []
        listadoArticulosConPreciosConvertidoFromAPI.forEach((articuloApi) => {
            try {
                const updatedArticulo = PrismaService.updateAikonArticulo(articuloApi.aik_ar_codigo, {
                    aik_ar_cosnet: articuloApi.aik_ar_cosnet,
                    aik_ap_utilidad: articuloApi.aik_ap_utilidad,
                    aik_ap_impuesto_interno: articuloApi.aik_ap_impuesto_interno,
                    aik_iva_porcen: articuloApi.aik_iva_porcen,
                    aik_stock_total: articuloApi.aik_stock_total,
                    aik_ap_precio_iva: articuloApi.aik_ap_precio_iva,
                    aik_ar_fechamodif: articuloApi.aik_ar_fechamodif
                })
                prismaArticulosUpdates.push(updatedArticulo)
            } catch (e: any) {
                // Si el error se trata de que la condición WHERE no se cumple (el artículo no esta almacenado en mysql), simplemente
                // salteamos al siguiente artículo.
                if (e instanceof PrismaClientKnownRequestError && e.code === CODIGO_ERROR_PRISMA_NO_CUMPLE_CONDICION_WHERE) {
                    return
                }
                throw e
            }
        })

        return prismaArticulosUpdates
    }

    private static convertirListadoArticuloPrecioDesdeApiToPrisma (listadoArticuloPrecioFromApi: DtTablaArticuloPrecioEsencialSincronizacion[], preciosIndex: PreciosIndexType) {
        return listadoArticuloPrecioFromApi.map(articulo => ({
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
            aik_ap_utilidad: preciosIndex[articulo.ar_codigo].Utilidad,
            aik_ap_impuesto_interno: preciosIndex[articulo.ar_codigo].impuestoInterno,
            aik_iva_porcen: articulo.AR_IVAPORCEN,
            aik_stock_total: articulo.st_stock,
            aik_ap_precio_iva: preciosIndex[articulo.ar_codigo].ap_precio_iva,
            aik_ar_fechamodif: articulo.AR_FECHAMODIF,
            aik_ar_fecha_alta: articulo.AR_FECHAALTA,
            aik_fa_codigo: articulo.fa_codigo,
            aik_ma_codigo: articulo.MA_CODIGO,
            aik_re1_codigo: articulo.RE1_CODIGO,
            aik_re2_codigo: articulo.RE2_CODIGO,
            aik_esa_codigo: articulo.ESA_CODIGO
        }))
    }
}

type PreciosIndexType = { [key: string]: DtTablaPrecioDataEscencialSincronizacion }
type ListadoArticulosConPreciosConvertidoFromAikonApiIndexType = { [key: string]: AikonArticuloApiConvertido }
// type ListadoArticulosNoHabilitadosFromAikonApiIndex = { [key: string]: DtTablaDataArticuloNoHabilitado }