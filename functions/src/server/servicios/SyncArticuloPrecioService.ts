import { AikonApiDtTablaService } from './AikonApiDtTablaService';
import { PrismaService } from './PrismaService';
import { DateUtils } from '../../utils/DateUtils';
import { DtTablaArticuloDataEscencialSincronizacion, DtTablaPrecioDataEscencialSincronizacion, DtTablaDataArticuloNoHabilitado, DtTablaArticuloPrecioEsencialSincronizacion } from '../entidades/AikonApiTypes';
import { AikonArticuloPrismaSchema, AikonArticuloApiConvertido } from '../entidades/PrismaTypes';
import { Prisma } from '@prisma/client'

const LP_CODIGO_PRECIO_VENTA_PUBLICO = '01';

export class SyncArticuloPrecioService {
    static async prepararSincronizacion(token: string) {
        const [aikonArticulosMcHogar, responseDtTablaArticulo, responseDtTablaPrecios, responseDtTablaArticulosNoHabilitados] = await Promise.all([
            PrismaService.fetchAllAikonArticulos(),
            AikonApiDtTablaService.fetchArticulos(token),
            AikonApiDtTablaService.fetchPrecios(token),
            AikonApiDtTablaService.fetchArticulosNoHabilitados(token)
        ]);

        const dtTablaArticuloDataAikonApi = responseDtTablaArticulo.data;
        const dtTablaPreciosDataAikonApi = responseDtTablaPrecios.data.filter(precio => precio.lp_codigo === LP_CODIGO_PRECIO_VENTA_PUBLICO);
        const dtTablaArticulosNoHabilitadosAikonApi = responseDtTablaArticulosNoHabilitados.data;

        const dtTablaArticuloDatosEscencialSincronizacion: DtTablaArticuloDataEscencialSincronizacion[] = dtTablaArticuloDataAikonApi.map(({ AR_FECHAMODIF, AR_FECHAALTA, ...rest }) => ({
            ...rest,
            AR_FECHAMODIF: DateUtils.convertDateStringAikonApiToUnixTimestamp(String(AR_FECHAMODIF)),
            AR_FECHAALTA: DateUtils.convertDateStringAikonApiToUnixTimestamp(String(AR_FECHAALTA))
        }));

        const dtTablaPrecioDatosEscencialSincronizacion: DtTablaPrecioDataEscencialSincronizacion[] = dtTablaPreciosDataAikonApi.map(({ ar_codigo, Utilidad, ap_precio_iva, impuestoInterno }) => ({
            ar_codigo, Utilidad, ap_precio_iva, impuestoInterno
        }));

        const preciosIndex: { [key: string]: DtTablaPrecioDataEscencialSincronizacion } = {};
        dtTablaPrecioDatosEscencialSincronizacion.forEach(precio => preciosIndex[precio.ar_codigo] = precio);

        const listadoArticulosConPrecios: DtTablaArticuloPrecioEsencialSincronizacion[] = dtTablaArticuloDatosEscencialSincronizacion.map(articulo => ({
            ...articulo,
            ...preciosIndex[articulo.ar_codigo]
        }));

        const listadoArticulosConPreciosConvertidoFromAPI: Prisma.aikon_articuloUpdateInput[] | Prisma.aikon_articuloCreateInput[] = listadoArticulosConPrecios.map(articulo => ({
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
        }));

        const prismaBatchOperations = listadoArticulosConPreciosConvertidoFromAPI.map(async (articulo) => {
            const existingArticulo = aikonArticulosMcHogar.find(a => a.aik_ar_codigo === articulo.aik_ar_codigo);
            if (existingArticulo) {
                return PrismaService.updateAikonArticulo(String(articulo.aik_ar_codigo), articulo);
            } else {
                return PrismaService.createAikonArticulo(articulo as Prisma.aikon_articuloCreateInput);
            }
        });

        await PrismaService.transaction(prismaBatchOperations as Prisma.PrismaPromise<any>[]);
    }
}