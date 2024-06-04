import { Request, Response } from "express"
import { ArticuloService } from '../services/ArticuloService'
import { IGeneralResponseMcAPI, IQueryStringListadosPaginadosReqMcAPI, Empty } from "../types/dto/GeneralReqRes.type"
import { ArticuloResponse } from "../types/dto/ArticuloReqRes.type"

interface obtenerArticulosPaginadoQueryString extends IQueryStringListadosPaginadosReqMcAPI {
    codMarca?:      string
    codCategoria?:  string
    codRubro?:      string
    codFamilia?:    string
    codArticulo?:   string
}

type RespuestaSatisfactoriaListadoArticulosCompletoPaginado = IGeneralResponseMcAPI<ArticuloResponse[]> 


const obtenerArticulosPaginado = async (req: Request<Empty, Empty, Empty, obtenerArticulosPaginadoQueryString>, res: Response) => {
    let cantidadItemsPagina: number | undefined = undefined
    if (typeof(req.query.cantidadItemsPagina) === 'string' && !isNaN(parseInt(req.query.cantidadItemsPagina))) {
        cantidadItemsPagina = parseInt(req.query.cantidadItemsPagina)
    }
    const allArticulos = await ArticuloService.obtenerArticulosPaginado(cantidadItemsPagina, req.query.cursorId, req.query.codMarca, req.query.codCategoria, req.query.codRubro, req.query.codFamilia, req.query.codArticulo)
    const response: RespuestaSatisfactoriaListadoArticulosCompletoPaginado = {
        estado: 'satisfactorio',
        mensaje: 'Listado artículos paginado (Paginación cursor-based de prisma-js)',
        data: allArticulos
    }
    res.send(response)
}

export {
    obtenerArticulosPaginado
}


/* export interface ReqBodyCrearArticulo {
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
}*/