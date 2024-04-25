import { Request, Response } from "express"
import { ArticuloService } from '../services/ArticuloService'

const getAllArticulos = async (req: Request, res: Response) => {
    const allArticulos = await ArticuloService.getAllArticulos()
    res.send({
        status: 'OK',
        data: allArticulos
    })
}

const crearArticulo = async (req: Request<{}, {}, ReqBodyCrearArticulo>, res: Response) => {
    
    const articuloCreado = await ArticuloService.crearArticulo(req.body)
    res.send({
        status: 'OK',
        data: articuloCreado
    })
}

export {
    getAllArticulos,
    crearArticulo
}

export interface ReqBodyCrearArticulo {
    ar_codigo: string
    ar_descri: string
    um_codigo: string
    um_codcom: string
    ar_barras: string
    AR_IVAPORCEN: number
    ma_codigo: string
    ma_descri: string
    fa_nombre: string
    fa_codigo: string
    st_stock: number
    ar_umexacta: string
    ar_cosbru: number
    ar_cosrep: number
    ar_cosucp: number
    ar_fecucp: string | null
    ar_equum: number
    ar_bonifi: string
    ar_desmax: string
    ar_minimavta: number
    ar_cosnet: number
    um_codigo_descri: string
    um_codcom_descri: string
    un_fijarprecio: string
    un_pisadesc: string
    AR_ESUNILEVER: string
    AR_UNICAJ: number
    AR_ESUNILEVER_ACTIVO: string
    ar_memo: string
    ar_descria: string
    ar_tamano: string
    ar_alto: number
    ar_ancho: number
    ar_profundo: number
    ar_color: string
    ar_peso: number
    ar_litros: number
    AR_ES_COMBO: string
    AR_ESDECOMPRAS: string
    AR_ESDEVENTAS: string
    MO_CODIGO: string
    AR_FECHAALTA: string | null
    re1_codigo: string
    re2_codigo: string
    esa_codigo: string
    ar_fechamodif: string | null
    ar_mesesgarantia: number
}