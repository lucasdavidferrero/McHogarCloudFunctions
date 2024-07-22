import { AikonApiDtTablaService } from './AikonApiDtTablaService';
import { PrismaService } from './PrismaService';
import { DateUtils } from '../../utils/DateUtils';
import { DtTablaArticuloDataEscencialSincronizacion, DtTablaPrecioDataEscencialSincronizacion, DtTablaDataArticuloNoHabilitado, DtTablaArticuloPrecioEsencialSincronizacion } from '../entidades/AikonApiTypes';
import { /*AikonArticuloPrismaSchema,*/ AikonArticuloApiConvertido } from '../entidades/PrismaTypes';
import { Prisma, aikon_articulo } from '@prisma/client'

const LP_CODIGO_PRECIO_VENTA_PUBLICO = '01';

export class SyncArticuloPrecioService {
    static async prepararSincronizacion(token: string): Promise<Prisma.PrismaPromise<aikon_articulo>[]> {
        const [aikonArticulosMcHogar, responseDtTablaArticulo, responseDtTablaPrecios, responseDtTablaArticulosNoHabilitados] = await Promise.all([
            PrismaService.fetchAllAikonArticulos(),
            AikonApiDtTablaService.fetchArticulos(token),
            AikonApiDtTablaService.fetchPrecios(token),
            AikonApiDtTablaService.fetchArticulosNoHabilitados(token)
        ]);

        const dtTablaArticuloDataAikonApi = responseDtTablaArticulo.data;
        const dtTablaPreciosDataAikonApi = responseDtTablaPrecios.data.filter(precio => precio.lp_codigo === LP_CODIGO_PRECIO_VENTA_PUBLICO);
        const dtTablaArticulosNoHabilitadosAikonApi = responseDtTablaArticulosNoHabilitados.data;

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
        // Fin Transformaciones

        // Convertir los valores en los campos necesarios. Convertir Estructura a la de prisma.
        const listadoArticulosConPreciosConvertidoFromAPI: AikonArticuloApiConvertido[] = this.convertirListadoArticuloPrecioDesdeApiToPrisma(listadoArticulosConPreciosFromApi, preciosIndex)
        // listadoArticulosConPreciosConvertidoFromAPI convierto a índice.
        const listadoArticulosConPreciosConvertidoFromAPIIndex: ListadoArticulosConPreciosConvertidoFromAikonApiIndexType = {};
        listadoArticulosConPreciosConvertidoFromAPI.forEach(articuloPrecio => {
            listadoArticulosConPreciosConvertidoFromAPIIndex[articuloPrecio.aik_ar_codigo] = articuloPrecio
        })

        // Artículos No Habilitados índice
        const dtTablaArticulosNoHabilitadosAikonApiIndex: ListadoArticulosNoHabilitadosFromAikonApiIndex = {}
            dtTablaArticulosNoHabilitadosAikonApi.forEach(articuloNoHabilitado => {
                dtTablaArticulosNoHabilitadosAikonApiIndex[articuloNoHabilitado.AR_CODIGO] = articuloNoHabilitado
        })

        const prismaCreatePreparados = this.articulosQueNoEstanEnPrismaPeroSiEnAikonApi(listadoArticulosConPreciosConvertidoFromAPI, aikonArticulosMcHogar)
        const prismaUpdatesPreparados = this.prepararArticulosActualizar(aikonArticulosMcHogar, listadoArticulosConPreciosConvertidoFromAPIIndex, dtTablaArticulosNoHabilitadosAikonApiIndex)

        return prismaCreatePreparados.concat(prismaUpdatesPreparados)
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
    
    /**
     * Se encarga de preparar la creación de Articulos en Prisma. Esto se hace comparando cada Artículo de la Aikon API con cada Artículo de Prisma. Si un artículo con código "X" existen en la API pero no en Prisma, entonces se procede a preparar la creación de este artículo.
     * @param listadoArticulosConPreciosConvertidoFromAPI 
     * @param aikonArticulosMcHogar 
     */
    private static articulosQueNoEstanEnPrismaPeroSiEnAikonApi (listadoArticulosConPreciosConvertidoFromAPI: AikonArticuloApiConvertido[], aikonArticulosMcHogar: aikon_articulo[]): Prisma.PrismaPromise<aikon_articulo>[] {
        const prismaCreate: Prisma.PrismaPromise<aikon_articulo>[] = []
        listadoArticulosConPreciosConvertidoFromAPI.forEach(articuloAikonApi => {
            const indexArticuloPrecio = aikonArticulosMcHogar.findIndex(articuloPrecio => {
                return articuloPrecio.aik_ar_codigo === articuloAikonApi.aik_ar_codigo
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
        return prismaCreate
    }

    private static prepararArticulosActualizar (aikonArticulosMcHogar: aikon_articulo[], listadoArticulosConPreciosConvertidoFromAPIIndex: ListadoArticulosConPreciosConvertidoFromAikonApiIndexType, dtTablaArticulosNoHabilitadosAikonApiIndex: ListadoArticulosNoHabilitadosFromAikonApiIndex): Prisma.PrismaPromise<aikon_articulo>[] {
        const prismaUpdatesNoHabilitados: Prisma.PrismaPromise<aikon_articulo>[] = []
        const prismaUpdatesHabilitados: Prisma.PrismaPromise<aikon_articulo>[] = []
        aikonArticulosMcHogar.forEach(articuloMcHogar => {
            const articuloApiAikon = listadoArticulosConPreciosConvertidoFromAPIIndex[articuloMcHogar.aik_ar_codigo]
            const articuloNoHabilitadoApiAikon = dtTablaArticulosNoHabilitadosAikonApiIndex[articuloMcHogar.aik_ar_codigo]
            if(!articuloApiAikon) {
                // Artículo se encuentra en DB pero no en la API Aikon DtTabla=articulo.
                const updateNoHabilitadoData = { aik_esa_codigo: articuloNoHabilitadoApiAikon.ESA_CODIGO, aik_ar_publicarweb: articuloNoHabilitadoApiAikon.AR_PUBLICARWEB }
                const updateArticuloNoHabilitado = PrismaService.updateAikonArticulo(articuloMcHogar.aik_ar_codigo, updateNoHabilitadoData)
                prismaUpdatesNoHabilitados.push(updateArticuloNoHabilitado)
            } else {
                // Artículo se encuentra en API y en la DB Mysql.
                // Sincronizar artículos únicamente si las fechas modificadas son distintas. Se convierte a BigInt la fecha de la API para que en la comparación sea compatible los tipos de datos.
                if (articuloApiAikon.aik_ar_fechamodif !== null && BigInt(articuloApiAikon.aik_ar_fechamodif) !== articuloMcHogar.aik_ar_fechamodif) {
                    const updateHabilitadoData = {
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
                    const updateArticuloHabilitado = PrismaService.updateAikonArticulo(articuloMcHogar.aik_ar_codigo, updateHabilitadoData)
                    prismaUpdatesHabilitados.push(updateArticuloHabilitado)
                }
            }

        })
        return prismaUpdatesNoHabilitados.concat(prismaUpdatesHabilitados)
    }
}

type PreciosIndexType = { [key: string]: DtTablaPrecioDataEscencialSincronizacion }
type ListadoArticulosConPreciosConvertidoFromAikonApiIndexType = { [key: string]: AikonArticuloApiConvertido }
type ListadoArticulosNoHabilitadosFromAikonApiIndex = { [key: string]: DtTablaDataArticuloNoHabilitado }