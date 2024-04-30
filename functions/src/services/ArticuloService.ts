import prisma from '../prisma'
import { ReqBodyCrearArticulo } from '../controllers/articuloController'
import { ArticuloResponse } from '../types/dto/ArticuloReqRes.type'
import { Decimal } from '@prisma/client/runtime/library'

export class ArticuloService {
    static async obtenerArticulosPaginado (cantidadItemsPagina: number = 10, cursorId?: string, codMarca?: string) {
        let aikon_articulos
        aikon_articulos = await prisma.aikon_articulo.findMany({
            take: cantidadItemsPagina,
            skip: cursorId ? 1 : undefined,
            cursor: cursorId ? { aik_ar_codigo: cursorId} : undefined,
            where: {
                aik_ma_codigo: typeof(codMarca) === 'string' ? codMarca : undefined
            },
            orderBy: {
                aik_ar_codigo: 'asc'
            },
            include: { articulo_precio: true, articulo: true }
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
                aik_ar_cosnet:           (art.aik_ar_cosnet instanceof Decimal) ? art.aik_ar_cosnet.toNumber() : null,
                aik_ap_utilidad:         (art.aik_ap_utilidad instanceof Decimal) ? art.aik_ap_utilidad.toNumber() : null,
                aik_impuesto_interno:    (art.aik_impuesto_interno instanceof Decimal) ? art.aik_impuesto_interno.toNumber() : null,
                aik_iva_porcen:          (art.aik_iva_porcen instanceof Decimal) ? art.aik_iva_porcen.toNumber() : null,
                aik_stock_total:         art.aik_stock_total,
                aik_ap_precio_iva:       (art.aik_ap_precio_iva instanceof Decimal) ? art.aik_ap_precio_iva.toNumber() : null,
                aik_fa_codigo:           art.aik_fa_codigo,
                aik_ma_codigo:           art.aik_ma_codigo,
                aik_esa_codigo:          art.aik_esa_codigo,
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
                articulo: art.articulo ? {
                    aik_ar_codigo: art.articulo.aik_ar_codigo,
                    ar_url_img_principal : art.articulo.ar_url_img_principal
                } : null
            })
        })
        return articulosDto
    }

    static async crearArticulo (articuloBody: ReqBodyCrearArticulo) {
    
        const articulo = await prisma.aikon_articulo.create({
            data: {
                aik_ar_codigo: articuloBody.ar_codigo,
                aik_ar_descri: articuloBody.ar_descri,
                aik_ar_memo: articuloBody.ar_memo,
                aik_re1_codigo: articuloBody.re1_codigo,
                aik_re2_codigo: articuloBody.re2_codigo,
                aik_ar_alto: articuloBody.ar_alto,
                aik_ar_ancho: articuloBody.ar_ancho,
                aik_ar_profundo: articuloBody.ar_profundo,
                aik_ar_color: articuloBody.ar_color,
                aik_ar_peso: articuloBody.ar_peso,
                aik_ar_descria: articuloBody.ar_descria,
                aik_ar_fechamodif: null,
                aik_ar_mesesgarantia: articuloBody.ar_mesesgarantia,
                aik_ar_cosnet: articuloBody.ar_cosnet,
                aik_ap_utilidad: null,
                aik_impuesto_interno: null,
                aik_iva_porcen: articuloBody.AR_IVAPORCEN,
                aik_stock_total: articuloBody.st_stock,
                aik_ap_precio_iva: null,
                aik_fa_codigo: articuloBody.fa_codigo,
                aik_ma_codigo: articuloBody.ma_codigo,
                aik_esa_codigo: articuloBody.esa_codigo
            }
        })
        return articulo
    }
}