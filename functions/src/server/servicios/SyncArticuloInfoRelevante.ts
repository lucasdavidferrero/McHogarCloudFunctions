import { Prisma, aikon_articulo } from '@prisma/client'
import { AikonApiDtTablaService } from './AikonApiDtTablaService'
import { DtTablaArticuloData, DtTablaPrecioData } from '../entidades/AikonApiTypes';
// import { DateUtils } from '../../utils/DateUtils';
// import { DtTablaArticuloDataEscencialSincronizacion, DtTablaPrecioDataEscencialSincronizacion, DtTablaArticuloPrecioEsencialSincronizacion } from '../entidades/AikonApiTypes';
// import { AikonArticuloApiConvertido } from '../entidades/PrismaTypes';
import { PrismaService } from './PrismaService';
import { DateUtils } from '../../utils/DateUtils';
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const LP_CODIGO_PRECIO_VENTA_PUBLICO = '01';
// const CODIGO_ERROR_PRISMA_NO_CUMPLE_CONDICION_WHERE = 'P2025'


/*
    [X] Obtener Todos los artículos Prisma
    [X] Convertir Estructuras.
    [X] Hacer update con prisma únicamente de los artículos que están guardados en mysql.  
*/
export class SyncArticuloInfoRelevante {
    static async prepararSincronizacion (token: string): Promise<Prisma.PrismaPromise<aikon_articulo>[]> {

        const [responseDtTablaArticulo, responseDtTablaPrecios, aikonArticulosMcHogarArray] = await Promise.all([
            AikonApiDtTablaService.fetchArticulos(token),
            AikonApiDtTablaService.fetchPrecios(token),
            PrismaService.fetchAllAikonArticulosWithSelectSubset({ aik_ar_codigo: true })
        ])

        const dtTablaArticuloDataAikonApi = responseDtTablaArticulo.data
        const dtTablaPreciosDataAikonApi = responseDtTablaPrecios.data.filter(precio => precio.lp_codigo === LP_CODIGO_PRECIO_VENTA_PUBLICO);

        const aikonArticulosMcHogarSet = new Set(aikonArticulosMcHogarArray.map( articulo => articulo.aik_ar_codigo ))

        const articulosPrisma = this.transformarArticuloAikonApiToArticuloPrisma(dtTablaArticuloDataAikonApi)
        const articulosConPrecioPrisma = this.transformarConvertirArticuloPrismaToArticuloPrecioPrisma(articulosPrisma, dtTablaPreciosDataAikonApi)
        


        return []
    }

    private static transformarArticuloAikonApiToArticuloPrisma (articulosAikonApi: DtTablaArticuloData[]): ArticuloPrismaTransformed[] {
        return articulosAikonApi.map(articulo => ({
            id: articulo.ar_codigo,
            data: {
                aik_stock_total: articulo.st_stock,
                aik_ar_cosnet: articulo.ar_cosnet,
                aik_iva_percen: articulo.AR_IVAPORCEN,
                aik_ar_fechamodif: DateUtils.convertDateStringAikonApiToUnixTimestamp(String(articulo.AR_FECHAMODIF))
            }
        }))
    }

    private static transformarConvertirArticuloPrismaToArticuloPrecioPrisma (articulosPrisma: ArticuloPrismaTransformed[], dtTablaPreciosDataAikonApi: DtTablaPrecioData[]): ArticuloPrecioPrismaTransformed[] {
        const articulosPreciosPrisma: ArticuloPrecioPrismaTransformed[] = []
        articulosPrisma.forEach((articulo) => {
            const precioIndex = dtTablaPreciosDataAikonApi.findIndex( item => item.ar_codigo === articulo.id)
            if (precioIndex === -1) return;

            const precio = dtTablaPreciosDataAikonApi[precioIndex]
            articulosPreciosPrisma.push({
                id: articulo.id,
                data: {
                    ...articulo.data,
                    aik_ap_precio_iva: precio.ap_precio_iva,
                    aik_ap_impuesto_interno: precio.impuestoInterno,
                    aik_ap_utilidad: precio.Utilidad
                }
            })
        })
        return articulosPreciosPrisma
    }

}

interface ArticuloPrismaTransformed {
    id: string
    data: ArticuloPrismaDataTransformed
}
interface ArticuloPrismaDataTransformed {
    aik_stock_total: number
    aik_ar_cosnet: number
    aik_iva_percen: number
    aik_ar_fechamodif: number | null
}

interface ArticuloPrecioPrismaTransformed {
    id: string
    data: ArticuloPrecioPrismaDataTransformed
}
interface ArticuloPrecioPrismaDataTransformed extends ArticuloPrismaDataTransformed {
    aik_ap_precio_iva: number
    aik_ap_impuesto_interno: number
    aik_ap_utilidad: number
}