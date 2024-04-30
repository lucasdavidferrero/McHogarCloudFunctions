export interface ArticuloResponse extends ArticuloAikonRes {
    articulo_precio: ArticuloPrecioRes | null
    articulo: ArticuloRes | null
}
interface ArticuloAikonRes {
    aik_ar_codigo:          string
    aik_ar_descri:          string | null
    aik_ar_memo:            string | null
    aik_re1_codigo:         string | null
    aik_re2_codigo:         string | null
    aik_ar_alto:            number | null
    aik_ar_ancho:           number | null
    aik_ar_profundo:        number | null
    aik_ar_color:           string | null
    aik_ar_peso:            number | null
    aik_ar_descria:         string | null
    aik_ar_fechamodif:      string | null
    aik_ar_mesesgarantia:   number | null
    aik_ar_cosnet:          number | null
    aik_ap_utilidad:        number | null
    aik_impuesto_interno:   number | null
    aik_iva_porcen:         number | null
    aik_stock_total:        number | null
    aik_ap_precio_iva:      number | null
    aik_fa_codigo:          string | null
    aik_ma_codigo:          string | null
    aik_esa_codigo:         string | null
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

export interface ArticuloRes {
    aik_ar_codigo:          string
    ar_url_img_principal:   string | null
}