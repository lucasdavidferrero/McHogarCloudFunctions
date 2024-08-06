import { Prisma, aikon_articulo, PrismaPromise } from '@prisma/client'
import { AikonApiDtTablaService } from '../../servicios/AikonApiDtTablaService'
import { DtTablaArticuloData, DtTablaPrecioData } from '../../entidades/AikonApiTypes';
import { PrismaService } from '../../servicios/PrismaService';
import { DateUtils } from '../../../utils/DateUtils';

const LP_CODIGO_PRECIO_VENTA_PUBLICO = '01';

export interface fetchAllAikonArticulosWithSelectSubsetReturnValue {
    aik_ar_codigo: string
    aik_ar_fechamodif: BigInt
    aik_stock_total: number
    aik_ar_cosnet: Prisma.Decimal
    aik_iva_porcen: Prisma.Decimal
    aik_ap_precio_iva: Prisma.Decimal
    aik_ap_impuesto_interno: Prisma.Decimal
    aik_ap_utilidad: Prisma.Decimal
}

/**
 * Clase responsable de preparar las actualizaciones de los Artículos ya existentes en la base de datos MySQL.
 * Únicamente se actualizan los artículos que tengan al menos un valor distinto comparado con su equivalente en la API de aikon, en los 
 * campos: aik_stock_total, aik_ar_cosnet, aik_iva_porcen, aik_ap_precio_iva, aik_ap_impuesto_interno, aik_ap_utilidad.
 */
export class SyncArticuloInfoRelevante {
    static async prepararSincronizacion (token: string): Promise<Prisma.PrismaPromise<aikon_articulo>[]> {

        const [responseDtTablaArticulo, responseDtTablaPrecios, aikonArticulosMcHogarArray ] = await Promise.all([
            AikonApiDtTablaService.fetchArticulos(token),
            AikonApiDtTablaService.fetchPrecios(token),
            PrismaService.fetchAllAikonArticulosWithSelectSubset({ aik_ar_codigo: true, aik_ar_fechamodif: true, aik_stock_total: true, 
                aik_ar_cosnet: true, aik_iva_porcen: true, aik_ap_precio_iva: true, aik_ap_impuesto_interno: true, aik_ap_utilidad: true })
        ])

        const dtTablaArticuloDataAikonApi = responseDtTablaArticulo.data
        const dtTablaPreciosDataAikonApi = responseDtTablaPrecios.data.filter(precio => precio.lp_codigo === LP_CODIGO_PRECIO_VENTA_PUBLICO);

        /* Transformamos todo listado de artículos que obtenemos de Prisma en un Objeto para mejorar la búsqueda posterior. */
        const aikonArticulosMcHogarObjectWithIds = this.fromListadoCompletoAikonArticulosToAikonArticulosObject(aikonArticulosMcHogarArray)

        /* Transformamos la info que viene de la API a estructuras de prisma y mergeamos la información de Artículos y Precios */
        const articulosPrisma = this.transformarArticuloAikonApiToArticuloPrisma(dtTablaArticuloDataAikonApi)
        const articulosConPrecioConvertidosToPrisma = this.transformarConvertirArticuloPrismaToArticuloPrecioPrisma(articulosPrisma, dtTablaPreciosDataAikonApi)

        /* Se filtran los artículos que ya existen en la base de datos de Prisma y que la fecha de modificación sea distinta. */
        const articulosExistentesEnPrismaConFechaModifDistintasFiltrados = articulosConPrecioConvertidosToPrisma.filter((articulo) => {
            return aikonArticulosMcHogarObjectWithIds[articulo.id] && Number(aikonArticulosMcHogarObjectWithIds[articulo.id].aik_ar_fechamodif) !== articulo.data.aik_ar_fechamodif
        })

        /* 
            Si al menos uno de los campos de la API comparada con la de Prisma es !==, se actualiza el artículo.
        */
        const articulosFiltradosUnicamenteValoresCamposDistintos = articulosExistentesEnPrismaConFechaModifDistintasFiltrados.filter((articulo) => {
            return (aikonArticulosMcHogarObjectWithIds[articulo.id].aik_stock_total !== articulo.data.aik_stock_total                               ||
                    aikonArticulosMcHogarObjectWithIds[articulo.id].aik_ar_cosnet.toNumber() !== articulo.data.aik_ar_cosnet                        ||
                    aikonArticulosMcHogarObjectWithIds[articulo.id].aik_iva_porcen.toNumber() !== articulo.data.aik_iva_porcen                      ||
                    aikonArticulosMcHogarObjectWithIds[articulo.id].aik_ap_precio_iva.toNumber() !== articulo.data.aik_ap_precio_iva                ||
                    aikonArticulosMcHogarObjectWithIds[articulo.id].aik_ap_impuesto_interno.toNumber() !== articulo.data.aik_ap_impuesto_interno    ||
                    aikonArticulosMcHogarObjectWithIds[articulo.id].aik_ap_utilidad.toNumber() !== articulo.data.aik_ap_utilidad

            )
        })

        const articulosPreparadosParaActualizar: PrismaPromise<aikon_articulo>[] = []
        articulosFiltradosUnicamenteValoresCamposDistintos.forEach((articulo) => {
            /*  No deseamos guardar la fechamodif ya que genera conflictos en el proceso de sincronización completa.
                Únicamente se actualiza la fechamodif en Prisma desde el proceso completo de sincronización.
            */
            delete articulo.data.aik_ar_fechamodif
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
                aik_iva_porcen: articulo.AR_IVAPORCEN,
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
    aik_iva_porcen: number
    aik_ar_fechamodif?: number | null
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