import { Prisma, aikon_articulo, PrismaPromise } from '@prisma/client'
import { AikonApiDtTablaService } from './AikonApiDtTablaService'
import { DtTablaArticuloData, DtTablaPrecioData } from '../entidades/AikonApiTypes';
import { PrismaService } from './PrismaService';
import { DateUtils } from '../../utils/DateUtils';

const LP_CODIGO_PRECIO_VENTA_PUBLICO = '01';

/*
    [X] Obtener Todos los artículos Prisma
    [X] Convertir Estructuras.
    [X] Hacer update con prisma únicamente de los artículos que están guardados en mysql.  
*/
interface fetchAllAikonArticulosWithSelectSubsetReturnValue {
    aik_ar_codigo: string
    aik_ar_fechamodif: BigInt
}
export class SyncArticuloInfoRelevante {
    static async prepararSincronizacion (token: string): Promise<Prisma.PrismaPromise<aikon_articulo>[]> {

        const [responseDtTablaArticulo, responseDtTablaPrecios, aikonArticulosMcHogarArray ] = await Promise.all([
            AikonApiDtTablaService.fetchArticulos(token),
            AikonApiDtTablaService.fetchPrecios(token),
            PrismaService.fetchAllAikonArticulosWithSelectSubset({ aik_ar_codigo: true, aik_ar_fechamodif: true })
        ])

        const dtTablaArticuloDataAikonApi = responseDtTablaArticulo.data
        const dtTablaPreciosDataAikonApi = responseDtTablaPrecios.data.filter(precio => precio.lp_codigo === LP_CODIGO_PRECIO_VENTA_PUBLICO);

        /* Transformamos todo listado de artículos que obtenemos de Prisma en un Objeto para mejorar la búsqueda posterior. */
        const aikonArticulosMcHogarObjectWithIds = this.fromListadoCompletoAikonArticulosToAikonArticulosObject(aikonArticulosMcHogarArray)

        /* Transformamos la info que viene de la API a estructuras de prisma y mergeamos la información de Artículos y Precios */
        const articulosPrisma = this.transformarArticuloAikonApiToArticuloPrisma(dtTablaArticuloDataAikonApi)
        const articulosConPrecioConvertidosToPrisma = this.transformarConvertirArticuloPrismaToArticuloPrecioPrisma(articulosPrisma, dtTablaPreciosDataAikonApi)

        /* Se filtran los artículos que ya existen en la base de datos de Prisma y que la fecha de modificación sea distinta. */
        const articuloFiltradoParaActualizar = articulosConPrecioConvertidosToPrisma.filter((articulo) => {
            return aikonArticulosMcHogarObjectWithIds[articulo.id] && Number(aikonArticulosMcHogarObjectWithIds[articulo.id].aik_ar_fechamodif) !== articulo.data.aik_ar_fechamodif
        })

        const articulosPreparadosParaActualizar: PrismaPromise<aikon_articulo>[] = []
        articuloFiltradoParaActualizar.forEach((articulo) => {
            articulosPreparadosParaActualizar.push(PrismaService.updateAikonArticulo(articulo.id, articulo.data))
        })

        return articulosPreparadosParaActualizar
    }

    private static fromListadoCompletoAikonArticulosToAikonArticulosObject (aikonArticulosMcHogarArray: fetchAllAikonArticulosWithSelectSubsetReturnValue[]) {
        const articulosAikonObject: { [key: string]: fetchAllAikonArticulosWithSelectSubsetReturnValue } = {}
        aikonArticulosMcHogarArray.forEach((articulo) => {
            articulosAikonObject[articulo.aik_ar_codigo] = articulo
        })
        return articulosAikonObject
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