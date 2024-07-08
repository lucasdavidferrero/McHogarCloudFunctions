export interface ArticuloResponse extends ArticuloAikonRes {
    aikon_estado_articulo: aikon_estado_articulo
    aikon_familia: aikon_familia
    aikon_marca: aikon_marca // Cambiar también en Frontend
    aikon_referencia01: aikon_referencia01
    aikon_referencia02: aikon_referencia02
    articulo_precio: ArticuloPrecioRes | null
    articulo_web: ArticuloWebRes | null
}

export interface ArticuloGrillaImagen {
    aik_ar_codigo:          string
    aik_ar_descri:          string
    articulo_web:           ArticuloWebRes
    aikon_familia:          aikon_familia
    aikon_marca:            aikon_marca
}

interface ArticuloAikonRes {
    aik_ar_codigo:          string
    aik_ar_descri:          string
    aik_ar_memo:            string
    aik_re1_codigo:         string
    aik_re2_codigo:         string
    aik_ar_alto:            number
    aik_ar_ancho:           number
    aik_ar_profundo:        number
    aik_ar_color:           string
    aik_ar_peso:            number
    aik_ar_descria:         string
    aik_ar_fechamodif:      string | null
    aik_ar_mesesgarantia:   number
    aik_ar_cosnet:          number
    aik_ap_utilidad:        number
    aik_impuesto_interno:   number
    aik_iva_porcen:         number
    aik_stock_total:        number
    aik_ap_precio_iva:      number
    aik_fa_codigo:          string
    aik_ma_codigo:          string | null
    aik_esa_codigo:         string
}
interface aikon_estado_articulo {
    aik_esa_codigo: string
    aik_esa_descri: string
}
interface aikon_familia {
    aik_fa_codigo: string
    aik_fa_nombre: string
    aik_fa_nivel: string
    aik_fa_palm: string
}
interface aikon_marca {
    aik_ma_codigo: string
    aik_ma_descri: string
}
interface aikon_referencia01 {
    aik_re1_codigo: string
    aik_re1_descri: string
}
interface aikon_referencia02 {
    aik_re2_codigo: string
    aik_re2_descri: string
}
export interface ArticuloPrecioRes {
    aik_ar_codigo:                      string
    arp_utilidad_web:                   number
    arp_utilidad_ofer:                  number | null
    arp_utilidad_ofer_fecha_hasta:      string | null
    arp_utilidad_ofer_stock_hasta:      number | null
    arp_descuento:                      number | null
    arp_descuento_fecha_hasta:          string | null
    arp_porcentaje_off:                 number | null
}

export interface ArticuloWebRes {
    aik_ar_codigo:          string
    ar_url_img_principal:   string | null
    ar_descripcion_web:     string
}