import { Prisma } from "@prisma/client";

export interface AikonArticuloPrismaSchema {
    aik_ar_codigo: string;
    aik_ar_publicarweb: string;
    aik_ar_descri: string;
    aik_ar_memo: string;
    aik_ar_alto: number;
    aik_ar_ancho: number;
    aik_ar_profundo: number;
    aik_ar_color: string;
    aik_ar_peso: number;
    aik_ar_descria: string;
    aik_ar_mesesgarantia: number;
    aik_ar_cosnet: Prisma.Decimal;
    aik_ap_utilidad: Prisma.Decimal;
    aik_ap_impuesto_interno: Prisma.Decimal;
    aik_iva_porcen: Prisma.Decimal;
    aik_stock_total: number;
    aik_ap_precio_iva: Prisma.Decimal;
    aik_ar_fechamodif: bigint | null;
    aik_ar_fecha_alta: bigint | null;
    aik_fa_codigo: string;
    aik_ma_codigo: string;
    aik_re1_codigo: string;
    aik_re2_codigo: string;
    aik_esa_codigo: string;
}

export interface AikonArticuloApiConvertido {
    aik_ar_codigo: string;
    aik_ar_publicarweb: string;
    aik_ar_descri: string;
    aik_ar_memo: string;
    aik_ar_alto: number;
    aik_ar_ancho: number;
    aik_ar_profundo: number;
    aik_ar_color: string;
    aik_ar_peso: number;
    aik_ar_descria: string;
    aik_ar_mesesgarantia: number;
    aik_ar_cosnet: number;
    aik_ap_utilidad: number;
    aik_ap_impuesto_interno: number;
    aik_iva_porcen: number;
    aik_stock_total: number;
    aik_ap_precio_iva: number;
    aik_ar_fechamodif: number | null;
    aik_ar_fecha_alta: number | null;
    aik_fa_codigo: string;
    aik_ma_codigo: string;
    aik_re1_codigo: string;
    aik_re2_codigo: string;
    aik_esa_codigo: string;
}