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

const obtenerArticulosPaginadoGrillaModificarImagenes = async (req: Request<Empty, Empty, Empty, obtenerArticulosPaginadoQueryString>, res: Response) => {
    let cantidadItemsPagina: number | undefined = undefined
    if (typeof(req.query.cantidadItemsPagina) === 'string' && !isNaN(parseInt(req.query.cantidadItemsPagina))) {
        cantidadItemsPagina = parseInt(req.query.cantidadItemsPagina)
    }
    const { articulos, totalItems, nextCursor } = await ArticuloService.obtenerArticulosPaginadoGrillaModificarImagenes(cantidadItemsPagina, req.query.cursorId, req.query.codMarca, req.query.codFamilia, req.query.codArticulo)
    const response = {
        estado: 'satisfactorio',
        mensaje: 'Listado artículos grilla modificar imagenes paginado',
        totalItems,
        nextCursor,
        data: articulos
    }
    res.send(response)
}

export {
    obtenerArticulosPaginado,
    obtenerArticulosPaginadoGrillaModificarImagenes
}