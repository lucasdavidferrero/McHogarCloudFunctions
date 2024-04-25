import prisma from '../prisma'
import { ReqBodyCrearArticulo } from '../controllers/articuloController'
import { ArticuloResponse } from '../dto/ArticuloReqRes.type'

export class ArticuloService {
    static async getAllArticulos () {
        const aikon_articulos = await prisma.aikon_articulo.findMany({
            include: { articulo_precio: true }
        })
        /* Transformar respuesta de la DB en el DTO creado. */
        const articulosDto: ArticuloResponse[] = []
        for (let i = 0; i < aikon_articulos.length; i++) {
            articulosDto[i] = {
                aik_ar_codigo: aikon_articulos[i].aik_ar_codigo
                aik_ar_descri: aikon_articulos[i].aik_ar_descri
                aik_ar_memo: aikon_articulos[i].aik_ar_memo
                aik_re1_codigo?          :string
                aik_re2_codigo?          :string
                aik_ar_alto?             :number
                aik_ar_ancho?            :number
                aik_ar_profundo?         :number
                aik_ar_color?            :string
                aik_ar_peso?             :number
                aik_ar_descria?          :string
                aik_ar_fechamodif?       :string
                aik_ar_mesesgarantia?    :number
                aik_ar_cosnet?           :number
                aik_ap_utilidad?         :number
                aik_impuesto_interno?    :number
                aik_iva_porcen?          :number
                aik_stock_total?         :number
                aik_ap_precio_iva?       :number
                aik_fa_codigo?           :string
                aik_ma_codigo?           :string
                aik_esa_codigo?          :string
            }
        }
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