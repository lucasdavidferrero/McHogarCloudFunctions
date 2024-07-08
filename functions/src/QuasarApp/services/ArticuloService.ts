import prisma from '../../prisma'
import { Prisma } from '@prisma/client'
import { ArticuloResponse } from '../types/dto/ArticuloReqRes.type'

type articuloGrillaGetPayload = {
    select: 
    { 
        aik_ar_codigo: true,
        aik_ar_descri: true, 
        articulo_web: true, 
        aikon_familia: true, 
        aikon_marca: true
    }
}
export class ArticuloService {
    static async obtenerArticulosPaginado (cantidadItemsPagina: number = 10, cursorId?: string, codMarca?: string, codCategoria?: string, codRubro?: string, codFamilia?: string, codArticulo?: string) {
        let aikon_articulos
        aikon_articulos = await prisma.aikon_articulo.findMany({
            take: cantidadItemsPagina,
            skip: cursorId ? 1 : undefined,
            cursor: cursorId ? { aik_ar_codigo: cursorId} : undefined,
            where: {
                aik_ma_codigo: (typeof(codMarca) === 'string' && codMarca.length) ? codMarca : undefined,
                aik_re1_codigo: typeof(codCategoria) === 'string' && typeof(codRubro) === 'undefined' && typeof(codFamilia) === 'undefined' ? codCategoria : undefined,
                aik_re2_codigo: typeof(codRubro) === 'string' && typeof(codFamilia) === 'undefined' ? codRubro : undefined,
                aik_fa_codigo: (typeof(codFamilia) === 'string' && codFamilia.length) ? codFamilia : undefined,
                aik_ar_codigo: (typeof(codArticulo) === 'string' && codArticulo.length) ? {
                    startsWith: codArticulo
                } : undefined
            },
            orderBy: {
                aik_ar_codigo: 'asc'
            },
            include: { articulo_precio: true, articulo_web: true, aikon_familia: true, aikon_marca: true, aikon_estado_articulo: true, aikon_referencia01: true, aikon_referencia02: true }
        })
        const articulosDto: ArticuloResponse[] = []
        aikon_articulos.forEach((art) => {
            articulosDto.push({
                aik_ar_codigo:           art.aik_ar_codigo,
                aik_ar_descri:           art.aik_ar_descri,
                aik_ar_memo:             art.aik_ar_memo,
                aik_re1_codigo:          art.aik_re1_codigo,
                aik_re2_codigo:          art.aik_re2_codigo,
                aik_ar_alto:             art.aik_ar_alto,
                aik_ar_ancho:            art.aik_ar_ancho,
                aik_ar_profundo:         art.aik_ar_profundo,
                aik_ar_color:            art.aik_ar_color,
                aik_ar_peso:             art.aik_ar_peso,
                aik_ar_descria:          art.aik_ar_descria,
                aik_ar_fechamodif:       art.aik_ar_fechamodif?.toDateString() || null,
                aik_ar_mesesgarantia:    art.aik_ar_mesesgarantia,
                aik_ar_cosnet:           art.aik_ar_cosnet.toNumber(),
                aik_ap_utilidad:         art.aik_ap_utilidad.toNumber(),
                aik_impuesto_interno:    art.aik_impuesto_interno.toNumber(),
                aik_iva_porcen:          art.aik_iva_porcen.toNumber(),
                aik_stock_total:         art.aik_stock_total,
                aik_ap_precio_iva:       art.aik_ap_precio_iva.toNumber(),
                aik_fa_codigo:           art.aik_fa_codigo,
                aik_ma_codigo:           art.aik_ma_codigo,
                aik_esa_codigo:          art.aik_esa_codigo,
                aikon_estado_articulo: art.aikon_estado_articulo,
                aikon_familia: art.aikon_familia,
                aikon_referencia01: art.aikon_referencia01,
                aikon_referencia02: art.aikon_referencia02,
                aikon_marca: art.aikon_marca,
                articulo_precio: art.articulo_precio ? {
                    aik_ar_codigo: art.articulo_precio.aik_ar_codigo,
                    arp_utilidad_web: art.articulo_precio.arp_utilidad_web.toNumber(),
                    arp_utilidad_ofer: art.articulo_precio.arp_utilidad_ofer ? art.articulo_precio.arp_utilidad_ofer.toNumber() : null,
                    arp_utilidad_ofer_fecha_hasta: art.articulo_precio.arp_utilidad_ofer_fecha_hasta ? art.articulo_precio.arp_utilidad_ofer_fecha_hasta.toDateString() : null,
                    arp_utilidad_ofer_stock_hasta: art.articulo_precio.arp_utilidad_ofer_stock_hasta,
                    arp_descuento: art.articulo_precio.arp_descuento ? art.articulo_precio.arp_descuento.toNumber() : null,
                    arp_descuento_fecha_hasta: art.articulo_precio.arp_descuento_fecha_hasta ? art.articulo_precio.arp_descuento_fecha_hasta.toDateString() : null,
                    arp_porcentaje_off: art.articulo_precio.arp_porcentaje_off ? art.articulo_precio.arp_porcentaje_off.toNumber() : null
                } : null,
                articulo_web: art.articulo_web ? {
                    aik_ar_codigo: art.articulo_web.aik_ar_codigo,
                    ar_url_img_principal : art.articulo_web.ar_url_img_principal,
                    ar_descripcion_web: art.articulo_web.ar_descripcion_web
                } : null
            })
        })
        return articulosDto
    }

    static async obtenerArticulosPaginadoGrillaModificarImagenes(cantidadItemsPagina: number = 10, cursorId?: string, codMarca?: string, codFamilia?: string, codArticulo?: string): Promise<{ articulos: Prisma.aikon_articuloGetPayload<articuloGrillaGetPayload>[], totalItems: number, nextCursor: string | null }> {
        // Calcular el total de items que cumplen con los filtros
        const totalItems = await prisma.aikon_articulo.count({
            where: {
                aik_ma_codigo: codMarca ? codMarca : undefined,
                aik_fa_codigo: codFamilia ? codFamilia : undefined,
                aik_ar_codigo: codArticulo ? { startsWith: codArticulo } : undefined
            }
        });
        let articulos
        articulos = await prisma.aikon_articulo.findMany({
            take: cantidadItemsPagina,
            skip: cursorId ? 1 : undefined,
            cursor: cursorId ? { aik_ar_codigo: cursorId } : undefined,
            where: {
                aik_ma_codigo: (typeof(codMarca) === 'string' && codMarca.length) ? codMarca : undefined,
                aik_fa_codigo: (typeof(codFamilia) === 'string' && codFamilia.length) ? codFamilia : undefined,
                aik_ar_codigo: (typeof(codArticulo) === 'string' && codArticulo.length) ? {
                    startsWith: codArticulo
                } : undefined
            },
            orderBy: {
                aik_ar_codigo: 'asc'
            },
            select: { 
                aik_ar_codigo: true,
                aik_ar_descri: true, 
                articulo_web: true, 
                aikon_familia: true, 
                aikon_marca: true
            },
        })

        // Calcular el nextCursor
        const nextCursor = articulos.length === cantidadItemsPagina ? articulos[articulos.length - 1].aik_ar_codigo : null;
        return { articulos, totalItems, nextCursor };
    }
    
}